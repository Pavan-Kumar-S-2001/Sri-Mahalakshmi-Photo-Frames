import type { RequestHandler } from 'express'
import { verifyToken } from './jwt.js'

export const requireAdmin: RequestHandler = (req, res, next) => {
  const token = req.cookies?.auth as string | undefined
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' })
  try {
    const payload = verifyToken(token)
    if (payload.role !== 'admin') return res.status(403).json({ error: 'FORBIDDEN' })
    ;(req as any).auth = payload
    next()
  } catch {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }
}

