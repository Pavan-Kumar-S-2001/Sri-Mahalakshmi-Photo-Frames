import { Helmet } from 'react-helmet-async'

export function ContactPage() {
  const phone = (import.meta.env.VITE_SHOP_PHONE ?? '+91 63642 18486') as string
  const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '916364218486') as string
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(
    /[^\d]/g,
    '',
  )}?text=${encodeURIComponent('Hi, I am interested in your photo frame design')}`

  return (
    <>
      <Helmet>
        <title>Contact — Sri Mahalakshmi Photo Frames</title>
      </Helmet>

      <div className="container-px py-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
          Contact
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Visit our shop or reach us on phone/WhatsApp.
        </p>

        <div className="mt-6 flex justify-center">

          <aside className="w-full max-w-md">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-zinc-950">
                Get in touch
              </div>
              <div className="mt-4 space-y-3 text-sm">

  {/* PHONE */}
  {/* <div className="rounded-2xl bg-zinc-50 p-4 flex items-start gap-3">
  <span>📞</span>
  <div>
    <div className="text-xs font-semibold uppercase text-zinc-500">Phone</div>
    <div className="mt-1 font-semibold text-zinc-950">{phone}</div>
  </div>
</div> */}

  {/* ADDRESS */}
  <div className="rounded-2xl bg-zinc-50 p-4 flex items-start gap-3">
  <span>📍</span>
  <div>
    <div className="text-xs font-semibold uppercase text-zinc-500">Address</div>
    <div className="mt-1 text-zinc-950">
      1st main, 2nd cross, FF layout, Laggere - 560058
    </div>
  </div>
</div>

  {/* EMAIL */}
  <div className="rounded-2xl bg-zinc-50 p-4 flex items-start gap-3">
  <span>📧</span>
  <div>
    <div className="text-xs font-semibold uppercase text-zinc-500">Email</div>
    <div className="mt-1 text-zinc-950">
      srimahalakshmiphoto@gmail.com
    </div>
  </div>
</div>

  {/* CALL BUTTON */}
  <a
    href={`tel:${phone}`}
    className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
  >
    Call now
  </a>

  {/* WHATSAPP BUTTON */}
  <a
    href={whatsappHref}
    target="_blank"
    rel="noreferrer"
    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
  >
    WhatsApp
  </a>

</div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

