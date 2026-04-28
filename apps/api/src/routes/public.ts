import { Router } from 'express'
import { prisma } from '../db.js'

export const publicRouter = Router()

// 🔍 Track orders by phone
publicRouter.get('/track-orders', async (req, res) => {
  const phone = String(req.query.phone || '').trim()

  if (!phone) {
    return res.status(400).json({ error: 'PHONE_REQUIRED' })
  }

  const orders = await prisma.order.findMany({
    where: { phone },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      totalPaise: true,
      createdAt: true,
    },
  })

  res.json({ orders })
})