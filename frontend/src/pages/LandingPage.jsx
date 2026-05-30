import SearchBar from '../components/SearchBar.jsx'

const HOW_IT_WORKS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)',
    step: '1.',
    title: 'Crawl recent research',
    desc: 'Continuously index arXiv, bioRxiv, OpenReview and top conferences for breakthroughs in your domain.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
    step: '2.',
    title: 'Map commercial signal',
    desc: 'Cross-reference GitHub repos, Product Hunt launches and funding to find what no one is shipping.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    step: '3.',
    title: 'Generate scored opportunities',
    desc: 'Get pitchable startup ideas with gap, novelty, and market readiness scores you can defend.',
  },
]

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
    title: 'Gap score, not vibes',
    desc: 'Every opportunity ships with a defensible score across novelty, gap, and market readiness.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #4a1d96 0%, #7c3aed 100%)',
    title: 'Commercial landscape baked in',
    desc: 'See exactly which incumbents are adjacent — and where the white space lives.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #831843 0%, #db2777 100%)',
    title: 'Built for builders',
    desc: 'Each card unfolds into pitches, monetization models, and the source paper you can cite to investors.',
  },
]
export default function LandingPage({ onSearch }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section
        id="section-hero"
        className="grid-bg"
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 60px',
          position: 'relative',
          scrollMarginTop: '60px',
        }}
      >
        {/* Radial glows */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse, var(--violet-glow) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: '400px',
          height: '300px',
          background: 'radial-gradient(ellipse, var(--pink-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Live badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '100px',
          border: '1px solid var(--border)',
          background: 'var(--violet-light)',
          color: 'var(--text-accent)',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '28px',
          animation: 'fadeInUp 0.5s ease',
          fontFamily: 'var(--font-mono)',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#34d399',
            animation: 'glow-pulse 2s infinite',
          }} />
          Indexing 142,000+ papers from this week
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          textAlign: 'center',
          maxWidth: '800px',
          color: 'var(--text-primary)',
          margin: '0 auto 16px',
          animation: 'fadeInUp 0.5s ease 0.1s both',
        }}>
          Find research that's 
          <br />
          <span style={{
            background: 'linear-gradient(135deg, var(--violet-bright) 0%, var(--pink) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ready to be built
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: '480px',
          margin: '0 auto 40px',
          animation: 'fadeInUp 0.5s ease 0.2s both',
        }}>
          FoundersQuantum scans recent papers, GitHub and Product Hunt to surface startup opportunities where the science is ready and the market isn't.
        </p>

        {/* Search */}
        <div style={{ width: '100%', animation: 'fadeInUp 0.5s ease 0.3s both' }}>
          <SearchBar onSearch={onSearch} />
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ─────────────────────────────────────────── */}
      <section
        id="section-how-it-works"
        style={{
          padding: '80px 24px 40px',
          maxWidth: '1100px',
          margin: '0 auto',
          scrollMarginTop: '60px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            color: 'var(--text-accent)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            marginBottom: '10px',
          }}>
            HOW IT WORKS
          </p>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '0 0 12px',
          }}>
            From paper to pitch in seconds
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '15px',
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            A live pipeline that crawls research, weighs commercial signal, and writes the opportunity.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {HOW_IT_WORKS.map((item, i) => (
            <FeatureCard key={i} {...item} variant="primary" delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ─────────────────────────────────────────────── */}
      <section
        id="section-features"
        style={{
          padding: '40px 24px 80px',
          maxWidth: '1100px',
          margin: '0 auto',
          scrollMarginTop: '60px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            color: 'var(--text-accent)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            marginBottom: '10px',
          }}>
            FEATURES
          </p>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '0 0 12px',
          }}>
            Built for serious builders
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '15px',
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            Every feature is designed to get you from research to investor-ready pitch as fast as possible.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {FEATURES.map((item, i) => (
            <FeatureCard key={i} {...item} variant="secondary" delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(236,72,153,0.1) 100%)',
          border: '1px solid var(--border)',
          padding: '56px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, var(--violet-glow) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '0 0 12px',
          }}>
            Your next startup is already in a paper<br />from last week.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '28px' }}>
            Find it before anyone else does.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('section-hero')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setTimeout(() => document.querySelector('input')?.focus(), 500)
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, var(--violet) 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-button)',
              letterSpacing: '0.01em',
            }}
          >
            Run a live discovery →
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
          © 2026 FoundersQuantum. All breakthroughs reserved.
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
          Built for builders who read papers.
        </span>
      </footer>

      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, iconBg, step, title, desc, delay }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        transition: 'all var(--transition)',
        animation: `fadeInUp 0.5s ease ${delay}ms both`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-hover)'
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Subtle top line accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--violet-bright)33, transparent)',
      }} />

      {/* Icon box */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}>
        {icon}
      </div>

      {step && (
        <p style={{
          color: 'var(--text-accent)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          marginBottom: '6px',
          fontFamily: 'var(--font-mono)',
        }}>
          {step}
        </p>
      )}
      <h3 style={{
        color: 'var(--text-primary)',
        fontSize: '15px',
        fontWeight: 700,
        margin: '0 0 10px',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '13px',
        lineHeight: 1.65,
        margin: 0,
      }}>
        {desc}
      </p>
    </div>
  )
}