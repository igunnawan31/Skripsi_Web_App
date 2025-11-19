import { useState } from "react";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { dummyUsers } from "@/data/dummyUser";
import CutiCreateFormComponent from "@/components/rootComponents/cutiComponent/CutiCreateFormComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { cutiStyles } from "@/assets/styles/rootstyles/cuti/cuti.styles";

const PengajuanCuti = () => {
    const router = useRouter();
        
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
                <CutiCreateFormComponent />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default PengajuanCuti;
