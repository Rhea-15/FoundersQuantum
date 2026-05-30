import axios from 'axios'

// ─── PubMed ───────────────────────────────────────────────────────────────────

export async function searchPubMed(query) {
  try {
    const searchQuery = `${query} AND ("2024"[dp] OR "2025"[dp] OR "2026"[dp])`

    // Step 1: esearch to get PMIDs
    const searchRes = await axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi', {
      params: {
        db: 'pubmed',
        term: searchQuery,
        retmax: 15,
        sort: 'relevance',
        retmode: 'json',
        usehistory: 'n',
      },
      timeout: 10000,
    })

    const ids = searchRes.data?.esearchresult?.idlist || []
    if (ids.length === 0) return []

    // Step 2: efetch to get details
    const fetchRes = await axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi', {
      params: {
        db: 'pubmed',
        id: ids.slice(0, 10).join(','),
        retmode: 'json',
        rettype: 'abstract',
      },
      timeout: 15000,
    })

    const articles = fetchRes.data?.PubmedArticleSet?.PubmedArticle || []

    return articles.map(article => {
      const med = article?.MedlineCitation?.Article || {}
      const abs = med?.Abstract?.AbstractText
      const abstractText = Array.isArray(abs)
        ? abs.map(a => (typeof a === 'string' ? a : a?._ || '')).join(' ')
        : typeof abs === 'string' ? abs : ''

      const authList = med?.AuthorList?.Author || []
      const authors = authList.slice(0, 5).map(a => {
        if (a?.CollectiveName) return a.CollectiveName
        return [a?.LastName, a?.ForeName].filter(Boolean).join(' ')
      })

      const pmid = article?.MedlineCitation?.PMID?._ || article?.MedlineCitation?.PMID
      const pubDate = med?.Journal?.JournalIssue?.PubDate
      const year = pubDate?.Year || pubDate?.MedlineDate?.slice(0, 4) || '2024'
      const month = pubDate?.Month || '01'

      return {
        source: 'pubmed',
        external_id: String(pmid),
        title: med?.ArticleTitle?._ || med?.ArticleTitle || 'Untitled',
        abstract: abstractText.slice(0, 2000),
        authors,
        published_at: `${year}-${String(month).padStart(2, '0')}-01`,
        citation_count: 0, // PubMed free tier doesn't expose citations
        citation_velocity: 0,
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      }
    }).filter(p => p.title && p.title !== 'Untitled')

  } catch (err) {
    console.warn('[papers] PubMed search failed:', err.message)
    return []
  }
}

// ─── arXiv ────────────────────────────────────────────────────────────────────

export async function searchArXiv(query) {
  try {
    const searchQuery = encodeURIComponent(`${query}`)
    const res = await axios.get(
      `https://export.arxiv.org/api/query?search_query=all:${searchQuery}&start=0&max_results=12&sortBy=submittedDate&sortOrder=descending`,
      { timeout: 12000, headers: { 'Accept': 'application/xml' } }
    )

    // Parse Atom XML manually
    const xml = res.data
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || []

    return entries.slice(0, 10).map(entry => {
      const getTag = (tag) => {
        const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
        return match ? match[1].replace(/<[^>]+>/g, '').trim() : ''
      }
      const getAllTags = (tag) => {
        const matches = []
        const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g')
        let m
        while ((m = re.exec(entry)) !== null) {
          matches.push(m[1].replace(/<[^>]+>/g, '').trim())
        }
        return matches
      }

      const idRaw = getTag('id')
      const arxivId = idRaw.replace('http://arxiv.org/abs/', '').split('v')[0]
      const published = getTag('published')
      const authorNames = getAllTags('name').slice(0, 5)

      return {
        source: 'arxiv',
        external_id: arxivId,
        title: getTag('title').replace(/\n/g, ' '),
        abstract: getTag('summary').replace(/\n/g, ' ').slice(0, 2000),
        authors: authorNames,
        published_at: published ? published.slice(0, 10) : '2024-01-01',
        citation_count: 0,
        citation_velocity: 0,
        url: `https://arxiv.org/abs/${arxivId}`,
      }
    }).filter(p => p.title)

  } catch (err) {
    console.warn('[papers] arXiv search failed:', err.message)
    return []
  }
}

// ─── OpenAlex ─────────────────────────────────────────────────────────────────

export async function searchOpenAlex(query) {
  try {
    const res = await axios.get('https://api.openalex.org/works', {
      params: {
        search: query,
        filter: 'from_publication_date:2023-01-01',
        sort: 'cited_by_count:desc',
        per_page: 12,
        select: 'id,title,abstract_inverted_index,authorships,publication_date,cited_by_count,doi',
      },
      headers: {
        'User-Agent': 'ResearchGap/1.0 (mailto:dev@researchgap.io)',
      },
      timeout: 12000,
    })

    const works = res.data?.results || []

    return works.slice(0, 10).map(work => {
      // OpenAlex stores abstract as inverted index — reconstruct
      let abstract = ''
      if (work.abstract_inverted_index) {
        const positions = {}
        for (const [word, pos] of Object.entries(work.abstract_inverted_index)) {
          for (const p of pos) positions[p] = word
        }
        abstract = Object.keys(positions)
          .sort((a, b) => a - b)
          .map(k => positions[k])
          .join(' ')
          .slice(0, 2000)
      }

      const authors = (work.authorships || [])
        .slice(0, 5)
        .map(a => a?.author?.display_name)
        .filter(Boolean)

      const publishedDate = work.publication_date || '2024-01-01'
      const monthsSince = Math.max(1,
        (Date.now() - new Date(publishedDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
      )

      return {
        source: 'openalex',
        external_id: work.id?.replace('https://openalex.org/', '') || work.doi || '',
        title: work.title || 'Untitled',
        abstract: abstract,
        authors,
        published_at: publishedDate,
        citation_count: work.cited_by_count || 0,
        citation_velocity: parseFloat(((work.cited_by_count || 0) / monthsSince).toFixed(2)),
        url: work.doi
          ? `https://doi.org/${work.doi.replace('https://doi.org/', '')}`
          : `https://openalex.org/${work.id?.replace('https://openalex.org/', '')}`,
      }
    }).filter(p => p.title && p.title !== 'Untitled')

  } catch (err) {
    console.warn('[papers] OpenAlex search failed:', err.message)
    return []
  }
}

// ─── Compute citation velocity for papers that don't have it ──────────────────

export function computeVelocity(papers) {
  return papers.map(p => {
    if (p.citation_velocity > 0) return p
    const publishedMs = new Date(p.published_at).getTime()
    const monthsSince = Math.max(1, (Date.now() - publishedMs) / (1000 * 60 * 60 * 24 * 30))
    return {
      ...p,
      citation_velocity: parseFloat(((p.citation_count || 0) / monthsSince).toFixed(2)),
    }
  })
}