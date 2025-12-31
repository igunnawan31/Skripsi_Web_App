import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import COLORS from "@/constants/colors";
import { CutiResponse } from "@/types/cuti/cutiTypes";
import { CutiStatus } from "@/types/enumTypes";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ListDataCutiComponentProps = {
    data: CutiResponse[];
};

const ListDataCutiComponent = ({ data }: ListDataCutiComponentProps) => {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case CutiStatus.DITERIMA:
                return COLORS.success;
            case CutiStatus.DITOLAK:
                return COLORS.error;
            case CutiStatus.MENUNGGU:
                return COLORS.tertiary;
            default:
                return COLORS.muted;
        }
    };

    const computeTotalDays = (startStr: string, endStr: string) => {
        if (!startStr || !endStr) return 0;
        try {
            const start = parseISO(startStr);
            const end = parseISO(endStr);
            const msPerDay = 24 * 60 * 60 * 1000;
            const diff = Math.floor((end.getTime() - start.getTime()) / msPerDay);
            return diff >= 0 ? diff + 1 : 0
        } catch {
            return 0;
        }
    };

    return (
        <View style={cutiStyles.container}>
            {data.length > 0 ? (
                data.map((item) => (
                    <View
                        key={item.id}
                        style={cutiStyles.listContainer}
                    >
                        <View style={cutiStyles.listHeader}>
                            <Text style={cutiStyles.name}>{item.user.name}</Text>
                            <Text style={cutiStyles.date}>
                                {item.startDate ? format(new Date(item.startDate), "dd-MM-yyyy") : "-"} → {item.endDate ? format(new Date(item.endDate), "dd-MM-yyyy") : "-"}
                            </Text>
                        </View>
                        <View style={cutiStyles.roleContainer}>
                            <Text style={cutiStyles.roleText}>
                                {item.user.majorRole} - {item.user.minorRole}
                            </Text>
                            <View
                                style={[
                                    cutiStyles.statusBadge,
                                    { backgroundColor: getStatusColor(item.status) },
                                ]}
                            >
                                <Text style={cutiStyles.statusText}>{item.status}</Text>
                            </View>
                        </View>
                        <View style={cutiStyles.timeContainer}>
                            <View style={cutiStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/calendar.png")}
                                    style={cutiStyles.icon}
                                />
                                <Text style={cutiStyles.timeText}>
                                    Pengajuan: {item.createdAt ? format(new Date(item.createdAt), "dd-MM-yyyy") : "-"}
                                </Text>
                            </View>
                            <View style={cutiStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/calendar.png")}
                                    style={cutiStyles.icon}
                                />
                                <Text style={cutiStyles.timeText}>
                                    Total: {computeTotalDays(item.startDate, item.endDate)} Hari
                                </Text>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: COLORS.border, marginTop: 12 }} />
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => router.push(`/(cuti)/${item.id}`)}
                            style={{
                                marginTop: 12,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                gap: 5,
                            }}
                        >
                            <Text>Lebih Lanjut</Text>
                            <Image
                                style={cutiStyles.iconCalendar}
                                source={require('../../../assets/icons/arrow-right.png')}
                            />
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={{ textAlign: "center", marginTop: 20, color: COLORS.muted }}>
                    Tidak ada data cuti di bulan ini
                </Text>  
            )}
        </View>
    )
}

export default ListDataCutiComponent;