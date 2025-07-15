import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth Screens
import LoginScreen from '../auth/screens/LoginScreen';
import RegisterScreen from '@/auth/screens/RegisterScreen';
import OTPVerificationScreen from '@/auth/screens/OTPVerificationScreen';
import GuestConversionScreen from '@/auth/screens/GuestConversionScreen';
import WelcomeScreen from '@/auth/screens/WelcomeScreen';
import HomeScreen from '@/home/screens/HomeScreen';

// Auth context
import { AuthProvider } from '../auth/contexts/AuthContext';
import { useAuth } from '../auth/hooks/useAuth';
import OnboardingScreen from '@/auth/screens/OnboardingScreen';

// Stack Navigator 
const Stack = createNativeStackNavigator();


// Unthenticated Stack Navigator 
const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="GuestConversion" component={GuestConversionScreen} />
        </Stack.Navigator>
    );
}

// const PlaceHolderScreen = () => {
//     return (
//         <View>
//             <Text>PlaceHolderScreen</Text>
//         </View>
//     );
// }

// Authenticated Stack Navigator 
const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}

// Root Navigator inside auth context
const RootNavigator = () => {
    const { state } = useAuth();
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

    // Check if user has completed onboarding
    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const result = await AsyncStorage.getItem('HAS_COMPLETED_ONBOARDING');
                setHasCompletedOnboarding(result === 'true');
            } catch (error) {
                console.error('Error checking onboarding', error);
                setHasCompletedOnboarding(false);
            }
        }
        checkOnboarding();
    }, []);

    // Show loading screen while checking onboarding status 
    if (hasCompletedOnboarding === null) {
        // TODO: Show a splash screen 
        return <View>
            <Text>Loading...</Text>
        </View>
    }

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            {!hasCompletedOnboarding ? (
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : state.isAuthenticated ? (
                <Stack.Screen name="Auth" component={AuthStack} />
                // TODO: Switch the App
            ) : (
                <Stack.Screen name="App" component={AppStack} />
            )}
        </Stack.Navigator>
    );
};

// Main Navigator
const AppNavigator = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    )
}

export default AppNavigator;
