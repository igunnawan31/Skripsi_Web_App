import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import COLORS from "@/constants/colors";
import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";

type ChangeImageModalProps = {
    visible: boolean;
    onClose: () => void;
    onTakeSelfie: () => void;
    onPickGallery: () => void;
};

const ChangeImageModal = ({
    visible,
    onClose,
    onTakeSelfie,
    onPickGallery,
}: ChangeImageModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={profileListDataStyles.modalContainer}>
                <View style={profileListDataStyles.modal}>
                    <Text style={profileListDataStyles.titleModal}>
                        Change Profile Picture
                    </Text>
                    <TouchableOpacity
                        onPress={onTakeSelfie}
                        style={profileListDataStyles.activeButton}
                    >
                        <Text style={{ color: COLORS.white, textAlign: "center" }}>
                            Take a Selfie
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onPickGallery}
                        style={profileListDataStyles.activeButton}
                    >
                        <Text style={{ color: COLORS.white, textAlign: "center" }}>
                            Upload from Gallery
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onClose}
                        style={profileListDataStyles.passiveButton}
                    >
                        <Text style={{ textAlign: "center" }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ChangeImageModal;
