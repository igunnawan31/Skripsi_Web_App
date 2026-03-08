/*
  Warnings:

  - You are about to drop the column `skalaId` on the `PertanyaanKPI` table. All the data in the column will be lost.
  - You are about to drop the `SkalaNilaiKPI` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PertanyaanKPI" DROP CONSTRAINT "PertanyaanKPI_skalaId_fkey";

-- DropIndex
DROP INDEX "PertanyaanKPI_skalaId_idx";

-- AlterTable
ALTER TABLE "PertanyaanKPI" DROP COLUMN "skalaId";

-- DropTable
DROP TABLE "SkalaNilaiKPI";

-- DropEnum
DROP TYPE "ValueType";
