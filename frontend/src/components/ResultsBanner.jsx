export default function ResultsBanner({ query, paperCount, oppCount, avgGapScore }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      padding: '16px 20px',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-card)',
      marginBottom: '20px',
      animation: 'fadeInUp 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Stat value={paperCount} label="papers scanned" />
          <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />
          <Stat value={oppCount} label="gaps detected" highlight />
          {avgGapScore !== null && (
            <>
              <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />
              <Stat value={avgGapScore} label="avg gap score" />
            </>
          )}
        </div>
        <div style={{
          padding: '4px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--violet-light)',
          border: '1px solid var(--border)',
          color: 'var(--text-accent)',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
        }}>
          {query}
        </div>
      </div>
    </div>
  )
}

function Stat({ value, label, highlight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: '22px',
        color: highlight ? 'var(--violet-bright)' : 'var(--text-primary)',
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}>
        {value ?? '—'}
      </span>
      <span style={{
        color: 'var(--text-muted)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.03em',
      }}>
        {label}
      </span>
    </div>
  )
}