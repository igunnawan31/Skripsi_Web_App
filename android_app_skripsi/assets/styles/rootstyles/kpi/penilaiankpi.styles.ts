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
});

export default penilaianKpiStyles