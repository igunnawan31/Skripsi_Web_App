/*
  Warnings:

  - You are about to drop the column `role` on the `ProjectTeam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectTeam" DROP COLUMN "role";

-- DropEnum
DROP TYPE "ProjectRole";
