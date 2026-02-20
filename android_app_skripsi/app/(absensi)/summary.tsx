import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAbsen } from "@/context/AbsenContext";
import COLORS from "@/constants/colors";
import absenSummaryStyles from "@/assets/styles/rootstyles/absen/absensummary.style";
import ConfirmationPopUpModal from "@/components/rootComponents/absenComponent/ConfirmationPopUpModal";
import { useAbsensi } from "@/lib/api/hooks/useAbsensi";
import { useAuthStore } from "@/lib/store/authStore";
import NotificationModal from "@/components/rootComponents/NotificationModal";
import { WorkStatus } from "@/types/enumTypes";

const SummaryAbsensiPage = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const userId = user?.id ? user.id : null;
    const { location, photoUrl, resetAbsen } = useAbsen();

    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [modalPop, setModalPop] = useState(false);
    const [workStatus, setWorkStatus] = useState<WorkStatus | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<{
        visible: boolean;
        status: "success" | "error";
        title?: string;
        description?: string;
    }>({
        visible: false,
        status: "success",
    });
    
    if (!user?.id) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Memuat data user...</Text>
            </View>
        );
    }

    const dateNow = useMemo(() => {
        const now = new Date();
        const utcPlus7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        const today = utcPlus7.toISOString();
        console.log(today);
        return today;
    }, []);

    const { data, isLoading } = useAbsensi().fetchAbsensiById(userId, dateNow);
    const absensi = data;
    const mode: "Check-In" | "Check-Out" = absensi?.checkIn ? "Check-Out" : "Check-In";

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const date = now.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const time = now.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            });
            setCurrentDate(date);
            setCurrentTime(time);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const { mutate: checkInMutate, isPending: isUploadingCheckIn, isError, error } = useAbsensi().checkIn();
    const { mutate: checkOutMutate, isPending: isUploadingCheckOut } = useAbsensi().checkOut();

    const handleSubmit = () => {
        if (!photoUrl) {
            setShowModal(false);

            setNotification({
                visible: true,
                status: "error",
                title: "Pengajuan Gagal",
                description: "Foto absensi diperlukan untuk absensi.",
            });
            return;
        }

        if (mode === "Check-In") {
            if (!workStatus) {
                setNotification({
                    visible: true,
                    status: "error",
                    title: "Data Tidak Lengkap",
                    description: "Pilih tipe kehadiran (WFO/WFH/Hybrid).",
                });
                return;
            }

            if (!location.latitude || !location.longitude) {
                setNotification({
                    visible: true,
                    status: "error",
                    title: "Lokasi Tidak Ditemukan",
                    description: "Pastikan GPS aktif.",
                });
                return;
            }

            checkInMutate(workStatus, {
                onSuccess: () => {
                    setShowModal(false);

                    setNotification({
                        visible: true,
                        status: "success",
                        title: "Pengajuan Berhasil",
                        description: "Pengajuan check-in anda berhasil dikirim.",
                    });

                    resetAbsen();
                    router.replace("/(tabs)/home");
                },
                onError: (err: any) => {
                    setShowModal(false);

                    setNotification({
                        visible: true,
                        status: "error",
                        title: "Pengajuan Gagal",
                        description: err?.message || "Terjadi kesalahan saat check-in.",
                    });
                },
            });
        } 
        else {
            checkOutMutate(
                { id: userId },
                {
                    onSuccess: () => {
                        setShowModal(false);

                        setNotification({
                            visible: true,
                            status: "success",
                            title: "Pengajuan Berhasil",
                            description: "Pengajuan check-out anda berhasil dikirim.",
                        });

                        resetAbsen();
                        router.replace("/(tabs)/home");
                    },
                    onError: (err: any) => {
                        setShowModal(false);

                        setNotification({
                            visible: true,
                            status: "error",
                            title: "Pengajuan Gagal",
                            description: err?.message || "Terjadi kesalahan saat check-out.",
                        });
                    },
                }
            );
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={absenSummaryStyles.container}>
                <View style={absenSummaryStyles.header}>
                    <View style={absenSummaryStyles.logoHeaderContainer}>
                        <Image
                            style={absenSummaryStyles.logoHeader}
                            source={require("../../assets/icons/absence.png")}
                        />
                    </View>
                    <View style={absenSummaryStyles.textHeaderContainer}>
                        <Text style={absenSummaryStyles.headerTitle}>
                            Konfirmasi {mode === "Check-In" ? "Check-In" : "Check-Out"}
                        </Text>
                        <Text style={absenSummaryStyles.headerDescription}>
                            Pastikan semua data sudah benar sebelum dikirim.
                        </Text>
                    </View>
                </View>

                <View style={absenSummaryStyles.section}>
                    <Text style={absenSummaryStyles.sectionTitle}>Tipe Kehadiran</Text>
                    <View style={absenSummaryStyles.radioGroup}>
                        {Object.values(WorkStatus).map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    absenSummaryStyles.radioButton,
                                    workStatus === option && absenSummaryStyles.radioButtonSelected
                                ]}
                                onPress={() => setWorkStatus(option as any)}
                            >
                                <View style={[
                                    absenSummaryStyles.radioCircle,
                                    workStatus === option && absenSummaryStyles.radioCircleSelected
                                ]} />
                                <Text style={[
                                    absenSummaryStyles.radioText,
                                    workStatus === option && absenSummaryStyles.radioTextSelected
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={{ paddingHorizontal: 20, width: "100%"}}>
                    {mode === "Check-In" && (
                        <View style={absenSummaryStyles.section}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 5 }}>
                                <Image
                                    style={[absenSummaryStyles.logoHeader, { height: 16, width: 16, tintColor: COLORS.primary }]}
                                    source={require("../../assets/icons/location.png")}
                                />
                                <Text style={absenSummaryStyles.sectionTitle}>Lokasi Anda</Text>
                            </View>
                            <Text style={absenSummaryStyles.infoText}>
                                {location.address || "Alamat tidak ditemukan"}
                            </Text>
                            <Text style={absenSummaryStyles.coordText}>
                                {location.latitude && location.longitude
                                    ? `${location.latitude}, ${location.longitude}`
                                    : "Koordinat belum tersedia"}
                            </Text>
                        </View>  
                    )}

                    <View style={absenSummaryStyles.section}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 5 }}>
                            <Image
                                style={[absenSummaryStyles.logoHeader, { height: 16, width: 16, tintColor: COLORS.primary }]}
                                source={require("../../assets/icons/camera.png")}
                            />
                            <Text style={absenSummaryStyles.sectionTitle}>Foto Selfie</Text>
                        </View>
                        {photoUrl ? (
                            <Image source={{ uri: photoUrl }} style={absenSummaryStyles.photo} />
                        ) : (
                            <Text style={absenSummaryStyles.infoText}>Belum ada foto diambil.</Text>
                        )}
                    </View>
                    
                    <View style={absenSummaryStyles.section}>
                        <Text style={absenSummaryStyles.sectionTitle}>{mode === "Check-In" ? "Check-In Time" : "Check-Out Time"}</Text>
                        <Text style={absenSummaryStyles.infoText}>
                            {currentTime}
                        </Text>
                    </View>

                    <View style={absenSummaryStyles.actions}>
                        <TouchableOpacity
                            style={[absenSummaryStyles.button, { backgroundColor: COLORS.secondary || "#aaa" }]}
                            onPress={() => router.back()}
                        >
                            <Text style={absenSummaryStyles.buttonText}>Kembali</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[absenSummaryStyles.button, { backgroundColor: COLORS.tertiary || "#00AEEF" }]}
                            onPress={() => setShowModal(true)}
                            disabled={isUploadingCheckIn}
                        >
                            <Text style={absenSummaryStyles.buttonText}>
                                {isUploadingCheckIn || isUploadingCheckOut ? "Mengirim..." : `Kirim ${mode}`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ConfirmationPopUpModal 
                visible={showModal}
                onBack={() => setShowModal(false)}
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
        </ScrollView>
    );
};

export default SummaryAbsensiPage;