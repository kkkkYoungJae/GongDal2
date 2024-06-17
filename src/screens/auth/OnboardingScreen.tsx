import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { useState } from 'react';
import { FlatList, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OnboardingScreen = () => {
  const { width } = useWindowDimensions();
  const { palette, colors } = useUIKitTheme();
  const { bottom, top } = useSafeAreaInsets();
  const { navigation } = useAppNavigation();

  const [currentIndex, setCurrentIndex] = useState(0);

  const Section1 = () => (
    <View>
      <Text>Section1</Text>
    </View>
  );
  const Section2 = () => (
    <View>
      <Text>Section2</Text>
    </View>
  );
  const Section3 = () => (
    <View>
      <Text>Section3</Text>
    </View>
  );
  const Section4 = () => (
    <View>
      <Text>Section4</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 32,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 100,
              backgroundColor: currentIndex === i ? palette.primary : palette.grey200,
              marginHorizontal: 6,
            }}
          />
        ))}
      </View>
      <FlatList
        data={Array(4)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(
            Math.floor(event.nativeEvent.contentOffset.x) /
              Math.floor(event.nativeEvent.layoutMeasurement.width),
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item, index }) => (
          <MainLayout style={{ width }}>
            {index === 0 && <Section1 />}
            {index === 1 && <Section2 />}
            {index === 2 && <Section3 />}
            {index === 3 && <Section4 />}
          </MainLayout>
        )}
      />
      <TouchableOpacity
        onPress={() => navigation.replace(Routes.SignInScreen)}
        style={{
          backgroundColor: palette.primary,
          paddingBottom: bottom + 28,
          padding: 28,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text h1 color={palette.white}>
          시작하기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;
