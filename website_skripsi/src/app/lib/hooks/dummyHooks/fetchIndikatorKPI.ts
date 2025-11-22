import { KinerjaData } from "../../dummyData/KinerjaData";
import { dummyKontrakKerja } from "../../dummyData/KontrakKerjaData";

export const fetchIndikatorKPI = async (
    currentPage: number,
    itemsPerPage: number,
    selectedStatus: string,
    selectedStatusIndikator: string,
) => {
    let filtered = KinerjaData;

    if (selectedStatus !== "All") {
        filtered = filtered.filter((indikator) => indikator.statusPublic === selectedStatus)
    };
    if (selectedStatusIndikator !== "All") {
        filtered = filtered.filter((indikator) => indikator.status === selectedStatusIndikator)
    };

    const total = filtered.length;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return {
        data: paginated,
        total
    };
}