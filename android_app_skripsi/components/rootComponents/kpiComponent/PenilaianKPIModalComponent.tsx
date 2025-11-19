import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";
import COLORS from "@/constants/colors";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type PenilaianKPIModalComponentProps = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    title: string;
    description: string;
    textActive: string;
    textPassive: string;
}

const PenilaianKPIModalComponent = ({
    visible,
    onClose,
    onSave,
    title,
    description,
    textActive,
    textPassive
}: PenilaianKPIModalComponentProps) => {
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
                        {title}
                    </Text>
                    <Text style={profileListDataStyles.descriptionModal}>
                        {description}
                    </Text>
                    <TouchableOpacity
                        onPress={onSave}
                        style={profileListDataStyles.activeButton}
                    >
                        <Text style={{ color: COLORS.white, textAlign: "center", fontWeight: "600" }}>
                            {textActive}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        style={profileListDataStyles.passiveButton}
                    >
                        <Text style={{ textAlign: "center", color: COLORS.textPrimary, fontWeight: "500" }}>
                            {textPassive}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default PenilaianKPIModalComponent;