import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

type InputLoginProps = {
    title: string;
    placeholder: string;
    secureTextEntry?: boolean;
};

const InputLogin: React.FC<InputLoginProps> = ({ title, placeholder, secureTextEntry }) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);
    return (
        <View style={{ marginBottom: 16, width: "100%" }}>
            <Text style={authStyles.inputTitle}>
                {title}
            </Text>
    
            <View style={authStyles.input}>
                <TextInput
                    placeholder={placeholder}
                    secureTextEntry={isSecure}
                    style={{ flex: 1, paddingVertical: 10, color: COLORS.text }}
                    placeholderTextColor={COLORS.textMuted}
                />

                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                        <Ionicons
                            name={isSecure ? "eye-off" : "eye"}
                            size={20}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

export default InputLogin