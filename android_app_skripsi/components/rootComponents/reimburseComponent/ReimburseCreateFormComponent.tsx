import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { dummyUsers } from "@/data/dummyUser";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Platform, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CutiPopUpModal from "../cutiComponent/CutiPopUpModal";
import { ReimburseStatus } from "@/data/dummyReimburse";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import ReimbursePopUpModal from "./ReimbursePopUpModal";
import { CreateReimburseRequest } from "@/types/reimburse/reimburseTypes";
import { useAuthStore } from "@/lib/store/authStore";
import { useReimburse } from "@/lib/api/hooks/useReimburse";
import NotificationModal from "../NotificationModal";

const ReimburseCreateFormComponent = () => {
    const user = useAuthStore((state) => state.user);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<{ [key: string]: string}>({});
    const today = new Date().toISOString().split("T")[0];
    const { mutate: reimburseMutate, isPending: isCreateReimburse, isError} = useReimburse().createReimburse();
    const [notification, setNotification] = useState<{
        visible: boolean;
        status: "success" | "error";
        title?: string;
        description?: string;
    }>({
        visible: false,
        status: "success",
    });
    
    const [formData, setFormData] = useState<CreateReimburseRequest>({
        title: "",
        totalExpenses: 0,
        reimburseDocuments: [],
    });

    const handleChangeTotal = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, "");
        const numberValue = Number(numericValue) || 0;
        setFormData({ ...formData, totalExpenses: numberValue });
    };

    const handleUploadFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    "image/*",
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ],
                copyToCacheDirectory: true,
                multiple: true,
            });

            if (result.assets && result.assets.length > 0) {
                const files = result.assets.map((file) => ({
                    uri: file.uri,
                    name: file.name ?? file.uri.split("/").pop() ?? "document",
                    type: file.mimeType ?? "application/octet-stream",
                }));

                setFormData((prev) => ({
                    ...prev,
                    reimburseDocuments: [
                        ...(prev.reimburseDocuments ?? []),
                        ...files,
                    ],
                }));
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleDeleteDocument = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            reimburseDocuments: prev.reimburseDocuments?.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) tempErrors.title = "Judul wajib diisi.";
        if (!formData.totalExpenses || formData.totalExpenses <= 0) tempErrors.totalExpenses = "Total Pengeluaran wajib diisi dan harus lebih dari 0.";
        if (!formData.reimburseDocuments || formData.reimburseDocuments?.length === 0) tempErrors.reimburseDocuments = "Minimal 1 bukti pendukung.";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            setShowModal(false);
            return;
        }

        reimburseMutate(formData, {
            onSuccess: () => {
                setShowModal(false);

                setNotification({
                    visible: true,
                    status: "success",
                    title: "Pengajuan Berhasil",
                    description: "Pengajuan reimburse anda berhasil dikirim.",
                });
            },
            onError: (err: any) => {
                setShowModal(false);

                setNotification({
                    visible: true,
                    status: "error",
                    title: "Pengajuan Gagal",
                    description:
                    err?.message || "Terjadi kesalahan saat mengirim pengajuan reimburse.",
                });
            },
        });
    };

    return (
        <View style={[reimburseStyles.createFormContainer, { position: 'relative' }]}>
            {isCreateReimburse && (
                <View 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        borderRadius: 12,
                    }}
                >
                    <View 
                        style={{
                            backgroundColor: COLORS.white,
                            padding: 24,
                            borderRadius: 12,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={{ 
                            marginTop: 12, 
                            fontSize: 16, 
                            fontWeight: '600',
                            color: COLORS.textPrimary 
                        }}>
                            Mengirim Pengajuan...
                        </Text>
                        <Text style={{ 
                            marginTop: 4, 
                            fontSize: 12, 
                            color: COLORS.textMuted 
                        }}>
                            Mohon tunggu sebentar
                        </Text>
                    </View>
                </View>
            )}

            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Nama Lengkap <Text style={reimburseStyles.error}>*</Text></Text>
                <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>{user.name}</Text>
                {error.name && <Text style={reimburseStyles.error}>{error.name}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Tanggal Pengajuan <Text style={reimburseStyles.error}>*</Text></Text>
                <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>{today}</Text>
                {error.submissionDate && <Text style={reimburseStyles.error}>{error.submissionDate}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Judul Pengajuan Reimburse <Text style={reimburseStyles.error}>*</Text></Text>
                <TextInput
                    placeholder="Reimburse Uang Makan" 
                    style={reimburseStyles.input}
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text})}
                    editable={!isCreateReimburse}
                />
                {error.title && <Text style={reimburseStyles.error}>{error.title}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Total Pengeluaran <Text style={reimburseStyles.error}>*</Text></Text>
                <TextInput
                    placeholder="Total Pengeluaran"
                    style={reimburseStyles.input}
                    keyboardType="numeric"
                    value={formData.totalExpenses
                        ? formData.totalExpenses.toLocaleString("id-ID")
                        : ""}
                    onChangeText={handleChangeTotal}
                    editable={!isCreateReimburse}
                />
                {error.totalExpenses && <Text style={reimburseStyles.error}>{error.totalExpenses}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Major Role <Text style={reimburseStyles.error}>*</Text></Text>
                <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>{user.majorRole}</Text>
                {error.majorRole && <Text style={reimburseStyles.error}>{error.majorRole}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Minor Role <Text style={reimburseStyles.error}>*</Text></Text>
                <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>{user.minorRole}</Text>
                {error.minorRole && <Text style={reimburseStyles.error}>{error.minorRole}</Text>}
            </View>
            <View style={reimburseStyles.labelContainer}>
                <Text style={reimburseStyles.labelInput}>Bukti Pendukung <Text style={reimburseStyles.error}>*</Text></Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: isCreateReimburse ? COLORS.muted : COLORS.tertiary,
                        padding: 10,
                        borderRadius: 8,
                        alignItems: "center",
                        opacity: isCreateReimburse ? 0.5 : 1,
                    }}
                    onPress={handleUploadFile}
                    disabled={isCreateReimburse}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Upload File</Text>
                </TouchableOpacity>

                {formData.reimburseDocuments.length > 0 ? (
                    formData.reimburseDocuments.map((file, index) => {
                        const isImage = file.type.startsWith("image");

                        return (
                            <View
                                key={index}
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
                                <View
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 10,
                                        backgroundColor: "#E8EAF6",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: 10,
                                    }}
                                >
                                    <Image
                                        source={
                                            isImage
                                                ? require("../../../assets/icons/changeImage.png")
                                                : require("../../../assets/icons/pdfFile.png")
                                        }
                                        style={{
                                            width: 60,
                                            height: 60,
                                        }}
                                        resizeMode="contain"
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={1} style={{ fontWeight: "600", color: "#333" }}>
                                        {file.name}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#777" }}>
                                        {isImage ? "Gambar" : "Dokumen"}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: isCreateReimburse ? COLORS.muted : COLORS.primary,
                                        borderRadius: 20,
                                        width: 40,
                                        height: 40,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: isCreateReimburse ? 0.5 : 1,
                                    }}
                                    onPress={() => handleDeleteDocument(index)}
                                    disabled={isCreateReimburse}
                                >
                                    <Image
                                        source={require("../../../assets/icons/trash.png")}
                                        style={{
                                            width: 20,
                                            height: 20,
                                            tintColor: COLORS.white,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })
                ) : (
                    <Text style={{ marginTop: 6, fontSize: 13, color: "#888" }}>
                        Belum ada file dipilih
                    </Text>
                )}
                {error.reimburseDocuments && <Text style={reimburseStyles.error}>{error.reimburseDocuments}</Text>}
            </View>
            <TouchableOpacity
                style={[
                    reimburseStyles.submitButton,
                    { 
                        backgroundColor: isCreateReimburse ? COLORS.muted : COLORS.primary,
                        opacity: isCreateReimburse ? 0.5 : 1 
                    }
                ]}
                onPress={() => setShowModal(true)}
                disabled={isCreateReimburse}
            >
                <Text style={reimburseStyles.filterText}>
                    {isCreateReimburse ? "Mengirim..." : "Submit Reimburse"}
                </Text>
            </TouchableOpacity>

            <ReimbursePopUpModal
                visible={showModal && !isCreateReimburse}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
            />

            <NotificationModal
                visible={notification.visible}
                status={notification.status}
                title={notification.title}
                description={notification.description}
                onContinue={() => {
                    setNotification(prev => ({ ...prev, visible: false }));

                    if (notification.status === "success") {
                        router.back();
                    }
                }}
            />
        </View>
    )
}

export default ReimburseCreateFormComponent;