const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:4000'

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include', // ✅ required for cookies
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    throw new Error('API error')
  }

  return res.json() as Promise<T>
}