// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from '@shopify/restyle';

// Importar telas
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Importar tema e providers
import theme from '../utils/themes';
import { AuthProvider } from '../context/AuthContext';
import { AfirmacoesProvider } from '../context/AfirmacoesContext';

// Definir tipos de rotas
export type RootStackParamList = {
  Onboarding: undefined;
  ProfileSetup: undefined;
  Home: undefined;
  Payment: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AfirmacoesProvider>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Onboarding"
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.mainBackground }
              }}
            >
              <Stack.Screen 
                name="Onboarding" 
                component={OnboardingScreen} 
              />
              <Stack.Screen 
                name="ProfileSetup" 
                component={ProfileSetupScreen} 
              />
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
              />
              <Stack.Screen 
                name="Payment" 
                component={PaymentScreen} 
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AfirmacoesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppNavigator;