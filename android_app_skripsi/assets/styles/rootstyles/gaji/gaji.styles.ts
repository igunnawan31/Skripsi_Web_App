import COLORS from "@/constants/colors";
import { StyleSheet } from "react-native";

export const GajiStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        width: "100%",
        alignItems: "center",
        gap: 10,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
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
    
    firstContainer: {
        width: "90%",
        height: "auto",
        justifyContent: "center",
        marginTop: 72,
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
        fontWeight: "500",
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
        width: 34,
        height: 34,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        backgroundColor: COLORS.successOpacity20,
    },
    iconCheck: {
        width: 20,
        height: 20,
        tintColor: COLORS.success,
    },
    earningsMiddle: {
        flex: 1,
    },
    earningsDate: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
    },
    earningsStatus: {
        fontSize: 13,
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
    }
});