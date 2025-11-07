import { useState } from "react";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { router } from "expo-router";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { dummyUsers } from "@/data/dummyUsers";
import CutiCreateFormComponent from "@/components/rootComponents/cutiComponent.tsx/CutiCreateFormComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";

type Cuti = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    submissionDate: string;
    totalDays: number;
    reason: string;
    majorRole: string;
    minorRole: string;
    cutiStatus: string;
    approver: string;
};

const PengajuanCuti = () => {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={cutiDetailStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.push("/(tabs)/cuti")}
                >
                    <View style={cutiDetailStyles.iconPlace}>
                        <Image
                            style={cutiDetailStyles.iconBack}
                            source={require("../../../assets/icons/arrow-left.png")}
                        />
                    </View>
                    <Text style={cutiDetailStyles.headerTitle}>Kembali ke Home</Text>
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
                <View style={cutiDetailStyles.subHeaderContainer}>
                    <View>
                        <Text style={cutiDetailStyles.subHeaderTitle}>
                            Ajukan Cuti Kamu
                        </Text>
                        <Text style={cutiDetailStyles.subHeaderDescription}>
                            Lihat status pengajuan cuti yang kamu buat
                        </Text>
                    </View>
                    <View style={cutiDetailStyles.logoSubHeaderContainer}>
                        <Image
                            style={cutiDetailStyles.logoSubHeader}
                            source={require("../../../assets/icons/cuti.png")}
                        />
                    </View>
                </View>
                <CutiCreateFormComponent />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default PengajuanCuti;
