import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import COLORS from "@/constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootTabParamList } from "../Tabs";
import { useNavigation, useRouter } from "expo-router";
import { format } from "date-fns-tz";
import { toZonedTime } from "date-fns-tz";
import { AbsensiResponse } from "@/types/absensi/absensiTypes";

type HomeNavigation = NativeStackNavigationProp<RootTabParamList, "Home Page">;

type AbsenseComponentProps = {
    data: AbsensiResponse;
    currentDate: any;
    currentTime: any;
};

const AbsenseComponent = ({ data, currentDate, currentTime }: AbsenseComponentProps) => {
    const navigation = useNavigation<HomeNavigation>();
    const router = useRouter();

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

    const isButtonBlocked = () => {
        const now = toZonedTime(new Date(), "Asia/Jakarta");
        const timeInMinutes = now.getHours() * 60 + now.getMinutes();

        if (timeInMinutes >= 18 * 60 || timeInMinutes < 7 * 60) return true;
        if (checkIn && timeInMinutes < 16 * 60 + 30) return true;

        return false;
    };

    const getButtonLabel = () => {
        const now = toZonedTime(new Date(), "Asia/Jakarta");
        const timeInMinutes = now.getHours() * 60 + now.getMinutes();

        if (timeInMinutes >= 18 * 60 || timeInMinutes < 7 * 60) return "Di Luar Jam Absensi";
        if (checkIn && timeInMinutes < 16 * 60 + 30) return "Belum Waktunya Check-Out";

        return "Absen Sekarang";
    };

    const isBlocked = isButtonBlocked();
    const isDisabled = isAlreadyAbsent || isBlocked;

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
                    style={[
                        homeStyles.buttonPrimary, 
                        { backgroundColor: isDisabled ? COLORS.muted : COLORS.tertiary }
                    ]}
                    disabled={isDisabled}
                    onPress={() => {
                        if (isDisabled) return;
                        if (checkIn !== null) {
                            router.push("/(absensi)/fotoabsensi");
                        } else {
                            router.push("/(absensi)/geoLocation");
                        }
                    }}
                >
                    <Text style={homeStyles.buttonText}>
                        {getButtonLabel()}
                    </Text>
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