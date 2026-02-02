import absenDetailStyles from "@/assets/styles/rootstyles/absen/absendetail.style";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
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
import { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import ImageViewing from "react-native-image-viewing";

export default function DetailSalary() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const [photoUris, setPhotoUris] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const openImageModal = (uri: string) => setSelectedImage(uri);
    const [visible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageViewerData = photoUris.filter(Boolean).map(uri => ({ uri }));
    
    const { data: detailData, isLoading: isDetailLoading, error: detailError } = useSalary().fetchSalaryById(idParam);
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

    useEffect(() => {
        if (!detailData?.paychecks) return;

        detailData.paychecks.forEach((doc: any, index: number) => {
            if (doc.mimetype?.startsWith("image/")) {
                loadPhoto(doc.path, index);
            }
        });
    }, [detailData]);

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

    if (isDetailLoading) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Memuat data salary...</Text>
            </View>
        );
    }

    if (!detailData) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Data salary tidak ditemukan.</Text>
            </View>
        );
    };
    
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={absenDetailStyles.header}>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
                >
                    <View style={absenDetailStyles.iconPlace}>
                        <Image
                            style={absenDetailStyles.iconBack}
                            source={require('../../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={absenDetailStyles.headerTitle}>
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
                        source={require("../../../assets/icons/payment.png")}
                        style={{ width: 64, height: 64 }}
                    />
                    <Text style={cutiDetailStyles.detailTitle}>
                        Detail Gaji
                    </Text>
                    <Text style={cutiDetailStyles.label}>Dibayar tanggal: {toDate(detailData.paymentDate)}</Text>
                    <Text
                        style={[
                            cutiDetailStyles.cutiStatus,
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
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Nama</Text>
                        <Text style={cutiDetailStyles.infoText}>{detailData.user.name}</Text>
                    </View>
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Tanggal Tenggat Pembayaran</Text>
                        <Text style={cutiDetailStyles.infoText}>{detailData.dueDate ? format(new Date(detailData.dueDate), "dd-MM-yyyy") : "-"}</Text>
                    </View>
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Tanggal Pembayaran</Text>
                        <Text style={cutiDetailStyles.infoText}>{detailData.paymentDate ? format(new Date(detailData.paymentDate), "dd-MM-yyyy") : "-"} ({getStatusReal(detailData)?.toLowerCase()})</Text>
                    </View>
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Salary yang dibayarkan</Text>
                        <Text style={cutiDetailStyles.infoText}>
                            {detailData.amount?.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            })}
                        </Text>
                    </View>
                    <View style={cutiDetailStyles.itemContainer}>
                        <Text style={cutiDetailStyles.sectionTitle}>Dokumen Pendukung</Text>
                        <View style={cutiDetailStyles.labelContainer}>
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
    )
}