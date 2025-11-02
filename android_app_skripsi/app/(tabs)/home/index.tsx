import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/colors'

const HomePage = () => {
  return (
    <View style={{ backgroundColor: COLORS.background, flex:1 }}>
      <Text>index</Text>
    </View>
  )
}

export default HomePage