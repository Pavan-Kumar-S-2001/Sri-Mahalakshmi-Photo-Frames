import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

export function AdminRoute({ children }: { children: ReactNode }) {

  const isAdmin = localStorage.getItem('isAdmin')

  // ❌ NOT ADMIN → REDIRECT
  if (!isAdmin) {
    return <Navigate to="/admin/login" />
  }

  return children
}