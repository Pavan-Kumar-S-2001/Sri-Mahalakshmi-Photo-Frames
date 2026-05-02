import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ProductAvailabilityStatus } from '@framecraft/shared'
import { formatINR } from '../lib/money'

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

function statusClass(status: ProductAvailabilityStatus) {
  switch (status) {
    case 'in_stock':
      return 'bg-green-100 text-green-700'
    case 'out_of_stock':
      return 'bg-red-100 text-red-700'
    case 'soon_available':
      return 'bg-yellow-100 text-yellow-700'
  }
}

export function ProductCard({
  id,
  name,
  basePricePaise,
  minimumAdvancePaise,
  imageUrl,
  availabilityStatus,
}: {
  id: string
  name: string
  basePricePaise: number
  minimumAdvancePaise: number
  imageUrl?: string
  availabilityStatus: ProductAvailabilityStatus
}) {
  const canCustomize = availabilityStatus === 'in_stock'

  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg transition duration-300 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] w-full">
          <img
            src={imageUrl || '/placeholder.png'}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>

        <div className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm bg-white/90 text-zinc-900">
          Advance {formatINR(minimumAdvancePaise)}
        </div>

        <div
          className={[
            'absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
            statusClass(availabilityStatus),
          ].join(' ')}
        >
          {statusLabel(availabilityStatus)}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="flex items-center justify-between p-5">
        <div>
          <div className="text-base font-semibold text-zinc-950">{name}</div>
          <div className="mt-1 text-sm font-medium text-zinc-600">
            {formatINR(basePricePaise)}
          </div>
        </div>

        {canCustomize ? (
          <Link
            to={`/product/${id}`}
            className="rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:scale-105"
          >
            Customize
          </Link>
        ) : (
          <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-500">
            Unavailable
          </span>
        )}
      </div>
    </motion.div>
  )
}
