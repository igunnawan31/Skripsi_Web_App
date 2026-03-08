/*
  Warnings:

  - The primary key for the `Absensi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branchId` on the `Cuti` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,periode]` on the table `Gaji` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Cuti` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kontrakId` to the `Gaji` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periode` to the `Gaji` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Gaji` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dueDate` on the `Gaji` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `startDate` to the `KontrakKerja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `KontrakKerja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `ProjectTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'ON_HOLD', 'COMPLETED');

-- CreateEnum
CREATE TYPE "KategoriPertanyaan" AS ENUM ('KINERJA', 'SIFAT');

-- CreateEnum
CREATE TYPE "StatusIndikatorKPI" AS ENUM ('DRAFT', 'AKTIF', 'SELESAI', 'ARSIP');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('KETUA', 'ANGGOTA');

-- AlterEnum
ALTER TYPE "KontrakKerjaStatus" ADD VALUE 'DITANGGUHKAN';

-- DropForeignKey
ALTER TABLE "Cuti" DROP CONSTRAINT "Cuti_approverId_fkey";

-- DropForeignKey
ALTER TABLE "Cuti" DROP CONSTRAINT "Cuti_branchId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_branchId_fkey";

-- AlterTable
ALTER TABLE "Absensi" DROP CONSTRAINT "Absensi_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "date" SET DATA TYPE DATE,
ALTER COLUMN "checkIn" DROP DEFAULT,
ADD CONSTRAINT "Absensi_pkey" PRIMARY KEY ("userId", "date");

-- AlterTable
ALTER TABLE "Cuti" DROP COLUMN "branchId",
ADD COLUMN     "catatan" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Gaji" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "kontrakId" TEXT NOT NULL,
ADD COLUMN     "periode" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "dueDate",
ADD COLUMN     "dueDate" DATE NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'BELUM_DIBAYAR';

-- AlterTable
ALTER TABLE "KontrakKerja" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dpPercentage" INTEGER,
ADD COLUMN     "endDate" DATE,
ADD COLUMN     "finalPercentage" INTEGER,
ADD COLUMN     "startDate" DATE NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'AKTIF';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProjectTeam" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "ProjectRole" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "branchId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Branch";

-- CreateTable
CREATE TABLE "SkalaNilaiKPI" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "valueType" TEXT NOT NULL,
    "valueRange" TEXT[],
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkalaNilaiKPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndikatorKPI" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "statusPublic" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusIndikatorKPI" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndikatorKPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndikatorKPIPenilai" (
    "indikatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndikatorKPIPenilai_pkey" PRIMARY KEY ("indikatorId","userId")
);

-- CreateTable
CREATE TABLE "IndikatorKPIDinilai" (
    "indikatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndikatorKPIDinilai_pkey" PRIMARY KEY ("indikatorId","userId")
);

-- CreateTable
CREATE TABLE "PertanyaanKPI" (
    "id" TEXT NOT NULL,
    "indikatorId" TEXT NOT NULL,
    "kategori" "KategoriPertanyaan" NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "bobot" DOUBLE PRECISION NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "skalaId" INTEGER NOT NULL,
    "urutanSoal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PertanyaanKPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JawabanKPI" (
    "id" TEXT NOT NULL,
    "indikatorId" TEXT NOT NULL,
    "pertanyaanId" TEXT NOT NULL,
    "penilaiId" TEXT NOT NULL,
    "dinilaiId" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JawabanKPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RekapKPI" (
    "id" TEXT NOT NULL,
    "indikatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalNilai" DOUBLE PRECISION NOT NULL,
    "rataRata" DOUBLE PRECISION NOT NULL,
    "jumlahPenilai" INTEGER NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RekapKPI_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkalaNilaiKPI_name_idx" ON "SkalaNilaiKPI"("name");

-- CreateIndex
CREATE INDEX "IndikatorKPI_createdById_idx" ON "IndikatorKPI"("createdById");

-- CreateIndex
CREATE INDEX "IndikatorKPI_status_idx" ON "IndikatorKPI"("status");

-- CreateIndex
CREATE INDEX "IndikatorKPI_startDate_endDate_idx" ON "IndikatorKPI"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "IndikatorKPIPenilai_indikatorId_idx" ON "IndikatorKPIPenilai"("indikatorId");

-- CreateIndex
CREATE INDEX "IndikatorKPIPenilai_userId_idx" ON "IndikatorKPIPenilai"("userId");

-- CreateIndex
CREATE INDEX "IndikatorKPIDinilai_indikatorId_idx" ON "IndikatorKPIDinilai"("indikatorId");

-- CreateIndex
CREATE INDEX "IndikatorKPIDinilai_userId_idx" ON "IndikatorKPIDinilai"("userId");

-- CreateIndex
CREATE INDEX "PertanyaanKPI_indikatorId_idx" ON "PertanyaanKPI"("indikatorId");

-- CreateIndex
CREATE INDEX "PertanyaanKPI_skalaId_idx" ON "PertanyaanKPI"("skalaId");

-- CreateIndex
CREATE INDEX "PertanyaanKPI_aktif_idx" ON "PertanyaanKPI"("aktif");

-- CreateIndex
CREATE INDEX "JawabanKPI_indikatorId_idx" ON "JawabanKPI"("indikatorId");

-- CreateIndex
CREATE INDEX "JawabanKPI_pertanyaanId_idx" ON "JawabanKPI"("pertanyaanId");

-- CreateIndex
CREATE INDEX "JawabanKPI_penilaiId_idx" ON "JawabanKPI"("penilaiId");

-- CreateIndex
CREATE INDEX "JawabanKPI_dinilaiId_idx" ON "JawabanKPI"("dinilaiId");

-- CreateIndex
CREATE INDEX "JawabanKPI_penilaiId_dinilaiId_idx" ON "JawabanKPI"("penilaiId", "dinilaiId");

-- CreateIndex
CREATE UNIQUE INDEX "JawabanKPI_pertanyaanId_penilaiId_dinilaiId_key" ON "JawabanKPI"("pertanyaanId", "penilaiId", "dinilaiId");

-- CreateIndex
CREATE INDEX "RekapKPI_indikatorId_idx" ON "RekapKPI"("indikatorId");

-- CreateIndex
CREATE INDEX "RekapKPI_userId_idx" ON "RekapKPI"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RekapKPI_indikatorId_userId_key" ON "RekapKPI"("indikatorId", "userId");

-- CreateIndex
CREATE INDEX "Absensi_date_idx" ON "Absensi"("date");

-- CreateIndex
CREATE INDEX "Absensi_userId_date_idx" ON "Absensi"("userId", "date");

-- CreateIndex
CREATE INDEX "Cuti_userId_idx" ON "Cuti"("userId");

-- CreateIndex
CREATE INDEX "Cuti_approverId_idx" ON "Cuti"("approverId");

-- CreateIndex
CREATE INDEX "Cuti_status_idx" ON "Cuti"("status");

-- CreateIndex
CREATE INDEX "Cuti_startDate_endDate_idx" ON "Cuti"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Gaji_userId_idx" ON "Gaji"("userId");

-- CreateIndex
CREATE INDEX "Gaji_kontrakId_idx" ON "Gaji"("kontrakId");

-- CreateIndex
CREATE INDEX "Gaji_status_idx" ON "Gaji"("status");

-- CreateIndex
CREATE INDEX "Gaji_dueDate_idx" ON "Gaji"("dueDate");

-- CreateIndex
CREATE INDEX "Gaji_periode_idx" ON "Gaji"("periode");

-- CreateIndex
CREATE UNIQUE INDEX "Gaji_userId_periode_key" ON "Gaji"("userId", "periode");

-- CreateIndex
CREATE INDEX "KontrakKerja_userId_idx" ON "KontrakKerja"("userId");

-- CreateIndex
CREATE INDEX "KontrakKerja_projectId_idx" ON "KontrakKerja"("projectId");

-- CreateIndex
CREATE INDEX "KontrakKerja_status_idx" ON "KontrakKerja"("status");

-- CreateIndex
CREATE INDEX "KontrakKerja_startDate_endDate_idx" ON "KontrakKerja"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project"("name");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "ProjectTeam_projectId_idx" ON "ProjectTeam"("projectId");

-- CreateIndex
CREATE INDEX "ProjectTeam_userId_idx" ON "ProjectTeam"("userId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Cuti" ADD CONSTRAINT "Cuti_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gaji" ADD CONSTRAINT "Gaji_kontrakId_fkey" FOREIGN KEY ("kontrakId") REFERENCES "KontrakKerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndikatorKPI" ADD CONSTRAINT "IndikatorKPI_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndikatorKPIPenilai" ADD CONSTRAINT "IndikatorKPIPenilai_indikatorId_fkey" FOREIGN KEY ("indikatorId") REFERENCES "IndikatorKPI"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndikatorKPIPenilai" ADD CONSTRAINT "IndikatorKPIPenilai_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndikatorKPIDinilai" ADD CONSTRAINT "IndikatorKPIDinilai_indikatorId_fkey" FOREIGN KEY ("indikatorId") REFERENCES "IndikatorKPI"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndikatorKPIDinilai" ADD CONSTRAINT "IndikatorKPIDinilai_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PertanyaanKPI" ADD CONSTRAINT "PertanyaanKPI_indikatorId_fkey" FOREIGN KEY ("indikatorId") REFERENCES "IndikatorKPI"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PertanyaanKPI" ADD CONSTRAINT "PertanyaanKPI_skalaId_fkey" FOREIGN KEY ("skalaId") REFERENCES "SkalaNilaiKPI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanKPI" ADD CONSTRAINT "JawabanKPI_indikatorId_fkey" FOREIGN KEY ("indikatorId") REFERENCES "IndikatorKPI"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanKPI" ADD CONSTRAINT "JawabanKPI_pertanyaanId_fkey" FOREIGN KEY ("pertanyaanId") REFERENCES "PertanyaanKPI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanKPI" ADD CONSTRAINT "JawabanKPI_penilaiId_fkey" FOREIGN KEY ("penilaiId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanKPI" ADD CONSTRAINT "JawabanKPI_dinilaiId_fkey" FOREIGN KEY ("dinilaiId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekapKPI" ADD CONSTRAINT "RekapKPI_indikatorId_fkey" FOREIGN KEY ("indikatorId") REFERENCES "IndikatorKPI"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekapKPI" ADD CONSTRAINT "RekapKPI_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
