import { View, Text, FlatList, Image, ViewToken, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { welcomeStyles } from '@/assets/styles/authstyles/welcome.styles';
import ButtonLogin from '@/components/welcomeComponents/ButtonLogin';
import { welcomeData } from '@/data/welcomeData';
import CardExplanation from '@/components/welcomeComponents/CardExplanation';

const { width } = Dimensions.get("window");

const WelcomePage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewRef = useRef(({ viewableItems } : { viewableItems: ViewToken[]}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50});

  const handleNext = () => {
    if (currentIndex < welcomeData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true});
    }
    else {
      router.push("/(auth)/sign-in");
    }
  }

  return (
    <View style={ welcomeStyles.container }>
      <View style={ welcomeStyles.header }>
        <ButtonLogin hidden={currentIndex === welcomeData.length - 1} />
      </View>

      <FlatList 
        ref={flatListRef}
        data={welcomeData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: "center" }}>
            <View style={welcomeStyles.imageView}>
              <Image 
                source={item.image} 
                style={welcomeStyles.image} 
                resizeMode="contain" 
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <CardExplanation
                title={item.title}
                description={item.description}
                onNext={handleNext}
                nextLabel={currentIndex === welcomeData.length - 1 ? "Go to Sign-in" : "Next"}
                pagination={
                  <View style={welcomeStyles.pagination}>
                    {welcomeData.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          welcomeStyles.dot,
                          currentIndex === index && welcomeStyles.activeDot,
                        ]}
                      />
                    ))}
                  </View>
                }
              />
            </View>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  )
}

export default WelcomePage;
