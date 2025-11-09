import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import COLORS from "@/constants/colors";
import { dummyAbsensi } from "@/data/dummyAbsensi";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootTabParamList } from "../Tabs";
import { useNavigation, useRouter } from "expo-router";

type HomeNavigation = NativeStackNavigationProp<RootTabParamList, "Home Page">;

const AbsenseComponent = () => {
    const navigation = useNavigation<HomeNavigation>();
    const router = useRouter();
    const [data, setData] = useState(dummyAbsensi[2]);
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

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

    const isCheckedIn = data.checkIn !== "";
    const isCheckedOut = data.checkOut !== "";
    
    const isLate = (() => {
        if (!isCheckedIn) return false;
        const [hour, minute] = data.checkIn.split(":").map(Number);
        return hour > 8 || (hour === 8 && minute > 30);
    })();

    const checkInColor = isLate
        ? COLORS.primary
        : isCheckedIn
        ? COLORS.success
        : COLORS.textMutedOpacity20;

    const checkInBgColor = isLate
        ? COLORS.primaryOpacity20
        : isCheckedIn
        ? COLORS.successOpacity20
        : COLORS.textMutedOpacity20;

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
                            {isCheckedIn ? data.checkIn : "Belum"}
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
                                backgroundColor: isCheckedOut
                                ? COLORS.successOpacity20
                                : COLORS.textMutedOpacity20,
                            },
                        ]}
                    >
                        <Image
                            style={[
                                homeStyles.logoAbsense,
                                {
                                    tintColor: isCheckedOut
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
                                { color: isCheckedOut ? COLORS.success : COLORS.textMutedOpacity20 },
                            ]}
                        >
                            Check Out
                        </Text>
                        <Text
                            style={[
                                homeStyles.checkValue,
                                { color: isCheckedOut ? COLORS.success : COLORS.textMutedOpacity20 },
                            ]}
                        >
                            {isCheckedOut ? data.checkOut : "Belum"}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={homeStyles.buttonContainer}>
                <TouchableOpacity 
                    style={homeStyles.buttonPrimary}
                    onPress={() => router.push("/(absensi)/")}
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
    )
}

export default AbsenseComponent;