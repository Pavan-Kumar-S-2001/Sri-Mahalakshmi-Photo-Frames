import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { ProductCard } from '../components/ProductCard'
import { catalog } from '../lib/catalog'
import { formatINR } from '../lib/money'

type FrameType = 'wood' | 'metal' | 'acrylic'

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const type = (params.get('type') as FrameType | null) ?? 'wood'
  const maxPriceRupees = Number(params.get('maxPrice') ?? 2000)
  const maxPricePaise = maxPriceRupees * 100

  const items = useMemo(() => {
    return catalog
      .filter((p) => p.active)
      .filter((p) => p.frameTypes.includes(type))
      .filter((p) => p.basePricePaise <= maxPricePaise)
  }, [maxPricePaise, type])

  return (
    <>
      <Helmet>
        <title>Shop — Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-72">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">Filters</div>
              <div className="mt-5 space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Frame type
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(['wood', 'metal', 'acrylic'] as FrameType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          params.set('type', t)
                          setParams(params, { replace: true })
                        }}
                        className={[
                          'rounded-full border px-3 py-2 text-xs font-semibold transition',
                          t === type
                            ? 'border-zinc-900 bg-zinc-900 text-white'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
                        ].join(' ')}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Max price
                  </div>
                  <input
                    className="mt-3 w-full accent-zinc-900"
                    type="range"
                    min={500}
                    max={2500}
                    step={100}
                    value={maxPriceRupees}
                    onChange={(e) => {
                      params.set('maxPrice', e.target.value)
                      setParams(params, { replace: true })
                    }}
                  />
                  <div className="mt-2 text-sm font-semibold text-zinc-900">
                    Up to ₹{maxPriceRupees}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Shop frames
                </h1>
                <p className="mt-1 text-sm text-zinc-600">
                  Choose a style, then customize with your photo.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={Math.round(p.basePricePaise / 100)}
                />
              ))}
            </div>

            <p className="mt-6 text-xs text-zinc-500">
              Showing {items.length} product(s). Prices start at{' '}
              {items[0] ? formatINR(items[0].basePricePaise) : '—'}.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

