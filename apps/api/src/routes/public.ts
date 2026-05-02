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
      payableNowPaise: true,
      advancePaidPaise: true,
      balancePaymentStatus: true,
      balancePaymentMethod: true,
      balancePaidPaise: true,
      totalPaise: true,
      createdAt: true,
    },
  })

  res.json({ orders })
})

publicRouter.get('/receipt/:id', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    return res.status(404).json({ error: 'NOT_FOUND' })
  }

  res.json({
    order,
    remainingDuePaise: Math.max(0, order.totalPaise - order.advancePaidPaise - order.balancePaidPaise),
  })
})
