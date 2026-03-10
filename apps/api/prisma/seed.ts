import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { PrismaClient, StatusCuti } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString: url });

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await hash('rahasia123', 10);

  // 2. Upsert users
  const owner = await prisma.user.upsert({
    where: { email: 'aldigibran@example.com' },
    update: {},
    create: {
      name: 'Aldisar Gibran',
      email: 'aldigibran@example.com',
      password,
      majorRole: 'OWNER',
    },
  });

  const hr = await prisma.user.upsert({
    where: { email: 'hr@example.com' },
    update: {},
    create: {
      name: 'HR Staff',
      email: 'hr@example.com',
      password,
      majorRole: 'KARYAWAN',
      minorRole: 'HR',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password,
      majorRole: 'KARYAWAN',
      minorRole: 'ADMIN',
    },
  });

  const pm = await prisma.user.upsert({
    where: { email: 'pm@example.com' },
    update: {},
    create: {
      name: 'Project Manager',
      email: 'pm@example.com',
      password,
      majorRole: 'KARYAWAN',
      minorRole: 'PROJECT_MANAGER',
    },
  });

  const frontend = await prisma.user.upsert({
    where: { email: 'frontend@example.com' },
    update: {},
    create: {
      name: 'Frontend Dev',
      email: 'frontend@example.com',
      password,
      majorRole: 'KARYAWAN',
      minorRole: 'FRONTEND',
    },
  });

  // 3. Upsert project
  let project = await prisma.project.findFirst({
    where: { name: 'Sistem Manajemen Karyawan' },
  });
  if (!project) {
    project = await prisma.project.create({
      data: {
        name: 'Sistem Manajemen Karyawan',
        description: 'Aplikasi internal untuk HR dan KPI',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'ACTIVE',
      },
    });
  }
  // 4. Project team members (skip if already exists)
  await prisma.projectTeam.createMany({
    data: [
      { projectId: project.id, userId: pm.id },
      { projectId: project.id, userId: frontend.id },
    ],
    skipDuplicates: true,
  });

  // 5. Kontrak kerja
  let kontrak = await prisma.kontrakKerja.findFirst({
    where: { userId: frontend.id, projectId: project.id },
  });
  if (!kontrak) {
    kontrak = await prisma.kontrakKerja.create({
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
  }

  const hrKontrakExists = await prisma.kontrakKerja.findFirst({
    where: { userId: hr.id },
  });
  if (!hrKontrakExists) {
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
  }

  // 6. Salary
  const salaryExists = await prisma.salary.findFirst({
    where: { userId: frontend.id, periode: '2025-01' },
  });
  if (!salaryExists) {
    await prisma.salary.create({
      data: {
        userId: frontend.id,
        kontrakId: kontrak.id,
        periode: '2025-01',
        dueDate: new Date('2025-01-31'),
        amount: 8000000,
      },
    });
  }

  // 7. Absensi
  const absensiExists = await prisma.absensi.findFirst({
    where: { userId: frontend.id, date: new Date('2025-01-10') },
  });
  if (!absensiExists) {
    await prisma.absensi.create({
      data: {
        userId: frontend.id,
        date: new Date('2025-01-10'),
        workStatus: 'WFO',
        checkIn: new Date('2025-01-10T08:00:00Z'),
        checkOut: new Date('2025-01-10T17:00:00Z'),
      },
    });
  }

  // 8. Cuti
  const cutiSeeds = [
    {
      userId: frontend.id,
      approverId: hr.id,
      startDate: new Date('2025-02-14'),
      endDate: new Date('2025-02-15'),
      reason: 'Liburan keluarga',
      status: StatusCuti.EXPIRED,
    },
    {
      userId: frontend.id,
      approverId: hr.id,
      startDate: new Date('2025-11-14'),
      endDate: new Date('2025-11-15'),
      reason: 'Liburan keluarga',
      status: StatusCuti.DITERIMA,
    },
    {
      userId: frontend.id,
      approverId: hr.id,
      startDate: new Date('2025-12-10'),
      endDate: new Date('2025-12-11'),
      reason: 'Liburan keluarga',
      status: StatusCuti.DITOLAK,
    },
    {
      userId: frontend.id,
      approverId: hr.id,
      startDate: new Date('2025-12-07'),
      endDate: new Date('2025-12-08'),
      reason: 'Liburan keluarga',
      status: StatusCuti.BATAL,
    },
    {
      userId: pm.id,
      startDate: new Date('2025-12-24'),
      endDate: new Date('2025-12-25'),
      reason: 'Liburan keluarga',
      status: StatusCuti.MENUNGGU,
    },
  ];

  for (const cuti of cutiSeeds) {
    const exists = await prisma.cuti.findFirst({
      where: {
        userId: cuti.userId,
        startDate: cuti.startDate,
        endDate: cuti.endDate,
      },
    });
    if (!exists) {
      await prisma.cuti.create({ data: cuti });
    }
  }

  // 9. Indikator KPI
  let indikator = await prisma.indikatorKPI.findFirst({
    where: { name: 'Kualitas Kode & Kolaborasi' },
  });
  if (!indikator) {
    indikator = await prisma.indikatorKPI.create({
      data: {
        name: 'Kualitas Kode & Kolaborasi',
        description: 'Penilaian terhadap kualitas kerja developer',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'ACTIVE',
        createdById: pm.id,
        evaluations: {
          create: [{ evaluatorId: pm.id, evaluateeId: frontend.id }],
        },
      },
    });
  }

  // 10. Pertanyaan KPI
  let pertanyaan = await prisma.pertanyaanKPI.findFirst({
    where: { indikatorId: indikator.id },
  });
  if (!pertanyaan) {
    pertanyaan = await prisma.pertanyaanKPI.create({
      data: {
        indikatorId: indikator.id,
        kategori: 'KINERJA',
        pertanyaan: 'Seberapa bersih dan terstruktur kode yang ditulis?',
        bobot: 1.0,
      },
    });
  }

  // 11. Jawaban KPI
  const jawabanExists = await prisma.jawabanKPI.findFirst({
    where: {
      indikatorId: indikator.id,
      pertanyaanId: pertanyaan.id,
      evaluatorId: pm.id,
      evaluateeId: frontend.id,
    },
  });
  if (!jawabanExists) {
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
  }

  // 12. Rekap KPI
  const rekapExists = await prisma.rekapKPI.findFirst({
    where: { indikatorId: indikator.id, userId: frontend.id },
  });
  if (!rekapExists) {
    await prisma.rekapKPI.create({
      data: {
        indikatorId: indikator.id,
        userId: frontend.id,
        totalNilai: 4.0,
        rataRata: 4.0,
        jumlahPenilai: 1,
      },
    });
  }

  // 13. Reimburse
  const reimburseExists = await prisma.reimburse.findFirst({
    where: { userId: frontend.id, title: 'Biaya Internet Bulan Januari' },
  });
  if (!reimburseExists) {
    await prisma.reimburse.create({
      data: {
        userId: frontend.id,
        title: 'Biaya Internet Bulan Januari',
        totalExpenses: 150000,
        documents: { url: '/uploads/reimburse/internet-jan.pdf' },
      },
    });
  }

  // 14. Agenda
  let agenda = await prisma.agenda.findFirst({
    where: { title: 'Sprint Planning', projectId: project.id },
  });
  if (!agenda) {
    agenda = await prisma.agenda.create({
      data: {
        title: 'Sprint Planning',
        eventDate: new Date('2025-01-15T09:00:00Z'),
        timezone: 'Asia/Jakarta',
        projectId: project.id,
        status: 'UPCOMING',
        frequency: 'WEEKLY',
      },
    });
  }

  // 15. Agenda Occurrence
  const occurrenceExists = await prisma.agendaOccurrence.findFirst({
    where: { agendaId: agenda.id, date: new Date('2025-01-15') },
  });
  if (!occurrenceExists) {
    await prisma.agendaOccurrence.create({
      data: {
        agendaId: agenda.id,
        date: new Date('2025-01-15'),
      },
    });
  }

  // 16. Notifikasi
  const notifExists = await prisma.notification.findFirst({
    where: { userId: frontend.id, category: 'CUTI' },
  });
  if (!notifExists) {
    await prisma.notification.create({
      data: {
        userId: frontend.id,
        title: 'Pengajuan Cuti Anda Sedang Diproses',
        category: 'CUTI',
        content: 'HR sedang meninjau pengajuan cuti Anda untuk 14–15 Februari.',
      },
    });
  }

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
