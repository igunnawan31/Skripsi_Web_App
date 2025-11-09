import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";
import COLORS from "@/constants/colors";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type CutiPopUpModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
}

const CutiPopUpModal = ({
    visible,
    onClose,
    onSave,
}: CutiPopUpModalProps) => {
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
                        Ajukan Pengajuan Cuti?
                    </Text>
                    <Text style={profileListDataStyles.descriptionModal}>
                        Apakah anda sudah yakin terhadap pengajuan cuti anda?
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

export default CutiPopUpModal;