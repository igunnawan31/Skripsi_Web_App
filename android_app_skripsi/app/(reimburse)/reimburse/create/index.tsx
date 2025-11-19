import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import ReimburseCreateFormComponent from "@/components/rootComponents/reimburseComponent/ReimburseCreateFormComponent";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateReimbursePage = () => {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={reimburseStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
                >
                    <View style={reimburseStyles.iconPlace}>
                        <Image
                            style={reimburseStyles.iconBack}
                            source={require("../../../../assets/icons/arrow-left.png")}
                        />
                    </View>
                    <Text style={reimburseStyles.headerTitle}>Kembali</Text>
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
                <View style={reimburseStyles.subHeaderContainer}>
                    <View>
                        <Text style={reimburseStyles.subHeaderTitle}>
                            Ajukan Reimburse Kamu
                        </Text>
                        <Text style={reimburseStyles.subHeaderDescription}>
                            Buat pengajuan reimburse kamu
                        </Text>
                    </View>
                    <View style={reimburseStyles.logoSubHeaderContainer}>
                        <Image
                            style={reimburseStyles.logoSubHeader}
                            source={require("../../../../assets/icons/cuti.png")}
                        />
                    </View>
                </View>
                <ReimburseCreateFormComponent />
            </KeyboardAwareScrollView>
        </View>
    )
}

export default CreateReimbursePage;