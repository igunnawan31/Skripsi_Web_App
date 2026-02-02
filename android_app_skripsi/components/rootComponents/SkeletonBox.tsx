import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

interface Props {
    width?: number;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export default function SkeletonBox({
    width,
    height,
    borderRadius = 8,
    style,
}: Props) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
        Animated.sequence([
            Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            }),
            Animated.timing(opacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
            }),
        ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: "#E1E9EE",
                    opacity,
                },
                style,
            ]}
        />
    );
}
