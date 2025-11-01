import { Dimensions, StyleSheet } from "react-native"
import { COLORS } from "@/constants/colors"

export const historyStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.background,
        paddingBottom: 96,
        alignItems: "center"
    },
    header: {
        height: 100,
        width: "100%",
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,
        borderBottomEndRadius: 30,
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
    filterContainer: {
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 15,
    },
    filterText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.white,
    },
    modalFilterContainer: {
        justifyContent: "flex-end",
        margin: 0,
    },
    FilterModal: {
        height: "50%",
        width: "100%",
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 15,
    },
    modeSelector: {
        flexDirection: "row",
        gap: 5,
        width: "100%",
        marginBottom: 5,
    },
    modeButton: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    modeText: {
        fontSize: 16,
        color: COLORS.primary,
    },
    datePickerContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    modalPicker: {
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 5,
    },
    modalLabel: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: 10,
        marginBottom: 5,
        fontWeight: "500",
    },
    buttonDate: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: COLORS.white,
    },
    dateText: {
        fontSize: 15,
        color: COLORS.textPrimary,
    },
    iconCalendar: {
        width: 20,
        height: 20,
        tintColor: COLORS.primary,
    },
    applyButton: {
        marginTop: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: "center",
        width: "100%",
    },
    applyText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
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
    },
    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
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
    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    roleText: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "600",
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    timeBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 6,
        tintColor: COLORS.primary,
    },
    timeText: {
        fontSize: 13,
        color: COLORS.textPrimary,
    },
});