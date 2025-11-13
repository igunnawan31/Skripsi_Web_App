import React from 'react'
import { Stack } from "expo-router";
import { AbsenProvider } from '@/context/AbsenContext';

const AbsensiRootLayout = () => {
    return (
        <AbsenProvider>
            <Stack 
                screenOptions={{ headerShown: false }}
                initialRouteName='geoLocation'
            />
        </AbsenProvider>
    )
} 

export default AbsensiRootLayout;