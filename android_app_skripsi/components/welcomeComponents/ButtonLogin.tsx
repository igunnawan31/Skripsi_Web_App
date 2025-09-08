import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { welcomeStyles } from '@/assets/styles/authstyles/welcome.styles';

type ButtonLoginProps = {
  hidden?: boolean;
}

const ButtonLogin: React.FC<ButtonLoginProps> = ({ hidden = false}) => {
  return (
    <TouchableOpacity 
      style={[
        welcomeStyles.buttonLogin,
        hidden && { opacity: 0 }
      ]}
      disabled={hidden}
    >
      <Text style={welcomeStyles.buttonLoginText}>Sign-in</Text>
    </TouchableOpacity>
  )
}

export default ButtonLogin;