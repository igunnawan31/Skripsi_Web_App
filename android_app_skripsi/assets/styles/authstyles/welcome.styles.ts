import { Dimensions, StyleSheet } from "react-native"
import { COLORS } from "@/constants/colors"

const { width } = Dimensions.get("window");

export const welcomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.primary,
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 16
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        marginHorizontal: 10,
        width: width,
        height: "74%",
        alignSelf: "center"
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
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 8,
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
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: "#000",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 12,
    },
    nextButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    nextButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    slide: {
        width: width,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 12,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    buttonLogin: {
        marginTop: 16,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.white,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLoginText: {
        color: COLORS.white,
        fontWeight: 600
    }
})