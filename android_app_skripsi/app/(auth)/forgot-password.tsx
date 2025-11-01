import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import CardExplanation from '@/components/welcomeComponents/CardExplanation';
import { useRouter } from 'expo-router';
import CardLogin from '@/components/authComponents/Sign-In/CardLogin';
import ButtonSignIn from '@/components/authComponents/Sign-In/ButtonSignIn';
import CardForgotPassword from '@/components/authComponents/Forgot-Password/CardForgotPassword';

const { width } = Dimensions.get("window");

const ForgotPassword = () => {
  const router = useRouter();
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);

  const handleNext = () => {
    setIsVerificationSuccess(true);
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
        {!isVerificationSuccess ? (
          <>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Image 
                source={require("../../assets/images/welcome-1.png")} 
                style={authStyles.image}
                resizeMode="contain"
              />
            </View>
            <View style={authStyles.cardWrapper}>
              <CardForgotPassword
                title="Forgot Your Password"
                onNext={handleNext}
              />
            </View>
          </>
        ) : (
          <View style={authStyles.fullWrapper}>
              <Image 
                source={require("../../assets/images/welcome-1.png")} 
                style={authStyles.image}
                resizeMode="contain"
              />
              <Text style={authStyles.successTitle}>
                Verification Successful!
              </Text>
              <Text style={authStyles.descriptionSuccess}>
                You can now reset your password or go back to the login screen.
              </Text>
              <View style={[authStyles.buttonVerification]}>
                <Link href="/(auth)/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={authStyles.buttonText}>Back to Sign-In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ForgotPassword;