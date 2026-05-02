import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '@framecraft/shared'
import { ProductCard } from '../components/ProductCard'
import { apiFetch } from '../lib/apiClient'
import { formatINR } from '../lib/money'

type FrameType = 'wood' | 'metal' | 'acrylic'

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const type = (params.get('type') as FrameType | null) ?? 'wood'
  const maxPriceRupees = Number(params.get('maxPrice') ?? 3000)
  const maxPricePaise = maxPriceRupees * 100

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch<{ products: Product[] }>('/products'),
  })

  const items = useMemo(() => {
    const products = productsQuery.data?.products ?? []

    return products
      .filter((product) => product.active)
      .filter((product) => product.frameTypes.includes(type))
      .filter((product) => product.basePricePaise <= maxPricePaise)
  }, [maxPricePaise, productsQuery.data?.products, type])

  return (
    <>
      <Helmet>
        <title>Shop - Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-72">
            <div className="sticky top-24 rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg">
              <div className="text-sm font-semibold text-zinc-950">Filters</div>
              <div className="mt-5 space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Frame type
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(['wood', 'metal', 'acrylic'] as FrameType[]).map((frameType) => (
                      <button
                        key={frameType}
                        type="button"
                        onClick={() => {
                          params.set('type', frameType)
                          setParams(params, { replace: true })
                        }}
                        className={[
                          'rounded-full border px-3 py-2 text-xs font-semibold transition',
                          frameType === type
                            ? 'border-zinc-900 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
                        ].join(' ')}
                      >
                        {frameType}
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
                    max={5000}
                    step={100}
                    value={maxPriceRupees}
                    onChange={(e) => {
                      params.set('maxPrice', e.target.value)
                      setParams(params, { replace: true })
                    }}
                  />
                  <div className="mt-2 text-sm font-semibold text-zinc-950">
                    Up to Rs. {maxPriceRupees}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <div>
                <h1 className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-3xl font-bold text-transparent">
                  Shop Frames
                </h1>
                <p className="mt-1 text-sm text-zinc-600">
                  In-stock products can be customized now. Delivery is arranged locally.
                </p>
              </div>

              <div className="text-sm text-zinc-500">{items.length} products</div>
            </div>

            {productsQuery.isLoading ? (
              <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-600">
                Loading products...
              </div>
            ) : null}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  basePricePaise={product.basePricePaise}
                  minimumAdvancePaise={product.minimumAdvancePaise}
                  imageUrl={product.images[0]}
                  availabilityStatus={product.availabilityStatus}
                />
              ))}
            </div>

            <p className="mt-6 text-xs text-zinc-500">
              Showing {items.length} product(s). Prices start at{' '}
              {items[0] ? formatINR(items[0].basePricePaise) : '-'}.
            </p>

            {!productsQuery.isLoading && items.length === 0 ? (
              <div className="mt-10 text-center text-zinc-500">
                No products found
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  )
}
