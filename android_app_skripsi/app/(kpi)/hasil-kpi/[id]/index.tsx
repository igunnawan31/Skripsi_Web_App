import penilaianKpiStyles from "@/assets/styles/rootstyles/kpi/penilaiankpi.styles";
import PenilaianKPIComponent from "@/components/rootComponents/kpiComponent/PenilaianKPIComponent";
import PenilaianKPIModalComponent from "@/components/rootComponents/kpiComponent/PenilaianKPIModalComponent";
import COLORS from "@/constants/colors";
import { dummyIndikatorKPI } from "@/data/dummyIndikatorKPI";
import { dummyJawabanKPI } from "@/data/dummyJawabanKPI";
import { dummyPertanyaanKPI } from "@/data/dummyPertanyaanKPI";
import { dummySkalaNilai } from "@/data/dummySkalaNilai";
import { dummyUsers } from "@/data/dummyUsers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";

export default function DetailKPIByUser() {
    const { id } = useLocalSearchParams();
    const [page, setPage] = useState(0);
    const router = useRouter();

    const selectedUser = dummyUsers.find((item) => item.userId === id);

    if (!selectedUser) {
        return (
            <Text style={{ textAlign: "center", marginTop: 50 }}>
                Detail KPI not found.
            </Text>
        )
    };
    const jawabanUser = dummyJawabanKPI.filter(
        (item) => 
            item.dinilai.userId === selectedUser.userId &&
            item.indikatorKPIId === dummyIndikatorKPI.id
    );
    const convertNilai = jawabanUser.map(item => {
        const skala = dummySkalaNilai.find(skala => skala.nilai === item.nilai);

        return {
            ...item,
            label: skala ? skala.label : "Tidak Diketahui"
        };
    });
    const pertanyaanByCategory = dummyPertanyaanKPI
        .filter(item => item.IndikatorKPIId === dummyIndikatorKPI.id)
        .reduce((acc, p) => {
        const kategori = p.kategoriPertanyaan;
        if (!acc[kategori]) acc[kategori] = [];
        acc[kategori].push(p);
        return acc;
    }, {} as Record<string, typeof dummyPertanyaanKPI>);
    const categoriesQuestion = Object.entries(pertanyaanByCategory);
    const sudahDinilai = jawabanUser.length === dummyIndikatorKPI.hasilPenilaian.length;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={penilaianKpiStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.push("/(kpi)/hasil-kpi/hasil-kpi")}
                >
                    <View style={penilaianKpiStyles.iconPlace}>
                        <Image
                            style={penilaianKpiStyles.iconBack}
                            source={require('../../../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={penilaianKpiStyles.headerTitle}>
                        Detail Indikator Kinerja Karyawan
                    </Text>
                </TouchableOpacity>
            </View>
            
            {sudahDinilai ? (
                <PenilaianKPIComponent 
                    page={page}
                    setPage={setPage}
                    categoriesQuestion={categoriesQuestion}
                    convertNilai={convertNilai}
                    judul={"Penilaian Telah Dilakukan"}
                    sudahDinilai={true}
                />
            ) : (
                <Text style={{ textAlign: "center", marginTop: 20, color: COLORS.muted }}>
                    Tidak ada data cuti di bulan ini
                </Text> 
            )}
        </View>
    );
}