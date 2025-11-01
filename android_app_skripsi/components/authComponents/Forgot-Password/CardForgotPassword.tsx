import { authStyles } from "@/assets/styles/authstyles/auth.styles";
import React, { useState } from "react";
import { Text, View } from "react-native";
import InputForgotPassword from "./InputForgotPassword";
import ButtonForgotPassword from "./ButtonForgotPassword";

type CardForgotPasswordProps = {
    title: string;
    onNext: () => void;
};

const CardForgotPassword: React.FC<CardForgotPasswordProps> = ({title, onNext}) => {
    const [showOTP, setShowOTP] = useState(false);
    
    const handleAskOtp = () => {
        setShowOTP(true);
    }

    const handleVerifyOtp = () => {
        onNext();
    }
    
    const renderHtml = (
        <View style={authStyles.card}>
            <Text style={authStyles.title}>
                {title}
            </Text>
            {!showOTP ? (
                <InputForgotPassword title="Email Account" placeholder="Enter Email" />
            ) : (
                <InputForgotPassword title="OTP Code" placeholder="Enter OTP" isOTP={true} />
            )}
            <ButtonForgotPassword
                text={!showOTP ? "Ask for OTP Code" : "Verify OTP"}
                onPress={!showOTP ? handleAskOtp : handleVerifyOtp}
            />
        </View>
    );

    return renderHtml;
}

export default CardForgotPassword;