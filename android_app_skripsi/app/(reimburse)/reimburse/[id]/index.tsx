import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { useReimburse } from "@/lib/api/hooks/useReimburse";
import { ApprovalStatus } from "@/types/reimburse/reimburseTypes";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { gajiDetailStyles, HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";

export default function DetailReimburse() {
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const { data: detailData, isLoading: isDetailLoading, error: detailError, refetch, isFetching } = useReimburse().fetchReimburseById(idParam);
    
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
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

            <ScrollView
                contentContainerStyle={{ alignItems: "center", paddingTop: 80, paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
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
