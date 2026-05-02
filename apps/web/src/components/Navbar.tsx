import { NavLink } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/apiClient'
import { useCartStore } from '../store/cartStore'

const linkBase =
  'rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950'
const linkActive = 'bg-zinc-100 text-zinc-950'

export function Navbar() {
  const { data } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () =>
      apiFetch<{ user: null | { role: string } }>('/auth/me'),
  })

  const isAdmin = data?.user?.role === 'admin'
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + Math.max(1, item.qty || 1), 0),
  )

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="container-px flex h-16 items-center justify-between">

        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/lakshmi.png"
            className="w-10 h-10 rounded-full shadow"
          />
          <span className="leading-tight">
            <div className="text-lg font-bold text-zinc-950">
              Sri Mahalakshmi
            </div>
            <div className="text-sm bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent font-semibold">
              Photo Frames
            </div>
          </span>
        </NavLink>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 sm:flex">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/shop">Shop</NavItem>

          {/* CART WITH BADGE */}
          <div className="relative">
            <NavItem to="/cart">Cart</NavItem>
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </div>

          <NavItem to="/contact">Contact</NavItem>
          <NavItem to="/track-order">Track Order</NavItem>

          {isAdmin && <NavItem to="/admin">Admin</NavItem>}
        </nav>

        {/* MOBILE */}
        <div className="flex items-center gap-2 sm:hidden">
          <NavLink
            to="/shop"
            className="rounded-full border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-950"
          >
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            className="rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white px-3 py-2 text-sm font-medium shadow"
          >
            Cart
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className="rounded-full border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-950"
            >
              Admin
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

function NavItem({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <NavLink
      to={to}
      onClick={() => window.scrollTo({ top: 0 })}
      className={({ isActive }) =>
        twMerge(linkBase, isActive && linkActive, className)
      }
      end={to === '/'}
    >
      {children}
    </NavLink>
  )
}
