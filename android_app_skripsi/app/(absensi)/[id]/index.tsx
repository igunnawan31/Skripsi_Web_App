import absenDetailStyles from "@/assets/styles/rootstyles/absen/absendetail.style";
import AbsenseComponent from "@/components/rootComponents/homeComponent/AbsenseComponent";
import COLORS from "@/constants/colors";
import { dummyAbsensi } from "@/data/dummyAbsensi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

export default function DetailAbsensi() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const data = dummyAbsensi.find((item) => item.id === id);
    const [region, setRegion] = useState<Region | null>(null);
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    
    useEffect(() => {
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

        if (data?.latitude && data?.longitude) {
            setRegion({
                latitude: parseFloat(data?.latitude),
                longitude: parseFloat(data?.longitude),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        }
    }, [data]);

    if (!data) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Data absensi tidak ditemukan.</Text>
            </View>
        );
    };

    const statusLabel =
        data.status === "COMPLETED"
        ? "Sudah Check-In & Check-Out"
        : data.status === "CHECKED_IN"
        ? "Sudah Check-In, Belum Check-Out"
        : "Belum Check-In";

    const isCheckedIn = data.checkIn !== "";
    const isCheckedOut = data.checkOut !== "";

    const isLate = (() => {
        if (!isCheckedIn) return false;
        const [hour, minute] = data.checkIn.split(":").map(Number);
        return hour > 8 || (hour === 8 && minute > 30);
    })();

    const isEarly = (() => {
        if (!isCheckedOut) return false;
        const [hour, minute] = data.checkOut.split(":").map(Number);
        return hour < 16 || (hour === 16 && minute < 0);
    })();

    const checkInBgColor = isLate
        ? COLORS.primary
        : isCheckedIn
        ? COLORS.success
        : COLORS.border;

    const checkOutBgColor = isEarly
        ? COLORS.primary
        : isCheckedOut
        ? COLORS.success
        : COLORS.border;
    
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={absenDetailStyles.header}>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
                >
                    <View style={absenDetailStyles.iconPlace}>
                        <Image
                            style={absenDetailStyles.iconBack}
                            source={require('../../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={absenDetailStyles.headerTitle}>
                        Kembali
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={absenDetailStyles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                <View style={absenDetailStyles.subHeader}>
                    <Image
                        source={require("../../../assets/icons/absence.png")}
                        style={{ width: 64, height: 64 }}
                    />
                    <Text style={absenDetailStyles.subHeaderTitle}>
                        Detail Absensi
                    </Text>
                    <Text style={{ color: COLORS.textMuted }}>{currentDate}</Text>
                    <Text style={[
                        absenDetailStyles.textStatus, 
                        data.status === "COMPLETED" ? { backgroundColor: COLORS.success} :
                        data.status === "CHECKED-IN" ? { backgroundColor: COLORS.tertiaryOpacity20} :
                        {backgroundColor: COLORS.error}, 
                    ]}>{statusLabel}</Text>
                </View>

                <View style={absenDetailStyles.absenseContainer}>
                    <View style={absenDetailStyles.tanggalContainer}>
                        <Text style={{ fontSize: 14, color: COLORS.textPrimary }}>Tanggal</Text>
                        <Text style={absenDetailStyles.tanggalText}>{data.date}</Text>
                    </View>
                    <View style={absenDetailStyles.checkContainer}>
                        <View style={absenDetailStyles.checkInOutContainer}>
                            <View style={[absenDetailStyles.checkInOutSection, {backgroundColor: checkInBgColor}]}>
                                <Image 
                                    style={absenDetailStyles.logoCheck}
                                    source={require("../../../assets/icons/clock-in.png")}
                                />
                                <Text style={absenDetailStyles.titleCheck}>
                                    Check In
                                </Text>
                                <Text style={absenDetailStyles.textCheck}>
                                    {isCheckedIn ? data.checkIn : "Belum"}
                                </Text>
                                {isLate && (
                                    <Text style={{ color: COLORS.white, fontSize: 12 }}>
                                        Terlambat
                                    </Text>
                                )}
                            </View>
                            <View style={[absenDetailStyles.checkInOutSection, {backgroundColor: checkOutBgColor}]}>
                                <Image 
                                    style={absenDetailStyles.logoCheck}
                                    source={require("../../../assets/icons/clock-out.png")}
                                />
                                <Text style={absenDetailStyles.titleCheck}>
                                    Check-Out
                                </Text>
                                <Text style={absenDetailStyles.textCheck}>
                                    {isCheckedOut ? data.checkOut : "Belum"}
                                </Text>
                                {isEarly && (
                                    <Text style={{ color: COLORS.white, fontSize: 12 }}>
                                        Too Early
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {[
                    { title: "Nama", value: data.name },
                    { title: "Role", value: `${data.majorRole} - ${data.minorRole}` },
                    { title: "Status Kerja", value: data.workStatus },
                    { title: "Tanggal", value: data.date },
                    { 
                        title: "Lokasi", 
                        value: data.address || "Alamat belum tersedia",
                        extra: (data.latitude && data.longitude) 
                            ? `${data.latitude}, ${data.longitude}`
                            : "Koordinat belum tersedia"
                    },
                ].map((item, index) => (
                    <View key={index} style={absenDetailStyles.section}>
                        <Text style={absenDetailStyles.sectionTitle}>{item.title}</Text>
                        <Text style={absenDetailStyles.infoText}>{item.value}</Text>
                        {item.title === "Lokasi" && region && (
                            <MapView
                                style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 10 }}
                                region={region}
                                showsUserLocation={true}
                            >
                                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
                                    <Image 
                                        source={require("../../../assets/icons/location.png")}
                                        style={{ width: 32, height: 32, tintColor: COLORS.tertiary }}
                                    />
                                </Marker>
                            </MapView>
                        )}
                        {item.extra && (
                            <Text style={absenDetailStyles.coordText}>{item.extra}</Text>
                        )}
                    </View>
                ))}

                {data.url ? (
                    <View style={absenDetailStyles.section}>
                        <Text style={absenDetailStyles.sectionTitle}>Foto Selfie</Text>
                        <Image
                            source={require('../../../assets/images/foto2.jpeg')}
                            style={{
                                width: "100%",
                                height: 200,
                                borderRadius: 12,
                                marginTop: 10,
                            }}
                        />
                    </View>
                ) : (
                    <View style={absenDetailStyles.section}>
                        <Text style={absenDetailStyles.sectionTitle}>Foto Selfie</Text>
                        <Text style={absenDetailStyles.infoText}>Belum ada foto diambil.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}