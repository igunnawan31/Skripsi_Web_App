import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";
import COLORS from "@/constants/colors";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type ConfirmationPopUpModalProps = {
    visible: boolean;
    onBack: () => void;
}

const ConfirmationPopUpModal = ({
    visible,
    onBack,
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
                        Berhasil Absen
                    </Text>
                    <Text style={profileListDataStyles.descriptionModal}>
                        Silahkan kembali ke page home
                    </Text>
                    <TouchableOpacity
                        onPress={onBack}
                        style={profileListDataStyles.activeButton}
                    >
                        <Text style={{ color: COLORS.white, textAlign: "center", fontWeight: "600" }}>
                            Kembali ke Home
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmationPopUpModal;