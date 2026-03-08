/*
  Warnings:

  - You are about to drop the column `alasanPenolakan` on the `Reimburse` table. All the data in the column will be lost.
  - You are about to drop the column `approvalDate` on the `Reimburse` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `Reimburse` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Reimburse` table. All the data in the column will be lost.
  - You are about to drop the column `submissionDate` on the `Reimburse` table. All the data in the column will be lost.
  - You are about to drop the column `totalPengeluaran` on the `Reimburse` table. All the data in the column will be lost.
  - Added the required column `title` to the `Reimburse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalExpenses` to the `Reimburse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reimburse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "Reimburse" DROP COLUMN "alasanPenolakan",
DROP COLUMN "approvalDate",
DROP COLUMN "file",
DROP COLUMN "name",
DROP COLUMN "submissionDate",
DROP COLUMN "totalPengeluaran",
ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documents" JSONB,
ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "totalExpenses" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
