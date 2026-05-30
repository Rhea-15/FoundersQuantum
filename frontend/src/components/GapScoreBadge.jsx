export default function GapScoreBadge({ score, label = 'GAP', size = 'md' }) {
    const getColor = (s) => {
      if (s >= 8) return { color: 'var(--score-high)', bg: 'var(--score-high-bg)' }
      if (s >= 6) return { color: 'var(--score-med)', bg: 'var(--score-med-bg)' }
      return { color: 'var(--score-low)', bg: 'var(--score-low-bg)' }
    }
    const { color, bg } = getColor(score)
    const isLarge = size === 'lg'
  
    return (
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        padding: isLarge ? '10px 16px' : '6px 12px',
        borderRadius: 'var(--radius-sm)',
        background: bg,
        border: `1px solid ${color}33`,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: isLarge ? '24px' : '16px',
          color,
          lineHeight: 1,
        }}>
          {score.toFixed(1)}
        </span>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: isLarge ? '10px' : '9px',
          color,
          letterSpacing: '0.1em',
          opacity: 0.8,
        }}>
          {label}
        </span>
      </div>
    )
  }