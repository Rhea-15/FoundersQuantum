import { Router } from 'express'
import { nanoid } from 'nanoid'
import {
  validateQuery,
  summarizePaper,
  scoreNovelty,
  analyzeMarketGap,
  generateOpportunityBrief,
} from '../lib/gemini.js'
import { searchPubMed, searchArXiv, searchOpenAlex, computeVelocity } from '../lib/papers.js'
import { getAllCommercialSignals } from '../lib/commercial.js'
import { deduplicatePapers, rankPapers } from '../lib/deduplicate.js'
import {
  initDb, saveSearch, getSearchByHash, getSearchById,
  savePaper, saveCommercialSignal, saveOpportunity, getOpportunitiesBySearchId,
} from '../lib/db.js'
import { getCached, setCached, hashQuery } from '../lib/cache.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()

// POST /api/search
router.post('/', async (req, res, next) => {
  try {
    const { query } = req.body
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return next(new AppError('Query must be at least 2 characters.', 'invalid_query'))
    }

    const trimmed = query.trim()
    const cacheKey = hashQuery(trimmed)

    // 1. Memory cache hit
    const cached = getCached(cacheKey)
    if (cached) {
      console.log('[search] memory cache hit:', trimmed)
      return res.json({ ...cached, from_cache: true })
    }

    // 2. DB cache hit
    const existingSearch = getSearchByHash(cacheKey)
    if (existingSearch) {
      const opportunities = getOpportunitiesBySearchId(existingSearch.id)
      if (opportunities.length > 0) {
        const result = {
          search_id: existingSearch.id,
          query: existingSearch.query,
          paper_count: existingSearch.paper_count,
          opportunity_count: existingSearch.opportunity_count,
          opportunities,
        }
        setCached(cacheKey, result)
        console.log('[search] db cache hit:', trimmed)
        return res.json({ ...result, from_cache: true })
      }
    }

    // 3. Validate query
    console.log('[search] validating:', trimmed)
    const validation = await validateQuery(trimmed)

    if (validation.is_too_broad) {
      return res.status(400).json({
        error: 'query_too_broad',
        message: `"${trimmed}" is too broad. Try one of the suggestions below.`,
        suggestions: validation.suggestions || [],
      })
    }
    if (!validation.is_valid) {
      return res.status(400).json({
        error: 'invalid_query',
        message: `"${trimmed}" doesn't appear to be a valid research domain.`,
        suggestions: validation.suggestions || [],
      })
    }

    const normalizedQuery = validation.normalized_query || trimmed

    // 4. Fetch papers from all three sources in parallel
    console.log('[search] fetching papers:', normalizedQuery)
    const [pubmedResult, arxivResult, openalexResult] = await Promise.allSettled([
      searchPubMed(normalizedQuery),
      searchArXiv(normalizedQuery),
      searchOpenAlex(normalizedQuery),
    ])

    const allPapersRaw = [
      ...(pubmedResult.status  === 'fulfilled' ? pubmedResult.value  : []),
      ...(arxivResult.status   === 'fulfilled' ? arxivResult.value   : []),
      ...(openalexResult.status === 'fulfilled' ? openalexResult.value : []),
    ]

    const papers = rankPapers(deduplicatePapers(computeVelocity(allPapersRaw)), 20)
    console.log(`[search] ${papers.length} papers after dedup + rank`)

    if (papers.length === 0) {
      return res.json({
        search_id: null,
        query: trimmed,
        paper_count: 0,
        opportunity_count: 0,
        opportunities: [],
        message: 'No recent papers found. Try a more specific research domain.',
      })
    }

    // 5. Fetch commercial signals
    console.log('[search] fetching commercial signals')
    const allSignals = await getAllCommercialSignals(normalizedQuery)
    console.log(`[search] ${allSignals.length} total commercial signals`)

    // 6. Create the search record in DB FIRST so foreign keys work
    //    paper_count and opportunity_count are updated at the end
    const searchId = 'srch_' + nanoid(10)

    saveSearch({
      id: searchId,
      query: trimmed,
      query_hash: cacheKey,
      paper_count: papers.length,
      opportunity_count: 0,        // will be accurate in the final response
    })

    // 7. Process papers through the AI pipeline
    const processedOpportunities = []
    const papersToProcess = papers.slice(0, 4)   // 4 papers = ~16 Gemini calls, fits free tier

    for (let i = 0; i < papersToProcess.length; i++) {
      const paper = papersToProcess[i]
      try {
        console.log(`[search] [${i + 1}/${papersToProcess.length}] ${paper.title.slice(0, 55)}...`)

        const paperId = 'ppr_' + nanoid(10)
        const paperRecord = { ...paper, id: paperId, search_id: searchId }

        // Stage 1: Summarize
        const summary = await summarizePaper(paper.title, paper.abstract)
        paperRecord.summary = summary

        // Stage 2: Score novelty
        const signalNames = allSignals.map(s => s.name)
        const scores = await scoreNovelty(summary, signalNames)

        // Skip papers with very low gap scores — saves Gemini calls
        if (scores.gap_score < 4.5) {
          savePaper(paperRecord)
          console.log(`[search] skipping low gap (${scores.gap_score}): ${paper.title.slice(0, 40)}`)
          continue
        }

        // Stage 3: Market gap analysis
        const market_gap = await analyzeMarketGap(summary, scores.gap_score, signalNames)

        // Stage 4: Opportunity generation
        const brief = await generateOpportunityBrief(summary, market_gap, scores)

        // Distribute signals across papers so each gets a different slice
        const signalsPerPaper = 4
        const startIdx = (i * 2) % Math.max(1, allSignals.length)
        const paperSignals = allSignals
          .slice(startIdx, startIdx + signalsPerPaper)
          .concat(allSignals.slice(0, Math.max(0, signalsPerPaper - (allSignals.length - startIdx))))
          .slice(0, signalsPerPaper)

        const oppId = 'opp_' + nanoid(10)

        const opportunityRecord = {
          id: oppId,
          search_id: searchId,
          paper_id: paperId,
          gap_score: scores.gap_score,
          novelty_score: scores.novelty_score,
          market_readiness_score: scores.market_readiness_score,
          gap_reasoning: scores.reasoning,
          opportunity_title: brief.opportunity_title,
          problem_statement: brief.problem_statement,
          product_angles: brief.product_angles,
          target_user: brief.target_user,
          monetization: brief.monetization,
          unfair_advantage: brief.unfair_advantage,
          gap_reason: market_gap.gap_reason,
          underserved_segment: market_gap.underserved_segment,
          product_category: market_gap.product_category,
          time_to_market_estimate: market_gap.time_to_market_estimate,
          primary_risk: market_gap.primary_risk,
          competing_product_count: paperSignals.length,
        }

        // Persist to DB — search row already exists so FK constraint is satisfied
        savePaper(paperRecord)
        saveOpportunity(opportunityRecord)
        paperSignals.forEach((sig, si) => {
          saveCommercialSignal({
            id: `sig_${nanoid(8)}_${si}`,
            paper_id: paperId,
            ...sig,
          })
        })

        // Build response object
        processedOpportunities.push({
          id: oppId,
          gap_score: scores.gap_score,
          scores: {
            novelty_score: scores.novelty_score,
            gap_score: scores.gap_score,
            market_readiness_score: scores.market_readiness_score,
            reasoning: scores.reasoning,
          },
          brief: {
            opportunity_title: brief.opportunity_title,
            problem_statement: brief.problem_statement,
            product_angles: brief.product_angles,
            target_user: brief.target_user,
            monetization: brief.monetization,
            unfair_advantage: brief.unfair_advantage,
          },
          market_gap,
          paper: {
            id: paperId,
            source: paper.source,
            external_id: paper.external_id,
            title: paper.title,
            abstract: paper.abstract,
            authors: paper.authors,
            published_at: paper.published_at,
            citation_count: paper.citation_count,
            citation_velocity: paper.citation_velocity,
            url: paper.url,
            summary,
          },
          commercial_signals: paperSignals,
          competing_product_count: paperSignals.length,
          created_at: Date.now(),
        })

      } catch (paperErr) {
        console.warn(`[search] paper failed: ${paperErr.message}`)
      }
    }

    // Sort by gap score descending
    processedOpportunities.sort((a, b) => b.gap_score - a.gap_score)

    const result = {
      search_id: searchId,
      query: trimmed,
      paper_count: papers.length,
      opportunity_count: processedOpportunities.length,
      opportunities: processedOpportunities,
    }

    setCached(cacheKey, result)
    return res.json(result)

  } catch (err) {
    next(err)
  }
})

// GET /api/search/:id — retrieve a prior search by ID
router.get('/:id', async (req, res, next) => {
  try {
    const search = getSearchById(req.params.id)
    if (!search) {
      return res.status(404).json({ error: 'not_found', message: 'Search not found.' })
    }
    const opportunities = getOpportunitiesBySearchId(search.id)
    return res.json({
      search_id: search.id,
      query: search.query,
      paper_count: search.paper_count,
      opportunity_count: search.opportunity_count,
      opportunities,
    })
  } catch (err) {
    next(err)
  }
})

export default router