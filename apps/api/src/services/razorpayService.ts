import Razorpay from 'razorpay'
import crypto from 'crypto'
import { env } from '../env.js'

function requireRazorpay() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay is not configured')
  }
  return {
    keyId: env.RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
  }
}

export function createRazorpayClient() {
  const cfg = requireRazorpay()
  return new Razorpay({ key_id: cfg.keyId, key_secret: cfg.keySecret })
}

export function verifyWebhookSignature(rawBody: Buffer, signature: string) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) throw new Error('Webhook secret not configured')
  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

