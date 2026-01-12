import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { fetchFileBlob } from "@/lib/utils/path";
import { CutiResponse } from "@/types/cuti/cutiTypes";
import { format, parseISO } from "date-fns";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

type CutiFormComponentProps = {
    data: CutiResponse;
}

const CutiFormComponent = ({data}: CutiFormComponentProps) => {
    const computeTotalDays = (startStr: string, endStr: string) => {
        if (!startStr || !endStr) return 0;
        try {
            const start = parseISO(startStr);
            const end = parseISO(endStr);
            const msPerDay = 24 * 60 * 60 * 1000;
            const diff = Math.floor((end.getTime() - start.getTime()) / msPerDay);
            return diff >= 0 ? diff + 1 : 0
        } catch {
            return 0;
        }
    };

    const documents = Array.isArray(data.dokumen) ? data.dokumen : [];

    return (
        <View style={cutiDetailStyles.dataContainer}>
            <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 16,
                    borderBottomColor: COLORS.primary, borderBottomWidth: 1, 
                    paddingVertical: 4
                }}>
                    Your Cuti Submission
                </Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.sectionTitle}>Nama</Text>
                <Text style={cutiDetailStyles.infoText}>{data.user.name}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.sectionTitle}>Tanggal Mulai</Text>
                <Text style={cutiDetailStyles.infoText}>{data.startDate ? format(new Date(data.startDate), "dd-MM-yyyy") : "-"}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.sectionTitle}>Tanggal Selesai</Text>
                <Text style={cutiDetailStyles.infoText}>{data.endDate ? format(new Date(data.endDate), "dd-MM-yyyy") : "-"}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.sectionTitle}>Total Hari Cuti</Text>
                <Text style={cutiDetailStyles.infoText}>{computeTotalDays(data.startDate, data.endDate)}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.sectionTitle}>Alasan Cuti</Text>
                <Text style={cutiDetailStyles.infoText}>{data.reason}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.sectionTitle}>Dokumen Pendukung</Text>
                <View style={cutiDetailStyles.labelContainer}>
                    {data.dokumen ? (
                        <View
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
                                {data.dokumen.path === "image/" ? (
                                    <Image
                                        source={require("../../../assets/icons/changeImage.png")}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 10,
                                        }}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <Image
                                        source={require("../../../assets/icons/pdfFile.png")}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 10,
                                        }}
                                        contentFit="cover"
                                    />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={{ fontWeight: "600", color: "#333" }}>
                                    {data.dokumen.filename}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#777" }}>
                                    {data.dokumen.mimetype}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={{ marginTop: 6, fontSize: 13, color: "#888" }}>
                            Belum ada file dipilih
                        </Text>
                    )}
                </View>
            </View>
        </View>
    )
}

export default CutiFormComponent;