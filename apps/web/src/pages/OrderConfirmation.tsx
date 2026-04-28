import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

export function OrderConfirmationPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')

  return (
    <>
      <Helmet>
        <title>Order confirmed — Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900">
            Order confirmed
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Thanks! We’ve received your payment details.
          </p>
          {orderId ? (
            <div className="mt-4 rounded-2xl bg-zinc-50 p-4 text-left">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Order ID
              </div>
              <div className="mt-1 break-all text-sm font-semibold text-zinc-900">
                {orderId}
              </div>
              <div className="mt-1 text-xs text-zinc-600">
                Payment status updates finalize via webhook.
              </div>
            </div>
          ) : null}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Continue shopping
            </Link>
            <Link
              to="/admin/orders"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
            >
              View orders (admin)
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

