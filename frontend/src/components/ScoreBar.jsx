import { useEffect, useRef, useState } from 'react'

export default function ScoreBar({ score, label, color }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 150)
    return () => clearTimeout(timer)
  }, [])

  const getColor = () => {
    if (color) return color
    if (score >= 8) return 'var(--score-high)'
    if (score >= 6) return 'var(--score-med)'
    return 'var(--score-low)'
  }

  const c = getColor()
  const pct = (score / 10) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 700,
          color: c,
        }}>
          {score.toFixed(1)}<span style={{ fontSize: '10px', opacity: 0.6 }}>/10</span>
        </span>
      </div>
      <div ref={ref} style={{
        height: '5px',
        borderRadius: '3px',
        background: 'var(--bg-elevated)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: animated ? `${pct}%` : '0%',
          background: `linear-gradient(90deg, ${c}99, ${c})`,
          borderRadius: '3px',
          transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 8px ${c}66`,
        }} />
      </div>
    </div>
  )
}