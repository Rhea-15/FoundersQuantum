import { Router } from 'express'
import { getOpportunityById } from '../lib/db.js'

const router = Router()

// GET /api/opportunity/:id
router.get('/:id', async (req, res, next) => {
  try {
    const opp = getOpportunityById(req.params.id)
    if (!opp) {
      return res.status(404).json({
        error: 'not_found',
        message: `Opportunity ${req.params.id} not found or expired.`,
      })
    }
    return res.json(opp)
  } catch (err) {
    next(err)
  }
})

export default router