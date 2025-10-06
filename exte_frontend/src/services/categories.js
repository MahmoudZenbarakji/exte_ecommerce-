import api from './apiClient'

// Categories API functions
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    try {
      console.log('Categories API - Getting all categories')
      const response = await api.get('/categories')
      console.log('Categories API - Categories retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Categories API - Get all categories error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch categories')
    }
  },

  // Get single category
  getById: async (id) => {
    try {
      console.log('Categories API - Getting category by ID:', id)
      const response = await api.get(`/categories/${id}`)
      console.log('Categories API - Category retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Categories API - Get category error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch category')
    }
  },

  // Create new category
  create: async (categoryData) => {
    try {
      console.log('Categories API - Creating category:', categoryData)
      const response = await api.post('/categories', categoryData)
      console.log('Categories API - Category created:', response.data)
      return response.data
    } catch (error) {
      console.error('Categories API - Create category error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to create category')
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      console.log('Categories API - Updating category:', id, categoryData)
      const response = await api.patch(`/categories/${id}`, categoryData)
      console.log('Categories API - Category updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Categories API - Update category error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to update category')
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      console.log('Categories API - Deleting category:', id)
      const response = await api.delete(`/categories/${id}`)
      console.log('Categories API - Category deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('Categories API - Delete category error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to delete category')
    }
  }
}

// Subcategories API functions
export const subcategoriesAPI = {
  // Get all subcategories
  getAll: async () => {
    try {
      console.log('Subcategories API - Getting all subcategories')
      const response = await api.get('/subcategories')
      console.log('Subcategories API - Subcategories retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Subcategories API - Get all subcategories error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategories')
    }
  },

  // Get subcategories by category
  getByCategory: async (categoryId) => {
    try {
      console.log('Subcategories API - Getting subcategories by category:', categoryId)
      const response = await api.get(`/subcategories/category/${categoryId}`)
      console.log('Subcategories API - Subcategories retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Subcategories API - Get subcategories by category error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategories')
    }
  },

  // Get single subcategory
  getById: async (id) => {
    try {
      console.log('Subcategories API - Getting subcategory by ID:', id)
      const response = await api.get(`/subcategories/${id}`)
      console.log('Subcategories API - Subcategory retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Subcategories API - Get subcategory error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategory')
    }
  },

  // Create new subcategory
  create: async (subcategoryData) => {
    try {
      console.log('Subcategories API - Creating subcategory:', subcategoryData)
      const response = await api.post('/subcategories', subcategoryData)
      console.log('Subcategories API - Subcategory created:', response.data)
      return response.data
    } catch (error) {
      console.error('Subcategories API - Create subcategory error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to create subcategory')
    }
  },

  // Update subcategory
  update: async (id, subcategoryData) => {
    try {
      console.log('Subcategories API - Updating subcategory:', id, subcategoryData)
      const response = await api.patch(`/subcategories/${id}`, subcategoryData)
      console.log('Subcategories API - Subcategory updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Subcategories API - Update subcategory error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to update subcategory')
    }
  },

  // Delete subcategory
  delete: async (id) => {
    try {
      console.log('Subcategories API - Deleting subcategory:', id)
      const response = await api.delete(`/subcategories/${id}`)
      console.log('Subcategories API - Subcategory deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('Subcategories API - Delete subcategory error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to delete subcategory')
    }
  }
}
