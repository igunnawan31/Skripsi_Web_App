import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import ListDataReimburseComponent from "@/components/rootComponents/reimburseComponent/ListDataReimburseComponent";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView } from "react-native";
import { Text, TouchableOpacity, View } from "react-native"
import FilterModalReimburseComponent from "@/components/rootComponents/reimburseComponent/FilterModalReimburseComponent";
import { useReimburse } from "@/lib/api/hooks/useReimburse";
import { ReimburseResponse } from "@/types/reimburse/reimburseTypes";
import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ReimbursePage = () => {
    const router = useRouter();
    const { data, isLoading, error, refetch, isFetching } = useReimburse().fetchAllReimburse();
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [filteredData, setFilteredData] = useState<ReimburseResponse[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("month");
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState("month");

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

        if (pickerMode === "month" && startDate) {
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            filtered = filtered.filter((item: ReimburseResponse) => {
                const itemDate = new Date(item.createdAt);
                return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
            });
        }

        if (pickerMode === "approvalStatus" && selectedStatus) {
            filtered = filtered.filter((item: ReimburseResponse) => item.approvalStatus === selectedStatus);
        }

        setFilteredData(filtered);
        closeHandlePopUpFilter();
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
            <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                <View style={reimburseStyles.header}>
                    <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => router.push("/(tabs)/home")}
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
                <KeyboardAwareScrollView
                    style={{ flex: 1, backgroundColor: COLORS.background }}
                    contentContainerStyle={{
                        alignItems: "center",
                        paddingBottom: 20
                    }}
                    enableOnAndroid={true}
                    extraScrollHeight={150}
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
                    <View style={reimburseStyles.subHeaderContainer}>
                        <View>
                            <Text style={reimburseStyles.subHeaderTitle}>
                                Ajukan Reimburse
                            </Text>
                            <Text style={reimburseStyles.subHeaderDescription}>
                                Lihat status reimburse yang kamu buat
                            </Text>
                        </View>
                        <View style={reimburseStyles.logoSubHeaderContainer}>
                            <Image
                                style={reimburseStyles.logoSubHeader}
                                source={require("../../../assets/icons/reimburse.png")}
                            />
                        </View>
                    </View>
                    <View style={cutiStyles.cutiContainer}>
                        <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                            Bulan {startDate ? startDate.toLocaleString("default", { month: "long", year: "numeric" }): "All"}
                        </Text>
                        <TouchableOpacity 
                            style={cutiStyles.ajukanCutiButton}
                            onPress={() => router.push('/(reimburse)/reimburse/create')}
                        >
                            <Image
                                source={require("../../../assets/icons/add.png")}
                                style={cutiStyles.icons}
                            />
                            <Text style={cutiStyles.textAjukanCuti}>Ajukan Reimburse</Text>
                        </TouchableOpacity>
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
                </KeyboardAwareScrollView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={reimburseStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.push("/(tabs)/home")}
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
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: COLORS.background }}
                contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 20
                }}
                enableOnAndroid={true}
                extraScrollHeight={150}
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
                <View style={reimburseStyles.subHeaderContainer}>
                    <View>
                        <Text style={reimburseStyles.subHeaderTitle}>
                            Ajukan Reimburse
                        </Text>
                        <Text style={reimburseStyles.subHeaderDescription}>
                            Lihat status reimburse yang kamu buat
                        </Text>
                    </View>
                    <View style={reimburseStyles.logoSubHeaderContainer}>
                        <Image
                            style={reimburseStyles.logoSubHeader}
                            source={require("../../../assets/icons/reimburse.png")}
                        />
                    </View>
                </View>
                <View style={reimburseStyles.cutiContainer}>
                    <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
                        Bulan {startDate ? startDate.toLocaleString("default", { month: "long", year: "numeric" }): "All"}
                    </Text>
                    <TouchableOpacity 
                        style={reimburseStyles.ajukanCutiButton}
                        onPress={() => router.push('/(reimburse)/reimburse/create')}
                    >
                        <Image
                            source={require("../../../assets/icons/add.png")}
                            style={reimburseStyles.icons}
                        />
                        <Text style={reimburseStyles.textAjukanCuti}>Ajukan Reimburse</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={reimburseStyles.filterContainer}
                    onPress={showHandlePopUpFilter}
                >
                    <Text style={reimburseStyles.filterText}>Terapkan Filter</Text>
                </TouchableOpacity>
                <ListDataReimburseComponent data={filteredData} />
            </KeyboardAwareScrollView>
            <FilterModalReimburseComponent
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
        </View>
    );
}

export default ReimbursePage;