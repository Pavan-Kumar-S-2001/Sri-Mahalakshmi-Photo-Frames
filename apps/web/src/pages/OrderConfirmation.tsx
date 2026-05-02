import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/apiClient'
import { formatINR } from '../lib/money'

type ReceiptOrder = {
  id: string
  paymentStatus: string
  totalPaise: number
  payableNowPaise: number
  advancePaidPaise: number
  balancePaymentStatus: string
  balancePaymentMethod: string | null
  items: Array<{
    id: string
    qty: number
    lineTotalPaise: number
    product: {
      name: string
    }
  }>
}

export function OrderConfirmationPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')

  const receiptQuery = useQuery({
    queryKey: ['receipt', orderId],
    queryFn: () =>
      apiFetch<{ order: ReceiptOrder; remainingDuePaise: number }>(`/public/receipt/${orderId}`),
    enabled: Boolean(orderId),
  })

  const order = receiptQuery.data?.order
  const remainingDuePaise = receiptQuery.data?.remainingDuePaise ?? 0

  return (
    <>
      <Helmet>
        <title>Order confirmed - Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            OK
          </div>
          <h1 className="mt-6 text-center text-2xl font-semibold tracking-tight text-zinc-950">
            Advance payment received
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Your receipt is ready below. The balance can be collected after delivery.
          </p>

          {orderId ? (
            <div className="mt-6 rounded-3xl bg-zinc-50 p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Order ID
              </div>
              <div className="mt-1 break-all text-sm font-semibold text-zinc-950">
                {orderId}
              </div>
            </div>
          ) : null}

          {receiptQuery.isLoading ? (
            <div className="mt-6 rounded-3xl border border-zinc-200 p-6 text-sm text-zinc-600">
              Loading receipt...
            </div>
          ) : null}

          {order ? (
            <div className="mt-6 rounded-3xl border border-zinc-200 p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <Row label="Order total" value={formatINR(order.totalPaise)} />
                <Row label="Advance paid" value={formatINR(order.advancePaidPaise || order.payableNowPaise)} />
                <Row label="Payment status" value={order.paymentStatus} />
                <Row label="Balance due later" value={formatINR(remainingDuePaise)} />
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold text-zinc-950">Items</div>
                <div className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="text-zinc-700">
                        {item.product.name} x {item.qty}
                      </div>
                      <div className="font-semibold text-zinc-950">
                        {formatINR(item.lineTotalPaise)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                Remaining balance after delivery: {formatINR(remainingDuePaise)}
              </div>
            </div>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 px-5 py-3 text-sm font-semibold text-white transition"
            >
              Continue shopping
            </Link>
            <Link
              to="/track-order"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
            >
              Track order
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-zinc-950">{value}</div>
    </div>
  )
}
