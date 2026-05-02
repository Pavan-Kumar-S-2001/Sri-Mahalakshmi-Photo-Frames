import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Request } from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads')

export const LOCAL_UPLOADS_PREFIX = '/static/uploads'

function sanitizeBaseName(fileName: string) {
  const withoutExt = fileName.replace(/\.[^.]+$/, '')
  const cleaned = withoutExt.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-')
  return cleaned.slice(0, 40) || 'image'
}

function extFromMime(mime: string) {
  switch (mime) {
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/webp':
      return '.webp'
    case 'image/gif':
      return '.gif'
    default:
      return '.bin'
  }
}

export function buildUploadPublicUrl(req: Pick<Request, 'protocol' | 'get'>, storageKey: string) {
  return `${req.protocol}://${req.get('host')}${storageKey}`
}

export function isLocalUpload(storageKey: string) {
  return storageKey.startsWith(LOCAL_UPLOADS_PREFIX)
}

export function getLocalUploadsDir() {
  return uploadsDir
}

export async function saveDataUrlUpload({
  dataUrl,
  mime,
  fileName,
}: {
  dataUrl: string
  mime: string
  fileName: string
}) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)

  if (!match) {
    throw new Error('INVALID_DATA_URL')
  }

  const buffer = Buffer.from(match[2], 'base64')
  const ext = extFromMime(mime || match[1])
  const baseName = sanitizeBaseName(fileName)
  const storedName = `${Date.now()}-${Math.random().toString(16).slice(2)}-${baseName}${ext}`

  await mkdir(uploadsDir, { recursive: true })
  await writeFile(path.join(uploadsDir, storedName), buffer)

  return {
    storageKey: `${LOCAL_UPLOADS_PREFIX}/${storedName}`,
    size: buffer.length,
  }
}
