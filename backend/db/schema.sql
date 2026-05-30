CREATE TABLE IF NOT EXISTS searches (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  query_hash TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  paper_count INTEGER DEFAULT 0,
  opportunity_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS papers (
  id TEXT PRIMARY KEY,
  search_id TEXT NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  external_id TEXT,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT,
  published_at TEXT,
  citation_count INTEGER DEFAULT 0,
  citation_velocity REAL DEFAULT 0,
  url TEXT,
  summary TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS commercial_signals (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  signal_strength INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  search_id TEXT NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  paper_id TEXT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  gap_score REAL NOT NULL,
  novelty_score REAL NOT NULL,
  market_readiness_score REAL NOT NULL,
  opportunity_title TEXT NOT NULL,
  problem_statement TEXT,
  product_angles TEXT,
  target_user TEXT,
  monetization TEXT,
  gap_reasoning TEXT,
  unfair_advantage TEXT,
  gap_reason TEXT,
  underserved_segment TEXT,
  product_category TEXT,
  time_to_market_estimate TEXT,
  primary_risk TEXT,
  competing_product_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_searches_query_hash ON searches(query_hash);
CREATE INDEX IF NOT EXISTS idx_papers_search_id ON papers(search_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_search_id ON opportunities(search_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_gap_score ON opportunities(gap_score DESC);