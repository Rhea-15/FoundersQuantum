import GapScoreBadge from './GapScoreBadge.jsx'

const ArrowUpRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
)

export default function OpportunityCard({ opportunity, onClick, index = 0 }) {
  const { brief, scores, paper, commercial_signals, competing_product_count, competition, competition_level } = opportunity

  const competitionColor = {
    low: '#34d399',
    medium: '#f59e0b',
    high: '#f87171',
  }[competition_level] || '#a78bfa'

  const delay = index * 60

  return (
    <div
      onClick={() => onClick(opportunity)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: `fadeInUp 0.5s ease ${delay}ms both`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-hover)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
        e.currentTarget.style.background = 'var(--bg-card-hover)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
        e.currentTarget.style.background = 'var(--bg-card)'
      }}
    >
      {/* Subtle top glow */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--violet-bright)44, transparent)',
      }} />

      {/* Header: scores + competition */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <GapScoreBadge score={scores.gap_score} label="GAP" />
          <GapScoreBadge score={scores.novelty_score} label="NOVELTY" />
          <GapScoreBadge score={scores.market_readiness_score} label="READY" />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <span style={{
            padding: '3px 8px',
            borderRadius: '4px',
            background: `${competitionColor}15`,
            border: `1px solid ${competitionColor}33`,
            color: competitionColor,
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
          }}>
            {competition}
          </span>
        </div>
      </div>

      {/* Domain chip */}
      <div>
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          background: 'var(--violet-light)',
          color: 'var(--text-accent)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          fontFamily: 'var(--font-mono)',
          marginBottom: '8px',
        }}>
          {opportunity.domain}
        </span>
        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '15px',
          fontWeight: 700,
          lineHeight: 1.3,
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          {brief.opportunity_title}
        </h3>
      </div>

      {/* Summary */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '13px',
        lineHeight: 1.6,
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {brief.problem_statement}
      </p>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px' }}>📦</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            {competing_product_count === 0
              ? 'No competing products found'
              : `${competing_product_count} competing products`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px' }}>📄</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            {paper.source.charAt(0).toUpperCase() + paper.source.slice(1)} ·{' '}
            {new Date(paper.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} ·{' '}
            {paper.citation_count} citations
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--violet-light)',
          border: '1px solid var(--border)',
          color: 'var(--text-accent)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: '12px',
          cursor: 'pointer',
          width: '100%',
          transition: 'all var(--transition)',
          letterSpacing: '0.02em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, var(--violet) 0%, #a855f7 100%)'
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.borderColor = 'transparent'
          e.currentTarget.style.boxShadow = 'var(--shadow-button)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--violet-light)'
          e.currentTarget.style.color = 'var(--text-accent)'
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        View Full Opportunity <ArrowUpRightIcon />
      </button>
    </div>
  )
}