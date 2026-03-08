/*
  Warnings:

  - You are about to drop the column `rejectReason` on the `Reimburse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reimburse" DROP COLUMN "rejectReason",
ADD COLUMN     "catatan" TEXT;
