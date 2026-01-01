import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { profileStyles } from "@/assets/styles/rootstyles/profiles/profile.styles";
import COLORS from "@/constants/colors";
import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";
import { UserResponse } from "@/types/user/userTypes";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";

type ListDataComponentProps = {
    data: UserResponse
    changeData?: boolean;
};

const ListDataComponent = ({ data, changeData = false }: ListDataComponentProps) => {
    return (
        <View style={profileListDataStyles.dataContainer}>
            <View style={profileListDataStyles.labelContainer}>
                <Text style={profileListDataStyles.labelInput}>Id Karyawan</Text>
                <Text style={profileListDataStyles.input}>{data.id}</Text>
            </View>
            <View style={profileListDataStyles.labelContainer}>
                <Text style={profileListDataStyles.labelInput}>Nama Karyawan</Text>
                <Text style={profileListDataStyles.input}>{data.name}</Text>
            </View>
            <View style={profileListDataStyles.labelContainer}>
                <Text style={profileListDataStyles.labelInput}>Email Karyawan</Text>
                <Text style={profileListDataStyles.input}>{data.email}</Text>
            </View>
            <View style={profileListDataStyles.labelContainer}>
                <Text style={profileListDataStyles.labelInput}>Major Role</Text>
                <Text style={profileListDataStyles.input}>{data.majorRole}</Text>
            </View>
            <View style={profileListDataStyles.labelContainer}>
                <Text style={profileListDataStyles.labelInput}>Minor Role</Text>
                <Text style={profileListDataStyles.input}>{data.minorRole}</Text>
            </View>
        </View>
    );
};

export default ListDataComponent;
