import { cutiStyles } from "@/assets/styles/rootstyles/cuti.styles";
import COLORS from "@/constants/colors";
import { CutiStatus, dummyCuti } from "@/data/dummyCuti";
import { useState } from "react";
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import ListDataCutiComponent from "@/components/rootComponents/cutiComponent.tsx/ListDataCutiComponent";

const CutiPage = () => {
    const [data, setData] = useState(dummyCuti);
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");
    const router = useRouter();

    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    const handleFilter = () => {
        let filtered = dummyCuti;

        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            filtered = dummyCuti.filter((item) => {
                let [day, month, year] = item.startDate.split("-").map(Number);
                if (year < 2000) {
                    [year, month, day] = item.startDate.split("-").map(Number);
                }
                return month - 1 === selectedMonth && year === selectedYear;
            });
        }

        if (pickerMode === "status" && selectedStatus) {
            filtered = dummyCuti.filter((item) => item.cutiStatus === selectedStatus);
        }

        setData(filtered);
        closeHandlePopUpFilter();
    };
  
    const resetFilter = () => {
        setData(dummyCuti);
        setStartDate(null);
        setSelectedStatus(null);
        setPickerMode("month");
        closeHandlePopUpFilter();
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            if (pickerTarget === "month") setStartDate(selectedDate);
        }
    };

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
                    <View>
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
                        Bulan {startDate ? startDate.toLocaleString("default", { month: "long", year: "numeric" }): "-"}
                    </Text>
                    <TouchableOpacity 
                        style={cutiStyles.ajukanCutiButton}
                        onPress={() => router.push('/(cuti)/pengajuancuti')}
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
                        <Text style={cutiStyles.titleCutiAvailable}>
                            Cuti Tersedia
                        </Text>
                        <Image 
                            style={cutiStyles.logoCuti}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={cutiStyles.textCutiAvailable}>
                            2 Hari
                        </Text>
                    </View>
                    <View style={cutiStyles.cutiAvailable}>
                        <Text style={cutiStyles.titleCutiAvailable}>
                            Cuti Dipakai
                        </Text>
                        <Image 
                            style={cutiStyles.logoCuti}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={cutiStyles.textCutiAvailable}>
                            0 Hari
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
                    style={cutiStyles.modalFilterContainer}
                >
                    <View style={cutiStyles.FilterModal}>
                        <Text style={cutiStyles.modalTitle}>
                            Pilih Mode Filter
                        </Text>
                        <View style={cutiStyles.modeSelector}>
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
                        {pickerMode === "status" ? (
                            <View style={cutiStyles.modalPicker}>
                                <Text style={cutiStyles.modalLabel}>Pilih Status Cuti</Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                                    {Object.values(CutiStatus).map((status) => (
                                        <TouchableOpacity
                                            key={status}
                                            onPress={() => setSelectedStatus(status)}
                                            style={[
                                                cutiStyles.modeButton,
                                                selectedStatus === status && { backgroundColor: COLORS.primary, borderWidth: 0 },
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
                        ) : (
                            <View style={cutiStyles.modalPicker}>
                                <Text style={cutiStyles.modalLabel}>Pilih Bulan</Text>
                                <TouchableOpacity
                                    style={cutiStyles.buttonDate}
                                    onPress={() => {
                                        setPickerTarget("month");
                                        setShowPicker(true);
                                    }}
                                >
                                    <Text style={cutiStyles.dateText}>
                                        {startDate
                                        ? startDate.toLocaleString("default", { month: "long", year: "numeric" })
                                        : "Pilih bulan"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {showPicker && (
                            <DateTimePicker
                                value={startDate || new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={onChangeDate}
                            />
                        )}

                        <TouchableOpacity style={cutiStyles.cancelButton} onPress={resetFilter}>
                            <Text style={cutiStyles.cancelText}>Hapus Filter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={cutiStyles.applyButton} onPress={handleFilter}>
                            <Text style={cutiStyles.applyText}>Terapkan Filter</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <ListDataCutiComponent data={data} />

            </View>
        </ScrollView>
    )
}

export default CutiPage;