import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import COLORS from "@/constants/colors";
import { useCuti } from "@/lib/api/hooks/useCuti";
import { CutiResponse } from "@/types/cuti/cutiTypes";
import { CutiStatus } from "@/types/enumTypes";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import NotificationModal from "../NotificationModal";
import CutiPopUpModal from "./CutiPopUpModal";

type ListDataCutiComponentProps = {
    data: CutiResponse[];
    onCancelRequest: (id: string) => void;
};

const ListDataCutiComponent = ({ data, onCancelRequest }: ListDataCutiComponentProps) => {
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

    const isCancelAllowed = (startDate: string) => {
        if (!startDate) return false;
        const start = parseISO(startDate);
        const now = new Date();
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysUntilStart = Math.floor((start.getTime() - now.getTime()) / msPerDay);
        return daysUntilStart > 3;
    };

    return (
        <>
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
                            <View 
                                key={item.id}
                                style={[
                                    homeStyles.titleContainer,
                                    { alignItems: "center", marginBottom: 0 },
                                    item.status === CutiStatus.MENUNGGU
                                        ? { justifyContent: "space-between" }
                                        : { justifyContent: "flex-end" }
                                ]}
                            >
                                {item.status === CutiStatus.MENUNGGU && (
                                    <TouchableOpacity
                                        onPress={() => isCancelAllowed(item.startDate) ? onCancelRequest(item.id) : null}
                                        disabled={!isCancelAllowed(item.startDate)}   // 👈 disable if < 3 days
                                        style={{
                                            backgroundColor: isCancelAllowed(item.startDate) ? COLORS.primary : COLORS.muted,  // 👈 gray when blocked
                                            padding: 8,
                                            borderRadius: 8,
                                            marginTop: 12,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            gap: 5,
                                        }}
                                    >
                                        <Text style={{ color: COLORS.white }}>
                                            {isCancelAllowed(item.startDate) ? "Cancel" : "Tidak Bisa Dibatalkan"}
                                        </Text>
                                        <Image
                                            style={[cutiStyles.iconCalendar, { tintColor: COLORS.white }]}
                                            source={require('../../../assets/icons/cancel.png')}
                                        />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
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
                        </View>
                    ))
                ) : (
                    <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
                        <Image
                            source={require("../../../assets/icons/not-found.png")}
                            style={{ width: 72, height: 72, }}
                        />
                        <Text style={{ textAlign: "center", marginTop: 10, color: COLORS.textPrimary, fontWeight: "bold", fontSize: 16, }}>
                            Tidak ada riwayat pengajuan cuti
                        </Text>
                        <Text style={{ textAlign: "center", marginTop: 5, color: COLORS.muted, fontSize: 12, }}>
                            Mohon untuk mengecek kembali nanti
                        </Text>
                    </View> 
                )}
            </View>
        </>
    )
}

export default ListDataCutiComponent;