import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import COLORS from "@/constants/colors";
import { dummyCuti } from "@/data/dummyCuti";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ListDataCutiComponent from "../cutiComponent/ListDataCutiComponent";
import { dummyReimburse } from "@/data/dummyReimburse";

const ReimburseComponent = () => {
    const [data, setData] = useState(dummyReimburse);
    const router = useRouter();

    const displayedData = data.slice(0,1);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Reimburse Diterima":
                return COLORS.success;
            case "Reimburse Ditolak":
                return COLORS.error;
            case "Menunggu Jawaban":
                return COLORS.tertiary;
            default:
                return COLORS.muted;
        }
    };

    return (
        <View style={homeStyles.reimburseContainer}>
            <View style={homeStyles.titleContainer}>
                <View style={{ width: "50%" }}>
                    <Text style={homeStyles.titleSection}>
                        Reimburse Pengeluaran
                    </Text>
                    <Text style={homeStyles.descriptionSection}>
                        Status Reimburse Pengeluaran yang kamu ajukan
                    </Text>
                </View>
                <TouchableOpacity 
                    style={{ width: "auto", backgroundColor: COLORS.tertiary, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 8 }}
                    onPress={() => router.push('/(reimburse)')}
                >
                    <Text style={homeStyles.buttonText}>Lihat Semua Status</Text>
                </TouchableOpacity>
            </View>
            <View>
                {displayedData.length > 0 ? (
                    displayedData.map((item) => (
                        <View
                            key={item.id}
                            style={homeStyles.listContainer}
                        >
                            <View style={homeStyles.listHeader}>
                                <Text style={homeStyles.name}>{item.name}</Text>
                                <View style={homeStyles.timeBox}>
                                    <Image
                                        source={require("../../../assets/icons/calendar.png")}
                                        style={homeStyles.icon}
                                    />
                                    <Text style={homeStyles.timeText}>
                                        Pengajuan: {item.submissionDate}
                                    </Text>
                                </View>
                            </View>
                            <View style={homeStyles.roleContainer}>
                                <Text style={homeStyles.roleText}>
                                    {item.majorRole} - {item.minorRole}
                                </Text>
                                <View
                                    style={[
                                        homeStyles.statusBadge,
                                        { backgroundColor: getStatusColor(item.cutiStatus) },
                                    ]}
                                >
                                    <Text style={homeStyles.statusText}>{item.cutiStatus}</Text>
                                </View>
                            </View>
                            <View style={homeStyles.timeContainer}>
                                <View style={homeStyles.timeBox}>
                                    <Image
                                        source={require("../../../assets/icons/gaji.png")}
                                        style={homeStyles.icon}
                                    />
                                    <Text style={homeStyles.timeText}>
                                        Total Pengajuan: {item.totalPengeluaran?.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ height: 1, backgroundColor: COLORS.border, marginTop: 12 }} />
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => router.push(`/(reimburse)/${item.id}`)}
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
                                    style={homeStyles.iconCalendar}
                                    source={require('../../../assets/icons/arrow-right.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View>
                        <Text>Belum ada data</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default ReimburseComponent;