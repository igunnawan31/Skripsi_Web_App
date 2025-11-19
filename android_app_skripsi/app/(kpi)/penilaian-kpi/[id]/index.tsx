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

export default function DetailPenilaianKPIUser() {
    const { id } = useLocalSearchParams();
    const [ formJawaban, setFormJawaban ] = useState<{ 
        [key: string]: {nilai: number | null, notes: string} 
    }>({});
    const [page, setPage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
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

    const handleInputChange = (pertanyaanId: string, nilai: number) => {
        setFormJawaban((prev) => ({
            ...prev,
            [pertanyaanId]: {
                ...prev[pertanyaanId],
                nilai,
            },
        }));
    };
    const handleNotesChange = (pertanyaanId: string, notes: string) => {
        setFormJawaban((prev) => ({
            ...prev,
            [pertanyaanId]: {
                ...prev[pertanyaanId],
                notes
            },
        }));
    };
    const allAnswered = categoriesQuestion.every(([_, list]) =>
        list.every((item) => {
            const ans = formJawaban?.[item.id];
            return ans && ans.nilai !== null;
        })
    );
    
    const handleSubmit = () => {
        setShowModal(false);
        router.push("/(kpi)/penilaian-kpi/penilaian-kpi");
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={penilaianKpiStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => sudahDinilai ? router.push("/(kpi)/penilaian-kpi/penilaian-kpi") : setShowExitModal(true)}
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
                <PenilaianKPIComponent 
                    page={page}
                    setPage={setPage}
                    categoriesQuestion={categoriesQuestion}
                    convertNilai={convertNilai}
                    judul={`Form Penilaian: ${selectedUser.nama}`}
                    sudahDinilai={false}
                    formJawaban={formJawaban}
                    handleInputChange={handleInputChange}
                    handleNotesChange={handleNotesChange}
                    allAnswered={allAnswered}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
            <PenilaianKPIModalComponent 
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
                title={"Submit Indikator Kinerja Karyawan"}
                description={"Apakah anda sudah yakin terhadap indikator kinerja karyawan ini?"}
                textActive={"Ya, Simpan"}
                textPassive={"Batal"}
            />
            <PenilaianKPIModalComponent 
                visible={showExitModal}
                onClose={() => setShowExitModal(false)}
                onSave={() => {
                    setShowExitModal(false);
                    router.push("/(kpi)/penilaian-kpi/penilaian-kpi");
                }}
                title={"Kembali ke page sebelumnya"}
                description={"Apakah anda ingin kembali sebelum melakukan submit?"}
                textActive={"Ya, Kembali"}
                textPassive={"Batal"}
            />
        </View>
    );
}