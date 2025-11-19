import COLORS from "@/constants/colors";
import { StyleSheet } from "react-native";

export const calendarStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.background,
        paddingBottom: 96,
    },
    header: {
        height: 100,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    inverseLogoHeaderContainer: {
        width: 20,
        height: 20,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderColor: COLORS.primary,
        borderWidth: 1,
        backgroundColor: COLORS.white,
    },
    logoHeader: {
        width: 30,
        height: 30,
        tintColor: COLORS.primary,
    },
    item: {
        backgroundColor: 'lightblue',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 25,
        paddingBottom:20
    },
    itemText: {
        color: 'black',
        fontSize: 16,
    },
    monthGrid: {
        flex: 1,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 2,
    },
    monthCalendarContainer: { 
        backgroundColor: COLORS.white, 
        borderBottomWidth: 1, 
        borderBottomColor: COLORS.border 
    },
    headerMonth: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 16
    },
    prevNextMonthView: {
        width: 32,
        height: 32,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textPrevNext: { 
        fontSize: 14, 
        color: COLORS.border 
    },
    hasEvent: {
        width: 4,
        height: 4,
        borderRadius: 6,
        backgroundColor: COLORS.secondary,
        marginTop: 2
    },
    isToday: { 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderWidth: 1, 
        borderColor: '#e0e0e0', 
        borderRadius: 4 
    },
    textIsToday: {
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: 500
    },
    titleMonth: { 
        fontSize: 16, 
        fontWeight: '600', 
        minWidth: 150, 
        textAlign: 'center',
        color: COLORS.textPrimary 
    },
    dayContainer: { 
        flexDirection: 'row', 
        paddingHorizontal: 16, 
        marginVertical: 16 
    },
    eventSelected: { 
        padding: 16, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#e0e0e0' 
    },
    cardEvent: {
        backgroundColor: COLORS.white,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.secondary,
        padding: 12,
        marginBottom: 8,
        borderRadius: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 2,
    },
    eventTitle: {
        fontSize: 16, 
        fontWeight: '600', 
        minWidth: 150,
        color: COLORS.textPrimary,
        marginBottom: 4
    },
    eventDate: {
        fontSize: 24, 
        fontWeight: '600', 
        minWidth: 150,
        color: COLORS.textPrimary,
    },
    addEvent: {
        position: 'absolute',
        bottom: 100,
        right: 15,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 2,
        zIndex: 10,
    },

    // Filter Modal
    modalFilterContainer: {
        justifyContent: "flex-end",
        margin: 0,
    },
    filterModal: {
        height: "60%",
        width: "100%",
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        justifyContent: "flex-start",
        alignItems: "center",
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
        borderColor: COLORS.border,
        width: "100%",
        flexDirection: "row", 
        alignItems: "center",
        gap: 10
    },
    selectAll: {
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
    },
    buttonSelectAll: {
        color: COLORS.white,
        textAlign: "center",
        fontWeight: "600",
    },
    projectSelect: {
        padding: 15,
        borderRadius: 20,
        borderWidth: 1,
    },
    submitButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    }
});