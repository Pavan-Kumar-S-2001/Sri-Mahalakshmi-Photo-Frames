import type { CartItem } from '../store/cartStore'
import { computeCustomizationPricePaise } from '@framecraft/shared'
import { formatINR } from './money'

export function generateWhatsAppMessage(items: CartItem[], totalPaise: number) {
  if (!items.length) {
    return 'Hi, I want to know more about your frames.'
  }

  let message = `Hi, I want to place an order:\n\n`

  items.forEach((it, index) => {
    const breakdown = computeCustomizationPricePaise(
      it.basePricePaise,
      it.customization
    )

    message += `${index + 1}. ${it.productName}\n`
    message += `   Size: ${it.customization.size}\n`
    message += `   Style: ${it.customization.style}\n`
    message += `   Glass: ${it.customization.glass}\n`
    message += `   Qty: ${it.qty}\n`
    message += `   Price: ${formatINR(breakdown.subtotalPaise * it.qty)}\n\n`
  })

  message += `-----------------------------\n`
  message += `Total: ${formatINR(totalPaise)}\n\n`
  message += `Please confirm my order.`

  return message
}