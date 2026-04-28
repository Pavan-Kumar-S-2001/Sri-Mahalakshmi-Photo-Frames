import { useMutation, useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/apiClient'
import { formatINR } from '../../lib/money'
import { useMemo, useState } from 'react'

type Product = {
  id: string
  name: string
  basePricePaise: number
  active: boolean
  frameTypes: string[]
}

export function AdminProductsPage() {
  const [name, setName] = useState('')
  const [basePrice, setBasePrice] = useState(99900)
  const [frameType, setFrameType] = useState('wood')

  const q = useQuery({
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
          images: [],
          active: true,
        }),
      })
    },
    onSuccess: async () => {
      setName('')
      await q.refetch()
    },
  })

  const items = useMemo(() => q.data?.products ?? [], [q.data?.products])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Products
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Add/edit products shown in the shop.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-semibold text-zinc-900">Add product</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Name
            </div>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-400"
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
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-400"
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
              Frame type
            </div>
            <select
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-400"
              value={frameType}
              onChange={(e) => setFrameType(e.target.value)}
            >
              <option value="wood">wood</option>
              <option value="metal">metal</option>
              <option value="acrylic">acrylic</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={() => create.mutate()}
          disabled={!name || create.isPending}
          className="mt-5 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          Create
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-semibold text-zinc-900">All products</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Type</th>
                <th className="py-2">Base price</th>
                <th className="py-2">Active</th>
              </tr>
            </thead>
            <tbody className="border-t border-zinc-200">
              {items.map((p) => (
                <tr key={p.id} className="border-b border-zinc-200">
                  <td className="py-3 font-mono text-xs text-zinc-600">
                    {p.id}
                  </td>
                  <td className="py-3 font-semibold text-zinc-900">{p.name}</td>
                  <td className="py-3 text-zinc-700">
                    {p.frameTypes.join(', ')}
                  </td>
                  <td className="py-3 text-zinc-700">
                    {formatINR(p.basePricePaise)}
                  </td>
                  <td className="py-3 text-zinc-700">
                    {p.active ? 'yes' : 'no'}
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="py-6 text-sm text-zinc-600" colSpan={5}>
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

