import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import ListDataReimburseComponent from "@/components/rootComponents/reimburseComponent/ListDataReimburseComponent";
import COLORS from "@/constants/colors";
import { dummyReimburse, ReimburseStatus } from "@/data/dummyReimburse";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Text, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FilterModalReimburseComponent from "@/components/rootComponents/reimburseComponent/FilterModalReimburseComponent";
import { dummyRekapKPIAll } from "@/data/dummyRekapKPI";
import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import { dummyIndikatorKPI } from "@/data/dummyIndikatorKPI";

const HasilKPIPage = () => {
    const router = useRouter();
    const rekap = dummyRekapKPIAll[0];

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
                    <Text style={reimburseStyles.headerTitle}>Hasil Kinerja Karyawan</Text>
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
            >
                <View style={reimburseStyles.subHeaderContainer}>
                    <View>
                        <Text style={reimburseStyles.subHeaderTitle}>
                            Hasil KPI
                        </Text>
                        <Text style={reimburseStyles.subHeaderDescription}>
                            Lihat semua hasil KPI
                        </Text>
                    </View>
                    <View style={reimburseStyles.logoSubHeaderContainer}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require("../../../assets/icons/hasil-kpi.png")}
                        />
                    </View>
                </View> 
               <View style={styles.kpiSummaryGrid}>
                    <View style={[styles.kpiCard, { backgroundColor: COLORS.white }]}>
                        <Image source={require("../../../assets/icons/gaji.png")} style={styles.kpiIcon} />
                        <Text style={styles.kpiTitle}>Total Nilai</Text>
                        <Text style={styles.kpiSubtitle}>{rekap.totalNilaiKeseluruhan}</Text>
                    </View>
                    <View style={[styles.kpiCard, { backgroundColor: COLORS.white }]}>
                        <Image source={require("../../../assets/icons/penilaian-kpi.png")} style={styles.kpiIcon} />
                        <Text style={styles.kpiTitle}>Rata-rata</Text>
                        <Text style={styles.kpiSubtitle}>{rekap.rataRataNilaiKeseluruhan}</Text>
                    </View>
                    <View style={[styles.kpiCard, { backgroundColor: COLORS.white }]}>
                        <Image source={require("../../../assets/icons/calendar.png")} style={styles.kpiIcon} />
                        <Text style={styles.kpiTitle}>Periode</Text>
                        <Text style={styles.kpiSubtitle}>{rekap.jumlahPeriode} Periode</Text>
                    </View>
                </View>
                <View style={{ width: "90%" }}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={homeStyles.titleSection}>
                            KPI Kamu
                        </Text>
                        <Text style={homeStyles.descriptionSection}>
                            Lihat nilai KPI Kamu
                        </Text>
                    </View>
                    {rekap.detailPeriode.map((item, index) => {
                        const periode = dummyIndikatorKPI;
                        const tanggalPeriode = `${periode.periodeMulai} s/d ${periode.periodeBerakhir}`;

                        return (
                            item.status === "available" ? (
                                <View key={index} style={reimburseStyles.listContainer}>
                                    <View>
                                        <View style={reimburseStyles.listHeader}>
                                            <Text style={reimburseStyles.name}>{item.id}</Text>
                                            <View style={reimburseStyles.timeBox}>
                                                <Image
                                                    source={require("../../../assets/icons/calendar.png")}
                                                    style={reimburseStyles.icon}
                                                />
                                                <Text style={reimburseStyles.timeText}>
                                                    {tanggalPeriode}
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                        <Text>Total Nilai: {item.status === "available" ? item.totalNilai : "-"}</Text>
                                        <Text>Rata-rata: {item.status === "available" ? item.rataRataNilai : "-"}</Text>
                                        </View>
                                        <View style={{ height: 1, backgroundColor: COLORS.border, marginTop: 12 }} />

                                        <TouchableOpacity
                                            key={item.userDinilai.userId}
                                            onPress={() => router.push(`/(kpi)/hasil-kpi/${item.userDinilai.userId}`)}
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
                                                style={reimburseStyles.iconCalendar}
                                                source={require('../../../assets/icons/arrow-right.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View key={index} style={[reimburseStyles.listContainerNotAvailable]}>
                                    <View>
                                        <View style={reimburseStyles.listHeader}>
                                            <Text style={[reimburseStyles.name, { color: COLORS.textMuted }]}>{item.id}</Text>
                                            <View style={reimburseStyles.timeBox}>
                                                <Image
                                                    source={require("../../../assets/icons/calendar.png")}
                                                    style={[reimburseStyles.icon, { tintColor: COLORS.textMuted }]}
                                                />
                                                <Text style={[reimburseStyles.timeText, { color: COLORS.textMuted }]}>
                                                    {tanggalPeriode}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text style={[reimburseStyles.dateText, { color: COLORS.textMuted }]}>Total Nilai: {item.status === "available" ? item.totalNilai : "-"}</Text>
                                        <Text style={[reimburseStyles.dateText, { color: COLORS.textMuted }]}>Rata-rata: {item.status === "available" ? item.rataRataNilai : "-"}</Text>

                                        <View style={{ height: 1, marginTop: 12 }} />
                                        <View
                                            style={{
                                                marginTop: 12,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                gap: 5,
                                            }}
                                        >
                                            <Text style={[reimburseStyles.dateText, { color: COLORS.textMuted }]}>Lebih Lanjut</Text>
                                            <Image
                                                style={[reimburseStyles.iconCalendar, { tintColor: COLORS.textMuted }]}
                                                source={require('../../../assets/icons/arrow-right.png')}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )
                        );
                    })}
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    kpiSummaryGrid: {
        width: "90%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    kpiCard: {
        width: "48%",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },

    kpiIcon: {
        width: 28,
        height: 28,
        marginBottom: 10,
    },

    kpiTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },

    kpiSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
});


export default HasilKPIPage;