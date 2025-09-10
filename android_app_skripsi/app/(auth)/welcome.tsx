import { View, Text, Image, Animated, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { welcomeStyles } from '@/assets/styles/authstyles/welcome.styles';
import ButtonLogin from '@/components/welcomeComponents/ButtonLogin';
import { welcomeData } from '@/data/welcomeData';
import CardExplanation from '@/components/welcomeComponents/CardExplanation';

const { width } = Dimensions.get("window");

const WelcomePage = () => {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < welcomeData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.push("/(auth)/sign-in");
    }
  };

  const flatListRef = useRef<Animated.FlatList<any>>(null);

  return (
    <View style={welcomeStyles.container}>
      <View style={welcomeStyles.header}>
        <ButtonLogin hidden={currentIndex === welcomeData.length - 1} />
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={welcomeData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [20, 0, 20],
            extrapolate: "clamp",
          });

          return (
            <View style={{ width, alignItems: "center" }}>
              <Animated.View style={[welcomeStyles.imageView, { opacity, transform: [{ translateY }] }]}>
                <Image
                  source={item.image}
                  style={welcomeStyles.image}
                  resizeMode="contain"
                />
              </Animated.View>

              <Animated.View style={{ marginTop: 16, opacity, transform: [{ translateY }] }}>
                <CardExplanation
                  title={item.title}
                  description={item.description}
                  onNext={handleNext}
                  nextLabel={index === welcomeData.length - 1 ? "Go to Sign-in" : "Next"}
                  pagination={
                    <View style={welcomeStyles.pagination}>
                      {welcomeData.map((_, i) => {
                        const dotOpacity = scrollX.interpolate({
                          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                          outputRange: [0.3, 1, 0.3],
                          extrapolate: "clamp",
                        });

                        return <Animated.View key={i} style={[welcomeStyles.dot, { opacity: dotOpacity }]} />;
                      })}
                    </View>
                  }
                />
              </Animated.View>
            </View>
          );
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default WelcomePage;
