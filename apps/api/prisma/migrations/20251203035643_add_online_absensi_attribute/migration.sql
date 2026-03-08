/*
  Warnings:

  - Added the required column `address` to the `Absensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Absensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Absensi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Absensi" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Gaji" ADD COLUMN     "buktiPembayaran" JSONB;
