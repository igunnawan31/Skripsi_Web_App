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

export type ProjectType = {
    projectId: string;
    projectName: string;
    ketuaProject: User;
    anggotaProject: User[];
}

interface Props {
    visible: boolean;
    onClose: () => void;
    items: ProjectType[];
    selected: ProjectType[];
    onChange: (items: ProjectType[]) => void;
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
        p.projectName.toLowerCase().includes(query.toLowerCase())
    );
    const toggleSelect = (project: ProjectType) => {
        if (selected.some((p) => p.projectId === project.projectId)) {
            onChange(selected.filter((p) => p.projectId !== project.projectId));
        } else {
            onChange([...selected, project]);
        }
    };
    const isAllSelected = selected.length === items.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            onChange([]);
        } else {
            onChange(items);
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
                        <TouchableOpacity
                            onPress={handleSelectAll}
                            style={[calendarStyles.selectAll, 
                                isAllSelected && {backgroundColor: COLORS.white}
                            ]}
                        >
                            <Text style={[calendarStyles.buttonSelectAll,
                                isAllSelected && {color: COLORS.primary}
                            ]}>
                                {isAllSelected ? "Unselect All" : "Select All"}
                            </Text>
                        </TouchableOpacity>
                        
                        {filtered.map((item) => {
                            const isSelected = selected.some(
                                (s) => s.projectId === item.projectId
                            );
                            return (
                                <TouchableOpacity
                                    key={item.projectId}
                                    onPress={() => toggleSelect(item)}
                                    style={[calendarStyles.projectSelect,
                                        isSelected ? {borderColor: COLORS.primary} : {borderColor: COLORS.border},
                                        isSelected ? {backgroundColor: COLORS.primaryOpacity20} : {backgroundColor: COLORS.white}
                                    ]}
                                >
                                    <Text style={{ fontSize: 16 }}>
                                        {item.projectName}
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
