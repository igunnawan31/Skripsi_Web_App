import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dummyCuti } from "@/data/dummyCuti";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import CutiFormComponent from "@/components/rootComponents/cutiComponent/CutiFormComponent";
import { useAuthStore } from "@/lib/store/authStore";
import { useCuti } from "@/lib/api/hooks/useCuti";
import { CutiStatus } from "@/types/enumTypes";

export default function DetailCuti() {
    const user = useAuthStore((state) => state.user);
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const { data: detailData, isLoading: isDetailLoading, error: detailError } = useCuti().fetchCutiById(idParam);
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

    if (isDetailLoading) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Memuat data cuti...</Text>
            </View>
        );
    }

    if (!detailData) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Data cuti tidak ditemukan.</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={cutiDetailStyles.header}>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
                >
                    <View style={cutiDetailStyles.iconPlace}>
                        <Image
                            style={cutiDetailStyles.iconBack}
                            source={require('../../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={cutiDetailStyles.headerTitle}>
                        Kembali
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={{ alignItems: "center", paddingTop: 80, paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={cutiDetailStyles.subHeaderDetail}>
                    <Image
                        source={require("../../../assets/icons/leave.png")}
                        style={{ width: 64, height: 64 }}
                    />
                    <Text style={cutiDetailStyles.detailTitle}>
                        Detail Cuti
                    </Text>
                    <Text style={cutiDetailStyles.label}>Diajukan tanggal: {toDate(detailData.createdAt)}</Text>
                    <Text
                        style={[
                            cutiDetailStyles.cutiStatus,
                            { backgroundColor: getStatusColor(detailData.status) },
                        ]}
                    >
                        {detailData.status}
                    </Text>
                </View>

                {(detailData.status === CutiStatus.DITERIMA || detailData.status === CutiStatus.DITOLAK) && (
                    <View style={cutiDetailStyles.dataContainer}>
                        <View style={cutiDetailStyles.itemContainer}>
                            <View style={{ flex: 1, width: "100%" }}>
                                <Text style={cutiDetailStyles.sectionTitle}>Penilai: </Text>
                                <Text style={cutiDetailStyles.infoText}>{detailData.approver ? detailData.approver : "-"}</Text>
                            </View>
                            <View style={{ flex: 1, width: "100%" }}>
                                <Text style={cutiDetailStyles.sectionTitle}>Catatan </Text>
                                <Text style={cutiDetailStyles.infoText}>{detailData.catatan ? detailData.catatan : "-"}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <CutiFormComponent data={detailData} />

                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
                    onPress={() => router.push('/create')}
                >
                    <Text style={{ color: COLORS.primary, fontWeight: "600", marginRight: 6 }}>
                        Ajukan Cuti lain
                    </Text>
                    <Image
                        style={[cutiDetailStyles.iconBack, { tintColor: COLORS.primary }]}
                        source={require('../../../assets/icons/arrow-right.png')}
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
