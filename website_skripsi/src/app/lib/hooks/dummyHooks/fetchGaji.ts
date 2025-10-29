import { dummyGaji } from "../../dummyData/GajiData";

export const fetchGaji = async (
    currentPage: number,
    itemsPerPage: number,
    selectedStatus: string,
    selectedBulan: string
) => {
    let filtered = dummyGaji;

    if (selectedStatus !== "All") {
        filtered = filtered.filter((g) => g.status === selectedStatus);
    }

    if (selectedBulan) {
        const [year, month] = selectedBulan.split("-");
        const monthName = new Date(`${year}-${month}-01`).toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
        });

        filtered = filtered.filter(
        (g) =>
            g.month.includes(selectedBulan) || // cocokkan "YYYY-MM"
            g.month.toLowerCase() === monthName.toLowerCase() // cocokkan "Oktober 2025"
        );
    }

    const total = filtered.length;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return { data: paginated, total };
};
