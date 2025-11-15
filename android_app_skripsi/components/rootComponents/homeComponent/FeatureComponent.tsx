import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const featureNames = [
    {
        label: "Cuti",
        value: "Ajukan Cuti",
        image: require("../../../assets/icons/absence.png"),
        linkTo: "/(cuti)/create",
        accessedBy: [
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
        ]
    },
    {
        label: "Gaji",
        value: "Cek Gaji Kamu",
        image: require("../../../assets/icons/payment.png"),
        linkTo: "/(gaji)/gaji",
        accessedBy: [
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
        ]
    },
    {
        label: "Penilaian KPI",
        value: "Nilai KPI Karyawan",
        image: require("../../../assets/icons/penilaian-kpi.png"),
        linkTo: "/(kpi)/penilaian-kpi",
        accessedBy: [
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
        ]
    },
    {
        label: "Hasil KPI",
        value: "Hasil KPI",
        image: require("../../../assets/icons/hasil-kpi.png"),
        linkTo: "/(kpi)/hasil-kpi",
        accessedBy: [
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
        ]
    },
    {
        label: "Reimburse",
        value: "Reimburse Pengeluaran",
        image: require("../../../assets/icons/reimburse.png"),
        linkTo: "/(reimburse)/reimburse",
        accessedBy: [
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
            {
                majorRole:"Karyawan", 
                minorRole:"",
            },
        ]
    },
]

const FeatureComponent = () => {
    const router = useRouter();

    return (
        <View style={homeStyles.featureContainer}>
            <View style={{ paddingHorizontal: 10, }}>
                <Text style={homeStyles.titleSection}>
                    Feature
                </Text>
                <Text style={homeStyles.descriptionSection}>
                    Feature yang tersedia saat ini
                </Text>
            </View>
            <ScrollView
                horizontal
                contentContainerStyle={{ 
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                }}
            >
                <View style={{ flexDirection: "row", gap: 20  }}>
                    {featureNames.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={homeStyles.featureTouchContainer}
                            activeOpacity={0.7}
                            onPress={() => router.push(item.linkTo as any)}
                        >
                            <View
                                style={homeStyles.featureButtonContainer}
                            >
                                <Image
                                    source={item.image}
                                    style={homeStyles.featureButtonImage}
                                />
                            </View>
                            <View style={{ width: 60}}>
                                <Text style={homeStyles.featureButtonTitle}>
                                    {item.label}
                                </Text>
                                <Text style={homeStyles.featureButtonDescription}>
                                    {item.value}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

export default FeatureComponent;