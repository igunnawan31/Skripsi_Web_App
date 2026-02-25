import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import { gajiDetailStyles } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import penilaianKpiStyles from "@/assets/styles/rootstyles/kpi/penilaiankpi.styles";
import PenilaianKPIComponent from "@/components/rootComponents/kpiComponent/PenilaianKPIComponent";
import PenilaianKPIModalComponent from "@/components/rootComponents/kpiComponent/PenilaianKPIModalComponent";
import NotificationModal from "@/components/rootComponents/NotificationModal";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import COLORS from "@/constants/colors";
import { useJawaban } from "@/lib/api/hooks/useJawaban";
import { useKpi } from "@/lib/api/hooks/useKpi";
import { KategoriPertanyaanKPI } from "@/types/kpi/kpiTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DetailPenilaianKPIUser() {
    const { id, evaluatee } = useLocalSearchParams();
    const [ formJawaban, setFormJawaban ] = useState<{ 
        [key: string]: {nilai: number | null, notes: string} 
    }>({});
    const [page, setPage] = useState(0);

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const router = useRouter();

    const [notification, setNotification] = useState<{
        visible: boolean;
        status: "success" | "error";
        title?: string;
        description?: string;
    }>({
        visible: false,
        status: "success",
    });

    const { data: detailDataPertanyaan, isLoading: isDetailPertanyaanLoading, error: detailPertanyaanError, refetch: refetchPertanyaan, isFetching: isFetchingPertanyaan } = useKpi().fetchAllQuestionByIdIndikator({id: String(id)});
    const { data: detailDataJawaban, isLoading: isDetailJawabanLoading, error: detailJawabanError, refetch: refetchJawaban, isFetching: isFetchingJawaban} = useJawaban().fetchAllJawaban();
    const { mutate: createAnswer, isPending } = useJawaban().createAnswer();

    const jawabanMilikTarget = detailDataJawaban?.data?.filter(
        (j: any) => j.evaluatee?.id === evaluatee && j.indikatorId === id
    ) || [];
    const sudahDinilai = jawabanMilikTarget.length > 0;

    const pertanyaanByCategory = (detailDataPertanyaan?.data || []).reduce((acc: any, p: any) => {
        const kategori = p.kategori || KategoriPertanyaanKPI.KINERJA; 
        if (!acc[kategori]) acc[kategori] = [];
        acc[kategori].push(p);
        return acc;
    }, {});

    const categoriesQuestion = Object.entries(pertanyaanByCategory) as [string, any[]][];

    const allAnswered = (detailDataPertanyaan?.data || []).every((p: any) => 
        formJawaban[p.id]?.nilai !== null && formJawaban[p.id]?.nilai !== undefined
    );

    // const hitungNilaiAkhir = () => {
    //     if (sudahDinilai) {
    //         let totalWeightedScore = 0;
    //         let totalBobot = 0;

    //         jawabanMilikTarget.forEach((j: any) => {
    //             const pertanyaan = detailDataPertanyaan?.data?.find((p: any) => p.id === j.pertanyaanId);
    //             const bobot = pertanyaan?.bobot || 1;
    //             totalWeightedScore += (j.nilai * bobot);
    //             totalBobot += bobot;
    //         });

    //         return totalBobot > 0 ? (totalWeightedScore / totalBobot).toFixed(2) : "0";
    //     } else {
    //         let totalWeightedScore = 0;
    //         let totalBobot = 0;

    //         Object.entries(formJawaban).forEach(([pertanyaanId, data]) => {
    //             if (data.nilai !== null) {
    //                 const pertanyaan = detailDataPertanyaan?.data?.find((p: any) => p.id === pertanyaanId);
    //                 const bobot = pertanyaan?.bobot || 1;
    //                 totalWeightedScore += (data.nilai * bobot);
    //                 totalBobot += bobot;
    //             }
    //         });

    //         return totalBobot > 0 ? (totalWeightedScore / totalBobot).toFixed(2) : "0";
    //     }
    // };

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        await refetchPertanyaan();
        await refetchJawaban();

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

    useEffect(() => {
        if (detailDataPertanyaan?.data && Object.keys(formJawaban).length === 0 && !sudahDinilai) {
            const initialForm: { [key: string]: { nilai: number | null, notes: string } } = {};
            detailDataPertanyaan.data.forEach((p: any) => {
                initialForm[p.id] = { nilai: null, notes: "" };
            });
            setFormJawaban(initialForm);
        }
    }, [detailDataPertanyaan]);

    useEffect(() => {
        if (sudahDinilai && jawabanMilikTarget.length > 0) {
            const existingAnswers: { [key: string]: { nilai: number | null, notes: string } } = {};
            jawabanMilikTarget.forEach((j: any) => {
                existingAnswers[j.pertanyaanId] = {
                    nilai: j.nilai,
                    notes: j.notes || ""
                };
            });
            setFormJawaban(existingAnswers);
        }
    }, [detailDataJawaban]);

    const handleInputChange = (pertanyaanId: string, nilai: number) => {
        setFormJawaban((prev) => ({
            ...prev,
            [pertanyaanId]: {
                ...prev[pertanyaanId],
                nilai,
            },
        }));
    };

    const handleNotesChange = (pertanyaanId: string, notes: string) => {
        setFormJawaban((prev) => ({
            ...prev,
            [pertanyaanId]: {
                ...prev[pertanyaanId],
                notes
            },
        }));
    };

    const handleSubmit = () => {
        const answerPayload: any[] = Object.entries(formJawaban)
            .filter(([_, data]) => data.nilai !== null)
            .map(([pertanyaanId, data]) => ({
                indikatorId: String(id),
                pertanyaanId: pertanyaanId,
                evaluateeId: String(evaluatee),
                notes: data.notes || "-",
                nilai: data.nilai as number,
            }));

        createAnswer(answerPayload, {
            onSuccess: () => {
                setShowModal(false);
                setNotification({
                    visible: true,
                    status: "success",
                    title: "Penilaian Berhasil",
                    description: "Penilaian indikator anda berhasil dikirim.",
                });
            },
            onError: (err: any) => {
                setShowModal(false);
                setNotification({
                    visible: true,
                    status: "error",
                    title: "Penilaian Gagal",
                    description: err?.message || "Terjadi kesalahan saat mengirim penilaian indikator.",
                });
            },
        });
    };

    if (isDetailJawabanLoading || isDetailPertanyaanLoading || showSkeleton || isFetchingJawaban || isFetchingPertanyaan) {
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

    if (!detailDataJawaban || !detailDataPertanyaan) {
        const renderNoData = (
            <ScrollView
                contentContainerStyle={[gajiDetailStyles.container, { justifyContent: "center", alignItems: "center", paddingTop: 0, paddingBottom: 0}]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetchingJawaban}
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

    if (detailJawabanError || detailPertanyaanError) {
        const renderError = (
            <ScrollView
                contentContainerStyle={[gajiDetailStyles.container, { justifyContent: "center", alignItems: "center", paddingTop: 0, paddingBottom: 0}]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetchingJawaban || isFetchingPertanyaan}
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
            <View style={penilaianKpiStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => sudahDinilai ? router.push("/(kpi)/penilaian-kpi/penilaian-kpi") : setShowExitModal(true)}
                    disabled={isPending}
                >
                    <View style={penilaianKpiStyles.iconPlace}>
                        <Image
                            style={penilaianKpiStyles.iconBack}
                            source={require('../../../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={penilaianKpiStyles.headerTitle}>
                        Detail Indikator Kinerja Karyawan
                    </Text>
                </TouchableOpacity>
            </View>
            
            {sudahDinilai ? (
                <PenilaianKPIComponent 
                    page={page}
                    setPage={setPage}
                    categoriesQuestion={categoriesQuestion}
                    convertNilai={jawabanMilikTarget}
                    judul={"Penilaian Telah Dilakukan"}
                    sudahDinilai={true}
                />
            ) : (
                <PenilaianKPIComponent 
                    page={page}
                    setPage={setPage}
                    categoriesQuestion={categoriesQuestion}
                    convertNilai={jawabanMilikTarget}
                    judul={`Form Penilaian:`}
                    sudahDinilai={false}
                    formJawaban={formJawaban}
                    handleInputChange={handleInputChange}
                    handleNotesChange={handleNotesChange}
                    allAnswered={allAnswered}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    isPending={isPending}
                />
            )}
            <PenilaianKPIModalComponent 
                visible={showModal && !isPending}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
                title={"Submit Indikator Kinerja Karyawan"}
                description={"Apakah anda sudah yakin terhadap indikator kinerja karyawan ini?"}
                textActive={"Ya, Simpan"}
                textPassive={"Batal"}
            />
            <PenilaianKPIModalComponent 
                visible={showExitModal && !isPending}
                onClose={() => setShowExitModal(false)}
                onSave={() => {
                    setShowExitModal(false);
                    router.back();
                }}
                title={"Kembali ke page sebelumnya"}
                description={"Apakah anda ingin kembali sebelum melakukan submit?"}
                textActive={"Ya, Kembali"}
                textPassive={"Batal"}
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