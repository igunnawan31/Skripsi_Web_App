import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dummyCuti } from "@/data/dummyCuti";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import CutiFormComponent from "@/components/rootComponents/cutiComponent/CutiFormComponent";
import { dummyReimburse, ReimburseStatus } from "@/data/dummyReimburse";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import absenDetailStyles from "@/assets/styles/rootstyles/absen/absendetail.style";
import ReimbursePopUpModal from "@/components/rootComponents/reimburseComponent/ReimbursePopUpModal";
import { useState } from "react";

export default function DetailPengajuanReimburse() {
    const { id } = useLocalSearchParams();
    const data = dummyReimburse.find((item) => item.id === id);
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const sudahDinilai = data?.reimburseStatus !== ReimburseStatus.DITERIMA && data?.reimburseStatus !== ReimburseStatus.DITOLAK;

    if (!data) {
        return <Text style={{ textAlign: "center", marginTop: 50 }}>Cuti not found.</Text>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Cuti Diterima":
                return COLORS.success;
            case "Cuti Ditolak":
                return COLORS.error;
            case "Menunggu Jawaban":
                return COLORS.tertiary;
            default:
                return COLORS.muted;
        }
    };

    const fieldsToShow = [
        { label: "Nama Lengkap", value: data.name },
        { label: "Tanggal Pengajuan", value: data.submissionDate },
        { 
            label: "Total Pengeluaran", 
            value: data.totalPengeluaran.toLocaleString("id-ID", { 
                style: "currency", currency: "IDR" 
            }) 
        },
        { label: "Major Role", value: data.majorRole },
        { label: "Minor Role", value: data.minorRole },
    ];

    const handleSubmit = () => {
        setShowModal(false);
        router.push("/(reimburse)/setujui-reimburse/setujui-reimburse")
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
            >
                <View style={reimburseStyles.statusContainer}>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
                        <View>
                            <Text style={cutiDetailStyles.label}>Status: </Text>
                            <Text
                                style={[
                                    cutiDetailStyles.cutiStatus,
                                    { backgroundColor: getStatusColor(data.reimburseStatus) },
                                ]}
                            >
                                {data.reimburseStatus}
                            </Text>
                        </View>
                        {!sudahDinilai && (
                            <View>
                                <Text style={cutiDetailStyles.label}>Penilai: </Text>
                                <Text style={cutiDetailStyles.cutiApprover}>{data.approver}</Text>
                            </View>
                        )}
                    </View>
                    {!sudahDinilai && (
                        <View style={{ alignItems: "flex-start", width: "100%", marginTop: 10 }}>
                            <Text style={cutiDetailStyles.label}>Alasan Penolakan</Text>
                            <Text style={cutiDetailStyles.value}>{data.alasanPenolakan}</Text>
                        </View>
                    )}
                </View>

                <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 20 }}>
                    {fieldsToShow.map((item, index) => (
                        <View key={index} style={reimburseStyles.labelContainer}>
                            <Text style={reimburseStyles.labelInput}>{item.label}</Text>
                            <Text style={[reimburseStyles.input, { opacity: 0.5 }]}>
                                {item.value}
                            </Text>
                        </View>
                    ))}
                    {data.file ? (
                        <View style={absenDetailStyles.section}>
                            <Text style={absenDetailStyles.sectionTitle}>Bukti Pendukung</Text>
                            <Image
                                source={require('../../../../assets/images/foto2.jpeg')}
                                style={{
                                    width: "100%",
                                    height: 200,
                                    borderRadius: 12,
                                    marginTop: 10,
                                }}
                            />
                        </View>
                    ) : (
                        <View style={absenDetailStyles.section}>
                            <Text style={absenDetailStyles.sectionTitle}>Bukti Pendukung</Text>
                            <Text style={absenDetailStyles.infoText}>Bukti Pendukung tidak ada / error</Text>
                        </View>
                    )}
                    {sudahDinilai && (
                        <TouchableOpacity
                            style={reimburseStyles.applyButton}
                            onPress={() => setShowModal(true)}
                        >
                            <Text style={reimburseStyles.applyText}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
            <ReimbursePopUpModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
            />
        </View>
    );
}
