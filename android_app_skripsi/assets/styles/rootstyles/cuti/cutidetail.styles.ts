import { Dimensions, StyleSheet } from "react-native"
import { COLORS } from "@/constants/colors"

export const cutiDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.background,
        paddingTop: 72,
        paddingBottom: 36,
        alignItems: "center"
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
    subHeaderDetail: {
        alignItems: "center",
        marginBottom: 10,
        gap: 5,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        color: COLORS.textPrimary
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
        backgroundColor: COLORS.white,
        width: "90%",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginVertical: 4,
        justifyContent: "space-between",
        alignItems: "center",

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
        gap: 10
    },
    penolakanContainer: {
        backgroundColor: COLORS.white,
        width: "90%",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginVertical: 4,
        justifyContent: "space-between",

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
    cutiStatus: {
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
    cutiApprover: {
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
    label: {
        fontSize: 13,
        color: COLORS.textPrimary,
        marginBottom: 4,
        fontWeight: "500",
    },
    dataContainer: {
        width: "90%",
        paddingVertical: 16,
        gap: 12,
    },
    itemContainer: {
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 12,
        shadowColor: COLORS.shadow,
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        gap: 10,
    },
    value: {
        fontSize: 15,
        color: COLORS.textPrimary,
        fontWeight: "600",
    },
    formContainer: {
        width: "90%",
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#f1f5f9",
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
    dateInput: {
        backgroundColor: "#f8fafc",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    submitText: {
        color: COLORS.white,
        fontWeight: "600",
        fontSize: 16,
    },
    filterContainer: {
        width: "100%",
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
    profilePictureContainer: {
        alignSelf: "center",
        width: 30,
        height: 30,
        borderRadius: 60,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    profilePicture: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
        backgroundColor: COLORS.white,
    },
    dataRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
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
});