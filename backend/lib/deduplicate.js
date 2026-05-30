// Deduplicate papers by DOI or fuzzy title similarity

function normalizeTitle(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
  
  function levenshtein(a, b) {
    const m = a.length, n = b.length
    const dp = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    )
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
    return dp[m][n]
  }
  
  function titleSimilarity(a, b) {
    const na = normalizeTitle(a)
    const nb = normalizeTitle(b)
    if (na === nb) return 1.0
    const maxLen = Math.max(na.length, nb.length)
    if (maxLen === 0) return 1.0
    return 1 - levenshtein(na, nb) / maxLen
  }
  
  export function deduplicatePapers(papers) {
    const seen = []
    const result = []
  
    for (const paper of papers) {
      let isDuplicate = false
  
      for (const existing of seen) {
        // Check by external_id if both have it and source matches
        if (
          paper.external_id &&
          existing.external_id &&
          paper.source === existing.source &&
          paper.external_id === existing.external_id
        ) {
          isDuplicate = true
          break
        }
        // Check by title similarity
        if (titleSimilarity(paper.title, existing.title) > 0.88) {
          isDuplicate = true
          // Keep whichever has more citations
          if ((paper.citation_count || 0) > (existing.citation_count || 0)) {
            const idx = result.indexOf(existing)
            if (idx !== -1) result.splice(idx, 1, paper)
            seen.splice(seen.indexOf(existing), 1, paper)
          }
          break
        }
      }
  
      if (!isDuplicate) {
        seen.push(paper)
        result.push(paper)
      }
    }
  
    return result
  }
  
  // Sort papers by citation velocity descending, keep top N
  export function rankPapers(papers, topN = 20) {
    return papers
      .filter(p => p.title && p.title.length > 5)
      .sort((a, b) => (b.citation_velocity || 0) - (a.citation_velocity || 0))
      .slice(0, topN)
  }