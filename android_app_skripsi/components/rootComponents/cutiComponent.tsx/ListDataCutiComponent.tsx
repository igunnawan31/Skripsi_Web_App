import { cutiStyles } from "@/assets/styles/rootstyles/cuti.styles";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Cuti = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    submissionDate: string;
    totalDays: number;
    reason: string;
    majorRole: string;
    minorRole: string;
    cutiStatus: string;
    approver: string;
};

type ListDataCutiComponentProps = {
    data: Cuti[];
};

const ListDataCutiComponent = ({ data }: ListDataCutiComponentProps) => {
    const router = useRouter();

    const getStatusColor = (status: string) => {
    switch (status) {
        case "Cuti Diterima":
            return COLORS.success;
        case "Cuti Ditolak":
            return COLORS.error;
        case "Menunggu Jawaban":
            return COLORS.tertiary;
        default:
            return COLORS.muted;
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
                            <Text style={cutiStyles.name}>{item.name}</Text>
                            <Text style={cutiStyles.date}>
                                {item.startDate} → {item.endDate}
                            </Text>
                        </View>
                        <View style={cutiStyles.roleContainer}>
                            <Text style={cutiStyles.roleText}>
                                {item.majorRole} - {item.minorRole}
                            </Text>
                            <View
                                style={[
                                    cutiStyles.statusBadge,
                                    { backgroundColor: getStatusColor(item.cutiStatus) },
                                ]}
                            >
                                <Text style={cutiStyles.statusText}>{item.cutiStatus}</Text>
                            </View>
                        </View>
                        <View style={cutiStyles.timeContainer}>
                            <View style={cutiStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/calendar.png")}
                                    style={cutiStyles.icon}
                                />
                                <Text style={cutiStyles.timeText}>
                                    Pengajuan: {item.submissionDate}
                                </Text>
                            </View>
                            <View style={cutiStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/calendar.png")}
                                    style={cutiStyles.icon}
                                />
                                <Text style={cutiStyles.timeText}>
                                    Total: {item.totalDays} Hari
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