import GapScoreBadge from '../components/GapScoreBadge.jsx'
import ScoreBar from '../components/ScoreBar.jsx'
import PaperMeta from '../components/PaperMeta.jsx'
import CommercialSignals from '../components/CommercialSignals.jsx'
import ProductAnglesList from '../components/ProductAnglesList.jsx'

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

const Section = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <p style={{
      color: 'var(--text-muted)',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-mono)',
      margin: 0,
    }}>
      {label}
    </p>
    {children}
  </div>
)

const InfoPill = ({ label, value, highlight }) => (
  <div style={{
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '3px',
    padding: '10px 16px',
    borderRadius: 'var(--radius-sm)',
    background: highlight ? 'var(--violet-light)' : 'var(--bg-elevated)',
    border: `1px solid ${highlight ? 'var(--border)' : 'var(--border-subtle)'}`,
  }}>
    <span style={{ color: highlight ? 'var(--text-accent)' : 'var(--text-primary)', fontWeight: 700, fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
      {value}
    </span>
    <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {label}
    </span>
  </div>
)

export default function OpportunityPage({ opportunity, onBack }) {
  const { brief, scores, paper, commercial_signals, competing_product_count, domain, competition } = opportunity

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
      .catch(() => {})
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', animation: 'fadeInUp 0.4s ease' }}>
        {/* Domain + competition */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{
            padding: '3px 10px',
            borderRadius: '4px',
            background: 'var(--violet-light)',
            color: 'var(--text-accent)',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
          }}>
            {domain}
          </span>
          <span style={{
            padding: '3px 10px',
            borderRadius: '4px',
            background: 'rgba(52,211,153,0.1)',
            color: 'var(--score-low)',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
          }}>
            {competition}
          </span>
        </div>

        {/* Title + share */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            color: 'var(--text-primary)',
            margin: 0,
            maxWidth: '640px',
          }}>
            {brief.opportunity_title}
          </h1>
          <button
            onClick={handleShare}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.color = 'var(--text-accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <ShareIcon /> Share
          </button>
        </div>
      </div>

      {/* Main content card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-glow)',
        animation: 'fadeInUp 0.4s ease 0.1s both',
      }}>
        {/* Top glow line */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, var(--violet), var(--pink), var(--violet))',
        }} />

        <div style={{ padding: '32px' }}>
          {/* Scores row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <InfoPill label="Gap Score" value={`${scores.gap_score}/10`} highlight />
            <InfoPill label="Novelty" value={`${scores.novelty_score}/10`} />
            <InfoPill label="Market Ready" value={`${scores.market_readiness_score}/10`} />
            <InfoPill label="Competing Products" value={competing_product_count} />
          </div>

          {/* Score bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px', padding: '20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <ScoreBar score={scores.gap_score} label="Gap Score" />
            <ScoreBar score={scores.novelty_score} label="Novelty" color="var(--score-med)" />
            <ScoreBar score={scores.market_readiness_score} label="Market Readiness" color="#60a5fa" />
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <Section label="Problem">
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                {brief.problem_statement}
              </p>
            </Section>

            <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

            <Section label="Product Angles">
              <ProductAnglesList angles={brief.product_angles} />
            </Section>

            <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <Section label="Target User">
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {brief.target_user}
                </p>
              </Section>
              <Section label="Monetization">
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {brief.monetization}
                </p>
              </Section>
            </div>

            <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

            <Section label="Why Now">
              <div style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(139,92,246,0.06)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {brief.unfair_advantage}
                </p>
              </div>
            </Section>

            <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

            <Section label="Source Paper">
              <PaperMeta paper={paper} />
            </Section>

            <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

            <Section label={`Commercial Landscape (${commercial_signals.length} signals)`}>
              <CommercialSignals signals={commercial_signals} count={competing_product_count} />
            </Section>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '10px 20px',
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
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            ← Back to results
          </button>
          
          {/* ADDED THE MISSING <a TAG HERE */}
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--violet) 0%, #a855f7 100%)',
              border: 'none',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-button)',
              textDecoration: 'none',
              transition: 'all var(--transition)',
            }}
          >
            View Source Paper <ExternalLinkIcon />
          </a>
        </div>
      </div>
    </div>
  )
}