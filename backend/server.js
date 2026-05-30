import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDb } from './lib/db.js'
import searchRouter from './routes/search.js'
import opportunityRouter from './routes/opportunity.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '1mb' }))

// ── Request logging ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${ms}ms`)
  })
  next()
})

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() })
})

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/search', searchRouter)
app.use('/api/opportunity', opportunityRouter)

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: `Route ${req.path} not found.` })
})

// ── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler)

// ── Bootstrap ────────────────────────────────────────────────────────────────
initDb()
app.listen(PORT, () => {
  console.log(`[server] ResearchGap backend running on http://localhost:${PORT}`)
  console.log(`[server] Gemini key: ${process.env.GEMINI_API_KEY ? 'set' : 'MISSING'}`)
  console.log(`[server] GitHub token: ${process.env.GITHUB_TOKEN ? 'set' : 'not set (rate limited)'}`)
})