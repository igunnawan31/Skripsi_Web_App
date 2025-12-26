/*
  Warnings:

  - You are about to drop the column `employeeType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KontrakKerja" ADD COLUMN     "jenis" "EmployeeType" NOT NULL DEFAULT 'CONTRACT';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "employeeType";
