import { formatINR } from '../../lib/money'

type Order = {
  id: string
  status: string
  paymentStatus: string
  paymentMode: string
  totalPaise: number
  payableNowPaise: number
  fullName: string
  phone: string
  createdAt: string
}

export function AdminOrdersPage() {
  const orders: Order[] = [
    {
      id: 'ORD001',
      status: 'created',
      paymentStatus: 'paid',
      paymentMode: 'online',
      totalPaise: 150000,
      payableNowPaise: 0,
      fullName: 'Pavan Kumar',
      phone: '9876543210',
      createdAt: '2026-01-01T10:00:00Z',
    },
    {
      id: 'ORD002',
      status: 'shipped',
      paymentStatus: 'pending',
      paymentMode: 'cod',
      totalPaise: 220000,
      payableNowPaise: 50000,
      fullName: 'Ravi Kumar',
      phone: '9123456780',
      createdAt: '2026-01-02T14:30:00Z',
    },
  ]

  const updateStatus = { isPending: false }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Orders
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          View orders, payment status, and update fulfillment status.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Payment</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>

            <tbody className="border-t border-zinc-200">
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-zinc-200">
                  <td className="py-3 font-mono text-xs text-zinc-600">
                    {o.id}
                  </td>

                  <td className="py-3">
                    <div className="font-semibold text-zinc-950">
                      {o.fullName}
                    </div>
                    <div className="text-xs text-zinc-600">{o.phone}</div>
                  </td>

                  <td className="py-3">
                    <div className="text-zinc-950">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          o.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>{' '}
                      ({o.paymentMode})
                    </div>

                    <div className="text-xs text-zinc-600">
                      Payable now: {formatINR(o.payableNowPaise)}
                    </div>
                  </td>

                  <td className="py-3 text-zinc-950">
                    {formatINR(o.totalPaise)}
                  </td>

                  <td className="py-3">
                    <select
                      disabled={updateStatus.isPending} // ✅ NEW
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400 disabled:opacity-50"
                      value={o.status}
                      onChange={(e) => {
  alert(`Order ${o.id} status changed to ${e.target.value}`)
}}
                    >
                      {[
                        'created',
                        'confirmed',
                        'inProduction',
                        'shipped',
                        'delivered',
                        'cancelled',
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td className="py-6 text-sm text-zinc-600" colSpan={5}>
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}