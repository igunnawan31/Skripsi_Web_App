import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { authStyles } from '@/assets/styles/authstyles/auth.styles'
import { useRouter } from 'expo-router'
import ForgotPassword from '@/app/(auth)/forgot-password'
import InputForgotPassword from './InputForgotPassword'

type ButtonSignInProps = {
    text: string,
    onPress: () => void;
}

const ButtonForgotPassword: React.FC<ButtonSignInProps> = ({text, onPress}) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress} style={authStyles.button}>
                <Text style={authStyles.buttonText}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonForgotPassword;