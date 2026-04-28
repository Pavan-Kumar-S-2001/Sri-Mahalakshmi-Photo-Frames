import { Router } from 'express'
import { z } from 'zod'
import { env } from '../env.js'
import { signToken } from '../auth/jwt.js'
import { verifyToken } from '../auth/jwt.js'

export const authRouter = Router()

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

authRouter.post('/admin/login', (req, res) => {
  const parsed = adminLoginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })
  const { email, password } = parsed.data

  if (email !== env.ADMIN_BOOTSTRAP_EMAIL || password !== env.ADMIN_BOOTSTRAP_PASSWORD) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' })
  }

  const token = signToken({ sub: email, role: 'admin' })
  res.cookie('auth', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  res.json({ ok: true })
})

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('auth')
  res.json({ ok: true })
})

authRouter.get('/me', (req, res) => {
  const token = req.cookies?.auth as string | undefined
  if (!token) return res.json({ user: null })
  try {
    const payload = verifyToken(token)
    return res.json({ user: payload })
  } catch {
    return res.json({ user: null })
  }
})

