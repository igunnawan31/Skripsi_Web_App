import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 2. Buat user
  const password = await hash('rahasia123', 10);
  const owner = await prisma.user.create({
    data: {
      name: 'Aldisar Gibran',
      email: 'aldigibran@example.com',
      password,
      majorRole: 'OWNER',
    },
  });

  const hr = await prisma.user.create({
    data: {
      name: 'HR Staff',
      email: 'hr@example.com',
      password,
      majorRole: 'KARYAWAN',
      minorRole: 'HR',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password,
      majorRole: 'KARYAWAN',
      minorRole: 'ADMIN',
    },
  });

  const pm = await prisma.user.create({
    data: {
      name: 'Project Manager',
      email: 'pm@example.com',
      password,
      majorRole: 'KARYAWAN',
      minorRole: 'PROJECT_MANAGER',
    },
  });

  const frontend = await prisma.user.create({
    data: {
      name: 'Frontend Dev',
      email: 'frontend@example.com',
      password,
      majorRole: 'KARYAWAN',
      minorRole: 'FRONTEND',
    },
  });

  // 3. Buat project
  const project = await prisma.project.create({
    data: {
      name: 'Sistem Manajemen Karyawan',
      description: 'Aplikasi internal untuk HR dan KPI',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      status: 'ACTIVE',
    },
  });

  // 4. Tambahkan anggota tim
  await prisma.projectTeam.createMany({
    data: [
      { projectId: project.id, userId: pm.id },
      { projectId: project.id, userId: frontend.id },
    ],
  });

  // 5. Buat kontrak kerja
  const kontrak = await prisma.kontrakKerja.create({
    data: {
      userId: frontend.id,
      projectId: project.id,
      metodePembayaran: 'MONTHLY',
      totalBayaran: 8000000,
      absensiBulanan: 22,
      cutiBulanan: 2,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      jenis: 'CONTRACT',
    },
  });

  await prisma.kontrakKerja.create({
    data: {
      userId: hr.id,
      metodePembayaran: 'MONTHLY',
      totalBayaran: 12000000,
      absensiBulanan: 31,
      cutiBulanan: 3,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2028-12-31'),
      jenis: 'PERMANENT',
    },
  });

  // 6. Buat gaji bulan Januari 2025
  await prisma.salary.create({
    data: {
      userId: frontend.id,
      kontrakId: kontrak.id,
      periode: '2025-01',
      dueDate: new Date('2025-01-31'),
      amount: 8000000,
    },
  });

  // 7. Absensi contoh
  await prisma.absensi.create({
    data: {
      userId: frontend.id,
      date: new Date('2025-01-10'),
      workStatus: 'WFO',
      checkIn: new Date('2025-01-10T08:00:00Z'),
      checkOut: new Date('2025-01-10T17:00:00Z'),
    },
  });

  // 8. Pengajuan cuti
  await prisma.cuti.create({
    data: {
      userId: frontend.id,
      approverId: hr.id,
      startDate: new Date('2025-02-14'),
      endDate: new Date('2025-02-15'),
      reason: 'Liburan keluarga',
      status: 'EXPIRED',
    },
  });

  await prisma.cuti.create({
    data: {
      userId: frontend.id,
      approverId: hr.id,
      startDate: new Date('2025-11-14'),
      endDate: new Date('2025-11-15'),
      reason: 'Liburan keluarga',
      status: 'DITERIMA',
    },
  });

  await prisma.cuti.create({
    data: {
      userId: frontend.id,
      approverId: hr.id,
      startDate: new Date('2025-12-10'),
      endDate: new Date('2025-12-11'),
      reason: 'Liburan keluarga',
      status: 'DITOLAK',
    },
  });

  await prisma.cuti.create({
    data: {
      userId: frontend.id,
      approverId: hr.id,
      startDate: new Date('2025-12-07'),
      endDate: new Date('2025-12-08'),
      reason: 'Liburan keluarga',
      status: 'BATAL',
    },
  });

  await prisma.cuti.create({
    data: {
      userId: pm.id,
      startDate: new Date('2025-12-24'),
      endDate: new Date('2025-12-25'),
      reason: 'Liburan keluarga',
      status: 'MENUNGGU',
    },
  });

  // 9. Indikator KPI
  const indikator = await prisma.indikatorKPI.create({
    data: {
      name: 'Kualitas Kode & Kolaborasi',
      description: 'Penilaian terhadap kualitas kerja developer',
      category: 'TEKNIS',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
      status: 'ACTIVE',
      createdById: pm.id,
      evaluation: {
        create: [{ evaluatorId: pm.id, evaluateeId: frontend.id }],
      },
    },
  });

  // 10. Pertanyaan KPI
  const pertanyaan = await prisma.pertanyaanKPI.create({
    data: {
      indikatorId: indikator.id,
      kategori: 'KINERJA',
      pertanyaan: 'Seberapa bersih dan terstruktur kode yang ditulis?',
      bobot: 1.0,
    },
  });

  // 11. Jawaban KPI (misal: PM menilai Frontend)
  await prisma.jawabanKPI.create({
    data: {
      indikatorId: indikator.id,
      pertanyaanId: pertanyaan.id,
      evaluatorId: pm.id,
      evaluateeId: frontend.id,
      nilai: 4,
      notes: 'Kode cukup rapi, tapi kurang dokumentasi.',
    },
  });

  // 12. Rekap KPI otomatis (dalam real app, ini dihitung via cron/logika bisnis)
  await prisma.rekapKPI.create({
    data: {
      indikatorId: indikator.id,
      userId: frontend.id,
      totalNilai: 4.0,
      rataRata: 4.0,
      jumlahPenilai: 1,
    },
  });

  // 13. Reimburse
  await prisma.reimburse.create({
    data: {
      userId: frontend.id,
      title: 'Biaya Internet Bulan Januari',
      totalExpenses: 150000,
      documents: { url: '/uploads/reimburse/internet-jan.pdf' },
    },
  });

  // 14. Agenda
  const agenda = await prisma.agenda.create({
    data: {
      title: 'Sprint Planning',
      eventDate: new Date('2025-01-15T09:00:00Z'),
      timezone: 'Asia/Jakarta',
      projectId: project.id,
      status: 'UPCOMING',
      frequency: 'WEEKLY',
    },
  });

  // 15. Agenda Occurrence
  await prisma.agendaOccurrence.create({
    data: {
      agendaId: agenda.id,
      date: new Date('2025-01-15'),
    },
  });

  // 16. Notifikasi
  await prisma.notification.create({
    data: {
      userId: frontend.id,
      title: 'Pengajuan Cuti Anda Sedang Diproses',
      category: 'CUTI',
      content: 'HR sedang meninjau pengajuan cuti Anda untuk 14–15 Februari.',
    },
  });

  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
