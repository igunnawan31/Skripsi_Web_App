-- AlterEnum
ALTER TYPE "StatusCuti" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Cuti" ADD COLUMN     "dokumen" JSONB;
