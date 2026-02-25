import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import ReimbursePopUpModal from "@/components/rootComponents/reimburseComponent/ReimbursePopUpModal";
import { useEffect, useState } from "react";
import { useReimburse } from "@/lib/api/hooks/useReimburse";
import { ApprovalStatus } from "@/types/reimburse/reimburseTypes";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { getTokens } from "@/lib/utils/secureStorage";
import NotificationModal from "@/components/rootComponents/NotificationModal";
import { gajiDetailStyles, HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function DetailPengajuanReimburse() {
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const { data: detailData, isLoading: isDetailLoading, error: detailError, refetch, isFetching } = useReimburse().fetchReimburseById(idParam);
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
    const [notes, setNotes] = useState("");

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const approveMutation = useReimburse().approveReimburse();
    const rejectMutation = useReimburse().rejectReimburse();

    const [notification, setNotification] = useState<{
        visible: boolean;
        status: "success" | "error";
        title?: string;
        description?: string;
    }>({
        visible: false,
        status: "success",
    });

    const isPendingAction = detailData?.approvalStatus === ApprovalStatus.PENDING;
    const isLoadingMutation = approveMutation.isPending || rejectMutation.isPending;
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

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        await refetch();

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

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
        if (!actionType) return;

        const mutation = actionType === "approve" ? approveMutation : rejectMutation;
        const payload = { 
            id: idParam, 
            catatan: notes
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                setNotification({
                    visible: true,
                    status: "success",
                    title: "Berhasil",
                    description: `Reimburse berhasil ${actionType === "approve" ? "disetujui" : "ditolak"}.`,
                });
            },
            onError: (err: any) => {
                setNotification({
                    visible: true,
                    status: "error",
                    title: "Gagal",
                    description: err?.message || "Terjadi kesalahan sistem.",
                });
            },
        });
    };

    if (isDetailLoading || showSkeleton) {
        return (
            <View style={gajiDetailStyles.container}>
                <View style={gajiDetailStyles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBox width={40} height={40} borderRadius={20} />
                        <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
                    </View>
                </View>

                <View style={gajiDetailStyles.subHeaderDetail}>
                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                        <SkeletonBox width={70} height={70} borderRadius={40} />
                        <SkeletonBox width={100} height={18}/>
                        <SkeletonBox width={170} height={10}/>
                        <SkeletonBox width={100} height={30}/>
                    </View>
                </View>

                <View style={cutiDetailStyles.dataContainer}>
                    <SkeletonBox width={200} height={80} style={{ width: "100%" }}/>
                </View>

                <View style={{ width: "90%", paddingVertical: 16, gap:12 }}>
                    <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom: 10}}>
                        <SkeletonBox width={100} height={24}/>
                    </View>
                    {[1, 2, 3, 4].map((_, i) => (
                        <View
                            key={i}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "transparent",
                            }}
                        >
                            <SkeletonBox width={200} height={64} style={{ width: "100%" }}/>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    if (!detailData) {
        const renderNoData = (
            <ScrollView
                contentContainerStyle={[gajiDetailStyles.container, { justifyContent: "center", alignItems: "center", paddingTop: 0, paddingBottom: 0}]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={gajiDetailStyles.header}>
                    <TouchableOpacity 
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => router.back()}
                    >
                        <View style={gajiDetailStyles.iconPlace}>
                            <Image
                                style={gajiDetailStyles.iconBack}
                                source={require('../../../../assets/icons/arrow-left.png')}
                            />
                        </View>
                        <Text style={gajiDetailStyles.headerTitle}>
                            Kembali
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                    <Image
                        source={require("../../../../assets/icons/not-found.png")}
                        style={{ width: 72, height: 72, }}
                    />
                    <Text style={{ textAlign: "center", marginTop: 10, color: COLORS.textPrimary, fontWeight: "bold", fontSize: 16, }}>
                        Tidak ditemukan data yang sesuai
                    </Text>
                    <Text style={{ textAlign: "center", marginTop: 5, color: COLORS.muted, fontSize: 12, }}>
                        Mohon untuk mengecek kembali nanti
                    </Text>
                </View> 
            </ScrollView>
        );

        return renderNoData;
    }

    if (detailError) {
        const renderError = (
            <ScrollView
                contentContainerStyle={[gajiDetailStyles.container, { justifyContent: "center", alignItems: "center", paddingTop: 0, paddingBottom: 0}]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={gajiDetailStyles.header}>
                    <TouchableOpacity 
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => router.back()}
                    >
                        <View style={gajiDetailStyles.iconPlace}>
                            <Image
                                style={gajiDetailStyles.iconBack}
                                source={require('../../../../assets/icons/arrow-left.png')}
                            />
                        </View>
                        <Text style={gajiDetailStyles.headerTitle}>
                            Kembali
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                    <Image
                        source={require("../../../../assets/icons/error-logo.png")}
                        style={{ width: 72, height: 72, }}
                    />
                    <Text style={{ textAlign: "center", marginTop: 10, color: COLORS.textPrimary, fontWeight: "bold", fontSize: 16, }}>
                        Terdapat kendala pada sistem
                    </Text>
                    <Text style={{ textAlign: "center", marginTop: 5, color: COLORS.muted, fontSize: 12, }}>
                        Mohon untuk mengecek kembali nanti
                    </Text>
                </View> 
            </ScrollView>
        );

        return renderError;
    }

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

            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: COLORS.background }}
                contentContainerStyle={{
                    alignItems: "center",
                    paddingTop: 80,
                    paddingBottom: 30
                }}
                enableOnAndroid={true}
                extraScrollHeight={30}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                        progressViewOffset={HEADER_HEIGHT}
                    />
                }
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
                {isPendingAction && (
                    <View style={{ width: "90%", paddingVertical: 8, gap: 12 }}>
                        <View style={cutiDetailStyles.itemContainer}>
                            <View style={{ width: "100%", gap: 16 }}>
                                <View>
                                    <Text style={{ fontWeight: "600", marginBottom: 8 }}>
                                        Pilih Aksi
                                    </Text>

                                    <View style={{ flexDirection: "row", gap: 20, marginBottom: 12 }}>
                                        <TouchableOpacity
                                            onPress={() => setActionType("approve")}
                                            style={{ flexDirection: "row", alignItems: "center" }}
                                        >
                                            <View style={[reimburseStyles.radioOuter, { borderColor: actionType === "approve" ? COLORS.primary : COLORS.border }]}>
                                                {actionType === "approve" && <View style={reimburseStyles.radioInner} />}
                                            </View>
                                            <Text style={{ color: COLORS.textPrimary, fontWeight: "600" }}>Approve</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setActionType("reject")}
                                            style={{ flexDirection: "row", alignItems: "center" }}
                                        >
                                            <View style={[reimburseStyles.radioOuter, { borderColor: actionType === "reject" ? COLORS.primary : COLORS.border }]}>
                                                {actionType === "reject" && <View style={reimburseStyles.radioInner} />}
                                            </View>
                                            <Text style={{ color: COLORS.textPrimary, fontWeight: "600" }}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View>
                                    <Text style={{ marginBottom: 6, fontWeight: "600" }}>
                                        Catatan (Opsional)
                                    </Text>

                                    <TextInput
                                        value={notes}
                                        onChangeText={setNotes}
                                        placeholder="Tambahkan keterangan tambahan jika ada..."
                                        multiline
                                        style={{
                                            minHeight: 80,
                                            borderWidth: 1,
                                            borderColor: "#ddd",
                                            borderRadius: 8,
                                            padding: 10,
                                            textAlignVertical: "top",
                                            backgroundColor: COLORS.white,
                                        }}
                                    />
                                </View>
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
                    {!sudahDinilai && (
                        <>
                            <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 16,
                                    borderBottomColor: COLORS.primary, borderBottomWidth: 1, 
                                    paddingVertical: 4
                                }}>
                                    Tanggapan Pengajuan
                                </Text>
                            </View>
                            <View style={cutiDetailStyles.itemContainer}>
                                <Text style={cutiDetailStyles.sectionTitle}>Status</Text>
                                <Text style={cutiDetailStyles.infoText}>{detailData.approvalStatus? detailData.approvalStatus : "-"}</Text>
                            </View>
                            <View style={cutiDetailStyles.itemContainer}>
                                <Text style={cutiDetailStyles.sectionTitle}>Catatan</Text>
                                <Text style={cutiDetailStyles.infoText}>{detailData.catatan ? detailData.catatan : "-"}</Text>
                            </View>
                            <View style={cutiDetailStyles.itemContainer}>
                                <Text style={cutiDetailStyles.sectionTitle}>Tanggal Diperbarui</Text>
                                <Text style={cutiDetailStyles.infoText}>{detailData.updatedAt ? format(new Date(detailData.updatedAt), "dd-MM-yyyy") : "-"}</Text>
                            </View>
                        </>
                    )}
                </View>
                {isPendingAction && actionType && (
                    <TouchableOpacity
                        style={[reimburseStyles.submitButton, { 
                            backgroundColor: isLoadingMutation ? COLORS.muted : COLORS.primary,
                            opacity: isLoadingMutation ? 0.5 : 1,
                            width: "90%"
                        }]}
                        onPress={() => setShowModal(true)}
                        disabled={isLoadingMutation}
                    >
                        <Text style={reimburseStyles.filterText}>
                            {isLoadingMutation ? "Memproses..." : "Konfirmasi Perubahan"}
                        </Text>
                    </TouchableOpacity>
                )}
            </KeyboardAwareScrollView>
            <ReimbursePopUpModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
            />
            <NotificationModal
                visible={notification.visible}
                status={notification.status}
                title={notification.title}
                description={notification.description}
                onContinue={() => {
                    setNotification(prev => ({ ...prev, visible: false }));

                    if (notification.status === "success") {
                        router.back();
                    }
                }}
            />
        </View>
    );
}
