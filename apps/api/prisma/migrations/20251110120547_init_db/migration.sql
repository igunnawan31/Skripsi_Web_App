-- CreateEnum
CREATE TYPE "MajorRole" AS ENUM ('OWNER', 'KARYAWAN');

-- CreateEnum
CREATE TYPE "MinorRole" AS ENUM ('HR', 'ADMIN', 'PROJECT_MANAGER', 'UI_UX', 'FRONTEND', 'BACKEND');

-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('WFH', 'WFO', 'HYBRID');

-- CreateEnum
CREATE TYPE "StatusCuti" AS ENUM ('MENUNGGU', 'DITERIMA', 'DITOLAK');

-- CreateEnum
CREATE TYPE "GajiStatus" AS ENUM ('BELUM_DIBAYAR', 'DIBAYAR', 'TERLAMBAT');

-- CreateEnum
CREATE TYPE "KontrakKerjaStatus" AS ENUM ('AKTIF', 'SELESAI');

-- CreateEnum
CREATE TYPE "MetodePembayaran" AS ENUM ('BULANAN', 'TERMIN', 'FULL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "majorRole" "MajorRole" NOT NULL,
    "minorRole" "MinorRole",
    "photo" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Absensi" (
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "workStatus" "WorkStatus" NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkOut" TIMESTAMP(3),

    CONSTRAINT "Absensi_pkey" PRIMARY KEY ("userId","date")
);

-- CreateTable
CREATE TABLE "Cuti" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "approverId" TEXT,
    "branchId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "StatusCuti" NOT NULL DEFAULT 'MENUNGGU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cuti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gaji" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" "GajiStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3),

    CONSTRAINT "Gaji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KontrakKerja" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metodePembayaran" "MetodePembayaran" NOT NULL,
    "totalBayaran" INTEGER NOT NULL,
    "absensiBulanan" INTEGER NOT NULL,
    "cutiBulanan" INTEGER NOT NULL,
    "status" "KontrakKerjaStatus" NOT NULL,
    "catatan" TEXT,
    "dokumen" JSONB,

    CONSTRAINT "KontrakKerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTeam" (
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProjectTeam_pkey" PRIMARY KEY ("projectId","userId")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absensi" ADD CONSTRAINT "Absensi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuti" ADD CONSTRAINT "Cuti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuti" ADD CONSTRAINT "Cuti_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuti" ADD CONSTRAINT "Cuti_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gaji" ADD CONSTRAINT "Gaji_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KontrakKerja" ADD CONSTRAINT "KontrakKerja_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KontrakKerja" ADD CONSTRAINT "KontrakKerja_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
