import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { profileStyles } from "@/assets/styles/rootstyles/profiles/profile.styles";
import COLORS from "@/constants/colors";
import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";

type ListDataComponentProps = {
    data: { label: string; value: string }[];
    changeData?: boolean;
};

const ListDataComponent = ({ data, changeData = false }: ListDataComponentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState(data);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleChange = (text: string, index: number) => {
        const updated = [...editableData];
        updated[index].value = text;
        setEditableData(updated);
    };

    const handleSave = () => {
        setShowConfirmModal(true);
    };

    const confirmSave = () => {
        setShowConfirmModal(false);
        setIsEditing(false);
        console.log("✅ Data tersimpan:", editableData);
    };

    return (
        <View style={profileListDataStyles.dataContainer}>
            {editableData.map((item, index) => (
                <View key={index} style={profileListDataStyles.itemContainer}>
                    <Text style={profileListDataStyles.label}>{item.label}</Text>
                    {isEditing ? (
                        <TextInput
                            style={profileListDataStyles.editValue}
                            value={item.value}
                            onChangeText={(text) => handleChange(text, index)}
                        />
                    ) : (
                        <Text style={profileListDataStyles.value}>{item.value}</Text>
                    )}
                </View>
            ))}

            {changeData && (
                <View style={{ width: "100%", justifyContent: "flex-end", alignItems: "flex-end" }}>
                    <TouchableOpacity
                        style={profileListDataStyles.changeData}
                        onPress={() => {
                            if (isEditing) {
                                handleSave();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                    >
                        <Text style={profileStyles.statusText}>
                            {isEditing ? "Save Changes" : "Edit Your Data"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <Modal
                visible={showConfirmModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={profileListDataStyles.modalContainer}>
                    <View style={profileListDataStyles.modal}>
                        <Text style={profileListDataStyles.titleModal} >
                            Simpan Perubahan Data?
                        </Text>
                        <Text style={profileListDataStyles.descriptionModal}>
                            Apakah Anda yakin ingin menyimpan perubahan pada data profil Anda?
                        </Text>
                        <TouchableOpacity
                            onPress={confirmSave}
                            style={profileListDataStyles.activeButton}
                        >
                            <Text style={{ color: COLORS.white, textAlign: "center", fontWeight: "600" }}>
                                Ya, Simpan
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowConfirmModal(false)}
                            style={profileListDataStyles.passiveButton}
                        >
                            <Text style={{ textAlign: "center", color: COLORS.textPrimary, fontWeight: "500" }}>
                                Batal
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ListDataComponent;
