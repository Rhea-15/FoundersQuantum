import { useTheme } from '../context/ThemeContext.jsx'

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

const NAV_ITEMS = [
  { label: 'Home', sectionId: 'section-hero' },
  { label: 'How it works', sectionId: 'section-how-it-works' },
  { label: 'Features', sectionId: 'section-features' },
]

export default function Navbar({ onLogoClick, showBack, onBack, isLanding }) {
  const { theme, toggleTheme } = useTheme()

  const handleNavClick = (sectionId) => {
    if (!isLanding) {
      // If not on landing page, go home first then scroll
      onLogoClick()
      // Defer scroll until after page transition renders
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
      return
    }
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(20px)',
      background: theme === 'dark'
        ? 'rgba(10,10,15,0.85)'
        : 'rgba(244,243,255,0.85)',
      transition: 'background 0.4s',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Left: back button or logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {showBack && (
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--violet-light)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-accent)',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                transition: 'all var(--transition)',
              }}
            >
              <ArrowLeftIcon /> Back
            </button>
          )}
          <button
            onClick={onLogoClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '-0.02em',
              padding: 0,
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--violet) 0%, var(--pink) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <StarIcon />
            </div>
            FoundersQuantum
          </button>
        </div>

        {/* Center: nav links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.sectionId)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color var(--transition)',
                padding: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: theme toggle only — Try demo removed */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'var(--violet-light)',
              color: 'var(--text-accent)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition)',
            }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.background = 'var(--violet-glow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--violet-light)'
            }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

      </div>
    </nav>
  )
}