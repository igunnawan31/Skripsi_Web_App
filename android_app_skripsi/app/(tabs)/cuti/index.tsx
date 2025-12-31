import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import COLORS from "@/constants/colors";
import { CutiStatus } from "@/types/enumTypes";
import { useEffect, useState } from "react";
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import ListDataCutiComponent from "@/components/rootComponents/cutiComponent/ListDataCutiComponent";
import { useCuti } from "@/lib/api/hooks/useCuti";
import { CutiResponse } from "@/types/cuti/cutiTypes";
import { historyStyles } from "@/assets/styles/rootstyles/history.styles";

const CutiPage = () => {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const { data, isLoading, error} = useCuti().fetchAllCuti();
    const [filteredData, setFilteredData] = useState<CutiResponse[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");
    const router = useRouter();

    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    useEffect(() => {
        if (data?.data) setFilteredData(data?.data);
    }, [data]);

    const totalDiterima = (cuti: any[]) => {
        if (!Array.isArray(cuti)) return 0;
        return cuti.filter((item) => item.status === "DITERIMA").length;
    };

    const totalDitolak = (cuti: any[]) => {
        if (!Array.isArray(cuti)) return 0;
        return cuti.filter((item) => item.status === "DITOLAK").length;
    };

    const handleFilter = () => {
        let filtered = data?.data || [];

        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            filtered = filtered.filter((item: CutiResponse) => {
                const itemDate = new Date(item.createdAt);
                return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
            });
        }

        if (pickerMode === "status" && selectedStatus) {
            filtered = filtered.filter((item: CutiResponse) => item.status === selectedStatus);
        }

        setFilteredData(filtered);
        closeHandlePopUpFilter();
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            if (pickerTarget === "month") setStartDate(selectedDate);
        }
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
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={cutiStyles.container}>
                <View style={cutiStyles.header}>
                    <View style={cutiStyles.logoHeaderContainer}>
                        <Image
                            style={cutiStyles.logoHeader}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                    </View>
                    <View style={cutiStyles.textHeaderContainer}>
                        <Text style={cutiStyles.headerTitle}>
                            Cuti Status
                        </Text>
                        <Text style={cutiStyles.headerDescription}>
                            Lihat status pengajuan cuti yang kamu buat
                        </Text>
                    </View>
                </View>
                <View style={cutiStyles.cutiContainer}>
                    <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                        Bulan {startDate ? startDate.toLocaleString("default", { month: "long", year: "numeric" }): "All"}
                    </Text>
                    <TouchableOpacity 
                        style={cutiStyles.ajukanCutiButton}
                        onPress={() => router.push('/(cuti)/create')}
                    >
                        <Image
                            source={require("../../../assets/icons/add.png")}
                            style={cutiStyles.icons}
                        />
                        <Text style={cutiStyles.textAjukanCuti}>Ajukan Cuti</Text>
                    </TouchableOpacity>
                </View>
                <View style={cutiStyles.cutiAvailableContainer}>
                    <View style={cutiStyles.cutiAvailable}>
                        <Text style={cutiStyles.titleCutiAccepted}>
                            Cuti Diterima
                        </Text>
                        <Image 
                            style={cutiStyles.logoCutiAccepted}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={cutiStyles.textCutiAccepted}>
                            {totalDiterima(data?.data ?? [])}
                        </Text>
                    </View>
                    <View style={cutiStyles.cutiAvailable}>
                        <Text style={cutiStyles.titleCutiRejected}>
                            Cuti Ditolak
                        </Text>
                        <Image 
                            style={cutiStyles.logoCutiRejected}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={cutiStyles.textCutiRejected}>
                            {totalDitolak(data?.data ?? [])}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={cutiStyles.filterContainer}
                    onPress={showHandlePopUpFilter}
                >
                    <Text style={cutiStyles.filterText}>Terapkan Filter</Text>
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
                                    cutiStyles.modeButton,
                                    pickerMode === "month" && { backgroundColor: COLORS.primary },
                                ]}
                                onPress={() => setPickerMode("month")}
                            >
                                <Text
                                    style={[
                                        cutiStyles.modeText,
                                        pickerMode === "month" && { color: COLORS.white },
                                    ]}
                                >
                                    Per Bulan
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    cutiStyles.modeButton,
                                    pickerMode === "status" && { backgroundColor: COLORS.primary },
                                ]}
                                onPress={() => setPickerMode("status")}
                            >
                                <Text
                                    style={[
                                        cutiStyles.modeText,
                                        pickerMode === "status" && { color: COLORS.white },
                                    ]}
                                >
                                    Berdasarkan Status
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {pickerMode === "month" ? (
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
                        ) : (
                            <View style={cutiStyles.modalPicker}>
                                <Text style={cutiStyles.modalLabel}>Pilih Status Reimburse</Text>

                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                    {Object.values(CutiStatus).map((status) => (
                                        <TouchableOpacity
                                            key={status}
                                            onPress={() => setSelectedStatus(status)}
                                            style={[
                                                cutiStyles.modeButton,
                                                selectedStatus === status && {
                                                    backgroundColor: COLORS.primary,
                                                    borderWidth: 0,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    cutiStyles.modeText,
                                                    selectedStatus === status && { color: COLORS.white },
                                                ]}
                                            >
                                                {status}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
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
                <ListDataCutiComponent data={filteredData} />
            </View>
        </ScrollView>
    )
}

export default CutiPage;