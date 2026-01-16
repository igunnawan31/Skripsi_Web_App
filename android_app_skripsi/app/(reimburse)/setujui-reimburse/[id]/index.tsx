import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import ReimbursePopUpModal from "@/components/rootComponents/reimburseComponent/ReimbursePopUpModal";
import { useState } from "react";
import { useReimburse } from "@/lib/api/hooks/useReimburse";
import { ApprovalStatus } from "@/types/reimburse/reimburseTypes";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { getTokens } from "@/lib/utils/secureStorage";

export default function DetailPengajuanReimburse() {
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const { data: detailData, isLoading: isDetailLoading, error: detailError } = useReimburse().fetchReimburseById(idParam);
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const approveReimburse = useReimburse().approveReimburse();
    const rejectReimburse = useReimburse().rejectReimburse();
    const [notification, setNotification] = useState<{
        visible: boolean;
        status: "success" | "error";
        title?: string;
        description?: string;
    }>({
        visible: false,
        status: "success",
    });
    const sudahDinilai = detailData?.approvalStatus !== ApprovalStatus.APPROVED && detailData?.approvalStatus !== ApprovalStatus.REJECTED;

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

    const handleDownloadFile = async (doc: any) => {
        const token = await getTokens();
        const jwt = token?.access_token;

        const fileUrl = `${process.env.EXPO_PUBLIC_API_URL}/files?path=${doc.path}`;

        const fileUri =
            FileSystem.documentDirectory + doc.originalname;

        const download = FileSystem.createDownloadResumable(
            fileUrl,
            fileUri,
            {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            }
        );

        const result = await download.downloadAsync();
        if (result?.uri) {
            await Sharing.shareAsync(result.uri);
        }
    };

    const handleSubmit = () => {
        setShowModal(false);
        router.push("/(reimburse)/setujui-reimburse/setujui-reimburse")
    }

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

                {sudahDinilai && (
                    <View style={{ width: "90%", marginVertical: 16 }}>
                        <Text style={{ fontWeight: "600", marginBottom: 8 }}>
                            Pilih Aksi
                        </Text>

                        <TouchableOpacity
                            onPress={() => setActionType("approve")}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 10,
                            }}
                        >
                            <View
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: COLORS.border,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 10,
                                }}
                            >
                                {actionType === "approve" && (
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: COLORS.success,
                                        }}
                                    />
                                )}
                            </View>
                            <Text style={{ color: COLORS.success, fontWeight: "600" }}>
                                Approve
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActionType("reject")}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: COLORS.border,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 10,
                                }}
                            >
                                {actionType === "reject" && (
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: COLORS.error,
                                        }}
                                    />
                                )}
                            </View>
                            <Text style={{ color: COLORS.error, fontWeight: "600" }}>
                                Reject
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                {actionType === "reject" && (
                    <View style={{ width: "90%", marginTop: 12 }}>
                        <Text style={{ marginBottom: 6, fontWeight: "600" }}>
                            Alasan Penolakan
                        </Text>
                        <TextInput
                            value={rejectReason}
                            onChangeText={setRejectReason}
                            placeholder="Masukkan alasan penolakan"
                            multiline
                            style={{
                                minHeight: 80,
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 8,
                                padding: 10,
                                textAlignVertical: "top",
                            }}
                        />
                    </View>
                )}

                <View style={{ width: "90%", paddingVertical: 16, gap:12 }}>
                    <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 16,
                            borderBottomColor: COLORS.primary, borderBottomWidth: 1, 
                            paddingVertical: 4
                        }}>
                            Detail Reimburse Submission
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
                                            {doc.mimetype?.startsWith("image/") ? (
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

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: COLORS.primary,
                                                borderRadius: 20,
                                                width: 40,
                                                height: 40,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                            onPress={() => handleDownloadFile(doc)}
                                        >
                                            <Image
                                                source={require("../../../../assets/icons/download.png")}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    tintColor: COLORS.white,
                                                }}
                                            />
                                        </TouchableOpacity>
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
                {sudahDinilai && (
                    <TouchableOpacity
                        style={[
                            reimburseStyles.applyButton,
                            { opacity: actionType ? 1 : 0.5 },
                        ]}
                        disabled={!actionType}
                        onPress={handleSubmit}
                    >
                        <Text style={reimburseStyles.applyText}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
            <ReimbursePopUpModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
            />
        </View>
    );
}
