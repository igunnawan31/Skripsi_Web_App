import { KinerjaData } from "../../dummyData/KinerjaData";
import { dummyUsers } from "../../dummyData/dummyUsers";
import { PenilaianKPIData } from "../../dummyData/PenilaianKPIData";
import { layerPenilaian, User } from "../../types/types";
import { dummyProject } from "../../dummyData/ProjectData";

export const fetchPenilaianKPI = async (
    currentPage: number,
    itemsPerPage: number,
    selectedStatus: string | null,
    selectedMonth: Date | null,
    searchKeyword: string = ""
) => {
    const currentUser = dummyUsers[1];

    const filterUserByLayer = (penilai: User) => {
        const layer = layerPenilaian.find(
            (l) =>
                l.majorRolePenilai === penilai.majorRole &&
                (!l.minorRolePenilai || l.minorRolePenilai === penilai.minorRole)
        );
        if (!layer) return [];
        if (layer.hanyaDalamProject) {
            const projectsYangDiikuti = dummyProject.filter((project) =>
                project.anggotaProject?.some((member) => member.id === penilai.id)
            );
            const anggotaDariSemuaProject = projectsYangDiikuti.flatMap(
                (p) => p.anggotaProject ?? []
            );
            return anggotaDariSemuaProject.filter(
                (u): u is User =>
                    !!u.minorRole && layer.menilaiRole.includes(u.minorRole)
            );
        }
        return dummyUsers.filter(
            (u): u is User => !!u.minorRole && layer.menilaiRole.includes(u.minorRole)
        );
    };
    const allowedUsers = filterUserByLayer(currentUser).map(u => u.id);
    const selectedDate = selectedMonth || new Date();
    const selectedMonthIndex = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    let indikatorDalamPeriode = KinerjaData.filter(item => {
        const mulai = new Date(item.periodeMulai);
        return (
            mulai.getMonth() === selectedMonthIndex &&
            mulai.getFullYear() === selectedYear
        );
    });

    indikatorDalamPeriode = indikatorDalamPeriode.filter(item =>
        item.diisiOleh.some(u => u.id === currentUser.id)
    );

    if (indikatorDalamPeriode.length === 0) {
        return { data: [], total: 0 };
    }

    const indikator = indikatorDalamPeriode[0];

    let usersToEvaluate = indikator.pertanyaanUntuk
        .filter(u => allowedUsers.includes(u.id));

    let listKPIPerUser = usersToEvaluate.map(user => {
        const totalPertanyaan = indikator.pertanyaan.length;

        const jawabanUser = PenilaianKPIData.filter(
            j => j.indikatorKPIId === indikator.id && j.dinilai.id === user.id
        );

        return {
            dinilai: user,
            jumlahPertanyaan: totalPertanyaan,
            jumlahJawaban: jawabanUser.length,
            sudahDinilai: jawabanUser.length === totalPertanyaan,
            penilai: jawabanUser[0]?.penilai.nama ?? null,
            tanggalIsi: jawabanUser[0]?.tanggalIsi ?? null
        };
    });

    if (selectedStatus === "Sudah Dinilai") {
        listKPIPerUser = listKPIPerUser.filter(x => x.sudahDinilai);
    } else if (selectedStatus === "Belum Dinilai") {
        listKPIPerUser = listKPIPerUser.filter(x => !x.sudahDinilai);
    }

    if (searchKeyword.trim() !== "") {
        const keyword = searchKeyword.toLowerCase();
        listKPIPerUser = listKPIPerUser.filter(item =>
            item.dinilai.nama.toLowerCase().includes(keyword)
        );
    }

    const total = listKPIPerUser.length;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = listKPIPerUser.slice(start, start + itemsPerPage);

    return {
        data: paginated,
        total,
    };
};
