import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import COLORS from "@/constants/colors";
import { ReimburseStatus } from "@/data/dummyReimburse";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ApprovalStatus } from "@/types/reimburse/reimburseTypes";

export type FilterModalReimburseComponentProps = {
    visible: boolean;
    onClose: () => void;
    pickerMode: string;
    setPickerMode: (mode: string) => void;
    selectedStatus: string | null;
    setSelectedStatus: (value: string | null) => void;
    startDate: Date | null;
    setStartDate: (date: Date | null) => void;
    showPicker: boolean;
    setShowPicker: (value: boolean) => void;
    pickerTarget: string;
    setPickerTarget: (value: string) => void;
    handleFilter: () => void;
    resetFilter: () => void;
};

const FilterModalReimburseComponent = ({
    visible,
    onClose,
    pickerMode,
    setPickerMode,
    selectedStatus,
    setSelectedStatus,
    startDate,
    setStartDate,
    showPicker,
    setShowPicker,
    pickerTarget,
    setPickerTarget,
    handleFilter,
    resetFilter
}: FilterModalReimburseComponentProps) => {

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            if (pickerTarget === "month") setStartDate(selectedDate);
        }
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            style={reimburseStyles.modalFilterContainer}
        >
            <View style={reimburseStyles.filterModal}>
                <Text style={reimburseStyles.modalTitle}>Pilih Mode Filter</Text>

                <View style={reimburseStyles.modeSelector}>
                    <TouchableOpacity
                        style={[
                            reimburseStyles.modeButton,
                            pickerMode === "month" && { backgroundColor: COLORS.primary },
                        ]}
                        onPress={() => setPickerMode("month")}
                    >
                        <Text
                            style={[
                                reimburseStyles.modeText,
                                pickerMode === "month" && { color: COLORS.white },
                            ]}
                        >
                            Per Bulan
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            reimburseStyles.modeButton,
                            pickerMode === "approvalStatus" && { backgroundColor: COLORS.primary },
                        ]}
                        onPress={() => setPickerMode("approvalStatus")}
                    >
                        <Text
                            style={[
                                reimburseStyles.modeText,
                                pickerMode === "approvalStatus" && { color: COLORS.white },
                            ]}
                        >
                            Berdasarkan Status
                        </Text>
                    </TouchableOpacity>
                </View>

                {pickerMode === "approvalStatus" ? (
                    <View style={reimburseStyles.modalPicker}>
                        <Text style={reimburseStyles.modalLabel}>Pilih Status Reimburse</Text>

                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                            {Object.values(ApprovalStatus).map((approvalStatus) => (
                                <TouchableOpacity
                                    key={approvalStatus}
                                    onPress={() => setSelectedStatus(approvalStatus)}
                                    style={[
                                        reimburseStyles.modeButton,
                                        selectedStatus === approvalStatus && {
                                            backgroundColor: COLORS.primary,
                                            borderWidth: 0,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            reimburseStyles.modeText,
                                            selectedStatus === approvalStatus && { color: COLORS.white },
                                        ]}
                                    >
                                        {approvalStatus}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View style={reimburseStyles.modalPicker}>
                        <Text style={reimburseStyles.modalLabel}>Pilih Bulan</Text>

                        <TouchableOpacity
                            style={reimburseStyles.buttonDate}
                            onPress={() => {
                                setPickerTarget("month");
                                setShowPicker(true);
                            }}
                        >
                            <Text style={reimburseStyles.dateText}>
                                {startDate
                                    ? startDate.toLocaleString("default", {
                                            month: "long",
                                            year: "numeric",
                                        })
                                    : "Pilih Bulan"}
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

                <TouchableOpacity style={reimburseStyles.cancelButton} onPress={resetFilter}>
                    <Text style={reimburseStyles.cancelText}>Hapus Filter</Text>
                </TouchableOpacity>

                <TouchableOpacity style={reimburseStyles.applyButton} onPress={handleFilter}>
                    <Text style={reimburseStyles.applyText}>Terapkan Filter</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default FilterModalReimburseComponent;