import axios from 'axios'

// ─── Anakin URL Scraper helper (async: submit → poll → result) ────────────────
// Official docs: POST /v1/url-scraper returns { jobId, status: "pending" }
// Then GET /v1/url-scraper/{jobId} until status === "completed"

async function anakinScrapeUrl(url) {
  const apiKey = process.env.ANAKIN_API_KEY
  if (!apiKey) throw new Error('ANAKIN_API_KEY not set')

  const BASE = 'https://api.anakin.io/v1'
  const headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  }

  // Step 1: Submit job
  const submitRes = await axios.post(
    `${BASE}/url-scraper`,
    { url, useBrowser: false, country: 'us' },
    { headers, timeout: 15000 }
  )

  const jobId = submitRes.data?.jobId
  if (!jobId) throw new Error('No jobId returned from Anakin')

  // Step 2: Poll until completed (max 10 attempts, 2s apart = 20s max)
  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise(r => setTimeout(r, 2000))

    const pollRes = await axios.get(
      `${BASE}/url-scraper/${jobId}`,
      { headers, timeout: 10000 }
    )

    const { status, markdown, cleanedHtml, error } = pollRes.data

    if (status === 'completed') {
      return markdown || cleanedHtml || ''
    }
    if (status === 'failed') {
      throw new Error(`Anakin job failed: ${error || 'unknown error'}`)
    }
    // status is pending/processing — keep polling
  }

  throw new Error('Anakin scrape job timed out after 20s')
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

export async function searchGitHub(query) {
  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const res = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: `${query} in:name,description,topics`,
        sort: 'stars',
        order: 'desc',
        per_page: 10,
      },
      headers,
      timeout: 10000,
    })

    const repos = res.data?.items || []
    return repos
      .filter(r => r.stargazers_count >= 5)
      .slice(0, 6)
      .map(r => ({
        source: 'github',
        name: r.full_name,
        url: r.html_url,
        description: (r.description || '').slice(0, 200),
        signal_strength: r.stargazers_count,
      }))

  } catch (err) {
    console.warn('[commercial] GitHub search failed:', err.message)
    return []
  }
}

// ─── Product Hunt — via Anakin URL Scraper ────────────────────────────────────

export async function searchProductHunt(query) {
  try {
    const url = `https://www.producthunt.com/search?q=${encodeURIComponent(query)}`
    const markdown = await anakinScrapeUrl(url)

    if (!markdown) return []

    // PH search results render as markdown headings like:
    // ## Product Name
    // tagline text here
    const lines = markdown.split('\n')
    const products = []

    for (const line of lines) {
      if (products.length >= 5) break
      const headingMatch = line.match(/^#{1,3}\s+(.+)$/)
      if (!headingMatch) continue
      const name = headingMatch[1]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip markdown links
        .replace(/[*_`]/g, '')                     // strip formatting
        .trim()
      if (name.length < 2 || name.length > 80) continue
      // Skip nav/UI headings
      if (/^(search|sign|log\s?in|home|topics|collections|newsletter|about|community)/i.test(name)) continue
      products.push({
        source: 'product_hunt',
        name,
        url: `https://www.producthunt.com/search?q=${encodeURIComponent(query)}`,
        description: '',
        signal_strength: 0,
      })
    }

    console.log(`[commercial] Product Hunt via Anakin Wire: ${products.length} products`)
    return products

  } catch (err) {
    console.warn('[commercial] Product Hunt Wire scrape failed:', err.message)
    return []
  }
}

// ─── AlternativeTo — via Anakin URL Scraper ───────────────────────────────────

export async function searchAlternativeTo(query) {
  // ── Path A: Anakin Wire (primary — satisfies hackathon requirement) ──────────
  if (process.env.ANAKIN_API_KEY) {
    try {
      const url = `https://alternativeto.net/browse/search/?q=${encodeURIComponent(query)}`
      const markdown = await anakinScrapeUrl(url)

      if (markdown) {
        const slugRegex = /\/software\/([a-z0-9][a-z0-9-]{1,50})\//gi
        const seenSlugs = new Set()
        const products = []
        let match

        while ((match = slugRegex.exec(markdown)) !== null) {
          if (products.length >= 5) break
          const slug = match[1]
          if (seenSlugs.has(slug)) continue
          seenSlugs.add(slug)
          products.push({
            source: 'alternative_to',
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            url: `https://alternativeto.net/software/${slug}/`,
            description: '',
            signal_strength: 0,
          })
        }

        console.log(`[commercial] AlternativeTo via Anakin Wire: ${products.length} products`)
        if (products.length > 0) return products
      }
    } catch (err) {
      console.warn('[commercial] AlternativeTo Wire scrape failed:', err.message)
      // fall through to direct scrape
    }
  }

  // ── Path B: Direct HTML scrape fallback ─────────────────────────────────────
  try {
    const res = await axios.get('https://alternativeto.net/browse/search/', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ResearchGapBot/1.0)',
        Accept: 'text/html',
      },
      timeout: 10000,
    })

    const html = res.data
    const linkMatches = html.match(/href="\/software\/([^\/]+)\//g) || []
    const products = []

    for (let i = 0; i < Math.min(5, linkMatches.length); i++) {
      const slug = (linkMatches[i].match(/\/software\/([^\/]+)\//) || [])[1]
      if (!slug) continue
      products.push({
        source: 'alternative_to',
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        url: `https://alternativeto.net/software/${slug}/`,
        description: '',
        signal_strength: 0,
      })
    }

    console.log(`[commercial] AlternativeTo direct fallback: ${products.length} products`)
    return products

  } catch (err) {
    console.warn('[commercial] AlternativeTo fallback failed:', err.message)
    return []
  }
}

// ─── Aggregate all commercial signals ────────────────────────────────────────

export async function getAllCommercialSignals(query) {
  const [github, ph, alt] = await Promise.allSettled([
    searchGitHub(query),
    searchProductHunt(query),
    searchAlternativeTo(query),
  ])

  const signals = [
    ...(github.status === 'fulfilled' ? github.value : []),
    ...(ph.status    === 'fulfilled' ? ph.value    : []),
    ...(alt.status   === 'fulfilled' ? alt.value   : []),
  ]

  console.log(
    `[commercial] signals by source — github: ${github.value?.length ?? 0}, ` +
    `ph: ${ph.value?.length ?? 0}, alt: ${alt.value?.length ?? 0}`
  )
  return signals
}