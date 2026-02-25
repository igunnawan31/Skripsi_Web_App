import absenDetailStyles from "@/assets/styles/rootstyles/absen/absendetail.style";
import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import { gajiDetailStyles, HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import AbsenseComponent from "@/components/rootComponents/homeComponent/AbsenseComponent";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import COLORS from "@/constants/colors";
import { dummyAbsensi } from "@/data/dummyAbsensi";
import { useAbsensi } from "@/lib/api/hooks/useAbsensi";
import { useAuthStore } from "@/lib/store/authStore";
import { fetchImageWithAuth } from "@/lib/utils/path";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

export default function DetailAbsensi() {
    const user = useAuthStore((state) => state?.user);
    const router = useRouter();
    const { id, date } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const dateParam = Array.isArray(date) ? date[0] : date ?? "";
    const [region, setRegion] = useState<Region | null>(null);
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [photoUri, setPhotoUri] = useState<string[] | null>(null);

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { data: detailData, isLoading: isDetailLoading, error: detailError, refetch, isFetching } = useAbsensi().fetchAbsensiById(idParam, dateParam);
   
    const loadPhoto = async (path: string, index: number) => {
        if (!path) return;
        try {
            const blob = await fetchImageWithAuth(path);
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoUri(prev => {
                    const arr = prev ? [...prev] : [];
                    arr[index] = reader.result as string;
                    return arr;
                });
            };
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("Load photo error:", err);
            setPhotoUri(null);
        }
    };

    useEffect(() => {
        if (!detailData?.photo || !Array.isArray(detailData.photo)) return;

        if (detailData.photo[0]?.path) {
            loadPhoto(detailData.photo[0].path, 0);
        }

        if (detailData.checkOut && detailData.photo[1]?.path) {
            loadPhoto(detailData.photo[1].path, 1);
        }
    }, [detailData]);

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

        if (detailData?.latitude && detailData?.longitude) {
            setRegion({
                latitude: parseFloat(detailData?.latitude),
                longitude: parseFloat(detailData?.longitude),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        }
    }, [detailData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Data tidak ditemukan...</Text>
            </View>
        )
    }

    const toWIB = (dateString: string) => {
        const zoned = toZonedTime(dateString, "Asia/Jakarta");
        return format(zoned, "HH:mm");
    }

    const toDate = (isoString: string) => {
        if (!isoString) return "-";

        const date = new Date(isoString);
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        await refetch();

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };

    const getCheckInStatus = (checkIn?: string) => {
        if (!checkIn) return "-";
        
        const checkInWIB = toZonedTime(checkIn, "Asia/Jakarta");
        const limit = new Date(checkInWIB);
        limit.setHours(8, 30, 0, 0);

        return checkInWIB > limit ? "Terlambat" : "Tepat Waktu";
    };
    
    const getCheckOutStatus = (checkOut?: string) => {
        if (!checkOut) return "-";

        const checkOutWIB = toZonedTime(checkOut, "Asia/Jakarta");
        const limit = new Date(checkOutWIB);
        limit.setHours(16, 0, 0, 0);
        return checkOutWIB < limit ? "Terlalu Cepat" : "Tepat Waktu";
    }

    const checkIn = detailData?.checkIn ?? null;
    const checkOut = detailData?.checkOut ?? null;
    const isAlreadyAbsent = Boolean(checkIn) && Boolean(checkOut);
    const isLate = checkIn ? getCheckInStatus(checkIn) === "Terlambat" : false;
    const isEarly = checkOut ? getCheckOutStatus(checkOut) === "Terlalu Cepat" : false;

    const statusLabel =
        isAlreadyAbsent
        ? "Sudah Check-In & Check-Out"
        : checkIn
        ? "Sudah Check-In, Belum Check-Out"
        : "Belum Check-In";

    const isCheckedIn = detailData?.checkIn !== "";
    const isCheckedOut = detailData?.checkOut !== "";

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
    
    if (isDetailLoading || showSkeleton) {
        return (
            <View style={gajiDetailStyles.container}>
                <View style={gajiDetailStyles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBox width={40} height={40} borderRadius={20} />
                        <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
                    </View>
                </View>

                <View style={gajiDetailStyles.subHeaderDetail}>
                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                        <SkeletonBox width={70} height={70} borderRadius={40} />
                        <SkeletonBox width={100} height={18}/>
                        <SkeletonBox width={170} height={10}/>
                        <SkeletonBox width={150} height={30}/>
                    </View>
                </View>

                <View style={cutiDetailStyles.dataContainer}>
                    <SkeletonBox width={200} height={20} style={{ width: "100%" }}/>
                    <View style={[cutiStyles.cutiAvailableContainer, {paddingHorizontal: 0}]}>
                        <SkeletonBox width={120} height={100} style={{ width: "48%" }} />
                        <SkeletonBox width={120} height={100} style={{ width: "48%" }} />
                    </View>
                </View>

                <View style={{ width: "90%", paddingVertical: 16, gap:12 }}>
                    {[1, 2, 3, 4].map((_, i) => (
                        <View
                            key={i}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "transparent",
                            }}
                        >
                            <SkeletonBox width={200} height={64} style={{ width: "100%" }}/>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    if (!detailData) {
        const renderNoData = (
            <ScrollView
                contentContainerStyle={[gajiDetailStyles.container, { justifyContent: "center", alignItems: "center", paddingTop: 0, paddingBottom: 0}]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={gajiDetailStyles.header}>
                    <TouchableOpacity 
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => router.back()}
                    >
                        <View style={gajiDetailStyles.iconPlace}>
                            <Image
                                style={gajiDetailStyles.iconBack}
                                source={require('../../../assets/icons/arrow-left.png')}
                            />
                        </View>
                        <Text style={gajiDetailStyles.headerTitle}>
                            Kembali
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                    <Image
                        source={require("../../../assets/icons/not-found.png")}
                        style={{ width: 72, height: 72, }}
                    />
                    <Text style={{ textAlign: "center", marginTop: 10, color: COLORS.textPrimary, fontWeight: "bold", fontSize: 16, }}>
                        Tidak ditemukan data yang sesuai
                    </Text>
                    <Text style={{ textAlign: "center", marginTop: 5, color: COLORS.muted, fontSize: 12, }}>
                        Mohon untuk mengecek kembali nanti
                    </Text>
                </View> 
            </ScrollView>
        );

        return renderNoData;
    }

    if (detailError) {
        const renderError = (
            <ScrollView
                contentContainerStyle={[gajiDetailStyles.container, { justifyContent: "center", alignItems: "center", paddingTop: 0, paddingBottom: 0}]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={gajiDetailStyles.header}>
                    <TouchableOpacity 
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => router.back()}
                    >
                        <View style={gajiDetailStyles.iconPlace}>
                            <Image
                                style={gajiDetailStyles.iconBack}
                                source={require('../../../assets/icons/arrow-left.png')}
                            />
                        </View>
                        <Text style={gajiDetailStyles.headerTitle}>
                            Kembali
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                    <Image
                        source={require("../../../assets/icons/error-logo.png")}
                        style={{ width: 72, height: 72, }}
                    />
                    <Text style={{ textAlign: "center", marginTop: 10, color: COLORS.textPrimary, fontWeight: "bold", fontSize: 16, }}>
                        Terdapat kendala pada sistem
                    </Text>
                    <Text style={{ textAlign: "center", marginTop: 5, color: COLORS.muted, fontSize: 12, }}>
                        Mohon untuk mengecek kembali nanti
                    </Text>
                </View> 
            </ScrollView>
        );

        return renderError;
    }
    
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                        progressViewOffset={HEADER_HEIGHT}
                    />
                }
            >
                <View style={absenDetailStyles.subHeader}>
                    <Image
                        source={require("../../../assets/icons/absence.png")}
                        style={{ width: 64, height: 64 }}
                    />
                    <Text style={absenDetailStyles.subHeaderTitle}>
                        Detail Absensi
                    </Text>
                    <Text style={{ color: COLORS.textMuted }}>{toDate(detailData.date)}</Text>
                    <Text style={[
                        absenDetailStyles.textStatus, 
                        isAlreadyAbsent ? { backgroundColor: COLORS.success} :
                        checkIn ? { backgroundColor: COLORS.tertiary} :
                        {backgroundColor: COLORS.error}, 
                    ]}>{statusLabel}</Text>
                </View>

                <View style={absenDetailStyles.absenseContainer}>
                    <View style={absenDetailStyles.tanggalContainer}>
                        <Text style={{ fontSize: 14, color: COLORS.textPrimary }}>Tanggal</Text>
                        <Text style={absenDetailStyles.tanggalText}>{toDate(detailData.date)}</Text>
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
                                    {detailData.checkIn ? toWIB(detailData.checkIn) : "Belum"}
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
                                    {detailData.checkOut ? toWIB(detailData.checkOut) : "Belum"}
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
                    { title: "Nama", value: user.name},
                    { title: "Role", value: `${user.majorRole} - ${user.minorRole}` },
                    { title: "Status Kerja", value: detailData.workStatus },
                    { title: "Tanggal", value: toDate(detailData.date) },
                    { 
                        title: "Lokasi", 
                        value: detailData.address || "Alamat belum tersedia",
                        extra: (detailData.latitude && detailData.longitude) 
                            ? `${detailData.latitude}, ${detailData.longitude}`
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

                <View style={absenDetailStyles.section}>
                    <Text style={absenDetailStyles.sectionTitle}>Foto Selfie Check-In</Text>
                    {photoUri?.[0] ? (
                        <Image
                            source={{ uri: photoUri[0] }}
                            style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 10 }}
                        />
                    ) : (
                        <Text style={absenDetailStyles.infoText}>Belum ada foto diambil.</Text>
                    )}
                    </View>

                    <View style={absenDetailStyles.section}>
                    <Text style={absenDetailStyles.sectionTitle}>Foto Selfie Check-Out</Text>
                    {!detailData.checkOut ? (
                        <Text style={absenDetailStyles.infoText}>Belum ada foto diambil.</Text>
                    ) : photoUri?.[1] ? (
                        <Image
                            source={{ uri: photoUri[1] }}
                            style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 10 }}
                        />
                    ) : (
                        <Text style={absenDetailStyles.infoText}>Gagal memuat foto.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}