import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import { COLORS } from '@/constants/colors';

type InputLoginProps = {
    title: string;
    placeholder: string;
    secureTextEntry?: boolean;
    isOTP?: boolean;
};

const InputForgotPassword: React.FC<InputLoginProps> = ({ title, placeholder, secureTextEntry, isOTP }) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);
    const [isFocused, setIsFocused] = useState(false);
    const [otpCode, setOtpCode] = useState(["", "", "", ""]);
    const inputsRef = useRef<(TextInput | null)[]>([]);

    const handleChange = (text: string, index: number) => {
        if (/^[0-9]?$/.test(text)) {
            const newOtp = [...otpCode];
            newOtp[index] = text;
            setOtpCode(newOtp);

            if (text && index < 3) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && otpCode[index] === '' && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <View style={{ marginBottom: 16, width: "100%" }}>
            <Text style={authStyles.inputTitle}>
                {title}
            </Text>


            {!isOTP ? (
                <View style={{
                    ...authStyles.input,
                    borderColor: isFocused ? COLORS.primary : COLORS.border,
                    borderWidth: isFocused ? 2 : 1,
                    backgroundColor: 'transparent'
                }}>
                    <TextInput
                        placeholder={placeholder}
                        secureTextEntry={isSecure}
                        style={{ flex: 1, paddingHorizontal: 15, color: COLORS.textPrimary}}
                        placeholderTextColor={COLORS.textMuted}
                    />
                </View>
            ) : (
                <View style={authStyles.otpInput}>
                    {otpCode.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {inputsRef.current[index] = ref}}
                            style={authStyles.otpTextInput}
                            placeholder={"X"}
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

export default InputForgotPassword;