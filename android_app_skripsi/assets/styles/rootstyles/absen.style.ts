import COLORS from "@/constants/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const absenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    iconPlace: {
        position: "absolute",
        top: 15,
        left: 10,
        width: 40, 
        height: 40, 
        borderRadius: 40, 
        backgroundColor: COLORS.white, 
        justifyContent: "center", 
        alignItems: "center",
        marginRight: 10,
        zIndex: 10,
    },
    iconBack: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    errorMessage: { 
        color: "red", 
        textAlign: "center", 
        marginBottom: 16 
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000040",
    },
    modal: {
        width: 280,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        gap: 10,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    titleModal: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: COLORS.textPrimary,
    },
    descriptionModal: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 10,
    },
    activeButton: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 8,
    },
    textActive: {
        textAlign: "center",
        color: COLORS.white,
        fontWeight: "600",
    },
    textPassive: {
        textAlign: "center",
        color: COLORS.textPrimary,
        fontWeight: "600",
    },
    passiveButton: {
        padding: 10,
        borderRadius: 8,
        borderColor: COLORS.border,
        borderWidth: 1,
    },
    bottomCard: {
        position: "absolute",
        bottom: 0,
        width: width,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        elevation: 5,
    },
    label: {
        fontSize: 14,
        color: "#888",
        marginBottom: 4,
    },
    address: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#FFA500",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    marker: {
        alignItems: "center",
        justifyContent: "center",
    },
    markerText: {
        fontSize: 24,
    },
})

export default absenStyles;