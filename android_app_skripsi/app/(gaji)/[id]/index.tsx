import absenDetailStyles from "@/assets/styles/rootstyles/absen/absendetail.style";
import AbsenseComponent from "@/components/rootComponents/homeComponent/AbsenseComponent";
import COLORS from "@/constants/colors";
import { dummyAbsensi } from "@/data/dummyAbsensi";
import { useAbsensi } from "@/lib/api/hooks/useAbsensi";
import { useSalary } from "@/lib/api/hooks/useSalary";
import { useAuthStore } from "@/lib/store/authStore";
import { fetchImageWithAuth } from "@/lib/utils/path";
import { getTokens } from "@/lib/utils/secureStorage";
import { SalaryResponse, SalaryStatus } from "@/types/salary/salaryTypes";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import ImageViewing from "react-native-image-viewing";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { gajiDetailStyles, HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";

export default function DetailSalary() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const [photoUris, setPhotoUris] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const openImageModal = (uri: string) => setSelectedImage(uri);
    const [visible, setIsVisible] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageViewerData = photoUris.filter(Boolean).map(uri => ({ uri }));
    const { data: detailData, isLoading: isDetailLoading, error: detailError,  refetch, isFetching } = useSalary().fetchSalaryById(idParam);
    
    const loadPhoto = async (path: string, index: number) => {
        try {
            const blob = await fetchImageWithAuth(path);
            const reader = new FileReader();

            reader.onloadend = () => {
            setPhotoUris(prev => {
                const arr = [...prev];
                arr[index] = reader.result as string;
                return arr;
            });
            };

            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("Load photo error:", err);
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
        if (!detailData?.paychecks) return;

        detailData.paychecks.forEach((doc: any, index: number) => {
            if (doc.mimetype?.startsWith("image/")) {
                loadPhoto(doc.path, index);
            }
        });
    }, [detailData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case SalaryStatus.PAID:
                return COLORS.success;
            case SalaryStatus.OVERDUE:
                return COLORS.error;
            case SalaryStatus.PENDING:
                return COLORS.tertiary;
            default:
                return COLORS.muted;
        }
    };

    const getStatusReal = (sl: SalaryResponse) => {
        const today = new Date();
        const due = new Date(sl.dueDate);

        if (sl.status === SalaryStatus.PAID && due < today) {
            return SalaryStatus.OVERDUE
        }
    }

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

    if (detailError || !detailData) {
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
                                source={require('../../../assets/icons/arrow-left.png')}
                            />
                        </View>
                        <Text style={gajiDetailStyles.headerTitle}>
                            Kembali
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                    <Image
                        source={require("../../../assets/icons/error-logo.png")}
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
    
    const renderHtml = (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={gajiDetailStyles.header}>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
                >
                    <View style={gajiDetailStyles.iconPlace}>
                        <Image
                            style={gajiDetailStyles.iconBack}
                            source={require('../../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={gajiDetailStyles.headerTitle}>
                        Kembali
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={{ alignItems: "center", paddingTop: HEADER_HEIGHT + 20, paddingBottom: 30 }}
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
                <View style={gajiDetailStyles.subHeaderDetail}>
                    <Image
                        source={require("../../../assets/icons/payment.png")}
                        style={{ width: 64, height: 64 }}
                    />
                    <Text style={gajiDetailStyles.detailTitle}>
                        Detail Gaji
                    </Text>
                    <Text style={gajiDetailStyles.label}>Dibayar tanggal: {toDate(detailData.paymentDate)}</Text>
                    <Text
                        style={[
                            gajiDetailStyles.cutiStatus,
                            { backgroundColor: getStatusColor(detailData.status) },
                        ]}
                    >
                        {detailData.status}
                    </Text>
                </View>

                <View style={{ width: "90%", paddingVertical: 16, gap:12 }}>
                    <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 16,
                            borderBottomColor: COLORS.primary, borderBottomWidth: 1, 
                            paddingVertical: 4
                        }}>
                            Your Salary Details
                        </Text>
                    </View>
                    <View style={gajiDetailStyles.itemContainer}>
                        <Text style={gajiDetailStyles.sectionTitle}>Nama</Text>
                        <Text style={gajiDetailStyles.infoText}>{detailData.user.name}</Text>
                    </View>
                    <View style={gajiDetailStyles.itemContainer}>
                        <Text style={gajiDetailStyles.sectionTitle}>Tanggal Tenggat Pembayaran</Text>
                        <Text style={gajiDetailStyles.infoText}>{detailData.dueDate ? format(new Date(detailData.dueDate), "dd-MM-yyyy") : "-"}</Text>
                    </View>
                    <View style={gajiDetailStyles.itemContainer}>
                        <Text style={gajiDetailStyles.sectionTitle}>Tanggal Pembayaran</Text>
                        <Text style={gajiDetailStyles.infoText}>{detailData.paymentDate ? format(new Date(detailData.paymentDate), "dd-MM-yyyy") : "-"} ({getStatusReal(detailData)?.toLowerCase()})</Text>
                    </View>
                    <View style={gajiDetailStyles.itemContainer}>
                        <Text style={gajiDetailStyles.sectionTitle}>Salary yang dibayarkan</Text>
                        <Text style={gajiDetailStyles.infoText}>
                            {detailData.amount?.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            })}
                        </Text>
                    </View>
                    <View style={gajiDetailStyles.itemContainer}>
                        <Text style={gajiDetailStyles.sectionTitle}>Dokumen Pendukung</Text>
                        <View style={gajiDetailStyles.labelContainer}>
                            {detailData.paychecks?.length > 0 ? (
                                detailData.paychecks.map((doc: any, index: number) => {
                                    const isImage = doc.mimetype?.startsWith("image/");

                                    if (isImage) {
                                        return photoUris[index] ? (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    setCurrentIndex(index);
                                                    setIsVisible(true);
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: photoUris[index] }}
                                                    style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 10 }}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <Text key={index}>Loading image...</Text>
                                        );
                                    }

                                    return (
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
                                                <Image
                                                    source={require("../../../assets/icons/pdfFile.png")}
                                                    style={{
                                                        width: 70,
                                                        height: 70,
                                                        borderRadius: 10,
                                                    }}
                                                    // contentFit="cover"
                                                />
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
                                                    source={require("../../../assets/icons/download.png")}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        tintColor: COLORS.white,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            ) : (
                                <Text style={{ marginTop: 6, fontSize: 13, color: "#888" }}>
                                    Belum ada file dipilih
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <ImageViewing
                images={imageViewerData}
                imageIndex={currentIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
        </View>
    );

    return renderHtml;
}