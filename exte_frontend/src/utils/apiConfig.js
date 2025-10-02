// API Configuration Utility
// This file helps manage API configuration across the application

export const getApiConfig = () => {
  const API_URL = import.meta.env.VITE_API_URL || "https://backend-exte.onrender.com/api";
  const appName = import.meta.env.VITE_APP_NAME || 'Exte E-commerce';
  const environment = import.meta.env.MODE || 'development';
  
  return {
    apiUrl: API_URL,
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
    return 'https://backend-exte.onrender.com/api'; // Fallback
  }
  
  return config.apiUrl;
};





