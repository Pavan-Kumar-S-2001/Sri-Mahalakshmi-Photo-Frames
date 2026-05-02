import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { presignGetObject } from '../services/s3Service.js'
import { requireAdmin } from '../auth/requireAdmin.js'
import { buildUploadPublicUrl, isLocalUpload } from '../services/localUpload.js'

export const adminRouter = Router()
adminRouter.use(requireAdmin)

adminRouter.get('/orders', async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 200,
  })
  res.json({ orders })
})

adminRouter.delete('/orders/:id', async (req, res) => {
  const existing = await prisma.order.findUnique({
    where: { id: req.params.id },
    select: { id: true },
  })

  if (!existing) {
    return res.status(404).json({ error: 'NOT_FOUND' })
  }

  await prisma.order.delete({
    where: { id: req.params.id },
  })

  res.json({ ok: true })
})

adminRouter.get('/products', async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  res.json({ products })
})

const upsertProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  basePricePaise: z.number().int().min(0),
  images: z.array(z.string()).default([]),
  frameTypes: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  glassTypes: z.array(z.string()).default([]),
  availabilityStatus: z
    .enum(['in_stock', 'out_of_stock', 'soon_available'])
    .default('in_stock'),
  minimumAdvancePaise: z.number().int().min(1).default(50000),
  active: z.boolean().default(true),
})

adminRouter.post('/products', async (req, res) => {
  const parsed = upsertProductSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })
  const p = parsed.data

  const data = {
    name: p.name,
    basePricePaise: p.basePricePaise,
    images: p.images,
    frameTypes: p.frameTypes,
    sizes: p.sizes,
    glassTypes: p.glassTypes,
    availabilityStatus: p.availabilityStatus,
    minimumAdvancePaise: p.minimumAdvancePaise,
    active: p.active,
  }

  const product = p.id
    ? await prisma.product.upsert({
        where: { id: p.id },
        update: data,
        create: { id: p.id, ...data },
      })
    : await prisma.product.create({ data })

  res.json({ product })
})

adminRouter.patch('/products/:id', async (req, res) => {
  const parsed = z
    .object({
      availabilityStatus: z
        .enum(['in_stock', 'out_of_stock', 'soon_available'])
        .optional(),
      minimumAdvancePaise: z.number().int().min(1).optional(),
      active: z.boolean().optional(),
    })
    .safeParse(req.body)

  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: parsed.data,
  })

  res.json({ product })
})

adminRouter.delete('/products/:id', async (req, res) => {
  const orderItemCount = await prisma.orderItem.count({
    where: { productId: req.params.id },
  })

  if (orderItemCount > 0) {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        active: false,
        availabilityStatus: 'out_of_stock',
      },
    })

    return res.json({ archived: true, product })
  }

  await prisma.product.delete({
    where: { id: req.params.id },
  })

  res.json({ deleted: true })
})

adminRouter.patch('/orders/:id/status', async (req, res) => {
  const parsed = z
    .object({ status: z.string().min(1) })
    .safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status as any },
  })
  res.json({ order })
})

adminRouter.patch('/orders/:id/balance-payment', async (req, res) => {
  const parsed = z
    .object({
      status: z.enum(['pending', 'paid']),
      method: z.enum(['cash', 'online']).optional(),
    })
    .safeParse(req.body)

  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })

  const existing = await prisma.order.findUnique({
    where: { id: req.params.id },
  })

  if (!existing) return res.status(404).json({ error: 'NOT_FOUND' })

  const balanceDuePaise = Math.max(0, existing.totalPaise - existing.payableNowPaise)

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data:
      parsed.data.status === 'paid'
        ? {
            balancePaymentStatus: 'paid',
            balancePaymentMethod: parsed.data.method,
            balancePaidPaise: balanceDuePaise,
            balancePaidAt: new Date(),
          }
        : {
            balancePaymentStatus: 'pending',
            balancePaymentMethod: null,
            balancePaidPaise: 0,
            balancePaidAt: null,
          },
  })

  res.json({ order })
})

adminRouter.get('/uploads/:id/download', async (req, res) => {
  const upload = await prisma.upload.findUnique({ where: { id: req.params.id } })
  if (!upload) return res.status(404).json({ error: 'NOT_FOUND' })
  if (isLocalUpload(upload.storageKey)) {
    return res.json({ url: buildUploadPublicUrl(req, upload.storageKey) })
  }
  const url = await presignGetObject(upload.storageKey)
  res.json({ url })
})
