import { NavLink, Outlet } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { apiFetch } from '../../lib/apiClient'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

export function AdminLayout() {
  const nav = useNavigate()
  const qc = useQueryClient()

  return (
    <div className="container-px py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-72">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-zinc-900">Admin</div>
              <button
                type="button"
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                onClick={async () => {
                  await apiFetch('/auth/logout', { method: 'POST' })
                  await qc.invalidateQueries({ queryKey: ['auth', 'me'] })
                  nav('/admin/login', { replace: true })
                }}
              >
                Logout
              </button>
            </div>
            <nav className="mt-4 grid gap-1">
              <AdminNav to="/admin">Dashboard</AdminNav>
              <AdminNav to="/admin/products">Products</AdminNav>
              <AdminNav to="/admin/orders">Orders</AdminNav>
            </nav>
          </div>
        </aside>
        <section className="flex-1">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

function AdminNav({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge(
          'rounded-2xl px-4 py-3 text-sm font-semibold transition',
          isActive
            ? 'bg-zinc-900 text-white'
            : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900',
        )
      }
      end={to === '/admin'}
    >
      {children}
    </NavLink>
  )
}

