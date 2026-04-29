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
  phoneE164={import.meta.env.VITE_WHATSAPP_NUMBER ?? '916364218486'}
/>
    </div>
  )
}

