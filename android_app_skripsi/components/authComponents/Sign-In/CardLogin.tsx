import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import InputLogin from './InputLogin';
import ButtonSignIn from './ButtonSignIn';
import { Link } from 'expo-router';
import { CardLoginProps } from '@/types/auth/authProps';

const CardLogin: React.FC<CardLoginProps> = ({title, email, password, onEmailChange, onPasswordChange, onSubmit, loading, errorMsg}) => {
  return (
    <View style={authStyles.card}>
      <Text style={authStyles.title}>{title}</Text>
      <InputLogin 
        title="Email Account" 
        value={email} 
        placeholder="Enter Email"
        onChangeText={onEmailChange}
      />
      <InputLogin 
        title="Password" 
        placeholder="Enter Password" 
        secureTextEntry
        value={password}
        onChangeText={onPasswordChange} 
      />
      {errorMsg ? 
        <Text style={{ color: "red", marginBottom: 8, textAlign: "center" }}>
          {errorMsg}
        </Text>
      : null}
      <ButtonSignIn text={loading ? "Signing In..." : "Sign In"} disabled={loading} onPress={onSubmit} />
      <View style={authStyles.footerContainer}>
          <Text style={authStyles.footerText}>
              Forgot Your Password?
          </Text>
          <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                  <Text style={authStyles.linkText}>Click Here</Text>
              </TouchableOpacity>
          </Link>
      </View>
    </View>
  )
}

export default CardLogin;