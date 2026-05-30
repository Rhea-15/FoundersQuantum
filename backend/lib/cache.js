import { getDb } from './db.js'

// In-process TTL cache using SQLite as backing store.
// For production swap the Map for Upstash Redis.

const _mem = new Map()
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '21600') * 1000

export function getCached(key) {
  const entry = _mem.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    _mem.delete(key)
    return null
  }
  return entry.value
}

export function setCached(key, value) {
  _mem.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL,
  })
}

export function deleteCached(key) {
  _mem.delete(key)
}

export function hashQuery(query) {
  // Simple deterministic hash for cache key
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ' ')
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'q_' + Math.abs(hash).toString(36) + '_' + normalized.length
}