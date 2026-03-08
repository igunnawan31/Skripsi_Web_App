/*
  Warnings:

  - You are about to drop the `Gaji` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- DropForeignKey
ALTER TABLE "Gaji" DROP CONSTRAINT "Gaji_kontrakId_fkey";

-- DropForeignKey
ALTER TABLE "Gaji" DROP CONSTRAINT "Gaji_userId_fkey";

-- DropTable
DROP TABLE "Gaji";

-- DropEnum
DROP TYPE "GajiStatus";

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kontrakId" TEXT,
    "periode" TEXT NOT NULL,
    "dueDate" DATE NOT NULL,
    "status" "SalaryStatus" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "invoice" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Salary_userId_idx" ON "Salary"("userId");

-- CreateIndex
CREATE INDEX "Salary_kontrakId_idx" ON "Salary"("kontrakId");

-- CreateIndex
CREATE INDEX "Salary_status_idx" ON "Salary"("status");

-- CreateIndex
CREATE INDEX "Salary_dueDate_idx" ON "Salary"("dueDate");

-- CreateIndex
CREATE INDEX "Salary_periode_idx" ON "Salary"("periode");

-- CreateIndex
CREATE UNIQUE INDEX "Salary_userId_kontrakId_periode_key" ON "Salary"("userId", "kontrakId", "periode");

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_kontrakId_fkey" FOREIGN KEY ("kontrakId") REFERENCES "KontrakKerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
