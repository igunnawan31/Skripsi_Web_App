import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { useReimburse } from "@/lib/api/hooks/useReimburse";
import { ApprovalStatus } from "@/types/reimburse/reimburseTypes";
import { format } from "date-fns";

export default function DetailReimburse() {
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const { data: detailData, isLoading: isDetailLoading, error: detailError } = useReimburse().fetchReimburseById(idParam);
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
                <Text style={{ color: COLORS.textMuted }}>Memuat data reimburse...</Text>
            </View>
        );
    }

    if (!detailData) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Data reimburse tidak ditemukan.</Text>
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
                            source={require('../../../../assets/icons/arrow-left.png')}
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
                        source={require("../../../../assets/icons/reimburse.png")}
                        style={{ width: 64, height: 64 }}
                    />
                    <Text style={cutiDetailStyles.detailTitle}>
                        Detail Reimburse
                    </Text>
                    <Text style={cutiDetailStyles.label}>Diajukan tanggal: {toDate(detailData.createdAt)}</Text>
                    <Text
                        style={[
                            cutiDetailStyles.cutiStatus,
                            { backgroundColor: getStatusColor(detailData.approvalStatus) },
                        ]}
                    >
                        {detailData.approvalStatus}
                    </Text>
                </View>

                {(detailData.status === ApprovalStatus.APPROVED || detailData.status === ApprovalStatus.REJECTED) && (
                    <View style={cutiDetailStyles.dataContainer}>
                        <View style={cutiDetailStyles.itemContainer}>
                            <View style={{ flex: 1, width: "100%" }}>
                                <Text style={cutiDetailStyles.sectionTitle}>Penilai </Text>
                                <Text style={cutiDetailStyles.infoText}>{detailData.approver ? detailData.approver : "-"}</Text>
                            </View>
                            <View style={{ flex: 1, width: "100%" }}>
                                <Text style={cutiDetailStyles.sectionTitle}>Catatan </Text>
                                <Text style={cutiDetailStyles.infoText}>{detailData.catatan ? detailData.catatan : "-"}</Text>
                            </View>
                            <View style={{ flex: 1, width: "100%" }}>
                                <Text style={cutiDetailStyles.sectionTitle}>Terakhir Diperbarui </Text>
                                <Text style={cutiDetailStyles.infoText}>{detailData.updatedAt ? format(new Date(detailData.updatedAt), "dd-MM-yyyy") : "-"}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ width: "90%", paddingVertical: 16, gap:12 }}>
                    <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 16,
                            borderBottomColor: COLORS.primary, borderBottomWidth: 1, 
                            paddingVertical: 4
                        }}>
                            Your Reimburse Submission
                        </Text>
                    </View>
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Nama</Text>
                        <Text style={cutiDetailStyles.infoText}>{detailData.requester.name}</Text>
                    </View>
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Tanggal Pengajuan</Text>
                        <Text style={cutiDetailStyles.infoText}>{detailData.createdAt ? format(new Date(detailData.createdAt), "dd-MM-yyyy") : "-"}</Text>
                    </View>
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Dana yang diajukan</Text>
                        <Text style={cutiDetailStyles.infoText}>
                            {detailData.totalExpenses?.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            })}
                        </Text>
                    </View>
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Dokumen Pendukung</Text>
                        <View style={cutiDetailStyles.labelContainer}>
                            {detailData.documents && detailData.documents.length > 0 ? (
                                detailData.documents.map((doc: any, index: any) => (
                                    <View
                                        key={index}
                                        style={{
                                            backgroundColor: COLORS.white,
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 10,
                                                backgroundColor: "#E8EAF6",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginRight: 10,
                                            }}
                                        >
                                            {doc.mimeType === "image/" ? (
                                                <Image
                                                    source={require("../../../../assets/icons/changeImage.png")}
                                                    style={{
                                                        width: 70,
                                                        height: 70,
                                                        borderRadius: 10,
                                                    }}
                                                    // contentFit="cover"
                                                />
                                            ) : (
                                                <Image
                                                    source={require("../../../../assets/icons/pdfFile.png")}
                                                    style={{
                                                        width: 70,
                                                        height: 70,
                                                        borderRadius: 10,
                                                    }}
                                                    // contentFit="cover"
                                                />
                                            )}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text numberOfLines={1} style={{ fontWeight: "600", color: "#333" }}>
                                                {doc.filename}
                                            </Text>
                                            <Text style={{ fontSize: 12, color: "#777" }}>
                                                {doc.mimetype}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ marginTop: 6, fontSize: 13, color: "#888" }}>
                                    Belum ada file dipilih
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
                    onPress={() => router.push('/reimburse/create')}
                >
                    <Text style={{ color: COLORS.primary, fontWeight: "600", marginRight: 6 }}>
                        Ajukan Reimburse lain
                    </Text>
                    <Image
                        style={[cutiDetailStyles.iconBack, { tintColor: COLORS.primary }]}
                        source={require('../../../../assets/icons/arrow-right.png')}
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
