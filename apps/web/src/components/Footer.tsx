import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="container-px py-10">

        {/* TOP SECTION */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

          {/* LEFT SIDE */}
          <div>
            <div className="text-base font-bold text-zinc-950">
              Sri Mahalakshmi Photo Frames
            </div>

            <div className="mt-1 text-sm text-zinc-600">
              Custom photo frames & photo design services.
            </div>

            {/* 🔥 NEW: Address + Email */}
            <div className="mt-3 text-sm text-zinc-600 space-y-1">
              <div>📍 1st main, 2nd cross, FF layout, Laggere - 560058</div>
              <div>📧 srimahalakshmiphoto@gmail.com</div>
            </div>
          </div>

          {/* RIGHT SIDE LINKS */}
          <div className="flex flex-wrap gap-4 text-sm">
            <Link className="text-zinc-600 hover:text-zinc-950" to="/shop">
              Shop
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-950" to="/contact">
              Contact
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-950" to="/admin">
              Admin
            </Link>
          </div>
        </div>

        {/* 🔥 GOOGLE MAP */}
        <div className="mt-6">
          <a
            href="https://google.com/maps?q=13.0066929,77.5251614&z=17&hl=en"
            target="_blank"
            className="text-blue-600 text-sm hover:underline"
          >
            View location on Google Maps
          </a>

          <iframe
            src="https://maps.google.com/maps?q=13.0066929,77.5251614&z=17&output=embed"
            className="w-full h-48 mt-3 rounded-xl border"
            loading="lazy"
          />
        </div>

        {/* BOTTOM */}
        <div className="mt-8 text-xs text-zinc-500">
          © {new Date().getFullYear()} Sri Mahalakshmi Photo Frames. All rights reserved.
        </div>

      </div>
    </footer>
  )
}