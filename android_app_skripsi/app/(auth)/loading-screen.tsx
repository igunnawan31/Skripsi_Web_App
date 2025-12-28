import { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
import { View, Text, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import COLORS from "@/constants/colors";
import { LinearGradient } from 'expo-linear-gradient';

const LoadingScreenPage = () => {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            router.replace("/welcome");
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={["#F59E0B", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}
        >
            <View style={{ position: "absolute", top: 40, left: 40, width: 180, height: 180, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 100, }} />
            <View style={{ position: "absolute", bottom: 40, right: 40, width: 220, height: 220, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 120, }} />

            <Animated.View style={{opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Image
                    source={require("../../assets/images/welcome-1.png")}
                    style={{ width: 280, height: 280, marginBottom: 20 }}
                    resizeMode="contain"
                />
                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: "700",
                        color: "#fff",
                        textAlign: "center",
                        marginBottom: 10,
                    }}
                >
                    Welcome to HRIS Berinovasi
                </Text>

                <Text
                    style={{
                        fontSize: 15,
                        color: "rgba(255,255,255,0.8)",
                        textAlign: "center",
                        maxWidth: 330,
                    }}
                >
                    Please log in to access your account and manage your HR tasks efficiently.
                </Text>
            </Animated.View>

            <LottieView
                autoPlay
                loop

                style={{ width: 150, height: 150 }}
                source={require("../../assets/animations/Spinner@1x-1.0s-200px-200px.json")}
            />
        </LinearGradient>
    );
};

export default LoadingScreenPage;
