import api from './apiClient'

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard statistics
  getStatistics: async () => {
    try {
      console.log('Dashboard API - Getting statistics')
      const response = await api.get('/dashboard/statistics')
      console.log('Dashboard API - Statistics retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Dashboard API - Get statistics error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics')
    }
  },

  // Get revenue statistics
  getRevenueStatistics: async (period = 'month') => {
    try {
      console.log('Dashboard API - Getting revenue statistics for period:', period)
      const response = await api.get(`/dashboard/revenue?period=${period}`)
      console.log('Dashboard API - Revenue statistics retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Dashboard API - Get revenue statistics error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch revenue statistics')
    }
  },

  // Get sales data
  getSalesData: async (filters = {}) => {
    try {
      console.log('Dashboard API - Getting sales data with filters:', filters)
      const response = await api.get('/dashboard/sales', { params: filters })
      console.log('Dashboard API - Sales data retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Dashboard API - Get sales data error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch sales data')
    }
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    try {
      console.log('Dashboard API - Getting recent orders with limit:', limit)
      const response = await api.get(`/dashboard/orders/recent?limit=${limit}`)
      console.log('Dashboard API - Recent orders retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Dashboard API - Get recent orders error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch recent orders')
    }
  },

  // Get top products
  getTopProducts: async (limit = 10) => {
    try {
      console.log('Dashboard API - Getting top products with limit:', limit)
      const response = await api.get(`/dashboard/products/top?limit=${limit}`)
      console.log('Dashboard API - Top products retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Dashboard API - Get top products error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch top products')
    }
  }
}
