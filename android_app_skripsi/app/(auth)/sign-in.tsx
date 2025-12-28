import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import CardExplanation from '@/components/welcomeComponents/CardExplanation';
import { useRouter } from 'expo-router';
import CardLogin from '@/components/authComponents/Sign-In/CardLogin';
import ButtonSignIn from '@/components/authComponents/Sign-In/ButtonSignIn';
import { useAuth } from '@/lib/api/hooks/useAuth';

const { width } = Dimensions.get("window");

const SignInPage = () => {
  const {loginMutation} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const onSubmit = () => {
    if (loginMutation.isPending) return;
    if (!email.trim()) {
      setValidationError("Email tidak boleh kosong");
      loginMutation.reset();
      return;
    }
    if (!password.trim()) {
      setValidationError("Password tidak boleh kosong");
      loginMutation.reset();
      return;
    }
    setValidationError("");
    loginMutation.mutate({ email, password });
  };

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
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={onSubmit}
            loading={loginMutation.isPending}
            errorMsg={
              validationError || (loginMutation.isError ? loginMutation.error.message : undefined)
            }
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignInPage;