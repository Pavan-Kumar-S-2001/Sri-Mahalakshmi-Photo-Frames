import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '@framecraft/shared'
import { computeCustomizationPricePaise } from '@framecraft/shared'
import { apiFetch } from '../lib/apiClient'
import { clearPendingUpload, getPendingUpload, setPendingUpload } from '../lib/pendingUpload'
import { formatINR } from '../lib/money'
import { uploadImageFile, type UploadedImage } from '../lib/uploadClient'
import { useCartStore } from '../store/cartStore'

type Size = '8x10' | '12x18' | '16x24'
type Style = 'classic' | 'minimal' | 'gallery'
type Glass = 'standard' | 'antiGlare' | 'museum'

function availabilityLabel(status: Product['availabilityStatus']) {
  switch (status) {
    case 'in_stock':
      return 'In stock'
    case 'out_of_stock':
      return 'Out of stock'
    case 'soon_available':
      return 'Soon available'
  }
}

export function ProductCustomizePage() {
  const { productId } = useParams()
  const nav = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedImage | null>(() => getPendingUpload())
  const [size, setSize] = useState<Size>('12x18')
  const [style, setStyle] = useState<Style>('minimal')
  const [glass, setGlass] = useState<Glass>('standard')

  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => apiFetch<{ product: Product }>(`/products/${productId}`),
    enabled: Boolean(productId),
  })

  const product = productQuery.data?.product ?? null
  const canOrder = product?.availabilityStatus === 'in_stock'

  const price = useMemo(() => {
    const basePricePaise = product?.basePricePaise ?? 99900
    return computeCustomizationPricePaise(basePricePaise, {
      size,
      style,
      glass,
      designService: false,
      uploadKey: uploadedPhoto?.uploadKey,
    })
  }, [glass, product?.basePricePaise, size, style, uploadedPhoto?.uploadKey])

  return (
    <>
      <Helmet>
        <title>Customize - Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <section className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
              Customize frame
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Product: <span className="font-semibold">{product?.name ?? productId}</span>
            </p>

            {product ? (
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700">
                  {availabilityLabel(product.availabilityStatus)}
                </span>
                <span className="rounded-full bg-yellow-50 px-3 py-1 font-semibold text-amber-700">
                  Minimum advance {formatINR(product.minimumAdvancePaise)}
                </span>
              </div>
            ) : null}

            {product?.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="mt-6 h-64 w-full rounded-3xl border border-zinc-200 object-cover"
              />
            ) : null}

            {!canOrder && product ? (
              <div className="mt-6 rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-sm text-yellow-800">
                This product is currently {availabilityLabel(product.availabilityStatus).toLowerCase()}.
                You can still view it here, but ordering is disabled until it is in stock.
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6">
              <div>
                <div className="text-xl font-bold text-green-600">Upload image</div>
                <p className="mt-1 text-sm text-zinc-600">
                  Choose a photo directly from your device. We will use it for preview and order processing.
                </p>
                <input
                  className="mt-3 block w-full text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-yellow-400 file:via-amber-500 file:to-yellow-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  type="file"
                  accept="image/*"
                  disabled={!canOrder}
                  onChange={async (event) => {
                    const file = event.target.files?.[0]
                    if (!file) return

                    setUploadingPhoto(true)

                    try {
                      const image = await uploadImageFile(file)
                      setUploadedPhoto(image)
                      setPendingUpload(image)
                    } catch {
                      alert('Photo upload failed. Please try again.')
                    } finally {
                      setUploadingPhoto(false)
                      event.target.value = ''
                    }
                  }}
                />
                {uploadingPhoto ? (
                  <div className="mt-2 text-xs text-zinc-500">Uploading photo...</div>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Size"
                  value={size}
                  options={[
                    { value: '8x10', label: '8x10' },
                    { value: '12x18', label: '12x18' },
                    { value: '16x24', label: '16x24' },
                  ]}
                  onChange={(value) => setSize(value as Size)}
                />
                <Select
                  label="Frame style"
                  value={style}
                  options={[
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'classic', label: 'Classic' },
                    { value: 'gallery', label: 'Gallery' },
                  ]}
                  onChange={(value) => setStyle(value as Style)}
                />
                <Select
                  label="Glass type"
                  value={glass}
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'antiGlare', label: 'Anti-glare' },
                    { value: 'museum', label: 'Museum' },
                  ]}
                  onChange={(value) => setGlass(value as Glass)}
                />
              </div>
            </div>
          </section>

          <aside className="h-fit w-full lg:sticky lg:top-24 lg:w-[420px]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-bold text-green-600">Live preview</div>
              <div className="mt-4">
                <FramePreview
                  style={style}
                  glass={glass}
                  imageUrl={uploadedPhoto?.imageUrl ?? null}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xl font-bold text-green-600">Price</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatINR(price.subtotalPaise)}
                  </div>
                </div>
                <div className="mt-3 text-xs font-medium text-green-600">
                  Advance to pay now: {formatINR(product?.minimumAdvancePaise ?? 0)}
                </div>
                <div className="mt-1 text-xs text-zinc-600">
                  The remaining balance is collected after delivery confirmation.
                </div>
              </div>

              {added ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl border border-green-200 bg-green-50 py-2 text-center font-semibold text-green-600"
                >
                  Item added to cart
                </motion.div>
              ) : null}

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                type="button"
                className="mt-6 w-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!uploadedPhoto || !productId || uploadingPhoto || !canOrder}
                onClick={() => {
                  if (!productId || !uploadedPhoto || !product) return

                  addItem({
                    productId,
                    productName: product.name,
                    basePricePaise: product.basePricePaise,
                    minimumAdvancePaise: product.minimumAdvancePaise,
                    qty: 1,
                    customization: {
                      size,
                      style,
                      glass,
                      designService: false,
                      uploadKey: uploadedPhoto.uploadKey,
                    },
                    localImageUrl: uploadedPhoto.imageUrl,
                  })

                  clearPendingUpload()
                  setAdded(true)

                  setTimeout(() => {
                    nav('/cart')
                  }, 800)
                }}
              >
                {added ? 'Added' : 'Add to cart'}
              </motion.button>
            </div>
          </aside>
        </div>

        {productQuery.isLoading ? (
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-600">
            Loading product...
          </div>
        ) : null}
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
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <select
        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
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
