-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatuses" NOT NULL DEFAULT 'Pending';
