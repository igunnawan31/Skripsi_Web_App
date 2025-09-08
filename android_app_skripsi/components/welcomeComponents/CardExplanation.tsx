import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { welcomeStyles } from '@/assets/styles/authstyles/welcome.styles';

type CardExplanationProps = {
  title: string;
  description: string;
  onNext: () => void;
  nextLabel?: string;
  pagination?: React.ReactNode;
};

const CardExplanation: React.FC<CardExplanationProps> = ({title, description, onNext, pagination, nextLabel = "Next"}) => {
  return (
    <View style={welcomeStyles.card}>
      <Text style={welcomeStyles.title}>{title}</Text>
      <Text style={welcomeStyles.description}>{description}</Text>

      <View style={welcomeStyles.footer}>
        {pagination && <View style={welcomeStyles.paginationContainer}>{pagination}</View>}

        <TouchableOpacity style={welcomeStyles.nextButton} onPress={onNext}>
          <Text style={welcomeStyles.nextButtonText}>{nextLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CardExplanation