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
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>Sri Mahalakshmi Photo Frames — Custom Photo Frames</title>
        <meta
          name="description"
          content="Premium custom photo frames and photo design services. Upload your photo, customize your frame, and get it delivered."
        />
      </Helmet>

      <section className="relative w-full overflow-hidden">
  <div className="relative h-[400px] sm:h-[500px] md:h-[550px]">

    <div className="absolute inset-0 animate-fade1">
      <img src="/images/frames/frame1.jpg" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50" />
    </div>

    <div className="absolute inset-0 animate-fade2 delay-[5s]">
      <img src="/images/frames/frame2.jpg" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50" />
    </div>

    <div className="absolute inset-0 animate-fade3 delay-[10s]">
      <img src="/images/frames/frame3.jpg" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50" />
    </div>

  </div>

  <div className="absolute inset-0 flex items-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
      <div className="max-w-xl text-white">

        <p className="text-sm bg-white/20 inline-block px-3 py-1 rounded-full">
          Premium frames • Made for your memories
        </p>

        <h1 className="mt-5 text-2xl sm:text-3xl md:text-5xl font-bold">
          Turn Your Memories Into
          <br />
          <span className="text-yellow-400">Luxury Wall Art</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-zinc-200">
          Upload your photo and transform it into premium frames.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/shop"
            className="bg-yellow-500 text-white px-5 py-3 rounded-full text-sm font-semibold text-center"
          >
            Upload Your Photo
          </Link>

          <Link
            to="/shop"
            className="bg-white text-black px-5 py-3 rounded-full text-sm font-semibold text-center"
          >
            Browse Frames
          </Link>
        </div>

      </div>
    </div>
  </div>
</section>
      
      {/* WHY CHOOSE US */}
<section className="container-px py-16">
  <h2 className="text-2xl font-bold text-center text-zinc-950">
    Why Choose Us
  </h2>

  <div className="mt-10 grid gap-6 md:grid-cols-3">
    {[
      {
        title: 'Premium Quality',
        desc: 'High-end materials and finishing',
      },
      {
        title: 'Custom Designs',
        desc: 'Personalized frames for your memories',
      },
      {
        title: 'Fast Delivery',
        desc: 'Quick and safe doorstep delivery',
      },
    ].map((item) => (
      <div
        key={item.title}
        className="rounded-3xl border border-zinc-200 p-6 text-center shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300"
      >
        <h3 className="font-semibold text-lg text-zinc-950">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-zinc-600">{item.desc}</p>
      </div>
    ))}
  </div>
</section>
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="container-px py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                Featured frames
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Best sellers curated for modern homes.
              </p>
            </div>
            <Link className="text-sm font-semibold text-zinc-950" to="/shop">
              Shop all →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >
                <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-950">
                      Signature Frame {i}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      From ₹999
                    </div>
                  </div>
                  <Link
                    to="/shop"
                    className="rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white px-3 py-2 text-xs font-semibold"
                  >
                    Customize
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px py-16">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
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
              <div className="mt-3 text-xs font-semibold text-zinc-950">
                Verified customer
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function HeroSlider() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(24,24,27,0.10),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(24,24,27,0.08),transparent_55%)]" />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
            New arrivals
          </div>
        </div>

        <div className="mt-6 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: ['0%', '-100%'] }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: 'linear',
            }}
          >
            {[...slides, ...slides].map((s, idx) => (
              <div
                key={idx}
                className="min-w-[300px] sm:min-w-[350px] rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg hover:shadow-2xl transition"
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                  <img
                    src={s.img}
                    className="w-full h-auto object-cover"
                  />

                  <div className="absolute inset-0 bg-black/30" />

                  <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
                    {s.title}
                  </div>
                </div>

                <div className="mt-4 text-sm font-semibold text-zinc-950">
                  {s.title}
                </div>

                <div className="mt-1 text-sm text-zinc-600">
                  Crafted for premium interiors.
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}