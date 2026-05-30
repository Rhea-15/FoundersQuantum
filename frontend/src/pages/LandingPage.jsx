import SearchBar from '../components/SearchBar.jsx'

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const HOW_IT_WORKS = [
  {
    icon: '🔬',
    step: '1.',
    title: 'Crawl recent research',
    desc: 'Continuously index arXiv, bioRxiv, OpenReview and top conferences for breakthroughs in your domain.',
  },
  {
    icon: '📡',
    step: '2.',
    title: 'Map commercial signal',
    desc: 'Cross-reference GitHub repos, Product Hunt launches and funding to find what no one is shipping.',
  },
  {
    icon: '✨',
    step: '3.',
    title: 'Generate scored opportunities',
    desc: 'Get pitchable startup ideas with gap, novelty, and market readiness scores you can defend.',
  },
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'Gap score, not vibes',
    desc: 'Every opportunity ships with a defensible score across novelty, gap, and market readiness.',
  },
  {
    icon: '🏭',
    title: 'Commercial landscape baked in',
    desc: 'See exactly which incumbents are adjacent — and where the white space lives.',
  },
  {
    icon: '🛠️',
    title: 'Built for builders',
    desc: 'Each card unfolds into pitches, monetization models, and the source paper you can cite to investors.',
  },
]

export default function LandingPage({ onSearch }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Hero section */}
      <section className="grid-bg" style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
      }}>
        {/* Radial glow */}
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

        {/* Papers count badge */}
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
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', animation: 'glow-pulse 2s infinite' }} />
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
          Find what research solved
          <br />
          <span style={{
            background: 'linear-gradient(135deg, var(--violet-bright) 0%, var(--pink) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            that no product built.
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: '480px',
          margin: '0 auto 40px',
          animation: 'fadeInUp 0.5s ease 0.2s both',
        }}>
          ResearchGap scans recent papers, GitHub and Product Hunt to surface startup opportunities where the science is ready and the market isn't.
        </p>

        {/* Search */}
        <div style={{ width: '100%', animation: 'fadeInUp 0.5s ease 0.3s both' }}>
          <SearchBar onSearch={onSearch} />
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: 'var(--text-accent)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>
            A live pipeline that crawls research, weighs commercial signal, and writes the opportunity.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {HOW_IT_WORKS.map((item, i) => (
            <FeatureCard key={i} {...item} variant="primary" delay={i * 80} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {FEATURES.map((item, i) => (
            <FeatureCard key={i} {...item} variant="secondary" delay={i * 80 + 240} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
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
            onClick={() => document.querySelector('input')?.focus()}
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

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>© 2026 ResearchGap. All breakthroughs reserved.</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>Built for builders who read papers.</span>
      </footer>

      <style>{`
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, step, title, desc, variant, delay }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      transition: 'all var(--transition)',
      animation: `fadeInUp 0.5s ease ${delay}ms both`,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-hover)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--violet-light)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        marginBottom: '16px',
      }}>
        {icon}
      </div>
      {step && (
        <p style={{ color: 'var(--text-accent)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
          {step}
        </p>
      )}
      <h3 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
        {desc}
      </p>
    </div>
  )
}