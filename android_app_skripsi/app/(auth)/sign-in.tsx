import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import CardExplanation from '@/components/welcomeComponents/CardExplanation';
import { useRouter } from 'expo-router';
import CardLogin from '@/components/authComponents/Sign-In/CardLogin';
import ButtonSignIn from '@/components/authComponents/Sign-In/ButtonSignIn';

const { width } = Dimensions.get("window");

const SignInPage = () => {
  const router = useRouter();
  const handleNext = () => {
    router.push("/");
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: authStyles.container.backgroundColor }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Image 
            source={require("../../assets/images/welcome-1.png")} 
            style={authStyles.image}
            resizeMode="contain"
          />
        </View>
        <View style={authStyles.cardWrapper}>
          <CardLogin
            title="Login to your Account"
            onNext={handleNext}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignInPage;