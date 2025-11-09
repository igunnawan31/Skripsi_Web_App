import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dummyCuti } from "@/data/dummyCuti";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import CutiFormComponent from "@/components/rootComponents/cutiComponent/CutiFormComponent";

export default function DetailCuti() {
    const { id } = useLocalSearchParams();
    const data = dummyCuti.find((item) => item.id === id);
    const router = useRouter();

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
                            source={require('../../../assets/icons/arrow-left.png')}
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
                <View style={cutiDetailStyles.cutiContainer}>
                    <View>
                        <Text style={cutiDetailStyles.label}>Status: </Text>
                        <Text
                            style={[
                                cutiDetailStyles.cutiStatus,
                                { backgroundColor: getStatusColor(data.cutiStatus) },
                            ]}
                        >
                            {data.cutiStatus}
                        </Text>
                    </View>
                    <View>
                        <Text style={cutiDetailStyles.label}>Penilai: </Text>
                        <Text style={cutiDetailStyles.cutiApprover}>{data.approver}</Text>
                    </View>
                </View>

                <View style={cutiDetailStyles.penolakanContainer}>
                    <Text style={cutiDetailStyles.label}>Alasan Penolakan</Text>
                    <Text style={cutiDetailStyles.value}>{data.reason} {data.reason} {data.reason} {data.reason} {data.reason} {data.reason} {data.reason} {data.reason}</Text>
                </View>

                <CutiFormComponent data={data} />

                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
                    onPress={() => router.push('/create')}
                >
                    <Text style={{ color: COLORS.primary, fontWeight: "600", marginRight: 6 }}>
                        Ajukan Cuti lain
                    </Text>
                    <Image
                        style={[cutiDetailStyles.iconBack, { tintColor: COLORS.primary }]}
                        source={require('../../../assets/icons/arrow-right.png')}
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
