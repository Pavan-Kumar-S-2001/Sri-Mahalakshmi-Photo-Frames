import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { computeCustomizationPricePaise } from '@framecraft/shared'
import { formatINR } from '../lib/money'

const DEFAULT_MINIMUM_ADVANCE_PAISE = 50000

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const setQty = useCartStore((state) => state.setQty)
  const totalsFn = useCartStore((state) => state.totals)
  const totals = totalsFn()

  return (
    <>
      <Helmet>
        <title>Cart - Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">
        <h1 className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-3xl font-bold text-transparent">
          Cart
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Your selected frames will appear here.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            {items.length === 0 ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-md">
                <div className="text-sm font-semibold text-zinc-950">
                  Your cart is empty
                </div>
                <div className="mt-2 text-sm text-zinc-600">
                  Browse frames and customize with your photo.
                </div>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
                >
                  Go to shop
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const breakdown = computeCustomizationPricePaise(
                    item.basePricePaise,
                    item.customization,
                  )
                  const minimumAdvancePaise =
                    typeof item.minimumAdvancePaise === 'number' && item.minimumAdvancePaise > 0
                      ? item.minimumAdvancePaise
                      : DEFAULT_MINIMUM_ADVANCE_PAISE

                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-zinc-200 bg-white p-6"
                    >
                      <div className="flex gap-4">
                        <div className="size-24 overflow-hidden rounded-2xl bg-zinc-100">
                          {item.localImageUrl ? (
                            <img
                              src={item.localImageUrl}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-zinc-950">
                                {item.productName}
                              </div>
                              <div className="mt-1 text-xs text-zinc-600">
                                Size {item.customization.size} | Style {item.customization.style} | Glass{' '}
                                {item.customization.glass}
                              </div>
                              <div className="mt-2 text-xs font-semibold text-amber-700">
                                Minimum advance {formatINR(minimumAdvancePaise * item.qty)}
                              </div>
                            </div>

                            <div className="text-sm font-semibold text-zinc-950">
                              {formatINR(breakdown.subtotalPaise * item.qty)}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2 py-1">
                              <button
                                type="button"
                                className="rounded-full px-2 py-1 text-sm font-semibold text-zinc-950 hover:bg-zinc-50"
                                onClick={() => setQty(item.id, item.qty - 1)}
                              >
                                -
                              </button>
                              <div className="min-w-8 text-center text-sm font-semibold text-zinc-950">
                                {item.qty}
                              </div>
                              <button
                                type="button"
                                className="rounded-full px-2 py-1 text-sm font-semibold text-zinc-950 hover:bg-zinc-50"
                                onClick={() => setQty(item.id, item.qty + 1)}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              className="text-sm font-semibold text-zinc-600 hover:text-zinc-950"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <aside className="h-fit lg:sticky lg:top-24 lg:col-span-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
              <div className="text-sm font-semibold text-zinc-950">
                Price summary
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatINR(totals.subtotalPaise)} />
                <Row label="Delivery" value={formatINR(totals.deliveryFeePaise)} />
                <div className="my-3 h-px bg-zinc-200" />
                <Row label="Total" value={formatINR(totals.totalPaise)} bold />
                <Row label="Advance to pay now" value={formatINR(totals.advancePayablePaise)} bold />
                <Row label="Balance after delivery" value={formatINR(totals.remainingDuePaise)} />
              </div>
              <Link
                to="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
              >
                Checkout
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className={bold ? 'font-semibold text-zinc-950' : 'text-zinc-600'}>
        {label}
      </div>
      <div className={bold ? 'font-semibold text-zinc-950' : 'text-zinc-950'}>
        {value}
      </div>
    </div>
  )
}
