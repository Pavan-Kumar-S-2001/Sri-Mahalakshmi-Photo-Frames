import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { computeCustomizationPricePaise } from '@framecraft/shared'
import { getProduct } from '../lib/catalog'
import { formatINR } from '../lib/money'
import { useCartStore } from '../store/cartStore'

type Size = '8x10' | '12x18' | '16x24'
type Style = 'classic' | 'minimal' | 'gallery'
type Glass = 'standard' | 'antiGlare' | 'museum'

export function ProductCustomizePage() {
  const { productId } = useParams()
  const nav = useNavigate()
  const addItem = useCartStore((s) => s.addItem)

  const product = productId ? getProduct(productId) : null

  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [size, setSize] = useState<Size>('12x18')
  const [style, setStyle] = useState<Style>('minimal')
  const [glass, setGlass] = useState<Glass>('standard')

  const price = useMemo(() => {
    const basePricePaise = product?.basePricePaise ?? 99900
    return computeCustomizationPricePaise(basePricePaise, {
      size,
      style,
      glass,
      designService: false,
    })
  }, [glass, product?.basePricePaise, size, style])

  return (
    <>
      <Helmet>
        <title>Customize — Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <section className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Customize frame
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Product:{' '}
              <span className="font-semibold">
                {product?.name ?? productId}
              </span>
            </p>

            <div className="mt-6 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Upload image
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  We’ll use this photo for your live preview and final print.
                </p>
                <input
                  className="mt-3 block w-full text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    setFileUrl(URL.createObjectURL(f))
                  }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Size"
                  value={size}
                  options={[
                    { value: '8x10', label: '8×10' },
                    { value: '12x18', label: '12×18' },
                    { value: '16x24', label: '16×24' },
                  ]}
                  onChange={(v) => setSize(v as Size)}
                />
                <Select
                  label="Frame style"
                  value={style}
                  options={[
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'classic', label: 'Classic' },
                    { value: 'gallery', label: 'Gallery' },
                  ]}
                  onChange={(v) => setStyle(v as Style)}
                />
                <Select
                  label="Glass type"
                  value={glass}
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'antiGlare', label: 'Anti-glare' },
                    { value: 'museum', label: 'Museum' },
                  ]}
                  onChange={(v) => setGlass(v as Glass)}
                />
              </div>
            </div>
          </section>

          <aside className="w-full lg:w-[420px]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">
                Live preview
              </div>
              <div className="mt-4">
                <FramePreview style={style} glass={glass} imageUrl={fileUrl} />
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-900">
                    Price
                  </div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {formatINR(price.subtotalPaise)}
                  </div>
                </div>
                <div className="mt-1 text-xs text-zinc-600">
                  Final total includes delivery (shown in cart/checkout).
                </div>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!fileUrl}
                onClick={() => {
                  if (!productId) return
                  addItem({
                    productId,
                    productName: product?.name ?? 'Custom frame',
                    basePricePaise: product?.basePricePaise ?? 99900,
                    qty: 1,
                    customization: {
                      size,
                      style,
                      glass,
                      designService: false,
                    },
                    localImageUrl: fileUrl ?? undefined,
                  })
                  nav('/cart')
                }}
              >
                Add to cart
              </button>
              <p className="mt-3 text-xs text-zinc-500">
                Cart/pricing will be fully wired once the shared pricing +
                backend order creation is in place.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <select
        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function FramePreview({
  style,
  glass,
  imageUrl,
}: {
  style: Style
  glass: Glass
  imageUrl: string | null
}) {
  const border =
    style === 'classic'
      ? 'border-[18px] border-amber-950/80'
      : style === 'gallery'
        ? 'border-[22px] border-zinc-900'
        : 'border-[14px] border-zinc-200'

  const glassFx =
    glass === 'museum'
      ? 'after:absolute after:inset-0 after:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)] after:opacity-70'
      : glass === 'antiGlare'
        ? 'after:absolute after:inset-0 after:bg-white/10 after:backdrop-blur-[1px]'
        : ''

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-100">
      <div
        className={[
          'absolute inset-4 rounded-2xl bg-white shadow-inner',
          border,
        ].join(' ')}
      >
        <div className={['relative size-full overflow-hidden', glassFx].join(' ')}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded preview"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm font-medium text-zinc-500">
              Upload a photo to preview
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

