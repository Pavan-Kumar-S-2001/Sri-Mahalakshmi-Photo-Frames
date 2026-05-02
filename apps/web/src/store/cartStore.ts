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
  minimumAdvancePaise: number
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
    advancePayablePaise: number
    remainingDuePaise: number
  }
}

const DEFAULT_MINIMUM_ADVANCE_PAISE = 50000

function randomId() {
  return Math.random().toString(16).slice(2)
}

function normalizeCustomization(customization: Partial<Customization> | undefined): Customization {
  return {
    size: customization?.size ?? '12x18',
    style: customization?.style ?? 'minimal',
    glass: customization?.glass ?? 'standard',
    designService: customization?.designService ?? false,
    uploadKey: customization?.uploadKey,
  }
}

function normalizeCartItem(item: Partial<CartItem> & { id?: string; productId?: string }) {
  return {
    id: item.id ?? randomId(),
    productId: item.productId ?? '',
    productName: item.productName ?? 'Custom frame',
    basePricePaise: Number.isFinite(item.basePricePaise) ? Number(item.basePricePaise) : 99900,
    minimumAdvancePaise:
      Number.isFinite(item.minimumAdvancePaise) && Number(item.minimumAdvancePaise) > 0
        ? Number(item.minimumAdvancePaise)
        : DEFAULT_MINIMUM_ADVANCE_PAISE,
    qty: Number.isFinite(item.qty) && Number(item.qty) > 0 ? Math.floor(Number(item.qty)) : 1,
    customization: normalizeCustomization(item.customization),
    localImageUrl: item.localImageUrl,
  } satisfies CartItem
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, normalizeCartItem({ ...item, id: randomId() })],
        })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, qty: Math.max(1, Math.floor(qty)) } : item,
          ),
        })),
      clear: () => set({ items: [] }),
      totals: () => {
        const subtotalPaise = get().items.reduce((sum, item) => {
          const safeItem = normalizeCartItem(item)
          const breakdown = computeCustomizationPricePaise(
            safeItem.basePricePaise,
            safeItem.customization,
          )
          return sum + breakdown.subtotalPaise * safeItem.qty
        }, 0)

        const deliveryFeePaise = computeDeliveryFeePaise(subtotalPaise)
        const totalPaise = subtotalPaise + deliveryFeePaise

        const advancePayablePaise = Math.min(
          totalPaise,
          get().items.reduce((sum, item) => {
            const safeItem = normalizeCartItem(item)
            const breakdown = computeCustomizationPricePaise(
              safeItem.basePricePaise,
              safeItem.customization,
            )
            const lineTotalPaise = breakdown.subtotalPaise * safeItem.qty
            return sum + Math.min(lineTotalPaise, safeItem.minimumAdvancePaise * safeItem.qty)
          }, 0),
        )

        return {
          subtotalPaise,
          deliveryFeePaise,
          totalPaise,
          advancePayablePaise,
          remainingDuePaise: Math.max(0, totalPaise - advancePayablePaise),
        }
      },
    }),
    {
      name: 'Sri Mahalakshmi Photo Frames_cart_v3',
      version: 1,
      partialize: (state) => ({
        items: state.items,
      }),
      migrate: (persistedState) => {
        const state = persistedState as { items?: Array<Partial<CartItem>> } | undefined

        return {
          items: (state?.items ?? []).map((item) => normalizeCartItem(item)),
        }
      },
    },
  ),
)
