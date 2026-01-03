import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import COLORS from "@/constants/colors";
import { dummyAbsensi } from "@/data/dummyAbsensi";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState, useMemo } from "react";  // Add useMemo
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootTabParamList } from "../Tabs";
import { useNavigation, useRouter } from "expo-router";
import { useAbsensi } from "@/lib/api/hooks/useAbsensi";
import { useAuthStore } from "@/lib/store/authStore";
import { format, fromZonedTime } from "date-fns-tz";
import { toZonedTime } from "date-fns-tz";

type HomeNavigation = NativeStackNavigationProp<RootTabParamList, "Home Page">;

const AbsenseComponent = () => {
    const navigation = useNavigation<HomeNavigation>();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const userId = user?.id ? user.id : null;
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    if (!user?.id) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Memuat data user...</Text>
            </View>
        );
    }

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

    const dateNow = useMemo(() => {
        const today = new Date().toISOString();
        return today;
    }, []);

    const { data, isLoading } = useAbsensi().fetchAbsensiById(userId, dateNow);
    const absensi = data;

    const checkIn = absensi?.checkIn ?? null;
    const checkOut = absensi?.checkOut ?? null;
    const isAlreadyAbsent = Boolean(checkIn) && Boolean(checkOut);

    const toWIB = (dateString: string) => {
        const zoned = toZonedTime(dateString, "Asia/Jakarta");
        return format(zoned, "HH:mm");
    }

    const getCheckInStatus = (checkIn?: string) => {
        if (!checkIn) return "-";
        
        const checkInWIB = toZonedTime(checkIn, "Asia/Jakarta");
        const limit = new Date(checkInWIB);
        limit.setHours(8, 30, 0, 0);

        return checkInWIB > limit ? "Terlambat" : "Tepat Waktu";
    };

    const isLate = checkIn ? getCheckInStatus(checkIn) === "Terlambat" : false;
    const checkInColor = isLate ? COLORS.primary : checkIn ? COLORS.success : COLORS.textMutedOpacity20;
    const checkInBgColor = isLate ? COLORS.primaryOpacity20 : checkIn ? COLORS.successOpacity20 : COLORS.textMutedOpacity20;

    return (
        <View style={homeStyles.absenseContainer}>
            <View style={homeStyles.waktuContainer}>
                <Text style={homeStyles.waktuText}>{currentDate}</Text>
                <Text style={homeStyles.waktuText}>{currentTime}</Text>
            </View>

            <View style={homeStyles.checkContainer}>
                <View style={homeStyles.checkRow}>
                    <View style={[ homeStyles.logoAbsenseContainer, { backgroundColor: checkInBgColor } ]}>
                        <Image
                            style={[ homeStyles.logoAbsense, { tintColor: checkInColor } ]}
                            source={require("../../../assets/icons/clock-in.png")}
                        />
                    </View>
                    <View>
                        <Text style={[homeStyles.checkLabel, { color: checkInColor }]}>
                            Check In
                        </Text>
                        <Text style={[homeStyles.checkValue, { color: checkInColor }]}>
                            {checkIn ? toWIB(absensi.checkIn) : "Belum"}
                        </Text>
                        {isLate && (
                            <Text style={{ color: COLORS.primary, fontSize: 12 }}>
                                Terlambat
                            </Text>
                        )}
                    </View>
                </View>
                <View style={homeStyles.checkRow}>
                    <View
                        style={[
                            homeStyles.logoAbsenseContainer,
                            {
                                backgroundColor: checkOut
                                ? COLORS.successOpacity20
                                : COLORS.textMutedOpacity20,
                            },
                        ]}
                    >
                        <Image
                            style={[
                                homeStyles.logoAbsense,
                                {
                                    tintColor: checkOut
                                    ? COLORS.success
                                    : COLORS.textMutedOpacity20,
                                },
                            ]}
                            source={require("../../../assets/icons/clock-in.png")}
                        />
                    </View>
                    <View>
                        <Text
                            style={[
                                homeStyles.checkLabel,
                                { color: checkOut ? COLORS.success : COLORS.textMutedOpacity20 },
                            ]}
                        >
                            Check Out
                        </Text>
                        <Text
                            style={[
                                homeStyles.checkValue,
                                { color: checkOut ? COLORS.success : COLORS.textMutedOpacity20 },
                            ]}
                        >
                            {checkOut ? toWIB(absensi.checkOut) : "Belum"}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={homeStyles.buttonContainer}>
                <TouchableOpacity 
                    style={[homeStyles.buttonPrimary, { backgroundColor: isAlreadyAbsent ? COLORS.muted : COLORS.tertiary}]}
                    disabled={isAlreadyAbsent}
                    onPress={() => {
                        if (isAlreadyAbsent) return;
                        if (checkIn !== null) {
                            router.push("/(absensi)/fotoabsensi");
                        } else {
                            router.push("/(absensi)/geoLocation");
                        }
                    }}
                >
                    <Text style={homeStyles.buttonText}>Absen Sekarang</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={homeStyles.buttonSecondary}
                    onPress={() => navigation.navigate("History Absensi Page")}
                >
                    
                    <Text style={{ color: COLORS.secondary }}>Lihat History</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AbsenseComponent;