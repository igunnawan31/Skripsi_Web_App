import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import COLORS from "@/constants/colors";
import { MajorRole, MinorRole } from "@/data/dummyUsers";
import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import penilaianKpiStyles from "@/assets/styles/rootstyles/kpi/penilaiankpi.styles";
import { ProjectResponse } from "@/types/project/projectTypes";

export type User = {
    userId: string;
    email: string;
    password: string;
    nama: string;
    majorRole: MajorRole;
    minorRole?: MinorRole;
    tanggalMulai: string;
    tanggalSelesai: string;
    projectList: string[];
}

interface Props {
    visible: boolean;
    onClose: () => void;
    items: ProjectResponse[];
    selected: ProjectResponse[];
    onChange: (items: ProjectResponse[]) => void;
}

export default function SearchDropdownComponent({
    visible,
    onClose,
    items,
    selected,
    onChange,
}: Props) {
    const [query, setQuery] = useState("");
    const filtered = items.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );
    const toggleSelect = (project: ProjectResponse) => {
        if (selected.some((p) => p.id === project.id)) {
            onChange(selected.filter((p) => p.id !== project.id));
        } else {
            onChange([...selected, project]);
        }
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            style={calendarStyles.modalFilterContainer}
        >
            <View style={calendarStyles.filterModal}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
                    Select Project
                </Text>
                <View style={{ flex: 1, width: "100%", gap: 10, }}>
                    <ScrollView 
                        contentContainerStyle={{ paddingBottom: 30, gap: 10 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={calendarStyles.inputSearch}>
                            <Image
                                source={require("../../../assets/icons/search.png")}
                                style={{ tintColor: COLORS.border, height: 20, width: 20 }}
                            />
                            <TextInput
                                placeholder="Cari project tim..."
                                value={query}
                                onChangeText={setQuery}
                                style={{ width: "100%" }}
                            />
                        </View>
                        
                        {filtered.map((item) => {
                            const isSelected = selected.some(
                                (s) => s.id === item.id
                            );
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => toggleSelect(item)}
                                    style={[calendarStyles.projectSelect,
                                        isSelected ? {borderColor: COLORS.primary} : {borderColor: COLORS.border},
                                        isSelected ? {backgroundColor: COLORS.primaryOpacity20} : {backgroundColor: COLORS.white}
                                    ]}
                                >
                                    <Text style={{ fontSize: 16 }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={{ justifyContent: "flex-end", width: "100%" }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={calendarStyles.submitButton}
                    >
                        <Text style={calendarStyles.buttonSelectAll}>
                            Done
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
