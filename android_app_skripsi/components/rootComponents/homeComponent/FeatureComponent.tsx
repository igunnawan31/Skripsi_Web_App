import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/lib/store/authStore";
import { MajorRole, MinorRole } from "@/types/enumTypes";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const featureNames = [
    {
        label: "Cuti",
        value: "Ajukan Cuti",
        image: require("../../../assets/icons/absence.png"),
        linkTo: "/(cuti)/create",
        accessedBy: [
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.ADMIN,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.HR,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.FRONTEND,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.BACKEND,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.PROJECT_MANAGER,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.UI_UX,
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
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.ADMIN,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.HR,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.FRONTEND,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.BACKEND,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.PROJECT_MANAGER,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.UI_UX,
            },
        ]
    },
    {
        label: "Penilaian KPI",
        value: "Nilai KPI Karyawan",
        image: require("../../../assets/icons/penilaian-kpi.png"),
        linkTo: "/(kpi)/penilaian-kpi/penilaian-kpi",
        accessedBy: [
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.HR,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.PROJECT_MANAGER,
            },
        ]
    },
    {
        label: "Hasil KPI",
        value: "Hasil KPI",
        image: require("../../../assets/icons/hasil-kpi.png"),
        linkTo: "/(kpi)/hasil-kpi/hasil-kpi",
        accessedBy: [
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.ADMIN,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.HR,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.FRONTEND,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.BACKEND,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.PROJECT_MANAGER,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.UI_UX,
            },
        ]
    },
    {
        label: "Reimburse",
        value: "Reimburse Pengeluaran",
        image: require("../../../assets/icons/reimburse.png"),
        linkTo: "/(reimburse)/reimburse/reimburse",
        accessedBy: [
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.ADMIN,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.HR,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.FRONTEND,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.BACKEND,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.PROJECT_MANAGER,
            },
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.UI_UX,
            },
        ]
    },
    {
        label: "Reimburse",
        value: "Setujui Reimburse",
        image: require("../../../assets/icons/approved.png"),
        linkTo: "/(reimburse)/setujui-reimburse/setujui-reimburse",
        accessedBy: [
            {
                majorRole: MajorRole.KARYAWAN, 
                minorRole: MinorRole.ADMIN,
            },
        ]
    },
]

const FeatureComponent = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state?.user);

    const allowedFeatures = useMemo(() => {
        if (!user) return [];
        return featureNames.filter(f =>
            f.accessedBy.some(
                a =>
                    a.majorRole === user.majorRole &&
                    a.minorRole === user.minorRole
            )
        );
    }, [user]);

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>
                    Memuat data user...
                </Text>
            </View>
        );
    }

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
                    {allowedFeatures.map((item, index) => (
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