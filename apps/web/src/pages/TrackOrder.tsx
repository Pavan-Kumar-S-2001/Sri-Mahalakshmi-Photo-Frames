import { useState } from 'react'
import { apiFetch } from '../lib/apiClient'
import { formatINR } from '../lib/money'

type Order = {
  id: string
  status: string
  paymentStatus: string
  payableNowPaise: number
  advancePaidPaise: number
  balancePaymentStatus: string
  balancePaymentMethod: string | null
  balancePaidPaise: number
  totalPaise: number
  createdAt: string
}

export function TrackOrderPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!phone) return alert('Enter phone number')

    try {
      setLoading(true)
      setSearched(true)

      const res = await apiFetch<{ orders: Order[] }>(`/public/track-orders?phone=${phone}`)
      setOrders(res.orders)
    } catch {
      alert('Error fetching orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600'
      case 'shipped':
        return 'text-blue-600'
      case 'inProduction':
        return 'text-yellow-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-zinc-950'
    }
  }

  const getPaymentColor = (status: string) => {
    return status === 'paid' ? 'text-green-600' : 'text-yellow-600'
  }

  return (
    <div className="container-px mx-auto max-w-xl py-10">
      <h1 className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-xl font-bold text-transparent">
        Track Your Order
      </h1>

      <div className="mt-4 flex gap-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="flex-1 rounded-2xl border px-3 py-3 outline-none focus:border-zinc-400"
        />
        <button
          onClick={handleSearch}
          className="rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 px-5 text-white"
        >
          Search
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? <div className="text-sm text-zinc-600">Loading orders...</div> : null}

        {!loading && searched && orders.length === 0 ? (
          <div className="text-sm text-zinc-500">
            No orders found for this number
          </div>
        ) : null}

        {orders.map((order) => {
          const remainingDue = Math.max(
            0,
            order.totalPaise - order.advancePaidPaise - order.balancePaidPaise,
          )

          return (
            <div
              key={order.id}
              className="space-y-2 rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="text-xs text-zinc-500">Order ID</div>
              <div className="font-mono text-sm">{order.id}</div>

              <div>
                Status:{' '}
                <span className={`font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div>
                Advance payment:{' '}
                <span className={`font-semibold ${getPaymentColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div>Total: {formatINR(order.totalPaise)}</div>
              <div>Advance paid: {formatINR(order.advancePaidPaise || order.payableNowPaise)}</div>
              <div>Balance due: {formatINR(remainingDue)}</div>
              <div>
                Balance status: {order.balancePaymentStatus}
                {order.balancePaymentMethod ? ` (${order.balancePaymentMethod})` : ''}
              </div>

              <div className="text-xs text-zinc-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
