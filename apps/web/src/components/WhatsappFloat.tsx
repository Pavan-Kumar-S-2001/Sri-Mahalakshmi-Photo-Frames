import { useCartStore } from '../store/cartStore'
import { formatINR } from '../lib/money'

type Props = {
  phoneE164: string
  message?: string
}

function computeCustomizationPricePaise(basePricePaise: number, _customization: any) {
  return { subtotalPaise: basePricePaise }
}

export function WhatsappFloat({ phoneE164, message }: Props) {
  const items = useCartStore((s) => s.items)
  const totalsFn = useCartStore((s) => s.totals)
  const totals = totalsFn()

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault()

  const phone = phoneE164

  const name = prompt('Enter your name:')
  if (!name) return

  const address = prompt('Enter your delivery address:')
  if (!address) return

  try {
    // 🔥 1. Send order to backend
    const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        customer: {
          fullName: name,
          phone: phone,
          addressLine1: address,
          city: "Bangalore",
          pincode: "560001"
        },
        paymentMode: "full",
        items: items.map((it) => ({
          productId: it.productId,
          qty: it.qty,
          customization: it.customization
        }))
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert("Order failed")
      return
    }

    const order = data.order

    // 🔥 2. Create WhatsApp message from real order
    let finalMessage = `🛍️ New Order (#${order.id})\n\n`
    finalMessage += `Name: ${name}\n`
    finalMessage += `Address: ${address}\n\n`

    order.items.forEach((it: any, index: number) => {
      finalMessage += `${index + 1}. Qty: ${it.qty}\n`
      finalMessage += `   Price: ₹${(it.lineTotalPaise / 100).toFixed(2)}\n\n`
    })

    finalMessage += `Total: ₹${(order.totalPaise / 100).toFixed(2)}`

    // 🔥 3. Open WhatsApp
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`
    window.open(url, '_blank')

  } catch (err) {
    console.error(err)
    alert("Something went wrong")
  }
}

  return (
    <a
      href="#"
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition"
    >
      WhatsApp
    </a>
  )
}