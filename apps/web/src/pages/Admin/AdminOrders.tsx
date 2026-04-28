import { useMutation, useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/apiClient'
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
  const q = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiFetch<{ orders: Order[] }>('/orders'),
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiFetch(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    },
    onSuccess: async () => {
      await q.refetch()
    },
  })

  const orders = q.data?.orders ?? []

  // ✅ NEW: loading state
  if (q.isLoading) {
    return <div className="p-6">Loading orders...</div>
  }

  // ✅ NEW: error state
  if (q.isError) {
    return <div className="p-6 text-red-600">Failed to load orders</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
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
                    <div className="font-semibold text-zinc-900">
                      {o.fullName}
                    </div>
                    <div className="text-xs text-zinc-600">{o.phone}</div>
                  </td>

                  <td className="py-3">
                    <div className="text-zinc-900">
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

                  <td className="py-3 text-zinc-900">
                    {formatINR(o.totalPaise)}
                  </td>

                  <td className="py-3">
                    <select
                      disabled={updateStatus.isPending} // ✅ NEW
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 disabled:opacity-50"
                      value={o.status}
                      onChange={(e) =>
                        updateStatus.mutate({
                          id: o.id,
                          status: e.target.value,
                        })
                      }
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