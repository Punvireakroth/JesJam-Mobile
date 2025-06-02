import axios from 'axios';
import { LoginCredentials, RegisterCredentials, SocialAuthCredentials, OTPVerificationData, GuestToUserMigrationData, TokenResponse, User } from '../types/auth.types';
import tokenService from './tokenService';

const API_URL = '@env';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add request interceptor to handle token
apiClient.interceptors.request.use(async (config) => {
    const token = await tokenService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

// Handle token refresh 
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // if authorized and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const isExpiring = await tokenService.isTokenExpiringSoon();

                if (isExpiring) {
                    // TODO: Refresh token here

                    // Use existing token to get new token
                    const token = await tokenService.getToken();

                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    }
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)

// Auth services 
const login = async (credentials: LoginCredentials): Promise<{ user: User; access_token: string }> => {
    try {
        const response = await apiClient.post('/api/v1/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
}

const register = async (credentials: RegisterCredentials): Promise<{ user: User; access_token: string }> => {
    try {
        const response = await apiClient.post('/api/auth/register', credentials);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Registration failed');
        }
        throw new Error('Network error. Please try again.');
    }
}

const socialLogin = async (credentials: SocialAuthCredentials): Promise<{ user: User; access_token: string }> => {
    try {
      const response = await apiClient.post('/api/auth/social', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Social login failed');
      }
      throw new Error('Network error. Please try again.');
    }
  };

const verifyOTP = async (data: OTPVerificationData): Promise<{ user: User; access_token: string }> => {
    try {
        const response = await apiClient.post('/api/auth/verify', data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.message || 'OTP verification failed');
        }
        throw new Error('Network error. Please try again.');
    }
}


const logout = async (): Promise<void> => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Still consider logout successful even if API call fails
    }
  };
  
  const getCurrentUser = async (): Promise<User> => {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get user data');
      }
      throw new Error('Network error. Please try again.');
    }
  };
  
  export default {
    login,
    register,
    socialLogin,
    verifyOTP,
    logout,
    getCurrentUser
  };
  