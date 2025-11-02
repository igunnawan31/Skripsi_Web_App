import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { authStyles } from '@/assets/styles/authstyles/auth.styles'
import { useRouter } from 'expo-router'

type ButtonSignInProps = {
    text: string,
}

const ButtonSignIn: React.FC<ButtonSignInProps> = ({text}) => {
    const router = useRouter();
    
    const handleSignIn = () => {
        router.push('/home')
    }

    return (
        <View>
            <TouchableOpacity onPress={handleSignIn} style={authStyles.button}>
                <Text style={authStyles.buttonText}>Sign In</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonSignIn