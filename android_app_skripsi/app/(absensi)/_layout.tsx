import React from 'react'
import { Stack } from "expo-router";

const AbsensiRootLayout = () => {
    return (
        <Stack 
            screenOptions={{ headerShown: false }}
            initialRouteName='geoLocation'
        />
    )
} 

export default AbsensiRootLayout;