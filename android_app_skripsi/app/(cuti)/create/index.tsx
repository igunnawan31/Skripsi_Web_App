import { useEffect, useState } from "react";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { Image, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { dummyUsers } from "@/data/dummyUser";
import CutiCreateFormComponent from "@/components/rootComponents/cutiComponent/CutiCreateFormComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";
import { useAuthStore } from "@/lib/store/authStore";
import { useKontrak } from "@/lib/api/hooks/useKontrak";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { gajiDetailStyles, HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";

const PengajuanCuti = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const { data, isLoading, error: isKontrakError, refetch, isFetching } = useKontrak().fetchKontrakById(user.id);

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };

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
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading || showSkeleton) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                <View style={gajiDetailStyles.header}>
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

                <View style={{ width: "100%", gap: 5 }}>
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <View
                            key={i}
                            style={{
                                alignItems: "center",
                                marginBottom: 20,
                                paddingHorizontal: 20,
                                backgroundColor: "transparent",
                            }}
                        >
                            <View style={{ width: "100%", gap: 10 }}>
                                <SkeletonBox width={60} height={20} borderRadius={24} />
                                <SkeletonBox width={80} height={40} style={{ width: "100%" }} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
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
                            source={require("../../../assets/icons/arrow-left.png")}
                        />
                    </View>
                    <Text style={cutiDetailStyles.headerTitle}>Kembali</Text>
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
                <View style={cutiDetailStyles.subHeaderContainer}>
                    <View>
                        <Text style={cutiDetailStyles.subHeaderTitle}>
                            Ajukan Cuti Kamu
                        </Text>
                        <Text style={cutiDetailStyles.subHeaderDescription}>
                            Buat pengajuan cuti kamu
                        </Text>
                    </View>
                    <View style={cutiDetailStyles.logoSubHeaderContainer}>
                        <Image
                            style={cutiDetailStyles.logoSubHeader}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                    </View>
                </View>
                <CutiCreateFormComponent kontrakData={data} />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default PengajuanCuti;
