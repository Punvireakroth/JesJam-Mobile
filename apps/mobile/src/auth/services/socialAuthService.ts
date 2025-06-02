import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { Platform } from 'react-native';
declare module '@env' {
    export const GOOGLE_EXPO_CLIENT_ID: string;
    export const GOOGLE_ANDROID_CLIENT_ID: string;
    export const GOOGLE_IOS_CLIENT_ID: string;
    export const FACEBOOK_APP_ID: string;
}
import { GOOGLE_EXPO_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, FACEBOOK_APP_ID } from '@env';

// Web redirect
WebBrowser.maybeCompleteAuthSession();

// Google auth 
export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_EXPO_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        scopes: ['profile', 'email']
    });

    return {
        request, 
        response,
        promptAsync,
        isLoading: !!request,
    };
};

// Facebook auth
export const useFacebookAuth = () => {
    const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: FACEBOOK_APP_ID,
        redirectUri: Platform.select({
            ios: 'host.exp.exponent:/oauth2redirect',
            android: 'host.exp.exponent:/oauth2redirect/facebook',
            // TODO: Add default redirect uri
            default: '<url/facebook>',
          }),
        scopes: ['public_profile', 'email'],
    });

    return {
        request,
        response,
        promptAsync,
        isLoading: !!request,
    };
};

// Helper to extrack token from response
export const extractAccessToken = (response: AuthSession.AuthSessionResult | null): string | null => {
    if (response?.type !== 'success') return null;
  
    return response.authentication?.accessToken || null;
};