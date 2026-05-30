const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function runSearch(query) {
  const res = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  const json = await res.json().catch(() => ({ message: 'Search failed — server returned invalid JSON' }))

  if (!res.ok) {
    const e = new Error(json.message || 'Search failed')
    e.code = json.error || 'unknown'
    e.suggestions = json.suggestions || []
    e.status = res.status
    throw e
  }

  return json
}

export async function getOpportunity(id) {
  const res = await fetch(`${BASE_URL}/api/opportunity/${id}`)
  if (!res.ok) throw new Error('Opportunity not found')
  return res.json()
}