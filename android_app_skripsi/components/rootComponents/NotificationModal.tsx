import { profileListDataStyles } from "@/assets/styles/rootstyles/profiles/profileListData.styles";
import COLORS from "@/constants/colors";
import { Modal, Text, TouchableOpacity, View, Image } from "react-native";

type NotificationModalProps = {
    visible: boolean;
    status: "success" | "error";
    title?: string;
    description?: string;
    onContinue: () => void;
};

const NotificationModal = ({
    visible,
    status,
    title,
    description,
    onContinue,
}: NotificationModalProps) => {
    const isSuccess = status === "success";

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onContinue}
        >
            <View style={profileListDataStyles.modalContainer}>
                <View style={profileListDataStyles.modal}>
                    <Image
                        source={
                        isSuccess
                            ? require("../../assets/icons/success.png")
                            : require("../../assets/icons/error.png")
                        }
                        style={[{ width: 80, height: 80, marginBottom: 16, tintColor: isSuccess ? COLORS.success : COLORS.error }]}
                        resizeMode="contain"
                    />
                    <Text style={profileListDataStyles.titleModal}>
                        {title ??
                        (isSuccess
                            ? "Pengajuan Berhasil"
                            : "Pengajuan Gagal")}
                    </Text>
                    <Text style={profileListDataStyles.descriptionModal}>
                        {description ??
                        (isSuccess
                            ? "Pengajuan cuti anda berhasil dikirim."
                            : "Terjadi kesalahan saat mengirim pengajuan cuti.")}
                    </Text>

                    <TouchableOpacity
                        onPress={onContinue}
                        style={[profileListDataStyles.activeButton, { backgroundColor: isSuccess ? COLORS.success : COLORS.error}]}
                    >
                        <Text
                            style={{
                                color: COLORS.white,
                                textAlign: "center",
                                fontWeight: "600",
                            }}
                        >
                            {isSuccess ? "Ke Beranda" : "Tutup"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default NotificationModal;
