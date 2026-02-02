import COLORS from "@/constants/colors";
import { StyleSheet } from "react-native";

export const GajiStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.background,
        paddingBottom: 50,
        alignItems: "center"
    },
    header: {
        height: "auto",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginBottom: 10,
        borderBottomEndRadius: 30,
        gap: 20,
        flexDirection: "column",
        overflow: "hidden",
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
    headerBlob: {
        position: "absolute",
        top: -40,
        left: -40,
        transform: [{ rotate: "10deg" }],
        zIndex: -1,
        opacity: 0.6,
    },
    headerTitle: {
        fontFamily: "poppins",
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.white
    },
    firstContainer: {
        width: "100%",
        height: "auto",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        overflow: "hidden",
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 11,
        gap: 20,
        flexWrap: "nowrap",
    },
    currencyInformation: {
        flexWrap: "nowrap",
        flexDirection: "row",
        gap: 20,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    gapCurrency: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icons: {
        width: 18,
        height: 18,
        resizeMode: "contain",
    },
    flag: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 1,
        resizeMode: "cover",
    },
    textCurrency: {
        color: COLORS.textPrimary,
        fontSize: 20,
        fontWeight: "500",
    },
    currency: {
        fontSize: 32,
        fontWeight: "500",
    },
    secondContainer: {
        width: "90%",
        height: "auto",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 10,
        overflow: "hidden",
        gap: 20,
        flexWrap: "nowrap",
    },
    recentEarning: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    titleRecentEarning: {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        flexDirection: "row"
    },
    textEarning: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: "bold",
    },
    showAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 6, 
        borderWidth: 1, 
        borderColor: '#e0e0e0', 
        borderRadius: 4 
    },
    earningsBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
    },
    iconCircle: {
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        backgroundColor: COLORS.successOpacity20,
    },
    iconCheck: {
        width: 30,
        height: 30,
        tintColor: COLORS.success,
    },
    earningsMiddle: {
        flex: 1,
        gap: 4,
    },
    earningsDate: {
        fontSize: 14,
        fontWeight: "600",
        color: "#222",
    },
    earningsStatus: {
        fontSize: 14,
        color: "#777",
        marginTop: -2,
    },
    earningsRight: {
        alignItems: "flex-end",
    },
    earningsAmount: {
        fontSize: 15,
        fontWeight: "600",
    },
    noData: { 
        fontSize: 16, 
        color: COLORS.textMuted, 
        marginTop: 16, 
        textAlign: 'center' 
    },
    iconCalendar: {
        width: 14,
        height: 14,
        tintColor: COLORS.white,
    },
});