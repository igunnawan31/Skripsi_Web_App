import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import { HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import penilaianKpiStyles from "@/assets/styles/rootstyles/kpi/penilaiankpi.styles";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import FilterModalKPIComponent from "@/components/rootComponents/kpiComponent/FilterModalKPIComponent.";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import COLORS from "@/constants/colors";
import { useJawaban } from "@/lib/api/hooks/useJawaban";
import { useKpi } from "@/lib/api/hooks/useKpi";
import { useUser } from "@/lib/api/hooks/useUser";
import { useAuthStore } from "@/lib/store/authStore";
import { StatusIndikatorKPI } from "@/types/kpi/kpiTypes";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const PenilaianKPI = () => {
    const user = useAuthStore((state) => state?.user);
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [assessmentStatus, setAssessmentStatus] = useState<string>("All");

    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { data: kpiData, isLoading: isLoadingKpi, error: isErrorKPI, refetch: refetchKPI, isFetching: isFetchingKPI } = useKpi().fetchAllIndikator({ limit: 1000 });
    const { data: fetchedDataUser, isLoading: isLoadingUser, error: isErrorUser, refetch: refetchUser, isFetching: isFetchingUser } = useUser().fetchAllUser({ limit: 1000 });
    const { data: allAnswersData, isLoading: isLoadingAnswer, error: isErrorAnswer, refetch: refetchAnswers, isFetching: isFetchingAnswers } = useJawaban().fetchAllJawaban({ limit: 1000 });

    const showHandlePopUpFilter = () => setModalVisible(true);
    const closeHandlePopUpFilter = () => setModalVisible(false);

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Data tidak ditemukan...</Text>
            </View>
        )
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const tasksToReview = useMemo(() => {
        if (!kpiData?.data || !user?.id) return [];

        const userMap = new Map();
        if (fetchedDataUser?.data) {
            fetchedDataUser.data.forEach((u: any) => userMap.set(u.id, u.name));
        }

        const allTasks = kpiData.data
            .filter((indikator: any) => indikator.status === StatusIndikatorKPI.ACTIVE)
            .flatMap((indikator: any) => {
                const myEvaluations = indikator.evaluations?.filter(
                    (ev: any) => ev.evaluatorId === user?.id
                ) || [];

                return myEvaluations.map((ev: any) => {
                   const dataRekap = indikator.rekap?.find(
                        (r: any) => r.userId === ev.evaluateeId
                    );
                    const sudahDinilai = (dataRekap?.jumlahPenilai || 0) > 0;
                    
                    return {
                        idUnique: `${indikator.id}-${ev.evaluateeId}`,
                        indikatorId: indikator.id,
                        indikatorPertanyaan: indikator.pertanyaan.length,
                        namaIndikator: indikator.name,
                        description: indikator.description,
                        startDate: indikator.startDate,
                        endDate: indikator.endDate,
                        evaluateeId: ev.evaluateeId,
                        namaTarget: userMap.get(ev.evaluateeId) || ev.evaluatee?.name || "Karyawan",
                        sudahDinilai: sudahDinilai, 
                    };
                });
            });

        if (assessmentStatus === "Sudah Dinilai") {
            return allTasks.filter((task: any) => task.sudahDinilai);
        } 
        if (assessmentStatus === "Perlu Dinilai") {
            return allTasks.filter((task: any) => !task.sudahDinilai);
        }

        return allTasks;
    }, [kpiData, user?.id, fetchedDataUser, assessmentStatus, allAnswersData]);

    useEffect(() => {
        if (tasksToReview.length > 0 && filteredData.length === 0) {
            setFilteredData(tasksToReview);
        }
    }, [tasksToReview]);

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        await refetchKPI();
        await refetchUser();

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };

    const handleFilter = () => {
        let filtered = [...tasksToReview];

        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            filtered = filtered.filter((item: any) => {
                const itemDate = new Date(item.startDate);
                return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
            });
        }

        if (pickerMode === "status" && selectedStatus) {
            filtered = filtered.filter((item: any) => {
                if (selectedStatus === "Sudah Dinilai") return item.sudahDinilai;
                if (selectedStatus === "Belum Dinilai") return !item.sudahDinilai;
                return true;
            });
        }

        setFilteredData(filtered);
        closeHandlePopUpFilter();
    };

    const resetFilter = () => {
        setSelectedStatus(null);
        setStartDate(new Date());
        setFilteredData(tasksToReview);
        closeHandlePopUpFilter();
    };

    const jumlahSudahDinilai = tasksToReview.filter((item: any) => item.sudahDinilai).length;
    const jumlahBelumDinilai = tasksToReview.filter((item: any) => !item.sudahDinilai).length;

    if (isLoadingKpi || isLoadingUser || isLoadingAnswer || showSkeleton || isFetchingKPI || isFetchingUser || isFetchingAnswers) {
        return (
            <View style={cutiStyles.container}>
                <View style={reimburseStyles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBox width={40} height={40} borderRadius={20} />
                        <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
                    </View>
                </View>
                <View style={[reimburseStyles.subHeaderContainer, {alignItems: "center"}]}>
                    <View style={{ gap: 5 }}>
                        <SkeletonBox width={90} height={20} borderRadius={20} />
                        <SkeletonBox width={120} height={20} borderRadius={20} />
                    </View>
                    <SkeletonBox width={60} height={60} borderRadius={30} />
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

    if (isErrorKPI || isErrorUser || isErrorAnswer) {
        return(
            <View style={penilaianKpiStyles.container}>
                <View style={penilaianKpiStyles.header}>
                    <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => router.push("/(tabs)/home")}
                    >
                        <View style={penilaianKpiStyles.iconPlace}>
                            <Image
                                style={penilaianKpiStyles.iconBack}
                                source={require('../../../assets/icons/arrow-left.png')}
                            />
                        </View>
                        <Text style={penilaianKpiStyles.headerTitle}>
                            Kembali
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 44 }}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing || isFetchingKPI || isFetchingUser}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                            progressViewOffset={HEADER_HEIGHT}
                        />
                    }
                >
                    <View style={penilaianKpiStyles.subHeaderContainer}>
                        <View>
                            <Text style={penilaianKpiStyles.subHeaderTitle}>
                                Penilaian Kinerja Karyawan
                            </Text>
                            <Text style={penilaianKpiStyles.subHeaderDescription}>
                                Nilai Kinerja Karyawan
                            </Text>
                        </View>
                        <View style={penilaianKpiStyles.logoSubHeaderContainer}>
                            <Image
                                style={penilaianKpiStyles.logoSubHeader}
                                source={require("../../../assets/icons/penilaian-kpi.png")}
                            />
                        </View>
                    </View>
                    <View style={cutiStyles.cutiContainer}>
                        <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                            Bulan {startDate ? startDate.toLocaleString("default", { month: "long", year: "numeric" }): "All"}
                        </Text>
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
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={penilaianKpiStyles.container}>
            <View style={penilaianKpiStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.push("/(tabs)/home")}
                >
                    <View style={penilaianKpiStyles.iconPlace}>
                        <Image
                            style={penilaianKpiStyles.iconBack}
                            source={require('../../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={penilaianKpiStyles.headerTitle}>
                        Kembali
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 44, }}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetchingKPI || isFetchingUser}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                        progressViewOffset={HEADER_HEIGHT}
                    />
                }
            >
                <View style={penilaianKpiStyles.subHeaderContainer}>
                    <View>
                        <Text style={penilaianKpiStyles.subHeaderTitle}>
                            Penilaian Kinerja Karyawan
                        </Text>
                        <Text style={penilaianKpiStyles.subHeaderDescription}>
                            Nilai Kinerja Karyawan
                        </Text>
                    </View>
                    <View style={penilaianKpiStyles.logoSubHeaderContainer}>
                        <Image
                            style={penilaianKpiStyles.logoSubHeader}
                            source={require("../../../assets/icons/penilaian-kpi.png")}
                        />
                    </View>
                </View>
                <View style={penilaianKpiStyles.bulanContainer}>
                    <Text style={penilaianKpiStyles.bulanText}>
                        Bulan {startDate ? startDate.toLocaleString("default", { month: "long" }): "All"}
                    </Text>
                </View>
                <View style={penilaianKpiStyles.KPIStatusContainer}>
                    <View style={penilaianKpiStyles.KPIStatus}>
                        <Text style={[penilaianKpiStyles.titleKPIStatus, { color: COLORS.success }]}>
                            KPI Sudah Dinilai
                        </Text>
                        <Image 
                            style={[penilaianKpiStyles.logoKPI, { tintColor: COLORS.success }]}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={[penilaianKpiStyles.textKPIStatus, { color: COLORS.success }]}>
                            {jumlahSudahDinilai}
                        </Text>
                    </View>
                    <View style={penilaianKpiStyles.KPIStatus}>
                        <Text style={[penilaianKpiStyles.titleKPIStatus, { color: COLORS.primary}]}>
                            KPI Belum Dinilai
                        </Text>
                        <Image 
                            style={[penilaianKpiStyles.logoKPI, { tintColor: COLORS.primary }]}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                        <Text style={[penilaianKpiStyles.textKPIStatus, { color: COLORS.primary }]}>
                            {jumlahBelumDinilai}
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity
                        style={penilaianKpiStyles.filterContainer}
                        onPress={showHandlePopUpFilter}
                    >
                        <Text style={penilaianKpiStyles.filterText}>Terapkan Filter</Text>
                    </TouchableOpacity>
                    {filteredData.length > 0 ? (
                        filteredData.map((item: any) => (
                            <View key={item.idUnique} style={penilaianKpiStyles.listContainer}>
                                <View style={penilaianKpiStyles.listHeader}>
                                    <Text style={penilaianKpiStyles.name}>{item.namaTarget}</Text>
                                    <Text style={penilaianKpiStyles.date}>
                                        {format(new Date(item.startDate), "dd MMM")} - {format(new Date(item.endDate), "dd MMM yyyy")}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Indikator - {item.namaIndikator}</Text>
                                <View style={penilaianKpiStyles.statusContainer}>
                                    <View style={[penilaianKpiStyles.statusBullet, { backgroundColor: item.sudahDinilai ? COLORS.success : COLORS.error }]} />
                                    <Text>{item.sudahDinilai ? "Sudah Dinilai" : "Belum Dinilai"}</Text>
                                </View>
                                
                                <View style={{ height: 1, backgroundColor: COLORS.border, marginTop: 12 }} />
                                
                                <TouchableOpacity
                                    key={item.indikatorId}
                                    onPress={() => router.push(`/(kpi)/penilaian-kpi/${item.indikatorId}?evaluatee=${item.evaluateeId}`)}
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
                                        style={{ tintColor: COLORS.primary, width: 12, height: 12 }}
                                        source={require('../../../assets/icons/arrow-right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
                            <Image
                                source={require("../../../assets/icons/not-found.png")}
                                style={{ width: 72, height: 72, }}
                            />
                            <Text style={{ textAlign: "center", marginTop: 10, color: COLORS.textPrimary, fontWeight: "bold", fontSize: 16, }}>
                                Tidak ada penilaian indikator
                            </Text>
                            <Text style={{ textAlign: "center", marginTop: 5, color: COLORS.muted, fontSize: 12, }}>
                                Mohon untuk mengecek kembali nanti
                            </Text>
                        </View> 
                    )}
                </View>
                <FilterModalKPIComponent
                    visible={modalVisible}
                    onClose={closeHandlePopUpFilter}
                    pickerMode={pickerMode}
                    setPickerMode={setPickerMode}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    showPicker={showPicker}
                    setShowPicker={setShowPicker}
                    pickerTarget={pickerTarget}
                    setPickerTarget={setPickerTarget}
                    handleFilter={handleFilter}
                    resetFilter={resetFilter}
                />
            </ScrollView>
        </View>
    )  
}

export default PenilaianKPI;