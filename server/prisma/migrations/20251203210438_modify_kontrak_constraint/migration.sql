/*
  Warnings:

  - A unique constraint covering the columns `[userId,kontrakId,periode]` on the table `Gaji` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Gaji_userId_periode_key";

-- AlterTable
ALTER TABLE "Gaji" ALTER COLUMN "kontrakId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gaji_userId_kontrakId_periode_key" ON "Gaji"("userId", "kontrakId", "periode");
