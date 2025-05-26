import axios from 'axios';
import { User, GuestToUserMigrationData } from '../types/auth.types';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const GUEST_ENCRYPTION_KEY = 'GUEST_DATA_KEY';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});


// Create a guest session
const createGuestSession = async (): Promise<string> => {
    try {
      // Generate a random encryption key for guest data
      const encryptionKey = Math.random().toString(36).substring(2, 15) +
                           Math.random().toString(36).substring(2, 15);
  
      // Store encryption key securely
      await SecureStore.setItemAsync(GUEST_ENCRYPTION_KEY, encryptionKey);
  
      // Request a guest token from server
      const response = await apiClient.post('/api/auth/guest');
  
      // Store guest migration token for later conversion
      if (response.data.guest_migration_token) {
        await SecureStore.setItemAsync(
          'GUEST_MIGRATION_TOKEN',
          response.data.guest_migration_token
        );
      }
  
      return response.data.access_token;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create guest session');
      }
      throw new Error('Network error. Please try again.');
    }
  };
  
  // Convert guest to registered user
  const convertGuestToUser = async (data: GuestToUserMigrationData): Promise<{ user: User; access_token: string }> => {
    try {
      // Get guest migration token
      const migrationToken = await SecureStore.getItemAsync('GUEST_MIGRATION_TOKEN');
  
      if (!migrationToken) {
        throw new Error('Guest session not found');
      }
  
      // Add migration token to request
      const requestData = {
        ...data,
        guest_migration_token: migrationToken
      };
  
      // Convert guest to user
      const response = await apiClient.post('/api/auth/guest-to-user', requestData);
  
      await migrateGuestData();
  
      // Clean up guest data
      await SecureStore.deleteItemAsync(GUEST_ENCRYPTION_KEY);
      await SecureStore.deleteItemAsync('GUEST_MIGRATION_TOKEN');
  
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to convert guest to user');
      }
      throw new Error('Network error. Please try again.');
    }
  };
  
  // Store guest data (encrypted with the key)
  const storeGuestData = async (key: string, data: any): Promise<void> => {
    try {
      const encryptionKey = await SecureStore.getItemAsync(GUEST_ENCRYPTION_KEY);
  
      if (!encryptionKey) {
        throw new Error('Guest encryption key not found');
      }
  
      // TODO: use proper encryption


      // just use a prefix to "simulate" encryption
      const encryptedData = JSON.stringify({
        key: encryptionKey,
        data
      });
  
      await AsyncStorage.setItem(`guest_${key}`, encryptedData);
    } catch (error) {
      console.error('Failed to store guest data:', error);
      throw new Error('Failed to store guest data');
    }
  };
  
  // Retrieve guest data
  const getGuestData = async (key: string): Promise<any> => {
    try {
      const encryptionKey = await SecureStore.getItemAsync(GUEST_ENCRYPTION_KEY);
  
      if (!encryptionKey) {
        throw new Error('Guest encryption key not found');
      }
  
      const encryptedData = await AsyncStorage.getItem(`guest_${key}`);
  
      if (!encryptedData) {
        return null;
      }
  
      const parsed = JSON.parse(encryptedData);
  
      // Verify the encryption key matches
      if (parsed.key !== encryptionKey) {
        throw new Error('Data integrity check failed');
      }
  
      return parsed.data;
    } catch (error) {
      console.error('Failed to retrieve guest data:', error);
      throw new Error('Failed to retrieve guest data');
    }
  };
  
  // Migrate guest data to server
  const migrateGuestData = async (): Promise<void> => {
    try {
      // Get all guest data keys
      const keys = await AsyncStorage.getAllKeys();
      const guestKeys = keys.filter(key => key.startsWith('guest_'));
  
      // Collect all guest data
      const guestData: Record<string, any> = {};
  
      for (const key of guestKeys) {
        const realKey = key.replace('guest_', '');
        const data = await getGuestData(realKey);
        guestData[realKey] = data;
      }
  
      // Send data to server
      if (Object.keys(guestData).length > 0) {
        await apiClient.post('/api/auth/migrate-guest-data', { data: guestData });
      }
  
      // Clean up guest data
      for (const key of guestKeys) {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to migrate guest data:', error);
      // Don't throw error, as we still want to complete the registration
    }
  };
  
  export default {
    createGuestSession,
    convertGuestToUser,
    storeGuestData,
    getGuestData
  };
