import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const slides = [
  {
    id: 'classic',
    title: 'Classic Wood Frames',
    img: '/images/frames/frame1.jpg',
  },
  {
    id: 'minimal',
    title: 'Minimal Matte Frames',
    img: '/images/frames/frame2.jpg',
  },
  {
    id: 'premium',
    title: 'Premium Glass Finish',
    img: '/images/frames/frame3.jpg',
  },
]

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Sri Mahalakshmi Photo Frames — Custom Photo Frames</title>
        <meta
          name="description"
          content="Premium custom photo frames and photo design services. Upload your photo, customize your frame, and get it delivered."
        />
      </Helmet>

      <section className="container-px py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-m font-medium text-zinc-700">
              Premium frames • Made for your memories
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Turn Photos Into
              <span className="text-zinc-500"> Gallery‑Grade</span> Frames
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base text-zinc-600 sm:text-lg">
              Upload your photo, pick the size and finish, and preview your
              frame instantly. Clean design, premium materials, fast delivery.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Upload Your Photo
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                Browse frames
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <HeroSlider />
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="container-px py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                Featured frames
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Best sellers curated for modern homes.
              </p>
            </div>
            <Link className="text-sm font-semibold text-zinc-900" to="/shop">
              Shop all →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">
                      Signature Frame {i}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      From ₹999
                    </div>
                  </div>
                  <Link
                    to="/shop"
                    className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Customize
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px py-12">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Customer reviews
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            'Beautiful finish and fast delivery.',
            'The preview matched the final frame perfectly.',
            'Premium look—worth it.',
          ].map((t) => (
            <div
              key={t}
              className="rounded-2xl border border-zinc-200 bg-white p-5"
            >
              <div className="text-sm text-zinc-600">{t}</div>
              <div className="mt-3 text-xs font-semibold text-zinc-900">
                Verified customer
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function HeroSlider() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(24,24,27,0.10),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(24,24,27,0.08),transparent_55%)]" />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-900">New arrivals</div>
          <div className="text-xs text-zinc-600">Slide</div>
        </div>

        <div className="mt-6 flex gap-4 overflow-hidden">
          {slides.map((s, idx) => (
            <motion.div
              key={s.id}
              className="min-w-[70%] rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:min-w-[55%]"
              animate={{ x: [0, -12, 0] }}
              transition={{
                duration: 3.5 + idx * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
  <img
    src={s.img}
    className="w-full h-full object-cover"
  />

  {/* overlay */}
  <div className="absolute inset-0 bg-black/30" />

  {/* text */}
  <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
    {s.title}
  </div>
</div>
              <div className="mt-4 text-sm font-semibold text-zinc-900">
                {s.title}
              </div>
              <div className="mt-1 text-sm text-zinc-600">
                Crafted for premium interiors.
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

