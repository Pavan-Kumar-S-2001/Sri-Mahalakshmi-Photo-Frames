-- CreateEnum
CREATE TYPE "ProductAvailabilityStatus" AS ENUM ('in_stock', 'out_of_stock', 'soon_available');

-- CreateEnum
CREATE TYPE "BalancePaymentMethod" AS ENUM ('cash', 'online');

-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "availabilityStatus" "ProductAvailabilityStatus" NOT NULL DEFAULT 'in_stock',
ADD COLUMN "minimumAdvancePaise" INTEGER NOT NULL DEFAULT 50000;

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "advancePaidPaise" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "balancePaymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN "balancePaymentMethod" "BalancePaymentMethod",
ADD COLUMN "balancePaidPaise" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "balancePaidAt" TIMESTAMP(3);
