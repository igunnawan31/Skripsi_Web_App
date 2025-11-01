import { Dimensions, StyleSheet } from "react-native"
import { COLORS } from "@/constants/colors"

export const tabStyles = StyleSheet.create({
    shadow: {
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    tabIcons: {
        alignItems: "center",
        justifyContent: "center",
        top: 10,
        width: 60,
    },
    textTabs: {
        fontSize: 12,
    }
});