/*
  Warnings:

  - You are about to drop the column `catatan` on the `Reimburse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reimburse" DROP COLUMN "catatan",
ADD COLUMN     "notes" TEXT;
