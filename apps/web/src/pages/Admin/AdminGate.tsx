import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { apiFetch } from '../../lib/apiClient'

export function AdminGate({ children }: PropsWithChildren) {
  const q = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiFetch<{ user: null | { role: string } }>('/auth/me'),
  })

  if (q.isLoading) {
    return (
      <div className="container-px py-10">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          Checking admin session...
        </div>
      </div>
    )
  }

  if (!q.data?.user || q.data.user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

