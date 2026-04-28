import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { WhatsappFloat } from './WhatsappFloat'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <Navbar />
      <main className="min-h-[calc(100dvh-4rem)]">
        <Outlet />
      </main>
      <Footer />
      <WhatsappFloat
        phoneE164={import.meta.env.VITE_WHATSAPP_NUMBER ?? '919999999999'}
        message="Hi, I am interested in your photo frame design"
      />
    </div>
  )
}

