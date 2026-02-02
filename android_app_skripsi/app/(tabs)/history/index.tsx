import { historyStyles } from "@/assets/styles/rootstyles/history.styles";
import COLORS from "@/constants/colors";
import { useState, useEffect } from "react";
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuthStore } from "@/lib/store/authStore";
import { useAbsensi } from "@/lib/api/hooks/useAbsensi";
import { AbsensiResponse } from "@/types/absensi/absensiTypes";
import ListDataHistoryAbsenComponent from "@/components/rootComponents/absenComponent/ListDataHistoryAbsenComponent";

const HistoryAbsensiPage = () => {
    const user = useAuthStore((state) => state.user);
    let current = new Date();
    const [selectedYear, setSelectedYear] = useState(current.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(current.getMonth());
    const { data, isLoading, error} = useAbsensi().fetchAbsensiByUserId(user.id, selectedYear, selectedMonth);
    const [filteredData, setFilteredData] = useState<AbsensiResponse[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");

    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    useEffect(() => {
        if (data) setFilteredData(data);
    }, [data]);

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

    console.log(data);

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

    if (isLoading) {
        return (
            <View style={historyStyles.container}>
                <Text>Loading absensi data...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Data tidak ditemukan...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={historyStyles.container}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
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
                    <Text style={historyStyles.filterText}>Filter Pilih Tanggal</Text>
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