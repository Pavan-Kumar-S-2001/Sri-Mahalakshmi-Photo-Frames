import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { ProductAvailabilityStatus } from '@framecraft/shared'
import { apiFetch } from '../../lib/apiClient'
import { formatINR } from '../../lib/money'
import { queryClient } from '../../providers/queryClient'
import { uploadImageFile, type UploadedImage } from '../../lib/uploadClient'

type Product = {
  id: string
  name: string
  basePricePaise: number
  active: boolean
  frameTypes: string[]
  images: string[]
  availabilityStatus: ProductAvailabilityStatus
  minimumAdvancePaise: number
}

function statusLabel(status: ProductAvailabilityStatus) {
  switch (status) {
    case 'in_stock':
      return 'In stock'
    case 'out_of_stock':
      return 'Out of stock'
    case 'soon_available':
      return 'Soon available'
  }
}

export function AdminProductsPage() {
  const [name, setName] = useState('')
  const [basePrice, setBasePrice] = useState(99900)
  const [frameType, setFrameType] = useState('wood')
  const [availabilityStatus, setAvailabilityStatus] = useState<ProductAvailabilityStatus>('in_stock')
  const [minimumAdvancePaise, setMinimumAdvancePaise] = useState(50000)
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [draftAdvance, setDraftAdvance] = useState<Record<string, number>>({})
  const [draftMethod, setDraftMethod] = useState<Record<string, ProductAvailabilityStatus>>({})

  const productsQuery = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => apiFetch<{ products: Product[] }>('/admin/products'),
  })

  const create = useMutation({
    mutationFn: async () => {
      await apiFetch('/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          basePricePaise: basePrice,
          frameTypes: [frameType],
          sizes: ['8x10', '12x18', '16x24'],
          glassTypes: ['standard', 'antiGlare', 'museum'],
          images: uploadedImage ? [uploadedImage.imageUrl] : [],
          availabilityStatus,
          minimumAdvancePaise,
          active: true,
        }),
      })
    },
    onSuccess: async () => {
      setName('')
      setBasePrice(99900)
      setFrameType('wood')
      setAvailabilityStatus('in_stock')
      setMinimumAdvancePaise(50000)
      setUploadedImage(null)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<Pick<Product, 'availabilityStatus' | 'minimumAdvancePaise' | 'active'>>
    }) => {
      await apiFetch(`/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(`/admin/products/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const items = productsQuery.data?.products ?? []

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Products
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Add products, control stock state, set minimum advance, and delete items.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-semibold text-zinc-950">Add product</div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Name
            </div>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Walnut"
            />
          </label>

          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Base price (paise)
            </div>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-400"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
            />
            <div className="mt-1 text-xs text-zinc-500">
              Preview: {formatINR(basePrice)}
            </div>
          </label>

          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Minimum advance (paise)
            </div>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-400"
              type="number"
              value={minimumAdvancePaise}
              onChange={(e) => setMinimumAdvancePaise(Number(e.target.value))}
            />
            <div className="mt-1 text-xs text-zinc-500">
              Customer pays now: {formatINR(minimumAdvancePaise)}
            </div>
          </label>

          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Frame type
            </div>
            <select
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-400"
              value={frameType}
              onChange={(e) => setFrameType(e.target.value)}
            >
              <option value="wood">wood</option>
              <option value="metal">metal</option>
              <option value="acrylic">acrylic</option>
            </select>
          </label>

          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Availability
            </div>
            <select
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-400"
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value as ProductAvailabilityStatus)}
            >
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="soon_available">Soon available</option>
            </select>
          </label>
        </div>

        <div className="mt-4 max-w-sm">
          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Product image
            </div>
            <input
              className="mt-2 block w-full text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-yellow-400 file:via-amber-500 file:to-yellow-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0]
                if (!file) return

                setUploadingImage(true)

                try {
                  const image = await uploadImageFile(file)
                  setUploadedImage(image)
                } catch {
                  alert('Image upload failed. Please try again.')
                } finally {
                  setUploadingImage(false)
                  event.target.value = ''
                }
              }}
            />
          </label>
        </div>

        {uploadedImage ? (
          <div className="mt-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Image preview
            </div>
            <img
              src={uploadedImage.imageUrl}
              alt="New product preview"
              className="h-32 w-32 rounded-2xl border border-zinc-200 object-cover"
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => create.mutate()}
          disabled={!name || create.isPending || uploadingImage}
          className="mt-5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
        >
          {uploadingImage ? 'Uploading image...' : 'Create'}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-semibold text-zinc-950">All products</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="py-2">Image</th>
                <th className="py-2">Name</th>
                <th className="py-2">Type</th>
                <th className="py-2">Base price</th>
                <th className="py-2">Advance</th>
                <th className="py-2">Availability</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="border-t border-zinc-200">
              {items.map((product) => (
                <tr key={product.id} className="border-b border-zinc-200">
                  <td className="py-3">
                    <img
                      src={product.images[0] || '/placeholder.png'}
                      alt={product.name}
                      className="h-14 w-14 rounded-xl border border-zinc-200 object-cover"
                    />
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-zinc-950">{product.name}</div>
                    <div className="text-xs text-zinc-500">{product.id}</div>
                  </td>
                  <td className="py-3 text-zinc-700">
                    {product.frameTypes.join(', ')}
                  </td>
                  <td className="py-3 text-zinc-700">
                    {formatINR(product.basePricePaise)}
                  </td>
                  <td className="py-3">
                    <input
                      className="w-36 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
                      type="number"
                      value={draftAdvance[product.id] ?? product.minimumAdvancePaise}
                      onChange={(e) =>
                        setDraftAdvance((state) => ({
                          ...state,
                          [product.id]: Number(e.target.value),
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="ml-2 rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700"
                      onClick={() =>
                        updateProduct.mutate({
                          id: product.id,
                          payload: {
                            minimumAdvancePaise:
                              draftAdvance[product.id] ?? product.minimumAdvancePaise,
                          },
                        })
                      }
                    >
                      Save
                    </button>
                  </td>
                  <td className="py-3">
                    <select
                      className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
                      value={draftMethod[product.id] ?? product.availabilityStatus}
                      onChange={(e) => {
                        const next = e.target.value as ProductAvailabilityStatus
                        setDraftMethod((state) => ({ ...state, [product.id]: next }))
                        updateProduct.mutate({
                          id: product.id,
                          payload: { availabilityStatus: next },
                        })
                      }}
                    >
                      <option value="in_stock">{statusLabel('in_stock')}</option>
                      <option value="out_of_stock">{statusLabel('out_of_stock')}</option>
                      <option value="soon_available">{statusLabel('soon_available')}</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      disabled={deleteProduct.isPending}
                      onClick={() => deleteProduct.mutate(product.id)}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 ? (
                <tr>
                  <td className="py-6 text-sm text-zinc-600" colSpan={7}>
                    No products yet.
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
