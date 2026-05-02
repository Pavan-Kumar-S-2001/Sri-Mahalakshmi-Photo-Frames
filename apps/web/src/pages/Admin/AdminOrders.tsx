import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { apiFetch } from '../../lib/apiClient'
import { formatINR } from '../../lib/money'
import { queryClient } from '../../providers/queryClient'

type Order = {
  id: string
  status: string
  paymentStatus: string
  paymentMode: string
  totalPaise: number
  payableNowPaise: number
  advancePaidPaise: number
  balancePaymentStatus: string
  balancePaymentMethod: string | null
  balancePaidPaise: number
  fullName: string
  phone: string
  createdAt: string
}

const ORDER_STATUSES = [
  'created',
  'confirmed',
  'inProduction',
  'shipped',
  'delivered',
  'cancelled',
] as const

export function AdminOrdersPage() {
  const [balanceMethod, setBalanceMethod] = useState<Record<string, 'cash' | 'online'>>({})

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiFetch<{ orders: Order[] }>('/admin/orders'),
    refetchInterval: 10000,
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiFetch(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
  })

  const updateBalancePayment = useMutation({
    mutationFn: async ({
      id,
      status,
      method,
    }: {
      id: string
      status: 'pending' | 'paid'
      method?: 'cash' | 'online'
    }) => {
      await apiFetch(`/admin/orders/${id}/balance-payment`, {
        method: 'PATCH',
        body: JSON.stringify({ status, method }),
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
  })

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(`/admin/orders/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
  })

  const orders = ordersQuery.data?.orders ?? []

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Orders
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          View live orders, remove duplicates, and confirm the remaining balance as cash or online.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1320px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Advance receipt</th>
                <th className="py-2">Balance receipt</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>

            <tbody className="border-t border-zinc-200">
              {orders.map((order) => {
                const balanceDuePaise = Math.max(
                  0,
                  order.totalPaise - order.advancePaidPaise - order.balancePaidPaise,
                )

                return (
                  <tr key={order.id} className="border-b border-zinc-200 align-top">
                    <td className="py-3 font-mono text-xs text-zinc-600">
                      <div>{order.id}</div>
                      <div className="mt-1 text-[11px] text-zinc-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="font-semibold text-zinc-950">
                        {order.fullName}
                      </div>
                      <div className="text-xs text-zinc-600">{order.phone}</div>
                    </td>

                    <td className="py-3">
                      <div className="font-semibold text-zinc-950">
                        {formatINR(order.advancePaidPaise || order.payableNowPaise)}
                      </div>
                      <div className="mt-1 text-xs text-zinc-600">
                        Status: {order.paymentStatus}
                      </div>
                      <div className="text-xs text-zinc-600">
                        Mode: online
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="font-semibold text-zinc-950">
                        Due: {formatINR(balanceDuePaise)}
                      </div>
                      <div className="mt-1 text-xs text-zinc-600">
                        Status: {order.balancePaymentStatus}
                      </div>
                      <div className="text-xs text-zinc-600">
                        Method: {order.balancePaymentMethod ?? '-'}
                      </div>

                      {balanceDuePaise > 0 ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <select
                            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-950 outline-none"
                            value={balanceMethod[order.id] ?? order.balancePaymentMethod ?? 'cash'}
                            onChange={(e) =>
                              setBalanceMethod((state) => ({
                                ...state,
                                [order.id]: e.target.value as 'cash' | 'online',
                              }))
                            }
                          >
                            <option value="cash">cash</option>
                            <option value="online">online</option>
                          </select>

                          <button
                            type="button"
                            className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white"
                            onClick={() =>
                              updateBalancePayment.mutate({
                                id: order.id,
                                status: 'paid',
                                method: balanceMethod[order.id] ?? 'cash',
                              })
                            }
                          >
                            Confirm paid
                          </button>

                          {order.balancePaymentStatus === 'paid' ? (
                            <button
                              type="button"
                              className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700"
                              onClick={() =>
                                updateBalancePayment.mutate({
                                  id: order.id,
                                  status: 'pending',
                                })
                              }
                            >
                              Mark pending
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </td>

                    <td className="py-3">
                      <select
                        disabled={updateStatus.isPending}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400 disabled:opacity-50"
                        value={order.status}
                        onChange={(e) => {
                          updateStatus.mutate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3">
                      <button
                        type="button"
                        disabled={deleteOrder.isPending}
                        onClick={() => {
                          deleteOrder.mutate(order.id)
                        }}
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}

              {!ordersQuery.isLoading && orders.length === 0 ? (
                <tr>
                  <td className="py-6 text-sm text-zinc-600" colSpan={6}>
                    No orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
