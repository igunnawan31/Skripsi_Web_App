import COLORS from "@/constants/colors";
import { HeaderTitle } from "@react-navigation/elements";
import { StyleSheet } from "react-native";

const penilaianKpiStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
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
    subHeaderContainer: { 
        paddingTop: 70,
        width: "100%",
        paddingHorizontal: 20,
        paddingBottom: 20,
        marginBottom: 20,
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    subHeaderTitle: {
        fontFamily: "poppins",
        fontSize: 24,
        fontWeight: 900,
        color: COLORS.white
    },
    subHeaderDescription: {
        fontFamily: "poppins",
        fontSize: 14,
        color: COLORS.background
    },
    logoSubHeaderContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
    },
    logoSubHeader: {
        width: 30,
        height: 30,
        tintColor: COLORS.primary,
    },
    listContainer: {
        height: "auto",
        width: "90%",
        justifyContent: "center",
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginVertical: 10,
        borderRadius: 15,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 11,
        gap: 6,
    },
    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    date: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    statusContainer: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 8
    },
    statusBullet: {
        width: 10,
        height: 10,
        borderRadius: 10,
    },
    filterContainer: {
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.tertiary,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 15,
    },
    filterText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.white,
    },
    bulanContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bulanText: { 
        color: COLORS.textPrimary, 
        fontWeight: "bold", 
        fontSize: 18 
    },
    KPIStatusContainer: {
        width: "100%",
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    KPIStatus: {
        height: "auto",
        width: "48%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
        paddingVertical: 20,
        marginVertical: 10,
        borderRadius: 15,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 11,
        gap: 5,
    },
    titleKPIStatus: {
        color: COLORS.tertiary,
        fontSize: 18,
        fontWeight: "600",
    },
    logoKPI: {
        width: 30,
        height: 30,
        tintColor: COLORS.tertiary,
    },
    textKPIStatus: {
        fontSize: 14,
        color: COLORS.textPrimary
    },
    inputSearch: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
        marginTop: 10,
        fontSize: 15,
        color: "#0f172a",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        width: "90%",
        flexDirection: "row", 
        alignItems: "center",
        gap: 10
    },
    noData: { 
        fontSize: 16, 
        color: COLORS.textMuted, 
        marginTop: 16, 
        textAlign: 'center' 
    },

    // detail
    headerDetailContainer: { 
        alignItems: "center", 
        paddingHorizontal: 20, 
        paddingTop: 72,
        paddingBottom: 10,
        flexDirection: "row", 
        justifyContent: "space-between" 
    },
    headerDetailTitle: { 
        color: COLORS.textPrimary, 
        fontSize: 18, 
        fontWeight: "600",
    },
    headerPageContainer: { 
        backgroundColor: COLORS.tertiary, 
        borderRadius: 10, 
        paddingHorizontal: 10, 
        paddingVertical: 5 
    },
    headerPageText: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: COLORS.white 
    },
    categoryContainer: { 
        backgroundColor: COLORS.secondary, 
        borderRadius: 10,
        width: "90%",
    },
    categoryTitle: { 
        fontSize: 16, 
        fontWeight: "700", 
        color: COLORS.white, 
        paddingHorizontal: 10, 
        paddingVertical: 5
    },
    cardContainer: {
        width: "90%",
        marginTop: 15,
        padding: 15,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        gap: 5,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 11
    },
    titleCard: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary
    },
    textCard: {
        fontSize: 14,
        color: COLORS.textPrimary
    },
    noteCard: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        height: 80,
    },
    rowPenanda: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 5 
    },
    radioButton: {
        width: 30,
        height: 30,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: { 
        color: COLORS.primary, 
        fontSize: 12 
    },
    buttonSubmit: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center"
    }
});

export default penilaianKpiStyles