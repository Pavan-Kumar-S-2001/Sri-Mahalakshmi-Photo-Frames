import { useState } from 'react'
import { apiFetch } from '../lib/apiClient'
import { formatINR } from '../lib/money'

type Order = {
id: string
status: string
paymentStatus: string
totalPaise: number
createdAt: string
}

export function TrackOrderPage() {
const [phone, setPhone] = useState('')
const [orders, setOrders] = useState<Order[]>([])
const [loading, setLoading] = useState(false)
const [searched, setSearched] = useState(false) // ✅ NEW

const handleSearch = async () => {
if (!phone) return alert('Enter phone number')
try {
  setLoading(true)
  setSearched(true)

  const res = await apiFetch<{ orders: Order[] }>(
    `/public/track-orders?phone=${phone}`
  )

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
return status === 'paid'
? 'text-green-600'
: 'text-yellow-600'
}

return<div className="container-px py-10 max-w-xl mx-auto"> 
<h1 className="text-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent font-bold">
Track Your Order </h1>

  {/* INPUT */}
  <div className="mt-4 flex gap-2">
    <input
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="Enter your phone number"
      className="flex-1 rounded-2xl border px-3 py-3 outline-none focus:border-zinc-400"
    />
    <button
      onClick={handleSearch}
      className="rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white text-white px-5"
    >
      Search
    </button>
  </div>

  {/* RESULTS */}
  <div className="mt-6 space-y-4">

    {loading && (
      <div className="text-sm text-zinc-600">Loading orders...</div>
    )}

    {!loading && searched && orders.length === 0 && (
      <div className="text-sm text-zinc-500">
        No orders found for this number
      </div>
    )}

    {orders.map((o) => (
      <div
        key={o.id}
        className="border rounded-2xl p-4 bg-white shadow-sm space-y-2"
      >
        <div className="text-xs text-zinc-500">Order ID</div>
        <div className="font-mono text-sm">{o.id}</div>

        <div>
          Status:{' '}
          <span className={`font-semibold ${getStatusColor(o.status)}`}>
            {o.status}
          </span>
        </div>

        <div>
          Payment:{' '}
          <span className={`font-semibold ${getPaymentColor(o.paymentStatus)}`}>
            {o.paymentStatus}
          </span>
        </div>

        <div>Total: {formatINR(o.totalPaise)}</div>

        <div className="text-xs text-zinc-500">
          {new Date(o.createdAt).toLocaleString()}
        </div>
      </div>
    ))}
  </div>
</div>

}
