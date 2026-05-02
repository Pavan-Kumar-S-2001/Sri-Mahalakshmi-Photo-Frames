import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/apiClient'
import { formatINR } from '../../lib/money'

type AdminOrder = {
  id: string
  totalPaise: number
  status: string
  fullName: string
  phone: string
  addressLine1: string
}

export function AdminDashboardPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const isAdmin = localStorage.getItem('isAdmin')

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiFetch<{ orders: AdminOrder[] }>('/admin/orders'),
    refetchInterval: 10000,
  })

  if (!isAdmin) {
    return <Navigate to="/admin/login" />
  }

  const orders = ordersQuery.data?.orders ?? []
  const totalOrders = orders.length
  const revenue = orders.reduce((sum, order) => sum + order.totalPaise, 0)
  const pendingOrders = orders.filter((order) => order.status !== 'delivered').length
  const completedOrders = orders.filter((order) => order.status === 'delivered').length

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    if (filter === 'completed') return order.status === 'delivered'
    return order.status !== 'delivered'
  })

  return (
    <>
      <Helmet>
        <title>Admin - Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-zinc-950">Admin Dashboard</h1>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="rounded-full bg-zinc-100 px-4 py-2"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className="rounded-full bg-zinc-100 px-4 py-2"
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className="rounded-full bg-zinc-100 px-4 py-2"
            >
              Completed
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border bg-white p-5 shadow">
            <div className="text-sm text-zinc-500">Total Orders</div>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow">
            <div className="text-sm text-zinc-500">Revenue</div>
            <div className="text-2xl font-bold">{formatINR(revenue)}</div>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow">
            <div className="text-sm text-zinc-500">Pending Orders</div>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow">
            <div className="text-sm text-zinc-500">Completed Orders</div>
            <div className="text-2xl font-bold">{completedOrders}</div>
          </div>
        </div>

        <div className="space-y-4">
          {ordersQuery.isLoading ? (
            <div className="rounded-3xl border bg-white p-6 shadow">
              Loading orders...
            </div>
          ) : null}

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border bg-white p-6 shadow"
            >
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Order #{order.id}</div>
                  <div className="text-sm text-zinc-600">{order.fullName}</div>
                  <div className="text-sm text-zinc-600">{order.phone}</div>
                  <div className="text-sm text-zinc-600">{order.addressLine1}</div>
                  <div className="mt-2 text-sm">{formatINR(order.totalPaise)}</div>
                </div>

                <span
                  className={[
                    'h-fit rounded-full px-3 py-1 text-xs',
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700',
                  ].join(' ')}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}

          {!ordersQuery.isLoading && filteredOrders.length === 0 ? (
            <div className="rounded-3xl border bg-white p-6 shadow">
              No orders found for this filter.
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
