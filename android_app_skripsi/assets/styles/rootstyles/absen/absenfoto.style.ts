import COLORS from "@/constants/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const absenFotoStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    header: {
        position: "absolute",
        top: 25,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 40, 
        backgroundColor: COLORS.white, 
        justifyContent: "center", 
        alignItems: "center",
        marginRight: 10,
        zIndex: 10,
    },
    textHeader: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: "bold",
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        paddingHorizontal: 64,
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    iconPlace: {
        position: "absolute",
        top: 15,
        left: 10,
        width: 40, 
        height: 40, 
        borderRadius: 40, 
        backgroundColor: COLORS.white, 
        justifyContent: "center", 
        alignItems: "center",
        marginRight: 10,
        zIndex: 10,
    },
    iconBack: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    faceFrame: {
        width: width * 0.6,
        height: width * 0.7,
        borderWidth: 4,
        borderColor: "#00E0FF",
        borderRadius: 20,
    },
    footer: {
        height: 220,
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
    },
    instruction: {
        fontSize: 14,
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    captureButton: {
        width: 70,
        height: 70,
        backgroundColor: COLORS.tertiary,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    flipButton: {
        width: 70,
        height: 70,
        borderColor: COLORS.tertiary,
        borderRadius: 35,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    flipButtonPosition: {
        position: "absolute",
        right: 20,
        bottom: 0,
    },
        centerButtonPosition: {
        position: "absolute",
        alignSelf: "center",
        bottom: 0,
    },
});

export default absenFotoStyles;