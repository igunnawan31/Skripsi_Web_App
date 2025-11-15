import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { dummyUsers } from "@/data/dummyUsers";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CutiPopUpModal from "../cutiComponent/CutiPopUpModal";
import { ReimburseStatus } from "@/data/dummyReimburse";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import ReimbursePopUpModal from "./ReimbursePopUpModal";

type ReimburseForm = {
    name: string;
    submissionDate: string;
    totalPengeluaran: number;
    majorRole: string;
    minorRole: string;
    buktiPendukung: string;
    fileType?: string;
};

const ReimburseCreateFormComponent = () => {
    const [data, setData] = useState(dummyUsers);
    const [showModal, setShowModal] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [error, setError] = useState<{ [key: string]: string}>({});
    const dataDummy = data[0];
    const today = new Date().toISOString().split("T")[0];
    
    const MaxCutiDay = 2;
    const [errorMsg, setErrorMsg] = useState("");
    
    const [formData, setFormData] = useState<ReimburseForm>({
        name: dataDummy.dataPersonal[0].value,
        submissionDate: today,
        totalPengeluaran: 0,
        majorRole: dataDummy.majorRole,
        minorRole: dataDummy.minorRole,
        buktiPendukung: "",
        fileType: "",
    });

    const handleChangeTotal = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, "");
        const numberValue = Number(numericValue) || 0;
        setFormData({ ...formData, totalPengeluaran: numberValue });
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

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) tempErrors.name = "Nama wajib diisi.";
        if (!formData.submissionDate) tempErrors.startDate = "Tanggal Pengajuan wajib diisi.";
        if (!formData.totalPengeluaran) tempErrors.endDate = "Total Pengeluaran wajib diisi.";
        if (!formData.majorRole.trim()) tempErrors.majorRole = "Major role wajib diisi.";
        if (!formData.minorRole.trim()) tempErrors.minorRole = "Minor role wajib diisi.";
        if (!formData.buktiPendukung.trim()) tempErrors.reason = "Bukti Pendukung wajib diisi.";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        const isValid = validateForm();
        if (!isValid) {
            console.log("Form invalid:", error);
            return;
        }
        setShowModal(false);
        router.push("/(tabs)/cuti");
    };

    return (
        <View style={reimburseStyles.createFormContainer}>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Nama Lengkap <Text style={reimburseStyles.error}>*</Text></Text>
                <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>{dataDummy.dataPersonal[0].value}</Text>
                {error.name && <Text style={reimburseStyles.error}>{error.name}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Tanggal Pengajuan <Text style={reimburseStyles.error}>*</Text></Text>
                <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>{today}</Text>
                {error.submissionDate && <Text style={reimburseStyles.error}>{error.submissionDate}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Total Pengeluaran <Text style={reimburseStyles.error}>*</Text></Text>
                <TextInput
                    placeholder="Total Pengeluaran"
                    style={reimburseStyles.input}
                    keyboardType="numeric"
                    value={
                        formData.totalPengeluaran
                            ? formData.totalPengeluaran.toLocaleString("id-ID")
                            : ""
                    }
                    onChangeText={handleChangeTotal}
                />
                {error.reason && <Text style={reimburseStyles.error}
                >{error.reason}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Major Role <Text style={reimburseStyles.error}>*</Text></Text>
                <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>{dataDummy.majorRole}</Text>
                {error.majorRole && <Text style={reimburseStyles.error}>{error.majorRole}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Minor Role <Text style={reimburseStyles.error}>*</Text></Text>
                <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>{dataDummy.minorRole}</Text>
                {error.minorRole && <Text style={reimburseStyles.error}>{error.minorRole}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Bukti Pendukung <Text style={reimburseStyles.error}>*</Text></Text>
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
                        style={reimburseStyles.buktiPendukungContainer}
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
                        Belum ada file yang dipilih
                    </Text>
                )}
            </View>
            <TouchableOpacity
                style={reimburseStyles.submitButton}
                onPress={() => setShowModal(true)}
            >
                <Text style={reimburseStyles.filterText}>Submit Reimburse</Text>
            </TouchableOpacity>

            <ReimbursePopUpModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
            />
        </View>
    )
}

export default ReimburseCreateFormComponent;