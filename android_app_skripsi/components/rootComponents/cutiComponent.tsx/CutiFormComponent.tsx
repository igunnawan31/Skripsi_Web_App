import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import { Text, View } from "react-native";

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

type CutiFormComponentProps = {
    data: Cuti;
}

const CutiFormComponent = ({data}: CutiFormComponentProps) => {
    return (
        <View style={cutiDetailStyles.dataContainer}>
            <View>
                <Text>Your Cuti Submission</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.label}>label Id</Text>
                <Text style={cutiDetailStyles.value}>{data.id}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.label}>Nama</Text>
                <Text style={cutiDetailStyles.value}>{data.name}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.label}>Tanggal Mulai</Text>
                <Text style={cutiDetailStyles.value}>{data.startDate}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.label}>Tanggal Selesai</Text>
                <Text style={cutiDetailStyles.value}>{data.endDate}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.label}>Total Hari Cuti</Text>
                <Text style={cutiDetailStyles.value}>{data.totalDays}</Text>
            </View>
            <View style={cutiDetailStyles.itemContainer}>
                <Text style={cutiDetailStyles.label}>Alasan Cuti</Text>
                <Text style={cutiDetailStyles.value}>{data.reason}</Text>
            </View>
        </View>
    )
}

export default CutiFormComponent;