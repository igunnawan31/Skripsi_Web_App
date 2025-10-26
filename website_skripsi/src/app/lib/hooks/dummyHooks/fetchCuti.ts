import { dummyAbsensi } from "../../dummyData/AbsensiData";
import { dummyCuti } from "../../dummyData/CutiData";
import { Cuti } from "../../types/types";

export async function fetchCuti(
  page: number,
  itemsPerPage: number,
  status?: string,
  role?: string
): Promise<{ data: Cuti[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  let filtered = dummyCuti;

  if (status && status !== "All") {
    filtered = filtered.filter(
      (item) =>
        item.status?.toLowerCase() === status.toLowerCase()
    );
  }

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
