import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import COLORS from "@/constants/colors";
import { ReimburseStatus } from "@/data/dummyReimburse";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Reimburse = {
    id: string;
    name: string;
    submissionDate: string;
    totalPengeluaran: number;
    majorRole: string;
    minorRole: string;
    reimburseStatus: ReimburseStatus;
    approver: string;
    approvalDate: string;
    file: string;
};

type ListDataPengajuanReimburseComponentProps = {
    data: Reimburse[];
};

const ListDataPengajuanReimburseComponent = ({ data }: ListDataPengajuanReimburseComponentProps) => {
    const router = useRouter();
    const getStatusColor = (status: string) => {
    switch (status) {
        case "Reimburse Diterima":
            return COLORS.success;
        case "Reimburse Ditolak":
            return COLORS.error;
        case "Menunggu Jawaban":
            return COLORS.tertiary;
        default:
            return COLORS.muted;
        }
    };

    return (
        <View style={reimburseStyles.reimburseContainer}>
            {data.length > 0 ? (
                data.map((item) => (
                    <View
                        key={item.id}
                        style={reimburseStyles.listContainer}
                    >
                        <View style={reimburseStyles.listHeader}>
                            <Text style={reimburseStyles.name}>{item.name}</Text>
                            <View style={reimburseStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/calendar.png")}
                                    style={reimburseStyles.icon}
                                />
                                <Text style={reimburseStyles.timeText}>
                                    Pengajuan: {item.submissionDate}
                                </Text>
                            </View>
                        </View>
                        <View style={reimburseStyles.roleContainer}>
                            <Text style={reimburseStyles.roleText}>
                                {item.majorRole} - {item.minorRole}
                            </Text>
                            <View
                                style={[
                                    reimburseStyles.statusBadge,
                                    { backgroundColor: getStatusColor(item.reimburseStatus) },
                                ]}
                            >
                                <Text style={reimburseStyles.statusText}>{item.reimburseStatus}</Text>
                            </View>
                        </View>
                        <View style={reimburseStyles.timeContainer}>
                            <View style={reimburseStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/gaji.png")}
                                    style={reimburseStyles.icon}
                                />
                                <Text style={reimburseStyles.timeText}>
                                    Total Pengajuan: {item.totalPengeluaran?.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })}
                                </Text>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: COLORS.border, marginTop: 12 }} />
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => router.push(`/(reimburse)/setujui-reimburse/${item.id}`)}
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
                                style={reimburseStyles.iconCalendar}
                                source={require('../../../assets/icons/arrow-right.png')}
                            />
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <View>
                    <Text>Belum ada data</Text>
                </View>
            )}
        </View>
    )
}

export default ListDataPengajuanReimburseComponent;