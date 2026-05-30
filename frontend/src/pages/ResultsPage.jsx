import { useState } from 'react'
import OpportunityCard from '../components/OpportunityCard.jsx'
import ResultsBanner from '../components/ResultsBanner.jsx'
import SortBar from '../components/SortBar.jsx'
import OpportunityChart from '../components/OpportunityChart.jsx'
import SearchBar from '../components/SearchBar.jsx'

// Normalize an opportunity from the API response into the shape components expect
function normalizeOpportunity(opp) {
  const count = opp.competing_product_count || 0
  const competitionLevel = count === 0 ? 'low' : count <= 3 ? 'medium' : 'high'
  const competitionLabel = count === 0
    ? 'Low competition'
    : count <= 3
      ? 'Medium competition'
      : 'High competition'

  // Domain: use paper source as a readable label, fall back to opportunity title words
  const sourceLabelMap = {
    pubmed: 'Life Sciences',
    arxiv: 'Computer Science',
    openalex: 'Academic Research',
  }
  const domain = sourceLabelMap[opp.paper?.source] || 'Research'

  return {
    ...opp,
    domain,
    competition: competitionLabel,
    competition_level: competitionLevel,
  }
}

export default function ResultsPage({ query, searchResult, searchError, onSelectOpportunity, onSearchAgain, onSearch }) {
  const [sort, setSort] = useState('gap')
  const [filter, setFilter] = useState('All competition')

  // ── Error state ────────────────────────────────────────────────────────────
  if (searchError) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '80px auto',
        padding: '0 24px',
        textAlign: 'center',
        animation: 'fadeInUp 0.4s ease',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {searchError.code === 'query_too_broad' ? '🔍' : '⚠️'}
        </div>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          {searchError.code === 'query_too_broad'
            ? 'Query too broad'
            : searchError.code === 'invalid_query'
              ? 'Invalid research domain'
              : 'Search failed'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          {searchError.message}
        </p>
        {searchError.suggestions?.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Try instead:
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {searchError.suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => onSearch(s)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '100px',
                    border: '1px solid var(--border)',
                    background: 'var(--violet-light)',
                    color: 'var(--text-accent)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: 500,
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--violet) 0%, #a855f7 100%)'
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--violet-light)'
                    e.currentTarget.style.color = 'var(--text-accent)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={onSearchAgain}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >
          ← Try a different search
        </button>
      </div>
    )
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!searchResult || searchResult.opportunity_count === 0) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '80px auto',
        padding: '0 24px',
        textAlign: 'center',
        animation: 'fadeInUp 0.4s ease',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔬</div>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          No gaps found
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          {searchResult?.message || `No high-velocity papers found for "${query}". This space may be well-covered, or try a more specific query.`}
        </p>
        <button
          onClick={onSearchAgain}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--violet-light)',
            color: 'var(--text-accent)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ← Try another domain
        </button>
      </div>
    )
  }

  // ── Normal results ─────────────────────────────────────────────────────────
  const rawOpportunities = searchResult.opportunities || []
  const allOpportunities = rawOpportunities.map(normalizeOpportunity)

  const SORT_FN = {
    gap: (a, b) => b.gap_score - a.gap_score,
    novelty: (a, b) => (b.scores?.novelty_score || 0) - (a.scores?.novelty_score || 0),
    ready: (a, b) => (b.scores?.market_readiness_score || 0) - (a.scores?.market_readiness_score || 0),
  }

  const filtered = allOpportunities
    .filter(o => filter === 'All competition' ? true : o.competition_level === filter.toLowerCase())
    .sort(SORT_FN[sort] || SORT_FN.gap)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top search bar row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', animation: 'fadeInUp 0.4s ease' }}>
        <button
          onClick={onSearchAgain}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '16px',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <SearchBar onSearch={onSearch} initialValue={query} compact />
        </div>
      </div>

      {/* Stats banner — uses real API data */}
      <ResultsBanner
        query={searchResult.query}
        paperCount={searchResult.paper_count}
        oppCount={searchResult.opportunity_count}
        avgGapScore={
          rawOpportunities.length > 0
            ? (rawOpportunities.reduce((sum, o) => sum + (o.gap_score || 0), 0) / rawOpportunities.length).toFixed(1)
            : null
        }
      />

      {/* Opportunity chart — uses real API data */}
      <OpportunityChart opportunities={allOpportunities} />

      {/* Sort + filter bar + header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
          Top opportunities <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({filtered.length})</span>
        </h2>
        <SortBar sort={sort} onSort={setSort} filter={filter} onFilter={setFilter} />
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
          No opportunities match this filter. Try "All competition".
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.map((opp, i) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onClick={onSelectOpportunity}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{
        textAlign: 'center',
        marginTop: '48px',
        padding: '32px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          Want to explore a different domain?
        </p>
        <button
          onClick={onSearchAgain}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--violet-light)',
            border: '1px solid var(--border)',
            color: 'var(--text-accent)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--violet) 0%, #a855f7 100%)'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = 'transparent'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--violet-light)'
            e.currentTarget.style.color = 'var(--text-accent)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          ← Search another field
        </button>
      </div>
    </div>
  )
}