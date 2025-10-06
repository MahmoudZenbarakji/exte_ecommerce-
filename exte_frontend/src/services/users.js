import api from './apiClient'

// Users API functions
export const usersAPI = {
  // Get all users
  getAll: async () => {
    try {
      console.log('Users API - Getting all users')
      const response = await api.get('/users')
      console.log('Users API - Users retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Users API - Get all users error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch users')
    }
  },

  // Get single user
  getById: async (id) => {
    try {
      console.log('Users API - Getting user by ID:', id)
      const response = await api.get(`/users/${id}`)
      console.log('Users API - User retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Users API - Get user error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch user')
    }
  },

  // Create new user
  create: async (userData) => {
    try {
      console.log('Users API - Creating user:', userData)
      const response = await api.post('/users', userData)
      console.log('Users API - User created:', response.data)
      return response.data
    } catch (error) {
      console.error('Users API - Create user error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to create user')
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      console.log('Users API - Updating user:', id, userData)
      const response = await api.patch(`/users/${id}`, userData)
      console.log('Users API - User updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Users API - Update user error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to update user')
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      console.log('Users API - Deleting user:', id)
      const response = await api.delete(`/users/${id}`)
      console.log('Users API - User deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('Users API - Delete user error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to delete user')
    }
  }
}
