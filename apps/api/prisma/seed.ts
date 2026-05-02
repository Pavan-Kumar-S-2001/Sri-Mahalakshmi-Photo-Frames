import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = [
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

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
