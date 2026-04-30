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
      whileHover={{ y: -5 }}
      className="group rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] w-full">
          <img
            src={imageUrl || '/placeholder.png'}
            alt={name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>

        {/* overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>

      <div className="p-5 flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-zinc-950">{name}</div>
          <div className="mt-1 text-sm text-zinc-600 font-medium">₹{price}</div>
        </div>

        <Link
          to={`/product/${id}`}
          className="rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 text-xs font-semibold text-white shadow hover:scale-105 transition"
        >
          Customize
        </Link>
      </div>
    </motion.div>
  )
}

  <><h2 className="text-2xl font-bold text-center text-zinc-950">
  Why Choose Us
</h2><div className="mt-10 grid gap-6 md:grid-cols-3">
    {[
      {
        title: 'Premium Materials',
        desc: 'High-quality wood, glass, and finish for long-lasting frames',
      },
      {
        title: 'Custom Design',
        desc: 'Personalize your frames exactly how you want',
      },
      {
        title: 'Fast Delivery',
        desc: 'Quick processing and safe doorstep delivery',
      },
    ].map((item) => (
      <div
        key={item.title}
        className="rounded-2xl border border-zinc-200 p-6 text-center hover:shadow-lg transition"
      >
        <h3 className="font-semibold text-lg text-zinc-950">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-zinc-600">{item.desc}</p>
      </div>
    ))}
  </div></>
