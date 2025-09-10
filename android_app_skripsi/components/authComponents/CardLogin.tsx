import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import InputLogin from './InputLogin';
import ButtonSignIn from './ButtonSignIn';
import { Link } from 'expo-router';

type CardLoginProps = {
  title: string;
  onNext: () => void;
};

const CardLogin: React.FC<CardLoginProps> = ({title, onNext}) => {
  return (
    <View style={authStyles.card}>
      <Text style={authStyles.title}>{title}</Text>
      <InputLogin title="Email Account" placeholder="Enter Email" />
      <InputLogin title="Password" placeholder="Enter Password" secureTextEntry />
      <ButtonSignIn text='Sign In'/>
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

export default CardLogin