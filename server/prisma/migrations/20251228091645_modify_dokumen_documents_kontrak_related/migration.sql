/*
  Warnings:

  - You are about to drop the column `dokumen` on the `KontrakKerja` table. All the data in the column will be lost.
  - You are about to drop the column `dokumen` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KontrakKerja" DROP COLUMN "dokumen",
ADD COLUMN     "documents" JSONB;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "dokumen",
ADD COLUMN     "documents" JSONB;
