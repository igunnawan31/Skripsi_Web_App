import { Dimensions, StyleSheet } from "react-native"
import { COLORS } from "@/constants/colors"
import { Colors } from "react-native/Libraries/NewAppScreen";

export const notificationStyles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 100,
        right: 20,
        flex: 1,
        width: "90%",
        backgroundColor: COLORS.white,
        paddingVertical: 20,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 12,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 11,
    },
    logoHeaderContainer: {
        position: "absolute",
        top: 30,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
    },
    logoHeader: {
        width: 30,
        height: 30,
        tintColor: COLORS.primary,
    },
    headerTitle: {
        fontWeight: "700",
        color: COLORS.primary,
        fontSize: 16,
    },
    notificationBox: {
        borderRadius: 10,
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 5,
        backgroundColor: COLORS.white,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    rowDate: {
        marginBottom: 6,
    },
    date: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: "500",
    },
    title: {
        fontWeight: "700",
        fontSize: 15,
        color: COLORS.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    categoryBadge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 6,
        backgroundColor: COLORS.info
    },
    categoryText: {
        fontSize: 12,
        color: COLORS.white,
        fontWeight: "600",
    },
    content: {
        width: "75%",
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    time: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    titleNotificationContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    showAllButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: COLORS.tertiary,
    }
});