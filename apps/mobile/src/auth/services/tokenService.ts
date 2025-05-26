import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'AUTH_TOKEN';
const TOKEN_EXPIRY_KEY = 'AUTH_TOKEN_EXPIRY';

const saveToken = async (token: string): Promise<void> => {
    try {
        // Save token
        await SecureStore.setItemAsync(TOKEN_KEY, token);

        // Expiry 100 days
        const expiryTime = Date.now() + 100 * 24 * 60 * 60 * 1000;
        await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
        console.error('Error saving token:', error);
        throw new Error('Could not save authentication token');
    }
}

const getToken = async (): Promise<string | null> => {
    try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const expiry = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);

        if (!token || !expiry) {
            return null;
        }

        if (token && expiry && parseInt(expiry) > Date.now()) {
            return token;
        }

        // Remove token if expired
        if (token && expiry && parseInt(expiry) <= Date.now()) {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
            return null;
        }

        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        throw new Error('Could not retrieve authentication token');
    }
}

const removeToken = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
};

const isTokenExpiringSoon = async (): Promise<boolean> => {
    try {
        const expiry = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);

        if (!expiry) {
            return false;
        }

        // Check if expiry is within 24 hours
        const expiryTime = parseInt(expiry);
        const oneDayMs = 24 * 60 * 60 * 1000;

        return expiryTime - Date.now() <= oneDayMs;
    } catch (error) {
        console.error('Failed to check if token is expiring soon:', error);
        return false;
    }
}


export default {
    saveToken,
    getToken,
    removeToken,
    isTokenExpiringSoon,
}
    