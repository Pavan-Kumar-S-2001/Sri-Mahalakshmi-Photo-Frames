import { useCartStore } from '../store/cartStore'

type Props = {
  phoneE164: string
}

export function WhatsappFloat({ phoneE164 }: Props) {
  const items = useCartStore((s) => s.items)

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const name = prompt('Enter your name:')
    if (!name) return

    const address = prompt('Enter your delivery address:')
    if (!address) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customer: {
            fullName: name,
            phone: phoneE164,
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

      let message = `🛍️ New Order (#${order.id})\n\n`
      message += `Name: ${name}\n`
      message += `Address: ${address}\n\n`

      order.items.forEach((it: any, index: number) => {
        message += `${index + 1}. Qty: ${it.qty}\n`
        message += `   Price: ₹${(it.lineTotalPaise / 100).toFixed(2)}\n\n`
      })

      message += `Total: ₹${(order.totalPaise / 100).toFixed(2)}`

      const url = `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`
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
    className="fixed bottom-6 right-6 z-50"
  >
    <div className="rounded-full shadow-xl hover:scale-110 transition flex items-center gap-2">

      {/* ICON */}
      <img
        src="/images/whatsapp.png"
        className="w-13 h-13"
      />

    </div>
  </a>
)
}