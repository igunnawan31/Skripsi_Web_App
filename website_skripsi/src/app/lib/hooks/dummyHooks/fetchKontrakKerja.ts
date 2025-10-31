import { dummyKontrakKerja } from "../../dummyData/KontrakKerjaData";

export const fetchKontrakKerja = async (
    currentPage: number,
    itemsPerPage: number,
    selectedStatus: string,
) => {
    let filtered = dummyKontrakKerja;

    if (selectedStatus !== "All") {
        filtered = filtered.filter((kk) => kk.status === selectedStatus)
    };

    const total = filtered.length;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return {
        data: paginated,
        total
    };
}