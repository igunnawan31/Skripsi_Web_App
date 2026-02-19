import { historyStyles } from "@/assets/styles/rootstyles/history.styles";
import COLORS from "@/constants/colors";
import { useState, useEffect } from "react";
import { Image, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuthStore } from "@/lib/store/authStore";
import { useAbsensi } from "@/lib/api/hooks/useAbsensi";
import { AbsensiResponse } from "@/types/absensi/absensiTypes";
import ListDataHistoryAbsenComponent from "@/components/rootComponents/absenComponent/ListDataHistoryAbsenComponent";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";

const HistoryAbsensiPage = () => {
    const user = useAuthStore((state) => state.user);

    let current = new Date();
    const [selectedYear, setSelectedYear] = useState(current.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(current.getMonth());
    const { data, isLoading, error, refetch, isFetching} = useAbsensi().fetchAbsensiByUserId(user?.id, selectedYear, selectedMonth);
    const [filteredData, setFilteredData] = useState<AbsensiResponse[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");

    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    useEffect(() => {
        if (data) setFilteredData(data);
    }, [data]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Data tidak ditemukan...</Text>
            </View>
        )
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        await refetch();

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };

    const handleFilter = () => {
        if (startDate) {
            setSelectedYear(startDate.getFullYear());
            setSelectedMonth(startDate.getMonth());
        }
        closeHandlePopUpFilter();
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            if (pickerTarget === "month") setStartDate(selectedDate);
        }
    };

    const resetFilter = () => {
        setSelectedYear(current.getFullYear());
        setSelectedMonth(current.getMonth());
        setStartDate(null);
        setPickerMode("month");
        closeHandlePopUpFilter();
    };
    
    const MONTH_NAMES = [
        "Januari","Februari","Maret","April","Mei","Juni",
        "Juli","Agustus","September","Oktober","November","Desember"
    ];

    if (isLoading || showSkeleton || isFetching) {
        return (
            <View style={historyStyles.container}>
                <View style={historyStyles.header}>
                    <SkeletonBox width={40} height={40} borderRadius={20} />
                    <View style={[historyStyles.textHeaderContainer, { gap: 6}]}>
                        <SkeletonBox width={80} height={20} style={{ marginLeft: 12 }} />
                        <SkeletonBox width={160} height={16} style={{ marginLeft: 12 }} />
                    </View>
                </View>

                <View style={historyStyles.historyContainer}>
                    <SkeletonBox width={80} height={25} borderRadius={14} />
                </View>

                <View style={[historyStyles.filterContainer, {backgroundColor: "transparent"}]}>
                    <SkeletonBox width={120} height={40} style={{ width: "100%" }} />
                </View>

                {[1, 2, 3, 4].map((_, i) => (
                    <View
                        key={i}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                            backgroundColor: "transparent",
                        }}
                    >
                        <SkeletonBox width={100} height={120} borderRadius={10} style={{ width: "90%" }} />
                    </View>
                ))}
            </View>
        );
    }


    if (error) {
        return (
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={historyStyles.container}>
                    <View style={historyStyles.header}>
                        <View style={historyStyles.logoHeaderContainer}>
                            <Image
                                style={historyStyles.logoHeader}
                                source={require("../../../assets/icons/history.png")}
                            />
                        </View>
                        <View style={historyStyles.textHeaderContainer}>
                            <Text style={historyStyles.headerTitle}>
                                History
                            </Text>
                            <Text style={historyStyles.headerDescription}>
                                Ini adalah history absensi yang kamu miliki per bulannya
                            </Text>
                        </View>
                    </View>
                    <View style={historyStyles.historyContainer}>
                        <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                            {selectedMonth !== null && selectedMonth !== undefined ? `Bulan ${MONTH_NAMES[selectedMonth]}` : "Semua Bulan"}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={historyStyles.filterContainer}
                        onPress={showHandlePopUpFilter}
                    >
                        <Text style={historyStyles.filterText}>Terapkan Filter</Text>
                    </TouchableOpacity>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                        <Image
                            source={require("../../../assets/icons/error-logo.png")}
                            style={{ width: 72, height: 72, }}
                        />
                        <Text style={{ textAlign: "center", marginTop: 10, color: COLORS.textPrimary, fontWeight: "bold", fontSize: 16, }}>
                            Terdapat kendala pada sistem
                        </Text>
                        <Text style={{ textAlign: "center", marginTop: 5, color: COLORS.muted, fontSize: 12, }}>
                            Mohon untuk mengecek kembali nanti
                        </Text>
                    </View> 
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing || isFetching}
                    onRefresh={onRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                />
            }
        >
            <View style={historyStyles.container}>
                <View style={historyStyles.header}>
                    <View style={historyStyles.logoHeaderContainer}>
                        <Image
                            style={historyStyles.logoHeader}
                            source={require("../../../assets/icons/history.png")}
                        />
                    </View>
                    <View style={historyStyles.textHeaderContainer}>
                        <Text style={historyStyles.headerTitle}>
                            History
                        </Text>
                        <Text style={historyStyles.headerDescription}>
                            Ini adalah history absensi yang kamu miliki per bulannya
                        </Text>
                    </View>
                </View>
                <View style={historyStyles.historyContainer}>
                    <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                        {selectedMonth !== null && selectedMonth !== undefined ? `Bulan ${MONTH_NAMES[selectedMonth]}` : "Semua Bulan"}
                    </Text>
                </View>
                <TouchableOpacity
                    style={historyStyles.filterContainer}
                    onPress={showHandlePopUpFilter}
                >
                    <Text style={historyStyles.filterText}>Terapkan Filter</Text>
                </TouchableOpacity>
                <Modal
                    isVisible={modalVisible}
                    onBackdropPress={closeHandlePopUpFilter}
                    style={historyStyles.modalFilterContainer}
                >
                    <View style={historyStyles.FilterModal}>
                        <Text style={historyStyles.modalTitle}>
                            Pilih Mode Filter
                        </Text>
                        <View style={historyStyles.modeSelector}>
                            <TouchableOpacity
                                style={[
                                    historyStyles.modeButton,
                                    pickerMode === "month" && { backgroundColor: COLORS.primary },
                                ]}
                                onPress={() => setPickerMode("month")}
                            >
                                <Text
                                    style={[
                                        historyStyles.modeText,
                                        pickerMode === "month" && { color: COLORS.white },
                                    ]}
                                >
                                    Per Bulan
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {pickerMode === "month" && (
                            <View style={historyStyles.modalPicker}>
                                <Text style={historyStyles.modalLabel}>Pilih Bulan</Text>
                                <TouchableOpacity
                                    style={historyStyles.buttonDate}
                                    onPress={() => {
                                        setPickerTarget("month");
                                        setShowPicker(true);
                                    }}
                                >
                                    <Text style={historyStyles.dateText}>
                                        {startDate
                                        ? startDate.toLocaleString("default", { month: "long", year: "numeric" })
                                        : "Pilih bulan"}
                                    </Text>
                                </TouchableOpacity>
                                {showPicker && (
                                    <DateTimePicker
                                        value={startDate || new Date()}
                                        mode="date"
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={onChangeDate}
                                    />
                                )}
                            </View>
                        )}

                        <TouchableOpacity style={historyStyles.cancelButton} onPress={resetFilter}>
                            <Text style={historyStyles.cancelText}>Hapus Filter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={historyStyles.applyButton} onPress={handleFilter}>
                            <Text style={historyStyles.applyText}>Terapkan Filter</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <ListDataHistoryAbsenComponent data={filteredData} />
            </View>
        </ScrollView>
    )
}

export default HistoryAbsensiPage;