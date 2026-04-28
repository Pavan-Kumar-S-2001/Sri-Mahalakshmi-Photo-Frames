import jwt from 'jsonwebtoken'
import { env } from '../env.js'

export type AuthToken = {
  sub: string
  role: 'admin' | 'customer'
}

export function signToken(payload: AuthToken) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthToken
}

