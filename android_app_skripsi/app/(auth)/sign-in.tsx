import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

const SignInPage = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link href="/welcome">
        welcome page
      </Link>
    </View>
  )
}

export default SignInPage;