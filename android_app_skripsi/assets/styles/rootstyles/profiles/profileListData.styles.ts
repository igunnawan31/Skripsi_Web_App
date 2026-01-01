; import COLORS from "@/constants/colors";
import { StyleSheet } from "react-native";

export const profileListDataStyles = StyleSheet.create({
    dataContainer: {
        width: "100%",
        paddingVertical: 20,
        gap: 2,
    },
    labelContainer: {
        gap: 2,
        marginBottom: 6,
    },
    labelInput: {
        fontSize: 14,
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: "#0f172a",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        opacity: 0.8,
    },
    changeData: {
        backgroundColor: COLORS.tertiary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        shadowColor: COLORS.shadow,
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    editValue: {
        marginTop: 5,
        borderColor: COLORS.border,
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 8,
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
    passiveButton: {
        padding: 10,
        borderRadius: 8,
        borderColor: COLORS.border,
        borderWidth: 1,
    }
})