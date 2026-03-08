/*
  Warnings:

  - You are about to drop the `IndikatorKPIDinilai` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndikatorKPIPenilai` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IndikatorKPIDinilai" DROP CONSTRAINT "IndikatorKPIDinilai_indikatorId_fkey";

-- DropForeignKey
ALTER TABLE "IndikatorKPIDinilai" DROP CONSTRAINT "IndikatorKPIDinilai_userId_fkey";

-- DropForeignKey
ALTER TABLE "IndikatorKPIPenilai" DROP CONSTRAINT "IndikatorKPIPenilai_indikatorId_fkey";

-- DropForeignKey
ALTER TABLE "IndikatorKPIPenilai" DROP CONSTRAINT "IndikatorKPIPenilai_userId_fkey";

-- DropTable
DROP TABLE "IndikatorKPIDinilai";

-- DropTable
DROP TABLE "IndikatorKPIPenilai";

-- CreateTable
CREATE TABLE "Evaluations" (
    "indikatorId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "evaluateeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluations_pkey" PRIMARY KEY ("indikatorId","evaluateeId","evaluatorId")
);

-- CreateIndex
CREATE INDEX "Evaluations_indikatorId_idx" ON "Evaluations"("indikatorId");

-- CreateIndex
CREATE INDEX "Evaluations_evaluateeId_idx" ON "Evaluations"("evaluateeId");

-- CreateIndex
CREATE INDEX "Evaluations_evaluatorId_idx" ON "Evaluations"("evaluatorId");

-- AddForeignKey
ALTER TABLE "Evaluations" ADD CONSTRAINT "Evaluations_indikatorId_fkey" FOREIGN KEY ("indikatorId") REFERENCES "IndikatorKPI"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluations" ADD CONSTRAINT "Evaluations_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluations" ADD CONSTRAINT "Evaluations_evaluateeId_fkey" FOREIGN KEY ("evaluateeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
