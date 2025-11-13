import COLORS from "@/constants/colors";
import { StyleSheet } from "react-native";

const absenDetailStyles = StyleSheet.create({
    container: { 
        paddingTop: 80, 
        paddingBottom: 30, 
        paddingHorizontal: 20 
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        zIndex: 10,
    },
    iconPlace: { 
        width: 32, 
        height: 32, 
        borderRadius: 40, 
        backgroundColor: COLORS.white, 
        justifyContent: "center", 
        alignItems: "center",
        marginRight: 10 
    },
    iconBack: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
    },
    headerTitle: {
        fontFamily: "poppins",
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.white
    },
    subHeader: {
        alignItems: "center",
        marginBottom: 10,
        gap: 5,
    },
    subHeaderTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        color: COLORS.textPrimary
    },
    textStatus: {
        fontSize: 16,
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        color: COLORS.white  
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
        fontSize: 14,
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
    absenseContainer: {
        width: "100%",
        height: "auto",
        justifyContent: "center",
        marginVertical: 5,
        overflow: "hidden",
    },
    tanggalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tanggalText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    checkContainer: {
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 4,
    },
    checkRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "48%",
        borderRadius: 12,
        marginVertical: 4,
        gap: 10,
    },
    checkLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.textPrimary,
    },
    checkValue: {
        fontSize: 32,
        fontWeight: "600",
        color: COLORS.tertiary,
    },
    logoAbsenseContainer: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: COLORS.tertiaryOpacity20,
    },
    logoAbsense: {
        width: 30,
        height: 30,
        tintColor: COLORS.tertiary,
    },
    checkInOutContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    checkInOutSection: {
        height: "auto",
        width: "48%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.successOpacity50,
        paddingVertical: 20,
        borderRadius: 15,
        gap: 5,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 2,
    },
    logoCheck: {
        width: 16,
        height: 16,
        tintColor: COLORS.white,
    },
    titleCheck: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "600",
    },
    textCheck: {
        fontSize: 26,
        color: COLORS.white,
    },
});

export default absenDetailStyles;