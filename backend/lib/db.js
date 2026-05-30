import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || './researchgap.db'

let _db = null

export function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
  }
  return _db
}

export function initDb() {
  const db = getDb()
  const schema = readFileSync(join(__dirname, '../db/schema.sql'), 'utf8')
  db.exec(schema)
  console.log('[db] Schema initialized at', DB_PATH)
  return db
}

export function saveSearch({ id, query, query_hash, paper_count, opportunity_count }) {
  const db = getDb()
  const now = Date.now()
  db.prepare(`
    INSERT OR REPLACE INTO searches (id, query, query_hash, created_at, paper_count, opportunity_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, query, query_hash, now, paper_count, opportunity_count)
}

export function getSearchByHash(query_hash) {
  const db = getDb()
  return db.prepare('SELECT * FROM searches WHERE query_hash = ?').get(query_hash)
}

export function getSearchById(id) {
  const db = getDb()
  return db.prepare('SELECT * FROM searches WHERE id = ?').get(id)
}

export function savePaper(paper) {
  const db = getDb()
  const now = Date.now()
  db.prepare(`
    INSERT OR IGNORE INTO papers
      (id, search_id, source, external_id, title, abstract, authors, published_at,
       citation_count, citation_velocity, url, summary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    paper.id, paper.search_id, paper.source, paper.external_id,
    paper.title, paper.abstract,
    JSON.stringify(paper.authors || []),
    paper.published_at, paper.citation_count || 0,
    paper.citation_velocity || 0, paper.url,
    paper.summary || null, now
  )
}

export function saveCommercialSignal(signal) {
  const db = getDb()
  const now = Date.now()
  db.prepare(`
    INSERT OR IGNORE INTO commercial_signals
      (id, paper_id, source, name, url, description, signal_strength, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    signal.id, signal.paper_id, signal.source,
    signal.name, signal.url, signal.description,
    signal.signal_strength || 0, now
  )
}

export function saveOpportunity(opp) {
  const db = getDb()
  const now = Date.now()
  db.prepare(`
    INSERT OR REPLACE INTO opportunities
      (id, search_id, paper_id, gap_score, novelty_score, market_readiness_score,
       opportunity_title, problem_statement, product_angles, target_user, monetization,
       gap_reasoning, unfair_advantage, gap_reason, underserved_segment, product_category,
       time_to_market_estimate, primary_risk, competing_product_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    opp.id, opp.search_id, opp.paper_id,
    opp.gap_score, opp.novelty_score, opp.market_readiness_score,
    opp.opportunity_title, opp.problem_statement,
    JSON.stringify(opp.product_angles || []),
    opp.target_user, opp.monetization,
    opp.gap_reasoning, opp.unfair_advantage,
    opp.gap_reason, opp.underserved_segment, opp.product_category,
    opp.time_to_market_estimate, opp.primary_risk,
    opp.competing_product_count || 0, now
  )
}

export function getOpportunityById(id) {
  const db = getDb()
  const opp = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(id)
  if (!opp) return null
  return hydrateOpportunity(opp)
}

export function getOpportunitiesBySearchId(search_id) {
  const db = getDb()
  const opps = db.prepare(
    'SELECT * FROM opportunities WHERE search_id = ? ORDER BY gap_score DESC'
  ).all(search_id)
  return opps.map(hydrateOpportunity)
}

function hydrateOpportunity(opp) {
  const db = getDb()
  const paper = db.prepare('SELECT * FROM papers WHERE id = ?').get(opp.paper_id)
  const signals = db.prepare('SELECT * FROM commercial_signals WHERE paper_id = ?').all(opp.paper_id)

  return {
    id: opp.id,
    gap_score: opp.gap_score,
    scores: {
      novelty_score: opp.novelty_score,
      gap_score: opp.gap_score,
      market_readiness_score: opp.market_readiness_score,
      reasoning: opp.gap_reasoning || '',
    },
    brief: {
      opportunity_title: opp.opportunity_title,
      problem_statement: opp.problem_statement,
      product_angles: JSON.parse(opp.product_angles || '[]'),
      target_user: opp.target_user,
      monetization: opp.monetization,
      unfair_advantage: opp.unfair_advantage,
    },
    market_gap: {
      gap_reason: opp.gap_reason,
      underserved_segment: opp.underserved_segment,
      product_category: opp.product_category,
      time_to_market_estimate: opp.time_to_market_estimate,
      primary_risk: opp.primary_risk,
    },
    paper: paper ? {
      id: paper.id,
      source: paper.source,
      external_id: paper.external_id,
      title: paper.title,
      abstract: paper.abstract,
      authors: JSON.parse(paper.authors || '[]'),
      published_at: paper.published_at,
      citation_count: paper.citation_count,
      citation_velocity: paper.citation_velocity,
      url: paper.url,
      summary: paper.summary,
    } : null,
    commercial_signals: signals.map(s => ({
      source: s.source,
      name: s.name,
      url: s.url,
      description: s.description,
      signal_strength: s.signal_strength,
    })),
    competing_product_count: opp.competing_product_count,
    created_at: opp.created_at,
  }
}