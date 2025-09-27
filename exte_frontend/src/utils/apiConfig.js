// API Configuration Utility
// This file helps manage API configuration across the application

export const getApiConfig = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const appName = import.meta.env.VITE_APP_NAME || 'Exte E-commerce';
  const environment = import.meta.env.MODE || 'development';
  
  return {
    apiUrl,
    appName,
    environment,
    isDevelopment: environment === 'development',
    isProduction: environment === 'production',
  };
};

export const logApiConfig = () => {
  const config = getApiConfig();
  console.log('🌐 API Configuration:', config);
  return config;
};

// Validate API URL format
export const validateApiUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Get API base URL with validation
export const getValidatedApiUrl = () => {
  const config = getApiConfig();
  const isValid = validateApiUrl(config.apiUrl);
  
  if (!isValid) {
    console.warn('⚠️ Invalid API URL format:', config.apiUrl);
    return 'http://localhost:3000/api'; // Fallback
  }
  
  return config.apiUrl;
};



