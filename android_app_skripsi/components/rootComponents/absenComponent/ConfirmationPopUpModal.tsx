import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";
import COLORS from "@/constants/colors";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type ConfirmationPopUpModalProps = {
    visible: boolean;
    onBack: () => void;
    onSave: () => void;
}

const ConfirmationPopUpModal = ({
    visible,
    onBack,
    onSave
}: ConfirmationPopUpModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={profileListDataStyles.modalContainer}>
                <View style={profileListDataStyles.modal}>
                    <Text style={profileListDataStyles.titleModal} >
                        Submit Absensi?
                    </Text>
                    <Text style={profileListDataStyles.descriptionModal}>
                        Apakah anda sudah yakin terhadap pengajuan absensi anda?
                    </Text>
                    <TouchableOpacity
                        onPress={onSave}
                        style={profileListDataStyles.activeButton}
                    >
                        <Text style={{ color: COLORS.white, textAlign: "center", fontWeight: "600" }}>
                            Ya, Simpan
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onBack}
                        style={profileListDataStyles.activeButton}
                    >
                        <Text style={{ color: COLORS.white, textAlign: "center", fontWeight: "600" }}>
                            Batal
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmationPopUpModal;