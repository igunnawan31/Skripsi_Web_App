/*
  Warnings:

  - You are about to drop the column `dinilaiId` on the `JawabanKPI` table. All the data in the column will be lost.
  - You are about to drop the column `penilaiId` on the `JawabanKPI` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pertanyaanId,evaluatorId,evaluateeId]` on the table `JawabanKPI` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `evaluateeId` to the `JawabanKPI` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluatorId` to the `JawabanKPI` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JawabanKPI" DROP CONSTRAINT "JawabanKPI_dinilaiId_fkey";

-- DropForeignKey
ALTER TABLE "JawabanKPI" DROP CONSTRAINT "JawabanKPI_penilaiId_fkey";

-- DropIndex
DROP INDEX "JawabanKPI_dinilaiId_idx";

-- DropIndex
DROP INDEX "JawabanKPI_penilaiId_dinilaiId_idx";

-- DropIndex
DROP INDEX "JawabanKPI_penilaiId_idx";

-- DropIndex
DROP INDEX "JawabanKPI_pertanyaanId_penilaiId_dinilaiId_key";

-- AlterTable
ALTER TABLE "JawabanKPI" DROP COLUMN "dinilaiId",
DROP COLUMN "penilaiId",
ADD COLUMN     "evaluateeId" TEXT NOT NULL,
ADD COLUMN     "evaluatorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "JawabanKPI_evaluatorId_idx" ON "JawabanKPI"("evaluatorId");

-- CreateIndex
CREATE INDEX "JawabanKPI_evaluateeId_idx" ON "JawabanKPI"("evaluateeId");

-- CreateIndex
CREATE INDEX "JawabanKPI_evaluatorId_evaluateeId_idx" ON "JawabanKPI"("evaluatorId", "evaluateeId");

-- CreateIndex
CREATE UNIQUE INDEX "JawabanKPI_pertanyaanId_evaluatorId_evaluateeId_key" ON "JawabanKPI"("pertanyaanId", "evaluatorId", "evaluateeId");

-- AddForeignKey
ALTER TABLE "JawabanKPI" ADD CONSTRAINT "JawabanKPI_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanKPI" ADD CONSTRAINT "JawabanKPI_evaluateeId_fkey" FOREIGN KEY ("evaluateeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
