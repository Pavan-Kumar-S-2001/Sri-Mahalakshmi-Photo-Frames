import { verifyToken } from '../auth/jwt.js'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import {
  computeCustomizationPricePaise,
  computeDeliveryFeePaise,
  type Customization,
} from '@framecraft/shared'

export const ordersRouter = Router()

const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    addressLine1: z.string().min(5),
    city: z.string().min(2),
    pincode: z.string().min(6),
  }),
  paymentMode: z.enum(['full', 'advance']).default('full'),
  advancePercent: z.number().int().min(1).max(99).default(30),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1).max(50),
        customization: z.custom<Customization>(),
      }),
    )
    .min(1),
})

ordersRouter.post('/', async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'BAD_REQUEST', details: parsed.error.flatten() })
  }

  const { customer, items, paymentMode, advancePercent } = parsed.data
  const productIds = [...new Set(items.map((i) => i.productId))]
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  })
  const productById = new Map(products.map((p) => [p.id, p]))

  if (products.length !== productIds.length) {
    return res.status(400).json({ error: 'INVALID_PRODUCT' })
  }

  const computedItems = items.map((it) => {
    const p = productById.get(it.productId)!
    const breakdown = computeCustomizationPricePaise(p.basePricePaise, it.customization)
    const unitPricePaise = breakdown.subtotalPaise
    const lineTotalPaise = unitPricePaise * it.qty
    return {
      productId: p.id,
      qty: it.qty,
      customization: it.customization,
      unitPricePaise,
      lineTotalPaise,
    }
  })

  const subtotalPaise = computedItems.reduce((acc, it) => acc + it.lineTotalPaise, 0)
  const deliveryFeePaise = computeDeliveryFeePaise(subtotalPaise)
  const totalPaise = subtotalPaise + deliveryFeePaise
  const payableNowPaise =
    paymentMode === 'full'
      ? totalPaise
      : Math.max(1, Math.round((totalPaise * advancePercent) / 100))

  const order = await prisma.order.create({
    data: {
      status: 'created',
      paymentStatus: 'pending',
      paymentMode,
      advancePercent,
      subtotalPaise,
      deliveryFeePaise,
      totalPaise,
      payableNowPaise,
      fullName: customer.fullName,
      phone: customer.phone,
      addressLine1: customer.addressLine1,
      city: customer.city,
      pincode: customer.pincode,
      items: {
        create: computedItems.map((it) => ({
          productId: it.productId,
          qty: it.qty,
          customization: it.customization as unknown as object,
          unitPricePaise: it.unitPricePaise,
          lineTotalPaise: it.lineTotalPaise,
        })),
      },
    },
    include: { items: true },
  })

  res.json({ order })
})

ordersRouter.use((req: any, res: any, next: any) => {
  const token = req.cookies?.auth
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' })

  try {
    const user = verifyToken(token)
    if (user.role !== 'admin') throw new Error()
    next()
  } catch {
    return res.status(401).json({ error: 'INVALID_TOKEN' })
  }
})

ordersRouter.get('/', async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ orders })
})
// 🔥 GET ORDER BY ID (for tracking)
ordersRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) {
    return res.status(404).json({ error: 'NOT_FOUND' })
  }
  // 🔥 UPDATE ORDER STATUS
ordersRouter.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })

    res.json({ order })
  } catch (err) {
    res.status(400).json({ error: 'UPDATE_FAILED' })
  }
})

  res.json({ order })
})