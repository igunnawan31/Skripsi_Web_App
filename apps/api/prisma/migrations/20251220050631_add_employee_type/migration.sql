/*
  Warnings:

  - Added the required column `employeeType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('CONTRACT', 'PERMANENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "employeeType" "EmployeeType" NOT NULL;
