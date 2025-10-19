-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
