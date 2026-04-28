import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
}: {
  id: string
  name: string
  price: number
  imageUrl?: string
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="relative overflow-hidden rounded-xl bg-zinc-100">
        <div className="aspect-[4/3] w-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-zinc-100 to-zinc-200 transition group-hover:from-zinc-200 group-hover:to-zinc-300" />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">{name}</div>
          <div className="mt-1 text-sm text-zinc-600">₹{price}</div>
        </div>
        <Link
          to={`/product/${id}`}
          className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800"
        >
          Customize
        </Link>
      </div>
    </motion.div>
  )
}

