import penilaianKpiStyles from "@/assets/styles/rootstyles/kpi/penilaiankpi.styles";
import FilterModalKPIComponent from "@/components/rootComponents/kpiComponent/FilterModalKPIComponent.";
import COLORS from "@/constants/colors";
import { dummyIndikatorKPI } from "@/data/dummyIndikatorKPI";
import { dummyJawabanKPI } from "@/data/dummyJawabanKPI";
import { dummyUsers } from "@/data/dummyUsers";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const PenilaianKPI = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [pickerTarget, setPickerTarget] = useState("month");
    const router = useRouter();

    const showHandlePopUpFilter = () => {
        setPickerMode("month");
        setModalVisible(true);
    };
    const closeHandlePopUpFilter = () => setModalVisible(false);

    const currentUserLogin = dummyUsers[0];
    const userProject = currentUserLogin.projectList;

    const hasSameProject = (listA: string[], listB: string[]) =>
        listA.some((p) => listB.includes(p));

    const anggotaDinilai = dummyIndikatorKPI.pertanyaanUntuk.filter((user) =>
        hasSameProject(user.projectList, userProject)
    );

    const totalPertanyaan = dummyIndikatorKPI.pertanyaan.length;

    const listKPIPerUser = anggotaDinilai.map((user) => {
        const jawabanUser = dummyJawabanKPI.filter(
            (j) => j.dinilai.userId === user.userId
        );

        return {
            user,
            sudahDinilai: jawabanUser.length === totalPertanyaan,
            pengisi: jawabanUser.length > 0 ? jawabanUser[0].penilai.nama : null,
            tanggalIsi: jawabanUser.length > 0 ? jawabanUser[0].tanggalIsi : null,
        };
    });
    const [filteredList, setFilteredList] = useState(listKPIPerUser);
    useEffect(() => {
        setFilteredList(listKPIPerUser);
    }, []);

    const handleFilter = () => {
        let result = listKPIPerUser;
        if (pickerMode === "status" && selectedStatus !== null) {
            result = result.filter(
                (item) =>
                (selectedStatus === "Sudah Dinilai" && item.sudahDinilai) ||
                (selectedStatus === "Belum Dinilai" && !item.sudahDinilai)
            )
        }

        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            const periodeMulai = new Date(dummyIndikatorKPI.periodeMulai);
            const periodeBerakhir = new Date(dummyIndikatorKPI.periodeBerakhir);

            const periodeMonth = periodeMulai.getMonth();
            const periodeYear = periodeMulai.getFullYear();

            const isSamePeriod =
                periodeMonth === selectedMonth && periodeYear === selectedYear;

            result = isSamePeriod ? result : [];
        }

        if (searchQuery.trim() !== "") {
            result = result.filter(item =>
                item.user.nama.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        setFilteredList(result);
        closeHandlePopUpFilter();
    };

    const resetFilter = () => {
        setSearchQuery("");
        setSelectedStatus(null);
        setStartDate(new Date());
        setFilteredList(listKPIPerUser);
        closeHandlePopUpFilter();
    };

    const jumlahSudahDinilai = filteredList.filter(item => item.sudahDinilai).length;
    const jumlahBelumDinilai = filteredList.filter(item => !item.sudahDinilai).length;

    return (
        <View style={penilaianKpiStyles.container}>
            <View style={penilaianKpiStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.push("/(tabs)/home")}
                >
                    <View style={penilaianKpiStyles.iconPlace}>
                        <Image
                            style={penilaianKpiStyles.iconBack}
                            source={require('../../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={penilaianKpiStyles.headerTitle}>
                        Kembali
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 44, }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={penilaianKpiStyles.subHeaderContainer}>
                    <View>
                        <Text style={penilaianKpiStyles.subHeaderTitle}>
                            Penilaian Kinerja Karyawan
                        </Text>
                        <Text style={penilaianKpiStyles.subHeaderDescription}>
                            Nilai Kinerja Karyawan
                        </Text>
                    </View>
                    <View style={penilaianKpiStyles.logoSubHeaderContainer}>
                        <Image
                            style={penilaianKpiStyles.logoSubHeader}
                            source={require("../../../assets/icons/penilaian-kpi.png")}
                        />
                    </View>
                </View>
                <View style={penilaianKpiStyles.bulanContainer}>
                    <Text style={penilaianKpiStyles.bulanText}>
                        Bulan {startDate ? startDate.toLocaleString("default", { month: "long" }): "All"}
                    </Text>
                </View>
                <View style={penilaianKpiStyles.KPIStatusContainer}>
                    <View style={penilaianKpiStyles.KPIStatus}>
                        <Text style={penilaianKpiStyles.titleKPIStatus}>
                            KPI Belum Dinilai
                        </Text>
                        <Image 
                            style={penilaianKpiStyles.logoKPI}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={penilaianKpiStyles.textKPIStatus}>
                            {jumlahBelumDinilai}
                        </Text>
                    </View>
                    <View style={penilaianKpiStyles.KPIStatus}>
                        <Text style={penilaianKpiStyles.titleKPIStatus}>
                            KPI Sudah Dinilai
                        </Text>
                        <Image 
                            style={penilaianKpiStyles.logoKPI}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={penilaianKpiStyles.textKPIStatus}>
                            {jumlahSudahDinilai}
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <View
                        style={penilaianKpiStyles.inputSearch}
                    >
                        <Image 
                            source={require("../../../assets/icons/search.png")}
                            style={{ tintColor: COLORS.border, height: 20, width: 20 }}
                        />
                        <TextInput
                            placeholder="Cari nama karyawan..."
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                                const result = listKPIPerUser.filter(item =>
                                    item.user.nama.toLowerCase().includes(text.toLowerCase())
                                );
                                setFilteredList(result);
                            }}
                            style={{ width: "100%" }}
                        />
                    </View>
                    <TouchableOpacity
                        style={penilaianKpiStyles.filterContainer}
                        onPress={showHandlePopUpFilter}
                    >
                        <Text style={penilaianKpiStyles.filterText}>Terapkan Filter</Text>
                    </TouchableOpacity>
                    {filteredList.length > 0 ? (
                        filteredList.map((item, index) => (
                            <View
                                key={index}
                                style={penilaianKpiStyles.listContainer}
                            >
                                <View style={penilaianKpiStyles.listHeader}>
                                    <Text style={penilaianKpiStyles.name}>{item.user.nama}</Text>
                                    <Text style={penilaianKpiStyles.date}>
                                        {dummyIndikatorKPI.periodeMulai} - {dummyIndikatorKPI.periodeBerakhir}
                                    </Text>
                                </View>
                                <View style={penilaianKpiStyles.statusContainer}>
                                    <View
                                        style={[penilaianKpiStyles.statusBullet, {backgroundColor: item.sudahDinilai ? COLORS.success : COLORS.error}]}/>
                                    <Text>
                                        {item.sudahDinilai ? "Sudah Dinilai" : "Belum Dinilai"}
                                    </Text>
                                </View>
                                {item.sudahDinilai && (
                                    <Text style={{ fontSize: 13 }}>
                                        Dinilai oleh: <Text style={{ fontWeight: "600" }}>{item.pengisi}</Text>
                                    </Text>
                                )}
                                <View style={{ height: 1, backgroundColor: COLORS.border, marginTop: 12 }} />
                                <TouchableOpacity
                                    key={item.user.userId}
                                    onPress={() => router.push(`/(kpi)/penilaian-kpi/${item.user.userId}`)}
                                    style={{
                                        marginTop: 12,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        gap: 5,
                                    }}
                                >
                                    <Text>Lebih Lanjut</Text>
                                    <Image
                                        style={{ tintColor: COLORS.primary, width: 12, height: 12 }}
                                        source={require('../../../assets/icons/arrow-right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={penilaianKpiStyles.noData}>Belum ada data</Text>
                    )}
                </View>
                <FilterModalKPIComponent
                    visible={modalVisible}
                    onClose={closeHandlePopUpFilter}
                    pickerMode={pickerMode}
                    setPickerMode={setPickerMode}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    showPicker={showPicker}
                    setShowPicker={setShowPicker}
                    pickerTarget={pickerTarget}
                    setPickerTarget={setPickerTarget}
                    handleFilter={handleFilter}
                    resetFilter={resetFilter}
                />
            </ScrollView>
        </View>
    )  
}

export default PenilaianKPI;