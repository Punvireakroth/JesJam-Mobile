export type AuthProvider = 'google' | 'phone' | 'facebook' | 'guest';

export interface User {
    id: Number;
    name?: string;
    email?: string;
    phone?: string;
    auth_provider: AuthProvider;
    provider_id: string;
    is_guest: boolean;
    profile_picture?: string;
    preferred_language: 'km' | 'en';
    preferred_font_size: 'small' | 'medium' | 'large';
    dark_mode: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    isGuest: boolean;
    isLoading: boolean;
    user: User | null;
    error: string | null;
    accessToken: string | null;
}

export interface LoginCredentials {
    email?: string;
    phone?: string;
    password: string;
}

export interface RegisterCredentials {
    name?: string;
    email?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
}

export interface OTPVerificationData {
    phone: string;
    code: string;
}

export interface SocialAuthCredentials {
    provider: 'google' | 'facebook';
    access_token: string;
}

export interface GuestToUserMigrationData {
    guest_migration_token: string;
    name?: string;
    email?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}