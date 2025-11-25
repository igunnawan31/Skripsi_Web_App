import { dummyUsers } from "../../dummyData/dummyUsers";
import { dummyKontrakKerja } from "../../dummyData/KontrakKerjaData";
import { MajorRole, MinorRole } from "../../types/types";

export const fetchUsers = async (
    currentPage: number,
    itemsPerPage: number,
    selectedMinorRole: string,
) => {
    let filtered = dummyUsers.filter((item) => item.majorRole !== MajorRole.OWNER);

    if (selectedMinorRole !== "All") {
        filtered = filtered.filter((kk) => kk.minorRole === selectedMinorRole)
    };

    const total = filtered.length;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return {
        data: paginated,
        total
    };
}