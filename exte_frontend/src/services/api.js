import axios from 'axios';
import { getValidatedApiUrl, logApiConfig } from '../utils/apiConfig';

// Get validated API URL
const apiUrl = getValidatedApiUrl();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for production
  // Enable credentials for CORS
  withCredentials: false,
});

// Log API configuration for debugging
logApiConfig();

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('API Request - URL:', config.url)
    console.log('API Request - Token:', token ? 'Present' : 'Missing')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API Response - Status:', response.status, 'URL:', response.config.url)
    return response;
  },
  (error) => {
    console.log('API Error - Status:', error.response?.status, 'URL:', error.config?.url)
    console.log('API Error - Message:', error.response?.data)
    
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it and redirect to appropriate login
      const currentPath = window.location.pathname;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // If we're in the dashboard, redirect to admin login, otherwise regular login
      if (currentPath.startsWith('/dashboard')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },
};

// Products API functions
export const productsAPI = {
  // Get all products
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  // Get single product
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  // Create new product
  create: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },


  // Update product
  update: async (id, productData) => {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  // Get available colors for a product
  getAvailableColors: async (id) => {
    try {
      const response = await api.get(`/products/${id}/colors`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product colors');
    }
  },

  // Get images by color
  getImagesByColor: async (id, color) => {
    try {
      const response = await api.get(`/products/${id}/images/${color}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product images');
    }
  },

  // Add image to product
  addImage: async (id, imageData) => {
    try {
      const response = await api.post(`/products/${id}/images`, imageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add product image');
    }
  },

  // Add multiple images to product
  addMultipleImages: async (id, imagesData) => {
    try {
      const response = await api.post(`/products/${id}/images/multiple`, imagesData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add product images');
    }
  },

  // Remove image from product
  removeImage: async (id, imageId) => {
    try {
      const response = await api.delete(`/products/${id}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove product image');
    }
  },

  // Add variant to product
  addVariant: async (id, variantData) => {
    try {
      const response = await api.post(`/products/${id}/variants`, variantData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add product variant');
    }
  },

  // Remove variant from product
  removeVariant: async (id, variantId) => {
    try {
      const response = await api.delete(`/products/${id}/variants/${variantId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove product variant');
    }
  },
};

// Upload API functions
export const uploadAPI = {
  // Upload category image
  uploadCategoryImage: async (file) => {
    try {
      console.log('🚀 Starting category image upload for file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload/category-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Category image upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Category image upload failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },

  // Upload product image
  uploadProductImage: async (file) => {
    try {
      console.log('🚀 Starting product image upload for file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload/product-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Product image upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Product image upload failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },

  // Upload multiple files (general purpose)
  uploadMultipleFiles: async (files, folder = 'products') => {
    try {
      console.log('📤 API: Starting multiple file upload for', files.length, 'files, folder:', folder);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', folder);
      
      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('📥 API: Multiple file upload completed successfully');
      return response.data.urls; // Return just the URLs array
    } catch (error) {
      console.error('❌ API: Multiple file upload failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload files');
    }
  },

  // Upload multiple product images with color
  uploadMultipleProductImages: async (files, color, productId) => {
    try {
      console.log('📤 API: Starting multiple upload for', files.length, 'files, color:', color, 'productId:', productId);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      if (color) formData.append('color', color);
      if (productId) formData.append('productId', productId);
      
      const response = await api.post('/upload/product-images-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('📥 API: Multiple upload completed successfully');
      return response.data;
    } catch (error) {
      console.error('❌ API: Multiple upload failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload images');
    }
  },

  // Upload collection image
  uploadCollectionImage: async (file) => {
    try {
      console.log('🚀 Starting collection image upload for file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload/collection-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Collection image upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Collection image upload failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },
};

// Categories API functions
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  // Get single category
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  },

  // Create new category
  create: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      const response = await api.patch(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  },
};

// Subcategories API functions
export const subcategoriesAPI = {
  // Get all subcategories
  getAll: async () => {
    try {
      const response = await api.get('/subcategories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategories');
    }
  },

  // Get subcategories by category ID
  getByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/subcategories/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategories for category');
    }
  },

  // Get single subcategory
  getById: async (id) => {
    try {
      const response = await api.get(`/subcategories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategory');
    }
  },

  // Create new subcategory (admin only)
  create: async (subcategoryData) => {
    try {
      const response = await api.post('/subcategories', subcategoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create subcategory');
    }
  },

  // Update subcategory (admin only)
  update: async (id, subcategoryData) => {
    try {
      const response = await api.patch(`/subcategories/${id}`, subcategoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update subcategory');
    }
  },

  // Delete subcategory (admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/subcategories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete subcategory');
    }
  },
};

// Collections API functions
export const collectionsAPI = {
  // Get all collections
  getAll: async () => {
    try {
      const response = await api.get('/collections');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch collections');
    }
  },

  // Get single collection
  getById: async (id) => {
    try {
      const response = await api.get(`/collections/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch collection');
    }
  },

  // Create new collection
  create: async (collectionData) => {
    try {
      const response = await api.post('/collections', collectionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create collection');
    }
  },

  // Update collection
  update: async (id, collectionData) => {
    try {
      const response = await api.patch(`/collections/${id}`, collectionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update collection');
    }
  },

  // Delete collection
  delete: async (id) => {
    try {
      const response = await api.delete(`/collections/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete collection');
    }
  },
};

// Orders API functions
export const ordersAPI = {
  // Get all orders (admin only)
  getAll: async (status) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Get user's orders
  getMyOrders: async () => {
    try {
      const response = await api.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Get single order
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const response = await api.patch(`/orders/${id}/payment-status`, { paymentStatus });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update payment status');
    }
  },

  // Update order (for editing notes, etc.)
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.patch(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order');
    }
  },

  // Cancel order
  cancelOrder: async (id, cancelData) => {
    try {
      const response = await api.patch(`/orders/${id}/cancel`, cancelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  },

  // Address management
  createAddress: async (addressData) => {
    try {
      const response = await api.post('/orders/addresses', addressData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create address');
    }
  },

  getMyAddresses: async () => {
    try {
      const response = await api.get('/orders/addresses/my-addresses');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
    }
  },

  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.patch(`/orders/addresses/${addressId}/set-default`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to set default address');
    }
  }
};

// Users API functions
export const usersAPI = {
  // Get all users (admin only)
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get single user
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      const response = await api.patch(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Delete user (admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },
};

// Cart API functions
export const cartAPI = {
  // Add item to cart
  addItem: async (cartItemData) => {
    try {
      const response = await api.post('/cart/items', cartItemData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
  },

  // Get cart items
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
  },

  // Get cart count
  getCartCount: async () => {
    try {
      const response = await api.get('/cart/count');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart count');
    }
  },

  // Update cart item
  updateItem: async (itemId, updateData) => {
    try {
      const response = await api.patch(`/cart/items/${itemId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  },
};

// Favorites API
export const favoritesAPI = {
  // Add product to favorites
  addToFavorites: async (productId) => {
    try {
      const response = await api.post('/favorites', { productId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add to favorites');
    }
  },

  // Remove product from favorites
  removeFromFavorites: async (productId) => {
    try {
      const response = await api.delete(`/favorites/product/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove from favorites');
    }
  },

  // Get user's favorites
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
    }
  },

  // Check if product is favorite
  checkFavorite: async (productId) => {
    try {
      const response = await api.get(`/favorites/check/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check favorite status');
    }
  },

  // Remove favorite by ID
  removeFavoriteById: async (favoriteId) => {
    try {
      const response = await api.delete(`/favorites/${favoriteId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove favorite');
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/dashboard/statistics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
    }
  },

  // Get revenue statistics
  getRevenueStats: async () => {
    try {
      const response = await api.get('/dashboard/revenue');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch revenue statistics');
    }
  },
};

export default api;
