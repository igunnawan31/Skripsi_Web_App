import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";
import COLORS from "@/constants/colors";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type ReimbursePopUpModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
}

const ReimbursePopUpModal = ({
    visible,
    onClose,
    onSave,
}: ReimbursePopUpModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={profileListDataStyles.modalContainer}>
                <View style={profileListDataStyles.modal}>
                    <Text style={profileListDataStyles.titleModal} >
                        Ajukan Pengajuan Reimburse?
                    </Text>
                    <Text style={profileListDataStyles.descriptionModal}>
                        Apakah anda sudah yakin terhadap pengajuan reimburse anda?
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
                        onPress={onClose}
                        style={profileListDataStyles.passiveButton}
                    >
                        <Text style={{ textAlign: "center", color: COLORS.textPrimary, fontWeight: "500" }}>
                            Batal
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ReimbursePopUpModal;