/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `SkalaNilaiKPI` table. All the data in the column will be lost.
  - Changed the type of `valueType` on the `SkalaNilaiKPI` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('NUMERIC', 'TEXT');

-- AlterTable
ALTER TABLE "SkalaNilaiKPI" DROP COLUMN "deskripsi",
DROP COLUMN "valueType",
ADD COLUMN     "valueType" "ValueType" NOT NULL;
