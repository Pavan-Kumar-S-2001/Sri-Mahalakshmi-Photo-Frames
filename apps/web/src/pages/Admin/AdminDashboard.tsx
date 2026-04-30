import { Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/apiClient'

export function AdminDashboardPage() {

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  type Order = {
    id: string
    totalPaise: number
    status: string
    fullName: string
    phone: string
    addressLine1: string
  }

  const { data } = useQuery<Order[]>({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiFetch('/orders'),
  })

  const orders = data ?? []

  const isAdmin = localStorage.getItem('isAdmin')

  if (!isAdmin) {
    return <Navigate to="/admin/login" />
  }

  // ✅ CALCULATIONS
  const totalOrders = orders.length

  const revenue = orders.reduce(
    (sum: number, o: any) => sum + o.totalPaise,
    0
  )

  const pendingOrders = orders.filter(
    (o: any) => o.status !== 'delivered'
  ).length

  const completedOrders = orders.filter(
    (o: any) => o.status === 'delivered'
  ).length

  return (
    <>
      <Helmet>
        <title>Admin — Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-950">
            Admin Dashboard
          </h1>

          <div className="flex gap-3">
            <button onClick={() => setFilter('all')} className="px-4 py-2 rounded-full bg-zinc-100">
              All
            </button>

            <button onClick={() => setFilter('pending')} className="px-4 py-2 rounded-full bg-zinc-100">
              Pending
            </button>

            <button onClick={() => setFilter('completed')} className="px-4 py-2 rounded-full bg-zinc-100">
              Completed
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">

          <div className="rounded-3xl bg-white p-5 shadow border">
            <div className="text-sm text-zinc-500">Total Orders</div>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow border">
            <div className="text-sm text-zinc-500">Revenue</div>
            <div className="text-2xl font-bold">
              ₹{(revenue / 100).toFixed(0)}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow border">
            <div className="text-sm text-zinc-500">Pending Orders</div>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow border">
            <div className="text-sm text-zinc-500">Completed Orders</div>
            <div className="text-2xl font-bold">{completedOrders}</div>
          </div>

        </div>

        {/* ORDERS LIST */}
        <div className="space-y-4">

          {orders
            .filter((order: any) => {
              if (filter === 'all') return true
              if (filter === 'completed') return order.status === 'delivered'
              return order.status !== 'delivered'
            })
            .map((order: any) => (
              <div
                key={order.id}
                className="rounded-3xl border bg-white p-6 shadow"
              >

                <div className="flex justify-between">

                  <div>
                    <div className="font-semibold text-lg">
                      Order #{order.id}
                    </div>

                    <div className="text-sm text-zinc-600">
                      👤 {order.fullName}
                    </div>

                    <div className="text-sm text-zinc-600">
                      📞 {order.phone}
                    </div>

                    <div className="text-sm text-zinc-600">
                      📍 {order.addressLine1}
                    </div>

                    <div className="text-sm mt-2">
                      ₹{(order.totalPaise / 100).toFixed(2)}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>

                </div>

              </div>
            ))}

        </div>

      </div>
    </>
  )
}