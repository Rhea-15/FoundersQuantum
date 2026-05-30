import Groq from 'groq-sdk'
import {
  SUMMARIZE_PAPER,
  SCORE_NOVELTY,
  ANALYZE_MARKET_GAP,
  GENERATE_OPPORTUNITY,
  VALIDATE_QUERY,
} from '../prompts/prompts.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function callGroq(prompt, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      })
      return res.choices[0]?.message?.content || ''
    } catch (err) {
      if (attempt === retries) throw err
      const waitMs = (attempt + 1) * 4000
      console.warn(`[groq] attempt ${attempt + 1} failed, retrying in ${waitMs / 1000}s:`, err.message.slice(0, 120))
      await new Promise(r => setTimeout(r, waitMs))
    }
  }
}

function parseJSON(text, fallback = null) {
  try {
    const clean = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()
    return JSON.parse(clean)
  } catch (err) {
    console.warn('[groq] JSON parse failed:', err.message, '| raw:', text.slice(0, 200))
    return fallback
  }
}

export async function validateQuery(query) {
  const prompt = VALIDATE_QUERY(query)
  const text = await callGroq(prompt)
  return parseJSON(text, {
    is_valid: true,
    is_too_broad: false,
    suggestions: [],
    normalized_query: query,
  })
}

export async function summarizePaper(title, abstract) {
  if (!abstract || abstract.trim().length < 50) {
    return `${title}. Abstract unavailable for detailed summarization.`
  }
  const prompt = SUMMARIZE_PAPER(title, abstract.slice(0, 2000))
  const text = await callGroq(prompt)
  return text.trim()
}

export async function scoreNovelty(paper_summary, competing_products) {
  const prompt = SCORE_NOVELTY(paper_summary, competing_products)
  const text = await callGroq(prompt)
  const result = parseJSON(text, {
    novelty_score: 5.0,
    gap_score: 5.0,
    market_readiness_score: 5.0,
    reasoning: 'Scoring unavailable.',
  })
  result.novelty_score = Math.min(10, Math.max(1, parseFloat(result.novelty_score) || 5))
  result.gap_score = Math.min(10, Math.max(1, parseFloat(result.gap_score) || 5))
  result.market_readiness_score = Math.min(10, Math.max(1, parseFloat(result.market_readiness_score) || 5))
  return result
}

export async function analyzeMarketGap(paper_summary, gap_score, competing_products) {
  const prompt = ANALYZE_MARKET_GAP(paper_summary, gap_score, competing_products)
  const text = await callGroq(prompt)
  return parseJSON(text, {
    gap_reason: 'Gap analysis unavailable.',
    underserved_segment: 'Unknown',
    product_category: 'SaaS',
    time_to_market_estimate: '6-12 months',
    primary_risk: 'Unknown',
  })
}

export async function generateOpportunityBrief(paper_summary, market_gap, scores) {
  const prompt = GENERATE_OPPORTUNITY(paper_summary, market_gap, scores)
  const text = await callGroq(prompt)
  return parseJSON(text, {
    opportunity_title: 'Research-Based Startup Opportunity',
    problem_statement: 'A research-to-product gap exists in this space.',
    product_angles: ['Build a SaaS product', 'Build an API', 'Build a developer tool'],
    target_user: 'Developers and researchers',
    monetization: 'Subscription $49/mo',
    unfair_advantage: 'First mover advantage from recent research.',
  })
}