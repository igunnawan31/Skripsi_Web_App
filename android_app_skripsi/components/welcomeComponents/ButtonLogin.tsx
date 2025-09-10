import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { welcomeStyles } from '@/assets/styles/authstyles/welcome.styles';
import { useRouter } from 'expo-router';

type ButtonLoginProps = {
  hidden?: boolean;
}

const ButtonLogin: React.FC<ButtonLoginProps> = ({ hidden = false}) => {
  const router = useRouter();

  const handleRoute = () => {
    router.push("/(auth)/sign-in");
  }
  
  return (
    <TouchableOpacity 
      style={[
        welcomeStyles.buttonLogin,
        hidden && { opacity: 0 }
      ]}
      disabled={hidden}
      onPress={handleRoute}
    >
      <Text style={welcomeStyles.buttonLoginText}>Sign-in</Text>
    </TouchableOpacity>
  )
}

export default ButtonLogin;