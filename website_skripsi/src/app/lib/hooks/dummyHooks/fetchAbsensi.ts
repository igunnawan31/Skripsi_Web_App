import { dummyAbsensi } from "../../dummyData/AbsensiData";
import { Absensi } from "../../types/types";

export async function fetchAbsensi(
  page: number,
  itemsPerPage: number,
  date?: string,
  role?: string
): Promise<{ data: Absensi[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  let filtered = dummyAbsensi;

  // Filter berdasarkan tanggal (jika ada)
  if (date && date !== "") {
    // sesuaikan format tanggal dummy
    filtered = filtered.filter((item) => {
      // gunakan includes supaya tidak strict (bisa "2025-10-21" atau "21/10/2025")
      return item.date?.includes(date);
    });
  }

  // Filter berdasarkan role (jika bukan All)
  if (role && role !== "All") {
    filtered = filtered.filter(
      (item) =>
        item.majorRole?.toLowerCase() === role.toLowerCase() ||
        item.minorRole?.toLowerCase() === role.toLowerCase()
    );
  }

  const total = filtered.length;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = filtered.slice(start, end);

  return {
    data: paginated,
    total,
  };
}
