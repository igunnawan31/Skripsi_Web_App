import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { Text, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FilterModalReimburseComponent from "@/components/rootComponents/reimburseComponent/FilterModalReimburseComponent";
import ListDataPengajuanReimburseComponent from "@/components/rootComponents/reimburseComponent/ListDataPengajuanReimburseComponent";
import { useReimburse } from "@/lib/api/hooks/useReimburse";
import { ApprovalStatus, ReimburseResponse } from "@/types/reimburse/reimburseTypes";
import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";

const SetujuiReimbursePage = () => {
    const router = useRouter();
    const { data, isLoading, error } = useReimburse().fetchAllReimburse();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState<ReimburseResponse[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");

    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    useEffect(() => {
        if (data?.data) setFilteredData(data?.data);
    }, [data]);

    const totalBelumKeputusan = (reimburse: ReimburseResponse[]) => {
        if (!Array.isArray(reimburse)) return 0;
        return reimburse.filter((item) => item.approvalStatus === ApprovalStatus.PENDING).length;
    };

    const totalSudahKeputusan = (reimburse: ReimburseResponse[]) => {
        if (!Array.isArray(reimburse)) return 0;
        return reimburse.filter((item) => item.approvalStatus !== ApprovalStatus.PENDING).length;
    };

    const handleFilter = () => {
        let filtered = data?.data || [];

        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            filtered = filtered.filter((item: ReimburseResponse) => {
                const itemDate = new Date(item.createdAt);
                return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
            });
        }

        if (pickerMode === "approvalStatus" && selectedStatus) {
            filtered = filtered.filter((item: ReimburseResponse) => item.approvalStatus === selectedStatus);
        }

        setFilteredData(filtered);
        closeHandlePopUpFilter();
    };
    
    const resetFilter = () => {
        if (data?.data) setFilteredData(data.data);
        setStartDate(null);
        setSelectedStatus(null);
        setPickerMode("month");
        closeHandlePopUpFilter();
    };

    if (isLoading) {
        return (
            <View style={cutiStyles.container}>
                <Text>Loading absensi data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={cutiStyles.container}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={reimburseStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.push("/(tabs)/home")}
                >
                    <View style={reimburseStyles.iconPlace}>
                        <Image
                            style={reimburseStyles.iconBack}
                            source={require("../../../assets/icons/arrow-left.png")}
                        />
                    </View>
                    <Text style={reimburseStyles.headerTitle}>Kembali</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: COLORS.background }}
                contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 20
                }}
                enableOnAndroid={true}
                extraScrollHeight={150}
                keyboardShouldPersistTaps="handled"
            >
                <View style={reimburseStyles.subHeaderContainer}>
                    <View>
                        <Text style={reimburseStyles.subHeaderTitle}>
                            Pengajuan Reimburse
                        </Text>
                        <Text style={reimburseStyles.subHeaderDescription}>
                            Lihat status reimburse yang diajukan
                        </Text>
                    </View>
                    <View style={reimburseStyles.logoSubHeaderContainer}>
                        <Image
                            style={reimburseStyles.logoSubHeader}
                            source={require("../../../assets/icons/reimburse.png")}
                        />
                    </View>
                </View>
                <View style={reimburseStyles.cutiContainer}>
                    <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                        Bulan {startDate ? startDate.toLocaleString("default", { month: "long", year: "numeric" }): "All"}
                    </Text>
                </View>
                <View style={cutiStyles.cutiAvailableContainer}>
                    <View style={cutiStyles.cutiAvailable}>
                        <Text style={cutiStyles.titleCutiAccepted}>
                            Sudah Diproses
                        </Text>
                        <Image 
                            style={cutiStyles.logoCutiAccepted}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={cutiStyles.textCutiAccepted}>
                            {totalSudahKeputusan(data?.data ?? [])}
                        </Text>
                    </View>
                    <View style={cutiStyles.cutiAvailable}>
                        <Text style={cutiStyles.titleCutiRejected}>
                            Belum Diproses
                        </Text>
                        <Image 
                            style={cutiStyles.logoCutiRejected}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={cutiStyles.textCutiRejected}>
                            {totalBelumKeputusan(data?.data ?? [])}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={reimburseStyles.filterContainer}
                    onPress={showHandlePopUpFilter}
                >
                    <Text style={reimburseStyles.filterText}>Terapkan Filter</Text>
                </TouchableOpacity>
                <ListDataPengajuanReimburseComponent data={filteredData} />
            </KeyboardAwareScrollView>
            <FilterModalReimburseComponent
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
        </View>
    );
}

export default SetujuiReimbursePage;