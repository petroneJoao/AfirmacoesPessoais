// src/screens/OnboardingScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList, 
  'Onboarding'
>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidePosition = useSharedValue(0);

  const slides = [
    {
      title: 'Bem-vindo ao Poder das Afirmações',
      description: 'Transform seu mindset e alcance seus objetivos através de afirmações positivas diárias.',
      image: require('../assets/images/slide1.png')
    },
    {
      title: 'Escolha Seus Focos',
      description: 'Personalize suas afirmações para áreas importantes da sua vida: amor, carreira, finanças e desenvolvimento pessoal.',
      image: require('../assets/images/slide2.png')
    },
    {
      title: 'Transformação Diária',
      description: 'Receba afirmações inspiradoras todos os dias e comece a reprogramar sua mente para o sucesso.',
      image: require('../assets/images/slide3.png')
    }
  ];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ 
        translateX: withTiming(-currentSlide * SCREEN_WIDTH, { duration: 300 }) 
      }]
    };
  });

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('ProfileSetup');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.slidesContainer, 
          animatedStyle
        ]}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image 
              source={slide.image} 
              style={styles.image} 
              resizeMode="contain" 
            />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </Animated.View>

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot, 
              currentSlide === index && styles.activeDot
            ]} 
          />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={handleNextSlide}
      >
        <Text style={styles.nextButtonText}>
          {currentSlide < slides.length - 1 ? 'Próximo' : 'Começar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slidesContainer: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 3
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333'
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20
  },
  dotsContainer: {
    flexDirection: 'row',
    marginVertical: 20
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5
  },
  activeDot: {
    backgroundColor: '#5A31F4'
  },
  nextButton: {
    backgroundColor: '#5A31F4',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default OnboardingScreen;