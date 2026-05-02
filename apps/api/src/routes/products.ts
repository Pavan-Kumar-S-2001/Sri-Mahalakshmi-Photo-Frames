import { Router } from 'express'
import { prisma } from '../db.js'

export const productsRouter = Router()

productsRouter.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ products })
})

productsRouter.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  })
  if (!product || !product.active) return res.status(404).json({ error: 'NOT_FOUND' })
  res.json({ product })
})
