import express, { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { createRazorpayClient, verifyWebhookSignature } from '../services/razorpayService.js'
import { env } from '../env.js'

export const paymentsRouter = Router()

paymentsRouter.post('/razorpay/order', async (req, res) => {
  const parsed = z.object({ orderId: z.string().min(1) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } })
  if (!order) return res.status(404).json({ error: 'NOT_FOUND' })
  if (order.paymentStatus === 'paid') return res.status(400).json({ error: 'ALREADY_PAID' })

  if (order.razorpayOrderId) {
    return res.json({
      keyId: env.RAZORPAY_KEY_ID,
      razorpayOrderId: order.razorpayOrderId,
      amountPaise: order.payableNowPaise,
      currency: 'INR',
      order,
    })
  }

  const razorpay = createRazorpayClient()
  const rpOrder: any = await razorpay.orders.create({
    amount: order.payableNowPaise,
    currency: 'INR',
    receipt: order.id,
    payment_capture: true,
  })

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: rpOrder.id },
  })

  res.json({
    keyId: env.RAZORPAY_KEY_ID,
    razorpayOrderId: rpOrder.id,
    amountPaise: order.payableNowPaise,
    currency: 'INR',
    order: updated,
  })
})

paymentsRouter.post('/razorpay/confirm', async (req, res) => {
  const parsed = z
    .object({
      orderId: z.string().min(1),
      razorpayOrderId: z.string().min(1),
      razorpayPaymentId: z.string().min(1),
    })
    .safeParse(req.body)

  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } })
  if (!order) return res.status(404).json({ error: 'NOT_FOUND' })

  const razorpay = createRazorpayClient()
  const payment: any = await razorpay.payments.fetch(parsed.data.razorpayPaymentId)

  if (
    payment?.order_id !== parsed.data.razorpayOrderId ||
    payment?.order_id !== order.razorpayOrderId
  ) {
    return res.status(400).json({ error: 'PAYMENT_MISMATCH' })
  }

  if (payment?.status !== 'captured' && payment?.status !== 'authorized') {
    return res.status(400).json({ error: 'PAYMENT_NOT_CAPTURED' })
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'paid',
      advancePaidPaise: order.payableNowPaise,
      status: 'confirmed',
      razorpayPaymentId: parsed.data.razorpayPaymentId,
    },
  })

  res.json({ order: updated })
})

paymentsRouter.post(
  '/razorpay/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.header('x-razorpay-signature')
    if (!signature) return res.status(400).json({ error: 'MISSING_SIGNATURE' })

    const rawBody = req.body as Buffer
    const ok = verifyWebhookSignature(rawBody, signature)
    if (!ok) return res.status(400).json({ error: 'INVALID_SIGNATURE' })

    const event = JSON.parse(rawBody.toString('utf8')) as any
    const eventType = event?.event as string | undefined

    const paymentEntity = event?.payload?.payment?.entity
    const razorpayOrderId = paymentEntity?.order_id as string | undefined
    const razorpayPaymentId = paymentEntity?.id as string | undefined

    if (!razorpayOrderId) return res.status(200).json({ ok: true })

    const order = await prisma.order.findFirst({ where: { razorpayOrderId } })
    if (!order) return res.status(200).json({ ok: true })

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          advancePaidPaise: order.payableNowPaise,
          status: 'confirmed',
          razorpayPaymentId: razorpayPaymentId ?? order.razorpayPaymentId,
        },
      })
    }

    if (eventType === 'payment.failed') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'failed',
          razorpayPaymentId: razorpayPaymentId ?? order.razorpayPaymentId,
        },
      })
    }

    res.json({ ok: true })
  },
)
