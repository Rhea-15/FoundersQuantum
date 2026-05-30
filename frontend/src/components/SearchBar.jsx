import { useState } from 'react'
import { EXAMPLE_QUERIES } from '../data/mockData.js'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

export default function SearchBar({ onSearch, initialValue = '', compact = false }) {
  const [value, setValue] = useState(initialValue)
  const [focused, setFocused] = useState(false)

  const handleSubmit = () => {
    if (value.trim()) onSearch(value.trim())
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ width: '100%', maxWidth: compact ? '600px' : '540px', margin: '0 auto' }}>
      {/* Search input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: focused
          ? 'var(--bg-card-hover)'
          : 'var(--bg-card)',
        border: `1px solid ${focused ? 'var(--violet-bright)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '5px 5px 5px 16px',
        gap: '10px',
        boxShadow: focused ? `0 0 0 3px var(--violet-glow), var(--shadow-glow)` : 'var(--shadow-card)',
        transition: 'all var(--transition)',
      }}>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <SearchIcon />
        </span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Search a research domain — try "LLM memory"`}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: compact ? '14px' : '15px',
            padding: '8px 0',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            background: value.trim()
              ? 'linear-gradient(135deg, var(--violet) 0%, #a855f7 100%)'
              : 'var(--bg-elevated)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: value.trim() ? '#fff' : 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: value.trim() ? 'pointer' : 'default',
            boxShadow: value.trim() ? 'var(--shadow-button)' : 'none',
            transition: 'all var(--transition)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          Discover <ArrowRightIcon />
        </button>
      </div>

      {/* Example chips */}
      {!compact && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '14px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>try:</span>
          {EXAMPLE_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => { setValue(q); onSearch(q) }}
              style={{
                padding: '4px 12px',
                borderRadius: '100px',
                border: '1px solid var(--border)',
                background: 'var(--violet-light)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = 'var(--violet-bright)'
                e.target.style.color = 'var(--text-accent)'
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.color = 'var(--text-secondary)'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}