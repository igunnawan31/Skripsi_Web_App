import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import ListDataReimburseComponent from "@/components/rootComponents/reimburseComponent/ListDataReimburseComponent";
import COLORS from "@/constants/colors";
import { dummyReimburse, ReimburseStatus } from "@/data/dummyReimburse";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Text, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FilterModalReimburseComponent from "@/components/rootComponents/reimburseComponent/FilterModalReimburseComponent";

const ReimbursePage = () => {
    const router = useRouter();
    const [data, setData] = useState(dummyReimburse);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");
    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    const handleFilter = () => {
        let filtered = dummyReimburse;

        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            filtered = dummyReimburse.filter((item) => {
                let [day, month, year] = item.submissionDate.split("-").map(Number);
                if (year < 2000) {
                    [year, month, day] = item.submissionDate.split("-").map(Number);
                }
                return month - 1 === selectedMonth && year === selectedYear;
            });
        }

        if (pickerMode === "status" && selectedStatus) {
            filtered = dummyReimburse.filter((item) => item.reimburseStatus === selectedStatus);
        }

        setData(filtered);
        closeHandlePopUpFilter();
    };
    
    const resetFilter = () => {
        setData(dummyReimburse);
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
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={reimburseStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
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
                            Ajukan Reimburse
                        </Text>
                        <Text style={reimburseStyles.subHeaderDescription}>
                            Lihat status reimburse yang kamu buat
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
                    <TouchableOpacity 
                        style={reimburseStyles.ajukanCutiButton}
                        onPress={() => router.push('/(reimburse)/reimburse/create')}
                    >
                        <Image
                            source={require("../../../assets/icons/add.png")}
                            style={reimburseStyles.icons}
                        />
                        <Text style={reimburseStyles.textAjukanCuti}>Ajukan Reimburse</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={reimburseStyles.filterContainer}
                    onPress={showHandlePopUpFilter}
                >
                    <Text style={reimburseStyles.filterText}>Terapkan Filter</Text>
                </TouchableOpacity>
                <ListDataReimburseComponent data={data} />
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

export default ReimbursePage;