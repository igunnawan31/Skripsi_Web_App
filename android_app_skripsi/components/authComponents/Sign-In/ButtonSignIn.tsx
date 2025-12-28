import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { authStyles } from '@/assets/styles/authstyles/auth.styles'
import { ButtonSignInProps } from '@/types/auth/authProps'

const ButtonSignIn: React.FC<ButtonSignInProps> = ({text, onPress, disabled}) => {
    return (
        <View>
            <TouchableOpacity 
                onPress={onPress}
                disabled={disabled} 
                style={authStyles.button}>
                <Text style={authStyles.buttonText}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonSignIn