export default function ProductAnglesList({ angles }) {
    const colors = ['#7c3aed', '#a855f7', '#ec4899']
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {angles.map((angle, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${colors[i]}44`
              e.currentTarget.style.background = `${colors[i]}08`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.background = 'var(--bg-elevated)'
            }}
          >
            <div style={{
              flexShrink: 0,
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              background: `${colors[i]}22`,
              border: `1px solid ${colors[i]}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '11px',
              color: colors[i],
            }}>
              {i + 1}
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              lineHeight: 1.6,
              margin: 0,
            }}>
              {angle}
            </p>
          </div>
        ))}
      </div>
    )
  }