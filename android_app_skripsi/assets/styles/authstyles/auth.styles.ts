import { Dimensions, StyleSheet } from "react-native"
import { COLORS } from "@/constants/colors"

const { width } = Dimensions.get("window");

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.primary,
        padding: 20,
        justifyContent: "center",
    },
    card: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 10,
        alignSelf: "center",
    },
    imageView : {
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.primary,
        textAlign: "center",
        marginBottom: 24,
    },
    description: {
        fontSize: 16,
        textAlign: "justify",
        color: COLORS.textMuted,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 16,
    },
    cardWrapper: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        minHeight: "50%",
        justifyContent: "flex-start",
    },
    input: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    inputTitle: {
        fontWeight: "600",
        marginBottom: 6,
        color: COLORS.primary
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
        width: "100%",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "600",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    footerText: {
        color: COLORS.text,
        fontSize: 16,
    },
    linkText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "600",
    },
});