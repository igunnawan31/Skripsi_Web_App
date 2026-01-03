import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAbsen } from "@/context/AbsenContext";
import COLORS from "@/constants/colors";
import absenSummaryStyles from "@/assets/styles/rootstyles/absen/absensummary.style";
import ConfirmationPopUpModal from "@/components/rootComponents/absenComponent/ConfirmationPopUpModal";
import { useAbsensi } from "@/lib/api/hooks/useAbsensi";
import { useAuthStore } from "@/lib/store/authStore";

const SummaryAbsensiPage = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const userId = user?.id ? user.id : null;
    const { location, photoUrl, resetAbsen } = useAbsen();

    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [modalPop, setModalPop] = useState(false);
    
    if (!user?.id) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Memuat data user...</Text>
            </View>
        );
    }

    const dateNow = useMemo(() => {
        const today = new Date().toISOString();
        return today
    }, []);

    const { data, isLoading } = useAbsensi().fetchAbsensiById(userId, dateNow);
    const absensi = data;
    const checkIn = absensi?.checkIn ?? null;
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
            Alert.alert("Error", "Foto selfie diperlukan untuk absensi.");
            return;
        }

        if (mode === "Check-In") {
            if (!location.latitude || !location.longitude) {
                Alert.alert("Error", "Lokasi diperlukan untuk Check-In.");
                return;
            }

            checkInMutate(undefined, {
                onSuccess: () => setModalPop(true),
                onError: (err: any) => Alert.alert("Error", err.message),
            });
        } 
        else {
            checkOutMutate(
                { id: userId },
                {
                    onSuccess: () => setModalPop(true),
                    onError: (err: any) => Alert.alert("Error", err.message),
                }
            );
        }
    };

    const handleBackToHome = () => {
        setModalPop(false);
        resetAbsen();
        router.replace("/(tabs)/home");
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
                            onPress={handleSubmit}
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
                visible={modalPop}
                onBack={handleBackToHome}
            />
        </ScrollView>
    );
};

export default SummaryAbsensiPage;