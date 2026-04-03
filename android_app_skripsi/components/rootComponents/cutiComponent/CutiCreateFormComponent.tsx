import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Image, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CutiPopUpModal from "./CutiPopUpModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuthStore } from "@/lib/store/authStore";
import { CreateCutiRequest } from "@/types/cuti/cutiTypes";
import { useCuti } from "@/lib/api/hooks/useCuti";
import NotificationModal from "../NotificationModal";
import { useKontrak } from "@/lib/api/hooks/useKontrak";
import { KontrakKerjaStatus } from "@/types/enumTypes";

type Props = {
    kontrakData: any;
};

const CutiCreateFormComponent = ({ kontrakData }: Props) => {
    const user = useAuthStore((state) => state.user);
    const [showModal, setShowModal] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [error, setError] = useState<{ [key: string]: string}>({});
    const { mutate: cutiMutate, isPending: isCreateCuti, isError} = useCuti().createCuti();
    const [notification, setNotification] = useState<{
        visible: boolean;
        status: "success" | "error";
        title?: string;
        description?: string;
    }>({
        visible: false,
        status: "success",
    });

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Data tidak ditemukan...</Text>
            </View>
        )
    }

    const MaxCutiDay = useMemo(() => {
        if (!Array.isArray(kontrakData)) return 0;

        const activeKontrak = kontrakData.filter(
            (k: any) => k.status === KontrakKerjaStatus.ACTIVE
        );

        if (activeKontrak.length === 0) return 0;

        return Math.max(
            ...activeKontrak.map((k: any) => k.cutiBulanan ?? 0)
        );
    }, [kontrakData]);

    const [formData, setFormData] = useState<CreateCutiRequest>({
        userId: user.id,
        startDate: "",
        endDate: "",
        reason: "",
        dokumenCuti: null,
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
                    updated.endDate = "";
                } else if (diffDays > MaxCutiDay) {
                    setError((prev) => ({
                        ...prev,
                        endDate: `Jatah cuti maksimal hanya ${MaxCutiDay} hari.`,
                    }));
                    updated.endDate = "";
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

                const fileObj = {
                    uri: file.uri,
                    name: file.name ?? file.uri.split("/").pop() ?? "document",
                    type: file.mimeType ?? "application/pdf",
                } as any;

                setFormData(prev => ({
                    ...prev,
                    dokumenCuti: fileObj,
                }));
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

    const handleDeleteDocument = () => {
        setFormData(prev => ({...prev, dokumenCuti: null}));
    }

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!formData.startDate) tempErrors.startDate = "Tanggal mulai wajib diisi.";
        if (!formData.endDate) tempErrors.endDate = "Tanggal berakhir wajib diisi.";
        if (!formData.reason.trim()) tempErrors.reason = "Alasan cuti wajib diisi.";

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            setShowModal(false);
        }

        cutiMutate(formData, {
            onSuccess: () => {
                setShowModal(false);

                setNotification({
                    visible: true,
                    status: "success",
                    title: "Pengajuan Berhasil",
                    description: "Pengajuan cuti anda berhasil dikirim.",
                });
            },
            onError: (err: any) => {
                setShowModal(false);

                setNotification({
                    visible: true,
                    status: "error",
                    title: "Pengajuan Gagal",
                    description: err?.message || "Terjadi kesalahan saat mengirim pengajuan cuti.",
                });
            },
        });
    };

    const getMaxEndDate = () => {
        if (!formData.startDate) return undefined;
        const start = new Date(formData.startDate);
        start.setDate(start.getDate() + MaxCutiDay - 1);
        return start;
    };

    return (
        <View style={cutiDetailStyles.createFormContainer}>
            {isCreateCuti && (
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

            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Nama Lengkap <Text style={cutiDetailStyles.error}>*</Text></Text>
                <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{user.name ? user.name : "-"}</Text>
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
                    editable={!isCreateCuti}
                />
                {error.reason && <Text style={cutiDetailStyles.error}>{error.reason}</Text>}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Major Role <Text style={cutiDetailStyles.error}>*</Text></Text>
                <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{user.majorRole ? user.majorRole : "-"}</Text>
                {error.majorRole && <Text style={cutiDetailStyles.error}>{error.majorRole}</Text>}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Minor Role <Text style={cutiDetailStyles.error}>*</Text></Text>
                <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{user.minorRole ? user.minorRole : "-"}</Text>
                {error.minorRole && <Text style={cutiDetailStyles.error}>{error.minorRole}</Text>}
            </View>
            <View style={cutiDetailStyles.labelContainer}>
                <Text style={cutiDetailStyles.labelInput}>Bukti Pendukung (PDF)</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: isCreateCuti ? COLORS.muted : COLORS.tertiary,
                        padding: 10,
                        borderRadius: 8,
                        alignItems: "center",
                        opacity: isCreateCuti ? 0.5 : 1,
                    }}
                    onPress={handleUploadFile}
                    disabled={isCreateCuti}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>{formData.dokumenCuti ? "Change File" : "Upload File"}</Text>
                </TouchableOpacity>

                {formData.dokumenCuti ? (
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
                            {formData.dokumenCuti.type === "image/" ? (
                                <Image
                                    source={require("../../../assets/icons/changeImage.png")}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 10,
                                    }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Image
                                    source={require("../../../assets/icons/pdfFile.png")}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 10,
                                    }}
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} style={{ fontWeight: "600", color: "#333" }}>
                                {formData.dokumenCuti.name}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#777" }}>
                                {formData.dokumenCuti.type}
                            </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                            <TouchableOpacity 
                                style={{                                         
                                    backgroundColor: isCreateCuti ? COLORS.muted : COLORS.primary,
                                    borderRadius: 20,
                                    width: 40,
                                    height: 40,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    opacity: isCreateCuti ? 0.5 : 1,
                                }}
                                onPress={handleDeleteDocument}
                                disabled={isCreateCuti}
                            >    
                                <Image
                                    source={require("../../../assets/icons/trash.png")}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        padding: 10,
                                        tintColor: COLORS.white
                                    }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <Text style={{ marginTop: 6, fontSize: 13, color: "#888" }}>
                        Belum ada file dipilih
                    </Text>
                )}
            </View>
            <TouchableOpacity
                style={[
                    cutiDetailStyles.filterContainer,
                    { 
                        borderRadius: 5,
                        backgroundColor: isCreateCuti ? COLORS.muted : COLORS.primary,
                        opacity: isCreateCuti ? 0.5 : 1 
                    }
                ]}
                onPress={() => setShowModal(true)}
                disabled={isCreateCuti}
            >
                <Text style={cutiDetailStyles.filterText}>
                    {isCreateCuti ? "Mengirim..." : "Submit Cuti"}
                </Text>
            </TouchableOpacity>

            <CutiPopUpModal
                visible={showModal && !isCreateCuti}
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

export default CutiCreateFormComponent;