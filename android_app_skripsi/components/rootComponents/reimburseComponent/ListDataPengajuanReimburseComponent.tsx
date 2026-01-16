import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import COLORS from "@/constants/colors";
import { ReimburseStatus } from "@/data/dummyReimburse";
import { ApprovalStatus, ReimburseResponse } from "@/types/reimburse/reimburseTypes";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ListDataPengajuanReimburseComponentProps = {
    data: ReimburseResponse[];
};

const ListDataPengajuanReimburseComponent = ({ data }: ListDataPengajuanReimburseComponentProps) => {
    const router = useRouter();
    const getStatusColor = (approvalStatus: string) => {
    switch (approvalStatus) {
        case ApprovalStatus.APPROVED:
            return COLORS.success;
        case ApprovalStatus.REJECTED:
            return COLORS.error;
        case ApprovalStatus.PENDING:
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
                            <Text style={reimburseStyles.name}>{item.requester.name}</Text>
                            <View style={reimburseStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/calendar.png")}
                                    style={reimburseStyles.icon}
                                />
                                <Text style={reimburseStyles.timeText}>
                                    Pengajuan: {item.createdAt ? format(new Date(item.createdAt), "dd-MM-yyyy") : "-"}
                                </Text>
                            </View>
                        </View>
                        <View style={reimburseStyles.roleContainer}>
                            <Text style={reimburseStyles.roleText}>
                                {item.requester.majorRole} - {item.requester.minorRole}
                            </Text>
                            <View
                                style={[
                                    reimburseStyles.statusBadge,
                                    { backgroundColor: getStatusColor(item.approvalStatus) },
                                ]}
                            >
                                <Text style={reimburseStyles.statusText}>{item.approvalStatus}</Text>
                            </View>
                        </View>
                        <View style={reimburseStyles.timeContainer}>
                            <View style={reimburseStyles.timeBox}>
                                <Image
                                    source={require("../../../assets/icons/gaji.png")}
                                    style={reimburseStyles.icon}
                                />
                                <Text style={reimburseStyles.timeText}>
                                    Total Pengajuan: {item.totalExpenses?.toLocaleString("id-ID", {
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