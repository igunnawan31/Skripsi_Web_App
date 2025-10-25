import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const AuthRoutesLayout = () => {
    return (
        <Stack 
            screenOptions={{ headerShown: false }}
            initialRouteName='welcome'
        />
    )
}

export default AuthRoutesLayout;