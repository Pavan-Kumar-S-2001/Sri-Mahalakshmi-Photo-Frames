import { Router } from 'express'
import { z } from 'zod'
import { presignPutObject } from '../services/s3Service.js'
import { prisma } from '../db.js'
import { buildUploadPublicUrl, saveDataUrlUpload } from '../services/localUpload.js'

export const uploadsRouter = Router()

const presignSchema = z.object({
  mime: z.string().min(3),
  size: z.number().int().min(1).max(20 * 1024 * 1024),
  orderId: z.string().optional(),
})

uploadsRouter.post('/presign', async (req, res) => {
  const parsed = presignSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })

  const { mime, size, orderId } = parsed.data
  const key = `uploads/${Date.now()}-${Math.random().toString(16).slice(2)}`
  const url = await presignPutObject(key, mime)

  const upload = await prisma.upload.create({
    data: {
      orderId,
      storageKey: key,
      mime,
      size,
    },
  })

  res.json({ upload, url, key })
})

const directUploadSchema = z.object({
  fileName: z.string().min(1),
  mime: z.string().min(3),
  dataUrl: z.string().min(30),
  orderId: z.string().optional(),
})

uploadsRouter.post('/direct', async (req, res) => {
  const parsed = directUploadSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'BAD_REQUEST' })

  const saved = await saveDataUrlUpload({
    dataUrl: parsed.data.dataUrl,
    mime: parsed.data.mime,
    fileName: parsed.data.fileName,
  })

  const upload = await prisma.upload.create({
    data: {
      orderId: parsed.data.orderId,
      storageKey: saved.storageKey,
      mime: parsed.data.mime,
      size: saved.size,
    },
  })

  res.json({
    upload,
    uploadKey: saved.storageKey,
    publicUrl: buildUploadPublicUrl(req, saved.storageKey),
  })
})
