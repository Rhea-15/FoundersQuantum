import { useState } from 'react'

const SORT_OPTIONS = [
  { key: 'gap', label: 'Gap Score' },
  { key: 'novelty', label: 'Novelty' },
  { key: 'ready', label: 'Market Ready' },
]

const FILTER_OPTIONS = ['All competition', 'Low', 'Medium', 'High']

const FilterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

export default function SortBar({ sort, onSort, filter, onFilter }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Sort:</span>
        <div style={{
          display: 'flex',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => onSort(opt.key)}
              style={{
                padding: '7px 14px',
                background: sort === opt.key ? 'linear-gradient(135deg, var(--violet) 0%, #a855f7 100%)' : 'transparent',
                border: 'none',
                color: sort === opt.key ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                borderRight: '1px solid var(--border-subtle)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)' }}><FilterIcon /></span>
        <div style={{
          display: 'flex',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}>
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => onFilter(opt)}
              style={{
                padding: '7px 12px',
                background: filter === opt ? 'var(--violet-light)' : 'transparent',
                border: 'none',
                color: filter === opt ? 'var(--text-accent)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                borderRight: '1px solid var(--border-subtle)',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}