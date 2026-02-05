import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, RefreshControl} from "react-native";
import COLORS from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import { useEvent } from "@/lib/api/hooks/useEvent";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { ProjectResponse } from "@/types/project/projectTypes";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { gajiDetailStyles, HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";

const DetailEventFormPage = () => {
    const { id } = useLocalSearchParams();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const router = useRouter();
    const { data: detailData, isLoading: isDetailLoading, error: detailError,  refetch, isFetching } = useEvent().fetchEventById(idParam);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        await refetch();

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
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

    const toWIB = (dateString: string) => {
        const zoned = toZonedTime(dateString, "Asia/Jakarta");
        return format(zoned, "HH:mm");
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (isDetailLoading || showSkeleton) {
        return (
            <View style={{ alignItems: "center",flex: 1, backgroundColor: COLORS.background }}>
                <View style={reimburseStyles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBox width={40} height={40} borderRadius={20} />
                        <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
                    </View>
                </View>
                <View style={reimburseStyles.subHeaderContainer}>
                    <View style={{ gap: 5 }}>
                        <SkeletonBox width={80} height={24} borderRadius={20} />
                        <SkeletonBox width={120} height={16} />
                    </View>
                    <View>
                        <SkeletonBox width={40} height={40} borderRadius={20} />
                    </View>
                </View>

                <View style={{ width: "90%", gap:12 }}>
                    {[1, 2, 3, 4].map((_, i) => (
                        <View
                            key={i}
                            style={{
                                flexDirection: "column",
                                backgroundColor: "transparent",
                                gap:10
                            }}
                        >
                            <SkeletonBox width={100} height={24}/>
                            <SkeletonBox width={200} height={36} style={{ width: "100%" }}/>
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
                <View style={reimburseStyles.header}>
                    <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => router.back()}
                    >
                        <View style={reimburseStyles.iconPlace}>
                            <Image
                                style={reimburseStyles.iconBack}
                                source={require("../../../assets/icons/arrow-left.png")}
                            />
                        </View>
                        <Text style={reimburseStyles.headerTitle}>Kembali</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                    <Image
                        source={require("../../../assets/icons/not-found.png")}
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
                <View style={reimburseStyles.header}>
                    <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => router.back()}
                    >
                        <View style={reimburseStyles.iconPlace}>
                            <Image
                                style={reimburseStyles.iconBack}
                                source={require("../../../assets/icons/arrow-left.png")}
                            />
                        </View>
                        <Text style={reimburseStyles.headerTitle}>Kembali</Text>
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

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={reimburseStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
                >
                    <View style={reimburseStyles.iconPlace}>
                        <Image
                            style={reimburseStyles.iconBack}
                            source={require("../../../assets/icons/arrow-left.png")}
                        />
                    </View>
                    <Text style={reimburseStyles.headerTitle}>Kembali</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                style={{ flex: 1, backgroundColor: COLORS.background }}
                contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 20
                }}
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
                <View style={reimburseStyles.subHeaderContainer}>
                    <View>
                        <Text style={reimburseStyles.subHeaderTitle}>
                            Detail Event
                        </Text>
                        <Text style={reimburseStyles.subHeaderDescription}>
                            Lihat detail event untuk {detailData.title}
                        </Text>
                    </View>
                    <View style={reimburseStyles.logoSubHeaderContainer}>
                        <Image
                            style={reimburseStyles.logoSubHeader}
                            source={require("../../../assets/icons/calendar.png")}
                        />
                    </View>
                </View>
                <View style={{ width: "90%", gap: 5 }}>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Judul Event</Text>
                        <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{detailData.title}</Text>
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Tanggal Event</Text>
                        <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{toDate(detailData.eventDate)}</Text>
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Waktu Event</Text>
                        <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>{toWIB(detailData.eventDate)}</Text>
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Ditujukan Kepada</Text>
                        {detailData.project ? (
                            <Text style={[cutiDetailStyles.input, { opacity: 0.5 }]}>
                                {detailData.project.name}
                            </Text>
                        ) : (
                            <Text  
                                style={[cutiDetailStyles.input, { opacity: 0.5 }]}
                            >
                                All
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default DetailEventFormPage;