/*
  Warnings:

  - You are about to drop the column `invoice` on the `Salary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Salary" DROP COLUMN "invoice",
ADD COLUMN     "paychecks" JSONB;
