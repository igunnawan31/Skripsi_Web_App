import absenStyles from "@/assets/styles/rootstyles/absen.style";
import COLORS from "@/constants/colors";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type AbsenPopModalProps = {
    title: string;
    description: string;
    activeButton: string;
    passiveButton: string;
    visible: boolean;
    onActive: () => void;
    onPassive: () => void;
}

const AbsenPopModal = ({
    title,
    description,
    activeButton,
    passiveButton,
    visible,
    onActive,
    onPassive,
}: AbsenPopModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onActive}
        >
            <View style={absenStyles.modalContainer}>
                <View style={absenStyles.modal}>
                    <Text style={absenStyles.titleModal} >
                        {title}
                    </Text>
                    <Text style={absenStyles.descriptionModal}>
                        {description}
                    </Text>
                    <TouchableOpacity
                        onPress={onActive}
                        style={absenStyles.activeButton}
                    >
                        <Text style={absenStyles.textActive}>
                            {activeButton}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPassive}
                        style={absenStyles.passiveButton}
                    >
                        <Text style={absenStyles.textPassive}>
                            {passiveButton}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default AbsenPopModal;