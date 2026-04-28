import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Customization } from '@framecraft/shared'
import {
  computeCustomizationPricePaise,
  computeDeliveryFeePaise,
} from '@framecraft/shared'

export type CartItem = {
  id: string
  productId: string
  productName: string
  basePricePaise: number
  qty: number
  customization: Customization
  localImageUrl?: string
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  totals: () => {
    subtotalPaise: number
    deliveryFeePaise: number
    totalPaise: number
  }
}

function randomId() {
  return Math.random().toString(16).slice(2)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => ({
          items: [...s.items, { ...item, id: randomId() }],
        })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, Math.floor(qty)) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      totals: () => {
  const subtotalPaise = get().items.reduce((acc, it) => {
    const breakdown = computeCustomizationPricePaise(
      it.basePricePaise,
      it.customization ?? ({} as Customization)
    )
    return acc + breakdown.subtotalPaise * it.qty
  }, 0)

  const deliveryFeePaise = computeDeliveryFeePaise(subtotalPaise)

  return {
    subtotalPaise,
    deliveryFeePaise,
    totalPaise: subtotalPaise + deliveryFeePaise,
  }
}
    }),
    {
      name: 'Sri Mahalakshmi Photo Frames_cart_v2',
      partialize: (state) => ({
      items: state.items,
    }),
    },
  ),
)

