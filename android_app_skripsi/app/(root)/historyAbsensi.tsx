import { historyStyles } from "@/assets/styles/rootstyles/history.styles";
import COLORS from "@/constants/colors";
import { dummyAbsensi } from "@/data/dummyAbsensi";
import { useState } from "react";
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";

const HistoryAbsensiPage = () => {
    const [data, setData] = useState(dummyAbsensi);
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState<"date" | "month">("date");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<"start" | "end" | "month">("start");

    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    const handleFilter = () => {
        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();
            const filtered = dummyAbsensi.filter((item) => {
                const [day, month, year] = item.date.split("-").map(Number);
                return month - 1 === selectedMonth && year === selectedYear;
            });
            setData(filtered);
        } else if (startDate && endDate) {
            const filtered = dummyAbsensi.filter((item) => {
                const [day, month, year] = item.date.split("-").map(Number);
                const itemDate = new Date(year, month - 1, day);
                return itemDate >= startDate && itemDate <= endDate;
            });
            setData(filtered);
        }
        closeHandlePopUpFilter();
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            if (pickerTarget === "start") setStartDate(selectedDate);
            else if (pickerTarget === "end") setEndDate(selectedDate);
            else if (pickerTarget === "month") setStartDate(selectedDate);
        }
    };
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={historyStyles.container}>
                <View style={historyStyles.header}>
                    <Text style={historyStyles.headerTitle}>
                        History
                    </Text>
                    <Text style={historyStyles.headerDescription}>
                        Ini adalah history absensi yang kamu miliki per bulannya
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
                                    pickerMode === "date" && { backgroundColor: COLORS.primary },
                                ]}
                                onPress={() => setPickerMode("date")}
                            >
                                <Text
                                    style={[
                                        historyStyles.modeText,
                                        pickerMode === "date" && { color: COLORS.white },
                                    ]}
                                >
                                    Rentang Tanggal
                                </Text>
                            </TouchableOpacity>

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

                        {pickerMode === "date" ? (
                            <View style={historyStyles.modalPicker}>
                                <Text style={historyStyles.modalLabel}>Tanggal Mulai</Text>
                                <TouchableOpacity
                                    style={historyStyles.buttonDate}
                                    onPress={() => {
                                        setPickerTarget("start");
                                        setShowPicker(true);
                                    }}
                                >
                                    <Text style={historyStyles.dateText}>
                                        {startDate ? startDate.toDateString() : "Pilih tanggal mulai"}
                                    </Text>
                                    <Image
                                        source={require("../../assets/icons/calendar.png")}
                                        style={historyStyles.iconCalendar}
                                    />
                                </TouchableOpacity>

                                <Text style={historyStyles.modalLabel}>Tanggal Selesai</Text>
                                <TouchableOpacity
                                    style={historyStyles.buttonDate}
                                    onPress={() => {
                                        setPickerTarget("end");
                                        setShowPicker(true);
                                    }}
                                >
                                    <Text style={historyStyles.dateText}>
                                        {endDate ? endDate.toDateString() : "Pilih tanggal selesai"}
                                    </Text>
                                    <Image
                                        source={require("../../assets/icons/calendar.png")}
                                        style={historyStyles.iconCalendar}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
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

                        <TouchableOpacity style={historyStyles.applyButton} onPress={handleFilter}>
                            <Text style={historyStyles.applyText}>Terapkan Filter</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {data.map((item) => (
                    <View
                        key={item.id} 
                        style={historyStyles.listContainer}
                    >
                        <View style={historyStyles.listHeader}>
                            <Text style={historyStyles.name}>{item.name}</Text>
                            <Text style={historyStyles.date}>{item.date}</Text>
                        </View>
                        <View style={historyStyles.roleContainer}>
                            <Text style={historyStyles.roleText}>
                                {item.majorRole} - {item.minorRole}
                            </Text>
                            <View
                                style={[
                                    historyStyles.statusBadge,
                                    { backgroundColor: item.workStatus === "WFO" ? COLORS.success : COLORS.info },
                                ]}
                            >
                                <Text style={historyStyles.statusText}>{item.workStatus}</Text>
                            </View>
                        </View>
                        <View style={historyStyles.timeContainer}>
                            <View style={historyStyles.timeBox}>
                                <Image
                                    source={require("../../assets/icons/clock-in.png")}
                                    style={historyStyles.icon}
                                />
                                <Text style={historyStyles.timeText}>Masuk: {item.checkIn}</Text>
                            </View>
                            <View style={historyStyles.timeBox}>
                                <Image
                                    source={require("../../assets/icons/clock-out.png")}
                                    style={historyStyles.icon}
                                />
                                <Text style={historyStyles.timeText}>Pulang: {item.checkOut}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

export default HistoryAbsensiPage;