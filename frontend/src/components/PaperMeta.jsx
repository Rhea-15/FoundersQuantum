const SourceBadge = ({ source }) => {
    const map = {
      pubmed: { label: 'PubMed', color: '#60a5fa' },
      arxiv: { label: 'arXiv', color: '#f97316' },
      openalex: { label: 'OpenAlex', color: '#34d399' },
    };
    
    const s = map[source] || { label: source, color: '#a78bfa' };
    
    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: '4px',
        background: `${s.color}18`,
        color: s.color,
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        fontFamily: 'var(--font-mono)',
        border: `1px solid ${s.color}33`,
      }}>
        {s.label}
      </span>
    );
  };
    
  const FileIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
    
  export default function PaperMeta({ paper }) {
    const date = new Date(paper.published_at);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '12px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }}>
            <FileIcon />
          </span>
          
          {/* ADDED THE MISSING <a TAG HERE */}
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: 1.4,
              textDecoration: 'none',
              transition: 'color var(--transition)',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-accent)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
          >
            {paper.title}
          </a>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingLeft: '20px' }}>
          <SourceBadge source={paper.source} />
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            {paper.authors.slice(0,2).join(', ')}{paper.authors.length > 2 ? ' et al.' : ''}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>·</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{monthYear}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>·</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            {paper.citation_count} citations
          </span>
        </div>
      </div>
    );
  }