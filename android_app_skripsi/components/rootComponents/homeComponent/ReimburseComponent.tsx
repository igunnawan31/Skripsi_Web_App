import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import COLORS from "@/constants/colors";
import { dummyCuti } from "@/data/dummyCuti";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ListDataCutiComponent from "../cutiComponent/ListDataCutiComponent";
import { dummyReimburse } from "@/data/dummyReimburse";
import ListDataReimburseComponent from "../reimburseComponent/ListDataReimburseComponent";

const ReimburseComponent = () => {
    const [data, setData] = useState(dummyReimburse);
    const router = useRouter();

    const displayedData = data.slice(0,1);
    
    return (
        <>
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
            </View>
            <View style={homeStyles.container}>
                <ListDataReimburseComponent data={displayedData} />
            </View>
        </>
    );
}

export default ReimburseComponent;