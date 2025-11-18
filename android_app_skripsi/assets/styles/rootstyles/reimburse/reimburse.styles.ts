import COLORS from "@/constants/colors";
import { StyleSheet } from "react-native";

const reimburseStyles = StyleSheet.create({
    reimburseContainer: {
        width: "90%",
    },

    // Tampilan Umum
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
    cutiContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ajukanCutiButton: {
        width: "auto",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.tertiary,
        padding: 10,
        borderRadius: 15,
        flexDirection: "row",
        gap: 10,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 11,
    },
    textAjukanCuti: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.white,
    },
    icons: {
        width: 20,
        height: 20,
        tintColor: COLORS.white,
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

    // Filter Modal
    modalFilterContainer: {
        justifyContent: "flex-end",
        margin: 0,
    },
    filterModal: {
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
    applyButton: {
        marginTop: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: "center",
        width: "100%",
    },
    cancelButton: {
        marginTop: 20,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: "center",
        width: "100%",
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    applyText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },
    cancelText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "600",
    },

    // List Data
    listContainer: {
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
    listContainerNotAvailable: {
        justifyContent: "center",
        backgroundColor: COLORS.border,
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
    iconCalendar: {
        width: 12,
        height: 12,
        tintColor: COLORS.primary,
    },
    timeText: {
        fontSize: 13,
        color: COLORS.textPrimary,
    },

    // Create
    createFormContainer: {
        width: "90%",
        gap: 2,
    },
    labelContainer: {
        gap: 4,
        marginBottom: 12,
    },
    error: { 
        color: "red", 
        fontSize: 12 
    },
    labelInput: {
        fontSize: 14,
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: "#0f172a",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    submitButton: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 15,
    },
    buktiPendukungContainer: {
        marginTop: 10,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        elevation: 3,
    },

    // Detail
    statusContainer: {
        backgroundColor: COLORS.white,
        width: "90%",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginVertical: 4,
        justifyContent: "space-between",
        alignItems: "flex-start",

        shadowColor: COLORS.shadow,
        shadowOffset: { 
            width: 0, 
            height: 6 
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,

        borderWidth: 1,
        borderColor: COLORS.border,
    },
    label: {
        fontSize: 13,
        color: COLORS.textPrimary,
        marginBottom: 4,
        fontWeight: "500",
    },
    value: {
        fontSize: 15,
        color: COLORS.textPrimary,
        fontWeight: "600",
    },
    Status: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.white,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        overflow: "hidden",
        textAlign: "center",
        minWidth: 90,
        shadowColor: COLORS.shadow,
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    Approver: {
        fontSize: 15,
        color: COLORS.white,
        fontWeight: "600",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        overflow: "hidden",
        textAlign: "center",
        minWidth: 90,
        shadowColor: COLORS.shadow,
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        backgroundColor: COLORS.tertiary
    },
});

export default reimburseStyles;