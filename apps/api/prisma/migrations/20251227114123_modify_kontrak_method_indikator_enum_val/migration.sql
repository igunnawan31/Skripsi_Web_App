/*
  Warnings:

  - The values [AKTIF,SELESAI,DITANGGUHKAN] on the enum `KontrakKerjaStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [BULANAN] on the enum `MetodePembayaran` will be removed. If these variants are still used in the database, this will fail.
  - The values [AKTIF,SELESAI,ARSIP] on the enum `StatusIndikatorKPI` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KontrakKerjaStatus_new" AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD');
ALTER TABLE "public"."KontrakKerja" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "KontrakKerja" ALTER COLUMN "status" TYPE "KontrakKerjaStatus_new" USING ("status"::text::"KontrakKerjaStatus_new");
ALTER TYPE "KontrakKerjaStatus" RENAME TO "KontrakKerjaStatus_old";
ALTER TYPE "KontrakKerjaStatus_new" RENAME TO "KontrakKerjaStatus";
DROP TYPE "public"."KontrakKerjaStatus_old";
ALTER TABLE "KontrakKerja" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MetodePembayaran_new" AS ENUM ('MONTHLY', 'TERMIN', 'FULL');
ALTER TABLE "KontrakKerja" ALTER COLUMN "metodePembayaran" TYPE "MetodePembayaran_new" USING ("metodePembayaran"::text::"MetodePembayaran_new");
ALTER TYPE "MetodePembayaran" RENAME TO "MetodePembayaran_old";
ALTER TYPE "MetodePembayaran_new" RENAME TO "MetodePembayaran";
DROP TYPE "public"."MetodePembayaran_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StatusIndikatorKPI_new" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');
ALTER TABLE "public"."IndikatorKPI" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "IndikatorKPI" ALTER COLUMN "status" TYPE "StatusIndikatorKPI_new" USING ("status"::text::"StatusIndikatorKPI_new");
ALTER TYPE "StatusIndikatorKPI" RENAME TO "StatusIndikatorKPI_old";
ALTER TYPE "StatusIndikatorKPI_new" RENAME TO "StatusIndikatorKPI";
DROP TYPE "public"."StatusIndikatorKPI_old";
ALTER TABLE "IndikatorKPI" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "KontrakKerja" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
