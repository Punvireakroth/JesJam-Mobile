import { API_URL, APP_ENV } from '@env';

export const Environment = {
  apiUrl: API_URL,
  isProduction: APP_ENV === 'production',
  isDevelopment: APP_ENV === 'development',
  isStaging: APP_ENV === 'staging',
};

export default Environment; 