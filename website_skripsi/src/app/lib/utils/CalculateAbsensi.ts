type Absensi = {
  date: string;
  checkIn: string | null;
};

type Kontrak = {
  absensiBulanan: number;
  startDate: string;
  endDate: string;
};

export type AttendanceResult = {
  label: string;
  hadir: number;
  target: number;
};


export function calculateAttendanceAdvanced(
  absensi: Absensi[],
  kontrak: Kontrak,
  mode: "month" | "year",
  year: number,
  month?: number,
  startDate?: string,
  endDate?: string
): AttendanceResult {
  const kontrakStart = new Date(kontrak.startDate);
  const kontrakEnd = new Date(kontrak.endDate);

  const rangeStart = startDate
    ? new Date(startDate)
    : kontrakStart;

  const rangeEnd = endDate
    ? new Date(endDate)
    : kontrakEnd;

  const validAbsensi = absensi.filter((a) => {
    if (!a.checkIn) return false;
    const d = new Date(a.date);
    return d >= rangeStart && d <= rangeEnd;
  });

  if (mode === "month" && month !== undefined) {
    const hadir = validAbsensi.filter((a) => {
      const d = new Date(a.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;

    return {
      label: `${year}-${String(month + 1).padStart(2, "0")}`,
      hadir,
      target: kontrak.absensiBulanan,
    };
  }

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  const effectiveStart = kontrakStart > yearStart ? kontrakStart : yearStart;
  const effectiveEnd = kontrakEnd < yearEnd ? kontrakEnd : yearEnd;

  let totalMonths = 0;
  if (effectiveStart <= effectiveEnd) {
    totalMonths =
      (effectiveEnd.getFullYear() - effectiveStart.getFullYear()) * 12 +
      (effectiveEnd.getMonth() - effectiveStart.getMonth()) +
      1;
  }

  const hadirTahunan = validAbsensi.filter((a) => {
    const d = new Date(a.date);
    return d.getFullYear() === year;
  }).length;

  return {
    label: `Tahun ${year}`,
    hadir: hadirTahunan,
    target: kontrak.absensiBulanan * totalMonths,
  };
}
