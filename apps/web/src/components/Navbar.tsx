import { NavLink } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/apiClient'

const linkBase =
'rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900'
const linkActive = 'bg-zinc-100 text-zinc-900'

export function Navbar() {
// 🔥 Check admin login
const { data } = useQuery({
queryKey: ['auth', 'me'],
queryFn: () =>
apiFetch<{ user: null | { role: string } }>('/auth/me'),
})

const isAdmin = data?.user?.role === 'admin'

return ( <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur"> <div className="container-px flex h-16 items-center justify-between"> <NavLink
       to="/"
       className="text-sm font-bold tracking-tight text-zinc-2000"
     >
Sri Mahalakshmi Photo Frames </NavLink>

```
    {/* DESKTOP NAV */}
    <nav className="hidden items-center gap-1 sm:flex">
      <NavItem to="/">Home</NavItem>
      <NavItem to="/shop">Shop</NavItem>
      <NavItem to="/cart">Cart</NavItem>
      <NavItem to="/contact">Contact</NavItem>
      <NavItem to="/track-order">Track Order</NavItem>

      {/* 🔥 ONLY SHOW ADMIN IF LOGGED IN */}
      {isAdmin && <NavItem to="/admin">Admin</NavItem>}
    </nav>

    {/* MOBILE NAV */}
    <div className="flex items-center gap-2 sm:hidden">
      <NavLink
        to="/shop"
        className="rounded-full border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900"
      >
        Shop
      </NavLink>

      <NavLink
        to="/cart"
        className="rounded-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
      >
        Cart
      </NavLink>

      {/* 🔥 MOBILE ADMIN */}
      {isAdmin && (
        <NavLink
          to="/admin"
          className="rounded-full border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900"
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
{children} </NavLink>
)
}
