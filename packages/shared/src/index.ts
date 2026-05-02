export type MoneyINR = {
  currency: 'INR'
  amountPaise: number
}

export type FrameGlassType = 'standard' | 'antiGlare' | 'museum'
export type FrameStyle = 'minimal' | 'classic' | 'gallery'

export type FrameSize = '8x10' | '12x18' | '16x24'
export type ProductAvailabilityStatus =
  | 'in_stock'
  | 'out_of_stock'
  | 'soon_available'

export type Product = {
  id: string
  name: string
  basePricePaise: number
  images: string[]
  frameTypes: string[]
  sizes: FrameSize[]
  glassTypes: FrameGlassType[]
  availabilityStatus: ProductAvailabilityStatus
  minimumAdvancePaise: number
  active: boolean
}

export type Customization = {
  size: FrameSize
  style: FrameStyle
  glass: FrameGlassType
  designService: boolean
  uploadKey?: string
}

export type PriceBreakdown = {
  basePricePaise: number
  customizationPaise: number
  subtotalPaise: number
}

export function computeCustomizationPricePaise(
  basePricePaise: number,
  customization: Customization,
) {
  const sizeAdd =
    customization.size === '8x10'
      ? 0
      : customization.size === '12x18'
        ? 35000
        : 70000
  const styleAdd =
    customization.style === 'minimal'
      ? 0
      : customization.style === 'classic'
        ? 15000
        : 25000
  const glassAdd =
    customization.glass === 'standard'
      ? 0
      : customization.glass === 'antiGlare'
        ? 20000
        : 45000
  const designAdd = customization.designService ? 19900 : 0

  return {
    basePricePaise,
    customizationPaise: sizeAdd + styleAdd + glassAdd + designAdd,
    subtotalPaise:
      basePricePaise + sizeAdd + styleAdd + glassAdd + designAdd,
  } satisfies PriceBreakdown
}

export function computeDeliveryFeePaise(subtotalPaise: number) {
  if (subtotalPaise >= 300000) return 0
  if (subtotalPaise >= 200000) return 14900
  return 19900
}

export const MIN_ORDER_VALUE_PAISE = 50000
