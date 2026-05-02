import type { UploadedImage } from './uploadClient'

const PENDING_UPLOAD_KEY = 'sri-mahalakshmi-pending-upload'

export function getPendingUpload() {
  if (typeof window === 'undefined') return null

  const raw = window.sessionStorage.getItem(PENDING_UPLOAD_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as UploadedImage
  } catch {
    window.sessionStorage.removeItem(PENDING_UPLOAD_KEY)
    return null
  }
}

export function setPendingUpload(upload: UploadedImage) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(PENDING_UPLOAD_KEY, JSON.stringify(upload))
}

export function clearPendingUpload() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(PENDING_UPLOAD_KEY)
}
