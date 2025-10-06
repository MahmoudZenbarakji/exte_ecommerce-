import api from './apiClient'

// Auth API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      console.log('Auth API - Login attempt for:', email)
      const response = await api.post('/auth/login', {
        email,
        password
      })
      
      console.log('Auth API - Login successful:', response.data)
      return response.data
    } catch (error) {
      console.error('Auth API - Login error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      console.log('Auth API - Registration attempt for:', userData.email)
      const response = await api.post('/auth/register', userData)
      
      console.log('Auth API - Registration successful:', response.data)
      return response.data
    } catch (error) {
      console.error('Auth API - Registration error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      console.log('Auth API - Getting user profile')
      const response = await api.get('/auth/profile')
      
      console.log('Auth API - Profile retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Auth API - Profile error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to get profile')
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      console.log('Auth API - Updating user profile')
      const response = await api.put('/auth/profile', userData)
      
      console.log('Auth API - Profile updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Auth API - Profile update error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      console.log('Auth API - Changing password')
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      
      console.log('Auth API - Password changed successfully')
      return response.data
    } catch (error) {
      console.error('Auth API - Password change error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to change password')
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      console.log('Auth API - Forgot password for:', email)
      const response = await api.post('/auth/forgot-password', { email })
      
      console.log('Auth API - Forgot password email sent')
      return response.data
    } catch (error) {
      console.error('Auth API - Forgot password error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to send reset email')
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      console.log('Auth API - Resetting password')
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      })
      
      console.log('Auth API - Password reset successful')
      return response.data
    } catch (error) {
      console.error('Auth API - Password reset error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to reset password')
    }
  },

  // Logout (client-side only, server doesn't need to know)
  logout: async () => {
    try {
      console.log('Auth API - Logging out')
      // Clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
      
      console.log('Auth API - Logout successful')
      return { success: true }
    } catch (error) {
      console.error('Auth API - Logout error:', error.message)
      throw new Error('Failed to logout')
    }
  }
}
