import { apiFetch } from './apiClient'

export type UploadedImage = {
  uploadId: string
  uploadKey: string
  imageUrl: string
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('FILE_READ_FAILED'))
    reader.readAsDataURL(file)
  })
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('IMAGE_LOAD_FAILED'))
    image.src = url
  })
}

async function optimizeImage(file: File) {
  if (!file.type.startsWith('image/')) {
    return {
      dataUrl: await readFileAsDataUrl(file),
      mime: file.type || 'application/octet-stream',
    }
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(objectUrl)
    const maxDimension = 1600
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('CANVAS_NOT_AVAILABLE')
    }

    context.drawImage(image, 0, 0, width, height)

    const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const dataUrl = canvas.toDataURL(mime, mime === 'image/jpeg' ? 0.86 : undefined)

    return { dataUrl, mime }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function uploadImageFile(file: File): Promise<UploadedImage> {
  const optimized = await optimizeImage(file)

  const response = await apiFetch<{
    upload: { id: string }
    uploadKey: string
    publicUrl: string
  }>('/uploads/direct', {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      mime: optimized.mime,
      dataUrl: optimized.dataUrl,
    }),
  })

  return {
    uploadId: response.upload.id,
    uploadKey: response.uploadKey,
    imageUrl: response.publicUrl,
  }
}
