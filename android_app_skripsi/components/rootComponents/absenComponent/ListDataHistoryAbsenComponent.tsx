import { historyStyles } from "@/assets/styles/rootstyles/history.styles";
import COLORS from "@/constants/colors";
import { AbsensiResponse } from "@/types/absensi/absensiTypes"
import { WorkStatus } from "@/types/enumTypes";
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ListDataAbsenseComponentProps = {
    data: AbsensiResponse[];
}

const ListDataHistoryAbsenComponent = ({ data } : ListDataAbsenseComponentProps) => {
    const router = useRouter();

    const toWIB = (dateString: string) => {
        const zoned = toZonedTime(dateString, "Asia/Jakarta");
        return format(zoned, "HH:mm");
    }

    const getCheckInStatus = (checkIn?: string) => {
        if (!checkIn) return "-";
        
        const checkInWIB = fromZonedTime(checkIn, "Asia/Jakarta");
        const limit = new Date(checkInWIB);
        limit.setHours(8, 30, 0, 0);

        return checkInWIB > limit ? "Terlambat" : "Tepat Waktu";
    };

    const getTimeFromISO = (iso?: string) => {
        if (!iso) return "-";
        return iso.split("T")[1]?.substring(0, 5);
    };

    return (
        <View style={historyStyles.container}>
            {data.length > 0 ? (
                data.map((item) => (
                    <View
                        key={`${item.user.id}-${item.date}`}
                        style={historyStyles.listContainer}
                    >
                        <View style={historyStyles.listHeader}>
                            <Text style={historyStyles.name}>{item.user.name}</Text>
                            <Text style={historyStyles.date}>{item.date ? format(new Date(item.date), "dd-MM-yyyy") : "-"}</Text>
                        </View>
                        <View style={historyStyles.roleContainer}>
                            <Text style={historyStyles.roleText}>
                                {item.user.majorRole} - {item.user.minorRole}
                            </Text>
                            <View
                                style={[
                                    historyStyles.statusBadge,
                                    { backgroundColor: item.workStatus === WorkStatus.WFO ? COLORS.success : COLORS.info },
                                ]}
                            >
                                <Text style={historyStyles.statusText}>{item.workStatus}</Text>
                            </View>
                        </View>
                        <View style={historyStyles.timeContainer}>
                            <View style={historyStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/clock-in.png")}
                                    style={historyStyles.icon}
                                />
                                <Text style={historyStyles.timeText}>Masuk: {item.checkIn ? toWIB(item.checkIn) : "-"}</Text>
                            </View>
                            <View style={historyStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/clock-out.png")}
                                    style={historyStyles.icon}
                                />
                                <Text style={historyStyles.timeText}>Pulang: {item.checkOut ? toWIB(item.checkOut) : "-"}</Text>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: COLORS.border, marginTop: 12 }} />
                        <TouchableOpacity
                            key={`${item.user.id}-${item.date}`}
                            onPress={() => router.push(`/(absensi)/${item.userId}?date=${item.checkIn}`)}
                            style={{
                                marginTop: 12,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 5,
                            }}
                        >
                            <View
                                style={[
                                    historyStyles.statusBadge,
                                    { backgroundColor: item.checkIn === "Terlambat" ? COLORS.success : COLORS.error },
                                ]}
                            >
                                <Text style={historyStyles.statusText}>{getCheckInStatus(item.checkIn)}</Text>
                            </View>
                            <View style={{ justifyContent: "flex-end", flexDirection: "row", gap: 5, alignItems: "center" }}>
                            <Text>Lebih Lanjut</Text>
                                <Image
                                    style={historyStyles.iconCalendar}
                                    source={require('../../../assets/icons/arrow-right.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
                    <Image
                        source={require("../../../assets/icons/not-found.png")}
                        style={{ width: 72, height: 72, }}
                    />
                    <Text style={{ textAlign: "center", marginTop: 10, color: COLORS.textPrimary, fontWeight: "bold", fontSize: 16, }}>
                        Tidak ada riwayat absensi
                    </Text>
                    <Text style={{ textAlign: "center", marginTop: 5, color: COLORS.muted, fontSize: 12, }}>
                        Mohon melakukan absensi untuk bulan ini
                    </Text>
                </View>  
            )}
        </View>
    )
}

export default ListDataHistoryAbsenComponent;