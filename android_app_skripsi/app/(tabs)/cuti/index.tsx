import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import COLORS from "@/constants/colors";
import { CutiStatus } from "@/types/enumTypes";
import { useEffect, useState } from "react";
import { Image, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import ListDataCutiComponent from "@/components/rootComponents/cutiComponent/ListDataCutiComponent";
import { useCuti } from "@/lib/api/hooks/useCuti";
import { CutiResponse } from "@/types/cuti/cutiTypes";
import { historyStyles } from "@/assets/styles/rootstyles/history.styles";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { useAuthStore } from "@/lib/store/authStore";

const CutiPage = () => {
    const user = useAuthStore((state) => state.user);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const { data, isLoading, error, refetch, isFetching} = useCuti().fetchCutiByUserId(user?.id);
    const [filteredData, setFilteredData] = useState<CutiResponse[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");
    const router = useRouter();

    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    useEffect(() => {
        if (data?.data) setFilteredData(data?.data);
    }, [data]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Data tidak ditemukan...</Text>
            </View>
        )
    }

    const totalDiterima = (cuti: any[]) => {
        if (!Array.isArray(cuti)) return 0;
        return cuti.filter((item) => item.status === "DITERIMA").length;
    };

    const totalDitolak = (cuti: any[]) => {
        if (!Array.isArray(cuti)) return 0;
        return cuti.filter((item) => item.status === "DITOLAK").length;
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

    const handleFilter = () => {
        let filtered = data?.data || [];
        console.log("filtered", filtered);

        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            filtered = filtered.filter((item: CutiResponse) => {
                const itemDate = new Date(item.createdAt);
                return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
            });
        }

        if (pickerMode === "status" && selectedStatus) {
            filtered = filtered.filter((item: CutiResponse) => item.status === selectedStatus);
        }

        setFilteredData(filtered);
        closeHandlePopUpFilter();
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            if (pickerTarget === "month") setStartDate(selectedDate);
        }
    };
  
    const resetFilter = () => {
        if (data?.data) setFilteredData(data.data);
        setStartDate(null);
        setSelectedStatus(null);
        setPickerMode("month");
        closeHandlePopUpFilter();
    };

    if (isLoading || showSkeleton || isFetching) {
        return (
            <View style={cutiStyles.container}>
                <View style={cutiStyles.header}>
                    <SkeletonBox width={40} height={40} borderRadius={20} />
                    <View style={[cutiStyles.textHeaderContainer, { gap: 6}]}>
                        <SkeletonBox width={80} height={20} style={{ marginLeft: 12 }} />
                        <SkeletonBox width={160} height={16} style={{ marginLeft: 12 }} />
                    </View>
                </View>

                <View style={cutiStyles.cutiContainer}>
                    <SkeletonBox width={80} height={20} borderRadius={14} />
                    <SkeletonBox width={120} height={40} style={{ marginLeft: 10 }} />
                </View>

                <View style={cutiStyles.cutiAvailableContainer}>
                    <SkeletonBox width={120} height={100} style={{ width: "48%" }} />
                    <SkeletonBox width={120} height={100} style={{ width: "48%" }} />
                </View>

                <View style={[cutiStyles.filterContainer, {backgroundColor: "transparent"}]}>
                    <SkeletonBox width={120} height={40} style={{ width: "100%" }} />
                </View>

                {[1, 2, 3, 4].map((_, i) => (
                    <View
                        key={i}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 20,
                            backgroundColor: "transparent",
                        }}
                    >
                        <SkeletonBox width={100} height={120} borderRadius={10} style={{ width: "90%" }} />
                    </View>
                ))}
            </View>
        );
    }

    if (error) {
        return(
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={cutiStyles.container}>
                    <View style={cutiStyles.header}>
                        <View style={cutiStyles.logoHeaderContainer}>
                            <Image
                                style={cutiStyles.logoHeader}
                                source={require("../../../assets/icons/cuti.png")}
                            />
                        </View>
                        <View style={cutiStyles.textHeaderContainer}>
                            <Text style={cutiStyles.headerTitle}>
                                Cuti Status
                            </Text>
                            <Text style={cutiStyles.headerDescription}>
                                Lihat status pengajuan cuti yang kamu buat
                            </Text>
                        </View>
                    </View>
                    <View style={cutiStyles.cutiContainer}>
                        <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                            Bulan {startDate ? startDate.toLocaleString("default", { month: "long", year: "numeric" }): "All"}
                        </Text>
                        <TouchableOpacity 
                            style={cutiStyles.ajukanCutiButton}
                            onPress={() => router.push('/(cuti)/create')}
                        >
                            <Image
                                source={require("../../../assets/icons/add.png")}
                                style={cutiStyles.icons}
                            />
                            <Text style={cutiStyles.textAjukanCuti}>Ajukan Cuti</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={cutiStyles.cutiAvailableContainer}>
                        <View style={cutiStyles.cutiAvailable}>
                            <Text style={cutiStyles.titleCutiAccepted}>
                                Cuti Diterima
                            </Text>
                            <Image 
                                style={cutiStyles.logoCutiAccepted}
                                source={require("../../../assets/icons/cuti.png")}
                            />
                            <Text style={cutiStyles.textCutiAccepted}>
                                {totalDiterima(data?.data ?? [])}
                            </Text>
                        </View>
                        <View style={cutiStyles.cutiAvailable}>
                            <Text style={cutiStyles.titleCutiRejected}>
                                Cuti Ditolak
                            </Text>
                            <Image 
                                style={cutiStyles.logoCutiRejected}
                                source={require("../../../assets/icons/cuti.png")}
                            />
                            <Text style={cutiStyles.textCutiRejected}>
                                {totalDitolak(data?.data ?? [])}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={cutiStyles.filterContainer}
                        onPress={showHandlePopUpFilter}
                    >
                        <Text style={cutiStyles.filterText}>Terapkan Filter</Text>
                    </TouchableOpacity>
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
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing || isFetching}
                    onRefresh={onRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                />
            }
        >
            <View style={cutiStyles.container}>
                <View style={cutiStyles.header}>
                    <View style={cutiStyles.logoHeaderContainer}>
                        <Image
                            style={cutiStyles.logoHeader}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                    </View>
                    <View style={cutiStyles.textHeaderContainer}>
                        <Text style={cutiStyles.headerTitle}>
                            Cuti Status
                        </Text>
                        <Text style={cutiStyles.headerDescription}>
                            Lihat status pengajuan cuti yang kamu buat
                        </Text>
                    </View>
                </View>
                <View style={cutiStyles.cutiContainer}>
                    <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                        Bulan {startDate ? startDate.toLocaleString("default", { month: "long", year: "numeric" }): "All"}
                    </Text>
                    <TouchableOpacity 
                        style={cutiStyles.ajukanCutiButton}
                        onPress={() => router.push('/(cuti)/create')}
                    >
                        <Image
                            source={require("../../../assets/icons/add.png")}
                            style={cutiStyles.icons}
                        />
                        <Text style={cutiStyles.textAjukanCuti}>Ajukan Cuti</Text>
                    </TouchableOpacity>
                </View>
                <View style={cutiStyles.cutiAvailableContainer}>
                    <View style={cutiStyles.cutiAvailable}>
                        <Text style={cutiStyles.titleCutiAccepted}>
                            Cuti Diterima
                        </Text>
                        <Image 
                            style={cutiStyles.logoCutiAccepted}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={cutiStyles.textCutiAccepted}>
                            {totalDiterima(data?.data ?? [])}
                        </Text>
                    </View>
                    <View style={cutiStyles.cutiAvailable}>
                        <Text style={cutiStyles.titleCutiRejected}>
                            Cuti Ditolak
                        </Text>
                        <Image 
                            style={cutiStyles.logoCutiRejected}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={cutiStyles.textCutiRejected}>
                            {totalDitolak(data?.data ?? [])}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={cutiStyles.filterContainer}
                    onPress={showHandlePopUpFilter}
                >
                    <Text style={cutiStyles.filterText}>Terapkan Filter</Text>
                </TouchableOpacity>
                <>
                    <Modal
                        isVisible={modalVisible}
                        onBackdropPress={closeHandlePopUpFilter}
                        style={historyStyles.modalFilterContainer}
                    >
                        <View style={historyStyles.FilterModal}>
                            <Text style={historyStyles.modalTitle}>
                                Pilih Mode Filter
                            </Text>
                            <View style={historyStyles.modeSelector}>
                                <TouchableOpacity
                                    style={[
                                        cutiStyles.modeButton,
                                        pickerMode === "month" && { backgroundColor: COLORS.primary },
                                    ]}
                                    onPress={() => setPickerMode("month")}
                                >
                                    <Text
                                        style={[
                                            cutiStyles.modeText,
                                            pickerMode === "month" && { color: COLORS.white },
                                        ]}
                                    >
                                        Per Bulan
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        cutiStyles.modeButton,
                                        pickerMode === "status" && { backgroundColor: COLORS.primary },
                                    ]}
                                    onPress={() => setPickerMode("status")}
                                >
                                    <Text
                                        style={[
                                            cutiStyles.modeText,
                                            pickerMode === "status" && { color: COLORS.white },
                                        ]}
                                    >
                                        Berdasarkan Status
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {pickerMode === "month" ? (
                                <View style={historyStyles.modalPicker}>
                                    <Text style={historyStyles.modalLabel}>Pilih Bulan</Text>
                                    <TouchableOpacity
                                        style={historyStyles.buttonDate}
                                        onPress={() => {
                                            setPickerTarget("month");
                                            setShowPicker(true);
                                        }}
                                    >
                                        <Text style={historyStyles.dateText}>
                                            {startDate
                                            ? startDate.toLocaleString("default", { month: "long", year: "numeric" })
                                            : "Pilih bulan"}
                                        </Text>
                                    </TouchableOpacity>
                                    {showPicker && (
                                        <DateTimePicker
                                            value={startDate || new Date()}
                                            mode="date"
                                            display={Platform.OS === "ios" ? "spinner" : "default"}
                                            onChange={onChangeDate}
                                        />
                                    )}
                                </View>
                            ) : (
                                <View style={cutiStyles.modalPicker}>
                                    <Text style={cutiStyles.modalLabel}>Pilih Status Cuti</Text>

                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                        {Object.values(CutiStatus).map((status) => (
                                            <TouchableOpacity
                                                key={status}
                                                onPress={() => setSelectedStatus(status)}
                                                style={[
                                                    cutiStyles.modeButton,
                                                    selectedStatus === status && {
                                                        backgroundColor: COLORS.primary,
                                                        borderWidth: 0,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        cutiStyles.modeText,
                                                        selectedStatus === status && { color: COLORS.white },
                                                    ]}
                                                >
                                                    {status}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity style={historyStyles.cancelButton} onPress={resetFilter}>
                                <Text style={historyStyles.cancelText}>Hapus Filter</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={historyStyles.applyButton} onPress={handleFilter}>
                                <Text style={historyStyles.applyText}>Terapkan Filter</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <ListDataCutiComponent data={filteredData} />
                </>
            </View>
        </ScrollView>
    )
}

export default CutiPage;