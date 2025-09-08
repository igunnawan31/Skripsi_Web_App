import { View, Text } from 'react-native'
import React, { ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@/constants/colors';

type SafeScreenProps = {
    children: ReactNode;
}

const SafeScreen: React.FC<SafeScreenProps> = ({children}) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ paddingTop: insets.top, flex: 1, backgroundColor:COLORS.background }}>
            {children}
        </View>
    );
}

export default SafeScreen