import React, { createContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthState, User, LoginCredentials, RegisterCredentials, OTPVerificationData, SocialAuthCredentials, GuestToUserMigrationData, TokenResponse } from '../types/auth.types';
import authService from '../services/authService';
import tokenService from '../services/tokenService';
import guestService from '../services/guestService';

// Initial state
const initialState: AuthState = {
    isAuthenticated: false,
    isGuest: false,
    isLoading: false,
    user: null,
    error: null,
    accessToken: null,
};

// Action types
type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'GUEST_LOGIN'; payload: string }
    | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'REGISTER_FAILURE'; payload: string }
    | { type: 'GUEST_TO_USER'; payload: { user: User; token: string } }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'CLEAR_ERROR' }
    | { type: 'AUTH_LOADED' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                isGuest: false,
                isLoading: false,
                user: action.payload.user,
                accessToken: action.payload.token,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,

            };
        case 'GUEST_LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                isGuest: true,
                isLoading: false,
                accessToken: action.payload,
                error: null,
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                isGuest: false,
                isLoading: false,
                user: action.payload.user,
                accessToken: action.payload.token,
                error: null,
            };
        case 'REGISTER_FAILURE':
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case 'GUEST_TO_USER':
            return {
                ...state,
                isAuthenticated: true,
                isGuest: false,
                isLoading: false,
                user: action.payload.user,
                accessToken: action.payload.token,
                error: null,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'AUTH_LOADED':
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    };
};

// Context interface
interface AuthContextProps {
    state: AuthState;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    socialLogin: (credentials: SocialAuthCredentials) => Promise<void>;
    verifyOtp: (data: OTPVerificationData) => Promise<void>;
    logout: () => Promise<void>;
    guestLogin: () => Promise<void>;
    convertGuestToUser: (data: GuestToUserMigrationData) => Promise<void>;
    clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const loadToken = async () => {
            try {
                // Check if user has a token
                const token = await tokenService.getToken();

                if (token) {
                    // Check if user is a guest
                    const isGuest = await SecureStore.getItemAsync('IS_GUEST');

                    if (isGuest) {
                        dispatch({ type: 'GUEST_LOGIN', payload: token });
                    } else {
                        // Get user data with token
                        const user = await authService.getCurrentUser();
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: {
                                user,
                                token,
                            },
                        });
                    }
                } else {
                    dispatch({ type: 'AUTH_LOADED' });
                }
            } catch (error) {
                await tokenService.removeToken();
                dispatch({ type: 'AUTH_LOADED' });
            }
        };
        loadToken();
    }, []);

    // Login function 
    const login = async (credentials: LoginCredentials) => {
        try {
            const { user, access_token } = await authService.login(credentials);
            await tokenService.saveToken(access_token);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token: access_token }
            });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
            } else {
                dispatch({ type: 'LOGIN_FAILURE', payload: 'An unknown error occurred' });
            }
        }
    };

    // Register function
    const register = async (credentials: RegisterCredentials) => {
        try {
            const { user, access_token } = await authService.register(credentials);
            await tokenService.saveToken(access_token);
            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: { user, token: access_token }
            });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
            } else {
                dispatch({ type: 'REGISTER_FAILURE', payload: 'An unknown error occurred' });
            }
        }
    };

    // Social login
    const socialLogin = async (credentials: SocialAuthCredentials) => {
        try {
            const { user, access_token } = await authService.socialLogin(credentials);
            await tokenService.saveToken(access_token);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token: access_token }
            });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
            } else {
                dispatch({ type: 'LOGIN_FAILURE', payload: 'An unknown error occurred' });
            }
        }
    };

    // OTP verification
    const verifyOtp = async (data: OTPVerificationData) => {
        try {
            const { user, access_token } = await authService.verifyOTP(data);
            await tokenService.saveToken(access_token);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token: access_token }
            });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
            } else {
                dispatch({ type: 'LOGIN_FAILURE', payload: 'An unknown error occurred' });
            }
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
            await tokenService.removeToken();
            await SecureStore.deleteItemAsync('IS_GUEST');
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            // Still logout even if API call fails
            await tokenService.removeToken();
            await SecureStore.deleteItemAsync('IS_GUEST');
            dispatch({ type: 'LOGOUT' });
        }
    };


    // Guest login
    const guestLogin = async () => {
        try {
            const guestToken = await guestService.createGuestSession();
            await tokenService.saveToken(guestToken);
            await SecureStore.setItemAsync('IS_GUEST', 'true');
            dispatch({ type: 'GUEST_LOGIN', payload: guestToken });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
            } else {
                dispatch({ type: 'LOGIN_FAILURE', payload: 'An unknown error occurred' });
            }
        }
    };


    // Convert guest to registered user
    const convertGuestToUser = async (data: GuestToUserMigrationData) => {
        try {
            const { user, access_token } = await guestService.convertGuestToUser(data);
            await tokenService.saveToken(access_token);
            await SecureStore.deleteItemAsync('IS_GUEST');
            dispatch({
                type: 'GUEST_TO_USER',
                payload: { user, token: access_token }
            });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
            } else {
                dispatch({ type: 'LOGIN_FAILURE', payload: 'An unknown error occurred' });
            }
        }
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <AuthContext.Provider
            value={{
                state,
                login,
                register,
                socialLogin,
                verifyOtp,
                logout,
                guestLogin,
                convertGuestToUser,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
