import type { Product } from '@framecraft/shared'

export const catalog: Product[] = [
  {
    id: 'p1',
    name: 'Classic Walnut',
    basePricePaise: 129900,
    images: [],
    frameTypes: ['wood'],
    sizes: ['8x10', '12x18', '16x24'],
    glassTypes: ['standard', 'antiGlare', 'museum'],
    availabilityStatus: 'in_stock',
    minimumAdvancePaise: 50000,
    active: true,
  },
  {
    id: 'p2',
    name: 'Minimal Black',
    basePricePaise: 99900,
    images: [],
    frameTypes: ['metal'],
    sizes: ['8x10', '12x18', '16x24'],
    glassTypes: ['standard', 'antiGlare', 'museum'],
    availabilityStatus: 'in_stock',
    minimumAdvancePaise: 50000,
    active: true,
  },
  {
    id: 'p3',
    name: 'Crystal Acrylic',
    basePricePaise: 179900,
    images: [],
    frameTypes: ['acrylic'],
    sizes: ['8x10', '12x18', '16x24'],
    glassTypes: ['standard', 'antiGlare', 'museum'],
    availabilityStatus: 'in_stock',
    minimumAdvancePaise: 50000,
    active: true,
  },
]

export function getProduct(productId: string) {
  return catalog.find((p) => p.id === productId) ?? null
}
