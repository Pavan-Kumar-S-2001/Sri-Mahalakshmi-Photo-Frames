import { useCartStore } from '../store/cartStore'
import { computeCustomizationPricePaise }from '@framecraft/shared'
import { formatINR } from '../lib/money'

export function WhatsappFloat() {
  const items = useCartStore((s) => s.items)
  const totalsFn = useCartStore((s) => s.totals)
  const totals = totalsFn()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const phone = "6364218486"

    const name = prompt('Enter your name:')
    if (!name) return

    const address = prompt('Enter your delivery address:')
    if (!address) return

    let message = `Hi, I want to order:\n\n`
    message += `Name: ${name}\n`
    message += `Address: ${address}\n\n`

    if (!items.length) {
      message += `I want to know more about your frames.`
    } else {
      items.forEach((it, index) => {
        const breakdown = computeCustomizationPricePaise(
          it.basePricePaise,
          it.customization
        )

        message += `${index + 1}. ${it.productName}\n`
        message += `   Size: ${it.customization.size} | Style: ${it.customization.style}\n`
        message += `   Qty: ${it.qty}\n`
        message += `   Price: ${formatINR(breakdown.subtotalPaise * it.qty)}\n\n`
      })

      message += `Total: ${formatINR(totals.totalPaise)}`
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition"
    >
      <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
        <path d="M16.002 3C9.373 3 4 8.373 4 15.002c0 2.646.864 5.092 2.326 7.072L5 29l7.18-1.873a11.93 11.93 0 0 0 3.822.627c6.629 0 12.002-5.373 12.002-12.002C28.004 8.373 22.631 3 16.002 3z" />
      </svg>
      WhatsApp
    </a>
  )
}