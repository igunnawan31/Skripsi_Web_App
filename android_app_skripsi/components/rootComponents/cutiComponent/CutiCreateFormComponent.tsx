import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { dummyUsers } from "@/data/dummyUser";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CutiPopUpModal from "./CutiPopUpModal";
import DateTimePicker from "@react-native-community/datetimepicker";

type CutiForm = {
    name: string;
    startDate: string;
    endDate: string;
    submissionDate: string;
    totalDays: number;
    reason: string;
    majorRole: string;
    minorRole: string;
    buktiPendukung: string;
    fileType?: string;
};

const CutiCreateFormComponent = () => {
    const [data, setData] = useState(dummyUsers);
    const [showModal, setShowModal] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [error, setError] = useState<{ [key: string]: string}>({});
    const dataDummy = data[0];
    const today = new Date().toISOString().split("T")[0];
    
    const MaxCutiDay = 2;
    const [errorMsg, setErrorMsg] = useState("");
    
    const [formData, setFormData] = useState<CutiForm>({
        name: dataDummy.dataPersonal[0].value,
        startDate: "",
        endDate: "",
        submissionDate: today,
        totalDays: 0,
        reason: "",
        majorRole: dataDummy.majorRole,
        minorRole: dataDummy.minorRole,
        buktiPendukung: "",
        fileType: "",
    });

    const handleDateChange = (key: "startDate" | "endDate", value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [key]: value };
            setError((prevErrors) => ({ ...prevErrors, [key]: "" }));

            if (updated.startDate && updated.endDate) {
                const start = new Date(updated.startDate);
                const end = new Date(updated.endDate);
                const diffTime = end.getTime() - start.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                if (end < start) {
                    setError((prev) => ({
                        ...prev,
                        endDate: "Tanggal berakhir tidak boleh sebelum tanggal mulai.",
                    }));
                    updated.totalDays = 0;
                    updated.endDate = "";
                } else if (diffDays > MaxCutiDay) {
                    setError((prev) => ({
                        ...prev,
                        endDate: `Jatah cuti maksimal hanya ${MaxCutiDay} hari.`,
                    }));
                    updated.totalDays = MaxCutiDay;
                    updated.endDate = "";
                } else {
                    updated.totalDays = diffDays;
                }
            }
            return updated;
        });
    };

    const handleUploadFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["image/*", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                const fileType = file.mimeType?.includes("image") ? "image" : "document";

                setFormData({
                    ...formData,
                    buktiPendukung: file.uri,
                    fileType: fileType,
                });
                console.log("File uploaded:", file);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleChange = (event: any, selectedDate: Date | undefined, key: "startDate" | "endDate") => {
        if (Platform.OS === "android") {
            key === "startDate" ? setShowStartPicker(false) : setShowEndPicker(false);
        }

        if (selectedDate) {
            const formatted = selectedDate.toISOString().split("T")[0];
            handleDateChange(key, formatted);
        }
    };

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) tempErrors.name = "Nama wajib diisi.";
        if (!formData.startDate) tempErrors.startDate = "Tanggal mulai wajib diisi.";
        if (!formData.endDate) tempErrors.endDate = "Tanggal berakhir wajib diisi.";
        if (!formData.reason.trim()) tempErrors.reason = "Alasan cuti wajib diisi.";
        if (!formData.majorRole.trim()) tempErrors.majorRole = "Major role wajib diisi.";
        if (!formData.minorRole.trim()) tempErrors.minorRole = "Minor role wajib diisi.";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        const isValid = validateForm();
        if (!isValid) {
            console.log("Form invalid:", error);
            return;
        }
        console.log("Data Pengajuan:", formData);
        setShowModal(false);
        router.push("/(tabs)/cuti");
    };

    const getMaxEndDate = () => {
        if (!formData.startDate) return undefined;
        const start = new Date(formData.startDate);
        start.setDate(start.getDate() + MaxCutiDay - 1);
        return start;
    };

    return (
        <View style={cutiDetailStyles.createFormContainer}>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Nama Lengkap <Text style={cutiDetailStyles.error}>*</Text></Text>
                <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{dataDummy.dataPersonal[0].value}</Text>
                {error.name && <Text style={cutiDetailStyles.error}>{error.name}</Text>}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Tanggal Mulai Cuti <Text style={cutiDetailStyles.error}>*</Text></Text>
                <TouchableOpacity
                    onPress={() => setShowStartPicker(true)}
                    style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                >
                    <Text style={{ color: formData.startDate ? COLORS.textPrimary : COLORS.muted }}>
                        {formData.startDate || "Pilih tanggal mulai"}
                    </Text>
                </TouchableOpacity>
                {error.startDate && <Text style={cutiDetailStyles.error}>{error.startDate}</Text>}

                {showStartPicker && (
                    <DateTimePicker
                        value={formData.startDate ? new Date(formData.startDate) : new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(e, date) => handleChange(e, date, "startDate")}
                        minimumDate={new Date()}
                    />
                )}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Tanggal Berakhir Cuti <Text style={cutiDetailStyles.error}>*</Text></Text>
                <TouchableOpacity
                    onPress={() => formData.startDate && setShowEndPicker(true)}
                    disabled={!formData.startDate}
                    style={[
                        cutiDetailStyles.input,
                        {
                            justifyContent: "center",
                            paddingVertical: 12,
                            opacity: formData.startDate ? 1 : 0.5,
                        },
                    ]}
                >
                    <Text style={{ color: formData.endDate ? "#000" : "#888" }}>
                        {formData.endDate || (formData.startDate ? "Pilih tanggal selesai" : "Pilih tanggal mulai dulu")}
                    </Text>
                </TouchableOpacity>
                {error.endDate && <Text style={cutiDetailStyles.error}>{error.endDate}</Text>}

                {showEndPicker && (
                    <DateTimePicker
                        value={formData.endDate ? new Date(formData.endDate) : new Date(formData.startDate)}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        minimumDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                        maximumDate={getMaxEndDate()}
                        onChange={(e, date) => handleChange(e, date, "endDate")}
                    />
                )}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Alasan Cuti <Text style={cutiDetailStyles.error}>*</Text></Text>
                <TextInput
                    placeholder="Alasan Cuti"
                    style={[cutiDetailStyles.input, { height: 100, textAlignVertical: "top" }]}
                    multiline
                    value={formData.reason}
                    onChangeText={(text) => setFormData({ ...formData, reason: text })}
                />
                {error.reason && <Text style={cutiDetailStyles.error}
                >{error.reason}</Text>}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Major Role <Text style={cutiDetailStyles.error}>*</Text></Text>
                <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{dataDummy.majorRole}</Text>
                {error.majorRole && <Text style={cutiDetailStyles.error}>{error.majorRole}</Text>}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Minor Role <Text style={cutiDetailStyles.error}>*</Text></Text>
                <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{dataDummy.minorRole}</Text>
                {error.minorRole && <Text style={cutiDetailStyles.error}>{error.minorRole}</Text>}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Bukti Pendukung</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: COLORS.tertiary,
                        padding: 10,
                        borderRadius: 8,
                        alignItems: "center",
                    }}
                    onPress={handleUploadFile}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Upload File</Text>
                </TouchableOpacity>

                {formData.buktiPendukung ? (
                    <View
                        style={{
                            marginTop: 10,
                            backgroundColor: COLORS.white,
                            borderRadius: 12,
                            padding: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowOffset: { width: 0, height: 4 },
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        {formData.fileType === "image" ? (
                            <Image
                                source={{ uri: formData.buktiPendukung }}
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 10,
                                    marginRight: 10,
                                }}
                                resizeMode="cover"
                            />
                        ) : (
                            <View
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 10,
                                    backgroundColor: "#E8EAF6",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 10,
                                }}
                            >
                                {/* <Filt color={COLORS.primary} size={32} /> */}
                            </View>
                        )}
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} style={{ fontWeight: "600", color: "#333" }}>
                                {formData.buktiPendukung.split("/").pop()}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#777" }}>
                                {formData.fileType === "image" ? "Gambar" : "Dokumen"}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <Text style={{ marginTop: 6, fontSize: 13, color: "#888" }}>
                        Belum ada file dipilih
                    </Text>
                )}
            </View>
            <TouchableOpacity
                style={cutiDetailStyles.filterContainer}
                onPress={() => setShowModal(true)}
            >
                <Text style={cutiDetailStyles.filterText}>Submit Cuti</Text>
            </TouchableOpacity>

            <CutiPopUpModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
            />
        </View>
    )
}

export default CutiCreateFormComponent;