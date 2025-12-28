import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { InputLoginProps } from '@/types/auth/authProps';

const InputLogin: React.FC<InputLoginProps> = ({ title, placeholder, secureTextEntry, value, onChangeText }) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <View style={{ marginBottom: 16, width: "100%" }}>
            <Text style={authStyles.inputTitle}>
                {title}
            </Text>
    
            <View style={{
                ...authStyles.input,
                borderColor: isFocused ? COLORS.primary : COLORS.border,
                borderWidth: isFocused ? 2 : 1,
                backgroundColor: 'transparent'
            }}>
                <TextInput
                    placeholder={placeholder}
                    secureTextEntry={isSecure}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    keyboardType={title.toLowerCase().includes("email") ? "email-address" : "default"}
                    autoCapitalize="none"
                    style={{ flex: 1, paddingHorizontal: 15, color: COLORS.textPrimary}}
                    placeholderTextColor={COLORS.textMuted}
                />

                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                        <Ionicons
                            name={isSecure ? "eye-off" : "eye"}
                            size={20}
                            color={COLORS.shadow}
                            style={{ position: "absolute", right: 10, bottom: -10}}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

export default InputLogin