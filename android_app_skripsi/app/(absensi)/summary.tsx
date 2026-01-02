import React, { useEffect, useState } from "react";
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
    const { location, photoUrl, resetAbsen } = useAbsen();
    const [mode, setMode] = useState<"Check-In" | "Check-Out">("Check-In");
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [modalPop, setModalPop] = useState(false);

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

    const { mutate: checkInMutate, isPending: isUploading, isError, error } = useAbsensi().checkIn(user.id);

    const handleSubmit = () => {
        if (!location.latitude || !photoUrl) {
            Alert.alert("Error", "Lokasi dan foto diperlukan untuk absensi.");
            return;
        }

        checkInMutate(undefined, {
            onSuccess: () => {
                setModalPop(true);
            },
            onError: (err: any) => {
                Alert.alert("Error", err.message || "Gagal mengirim absensi.");
            },
        });
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
                    <View>
                        <Text style={absenSummaryStyles.headerTitle}>
                            Konfirmasi Absen
                        </Text>
                        <Text style={absenSummaryStyles.headerDescription}>
                            Pastikan semua data sudah benar sebelum
                        </Text>
                        <Text style={absenSummaryStyles.headerDescription}>
                            dikirim.
                        </Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 20, }}>
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
                        <Text style={absenSummaryStyles.sectionTitle}>{mode}</Text>
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
                            disabled={isUploading}  // Disable button while uploading
                        >
                            <Text style={absenSummaryStyles.buttonText}>
                                {isUploading ? "Mengirim..." : "Kirim Absensi"}
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