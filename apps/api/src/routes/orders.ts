import { Router } from 'express'
import { z } from 'zod'
import {
  MIN_ORDER_VALUE_PAISE,
  computeCustomizationPricePaise,
  computeDeliveryFeePaise,
  type Customization,
} from '@framecraft/shared'
import { verifyToken } from '../auth/jwt.js'
import { prisma } from '../db.js'

export const ordersRouter = Router()

const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    addressLine1: z.string().min(5),
    city: z.string().min(2),
    pincode: z.string().min(6),
  }),
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

  const { customer, items } = parsed.data
  const productIds = [...new Set(items.map((item) => item.productId))]

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  })

  const productById = new Map(products.map((product) => [product.id, product]))

  if (products.length !== productIds.length) {
    return res.status(400).json({ error: 'INVALID_PRODUCT' })
  }

  const unavailable = products.find((product) => product.availabilityStatus !== 'in_stock')
  if (unavailable) {
    return res.status(400).json({
      error: 'PRODUCT_UNAVAILABLE',
      productId: unavailable.id,
    })
  }

  const computedItems = items.map((item) => {
    const product = productById.get(item.productId)!
    const breakdown = computeCustomizationPricePaise(product.basePricePaise, item.customization)
    const unitPricePaise = breakdown.subtotalPaise
    const lineTotalPaise = unitPricePaise * item.qty
    const lineAdvancePaise = Math.min(
      lineTotalPaise,
      Math.max(1, product.minimumAdvancePaise) * item.qty,
    )

    return {
      productId: product.id,
      qty: item.qty,
      customization: item.customization,
      unitPricePaise,
      lineTotalPaise,
      lineAdvancePaise,
    }
  })

  const subtotalPaise = computedItems.reduce((sum, item) => sum + item.lineTotalPaise, 0)

  if (subtotalPaise < MIN_ORDER_VALUE_PAISE) {
    return res.status(400).json({
      error: 'MIN_ORDER_VALUE',
      minimumPaise: MIN_ORDER_VALUE_PAISE,
    })
  }

  const deliveryFeePaise = computeDeliveryFeePaise(subtotalPaise)
  const totalPaise = subtotalPaise + deliveryFeePaise
  const payableNowPaise = Math.min(
    totalPaise,
    computedItems.reduce((sum, item) => sum + item.lineAdvancePaise, 0),
  )
  const advancePercent = Math.max(1, Math.round((payableNowPaise / totalPaise) * 100))

  const order = await prisma.order.create({
    data: {
      status: 'created',
      paymentStatus: 'pending',
      paymentMode: 'advance',
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
        create: computedItems.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          customization: item.customization as unknown as object,
          unitPricePaise: item.unitPricePaise,
          lineTotalPaise: item.lineTotalPaise,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  const uploadKeys = [
    ...new Set(
      computedItems
        .map((item) => item.customization?.uploadKey)
        .filter((value): value is string => typeof value === 'string' && value.length > 0),
    ),
  ]

  if (uploadKeys.length > 0) {
    await prisma.upload.updateMany({
      where: {
        storageKey: { in: uploadKeys },
      },
      data: {
        orderId: order.id,
      },
    })
  }

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
    include: {
      items: {
        include: {
          product: true,
        },
      },
      uploads: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ orders })
})

ordersRouter.get('/:id', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      uploads: true,
    },
  })

  if (!order) {
    return res.status(404).json({ error: 'NOT_FOUND' })
  }

  res.json({ order })
})

ordersRouter.patch('/:id', async (req, res) => {
  const parsed = z.object({ status: z.string().min(1) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })

  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status as any },
    })

    res.json({ order })
  } catch {
    res.status(400).json({ error: 'UPDATE_FAILED' })
  }
})
