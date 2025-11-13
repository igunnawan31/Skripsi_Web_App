import COLORS from "@/constants/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const absenSummaryStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.background,
        paddingBottom: 48,
        alignItems: "center"
    },
    header: {
        height: 100,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,
        borderBottomEndRadius: 30,
        flexDirection: "row",
    },
    headerTitle: {
        fontFamily: "poppins",
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.white
    },
    headerDescription: {
        fontFamily: "poppins",
        fontSize: 16,
        color: COLORS.background
    },
    logoHeaderContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
    },
    logoHeader: {
        width: 30,
        height: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: "center",
        marginBottom: 20,
    },
    section: {
        marginVertical: 5,
        padding: 15,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    coordText: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    photo: {
        width: "100%",
        height: 280,
        borderRadius: 10,
        marginTop: 10,
    },
    actions: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});

export default absenSummaryStyles;