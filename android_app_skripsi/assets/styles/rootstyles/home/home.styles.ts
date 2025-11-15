import { Dimensions, StyleSheet } from "react-native"
import { COLORS } from "@/constants/colors"

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.background,
        paddingBottom: 50,
        alignItems: "center"
    },
    header: {
        height: 210,
        width: "100%",
        justifyContent: "space-between",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginBottom: 10,
        borderBottomEndRadius: 30,
        flexDirection: "row",
        overflow: "hidden",
        position: "relative",
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
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
    },
    logoHeader: {
        width: 30,
        height: 30,
        tintColor: COLORS.primary,
    },
    absenseContainer: {
        position: "absolute",
        top: 100,
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
        gap: 6,
    },
    waktuContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    waktuText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    checkContainer: {
        borderColor: COLORS.border,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        gap:4,
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
    buttonContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
    },
    buttonPrimary: {
        width: "100%",
        flex: 1,
        backgroundColor: COLORS.tertiary,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonSecondary: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 6,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: "600",
        fontSize: 14,
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

    // Feature Styles
    titleSection: { 
        fontWeight: "bold", 
        fontSize: 18,
    },
    descriptionSection: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    featureContainer: {
        width: "95%",
        justifyContent: "center",
        marginTop: 120,
        marginBottom: 10,
    },
    featureTouchContainer: {
        alignItems: "center",
    },
    featureButtonContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 8,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
        gap: 6,
    },
    featureButtonImage: { 
        width: 40, 
        height: 40, 
        resizeMode: "contain",
    },
    featureButtonTitle: {
        fontWeight: "600",
        color: COLORS.textPrimary,
        textAlign: "center",
        fontSize: 13,
    },
    featureButtonDescription: {
        fontSize: 11,
        color: COLORS.textMuted,
        textAlign: "center",
    },

    // Reimburse
    reimburseContainer: {
        width: "90%",
    },
    titleContainer: { 
        flexDirection: "row", 
        alignItems: "flex-start", 
        justifyContent: "space-between",
        marginBottom: 10
    },

});