import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { presignGetObject } from '../services/s3Service.js'
import { requireAdmin } from '../auth/requireAdmin.js'

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

adminRouter.get('/uploads/:id/download', async (req, res) => {
  const upload = await prisma.upload.findUnique({ where: { id: req.params.id } })
  if (!upload) return res.status(404).json({ error: 'NOT_FOUND' })
  const url = await presignGetObject(upload.storageKey)
  res.json({ url })
})

