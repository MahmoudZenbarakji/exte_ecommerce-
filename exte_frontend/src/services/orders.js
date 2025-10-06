import api from './apiClient'

// Orders API functions
export const ordersAPI = {
  // Get all orders
  getAll: async () => {
    try {
      console.log('Orders API - Getting all orders')
      const response = await api.get('/orders')
      console.log('Orders API - Orders retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Orders API - Get all orders error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch orders')
    }
  },

  // Get single order
  getById: async (id) => {
    try {
      console.log('Orders API - Getting order by ID:', id)
      const response = await api.get(`/orders/${id}`)
      console.log('Orders API - Order retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Orders API - Get order error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch order')
    }
  },

  // Create new order
  create: async (orderData) => {
    try {
      console.log('Orders API - Creating order:', orderData)
      const response = await api.post('/orders', orderData)
      console.log('Orders API - Order created:', response.data)
      return response.data
    } catch (error) {
      console.error('Orders API - Create order error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to create order')
    }
  },

  // Update order
  update: async (id, orderData) => {
    try {
      console.log('Orders API - Updating order:', id, orderData)
      const response = await api.patch(`/orders/${id}`, orderData)
      console.log('Orders API - Order updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Orders API - Update order error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to update order')
    }
  },

  // Delete order
  delete: async (id) => {
    try {
      console.log('Orders API - Deleting order:', id)
      const response = await api.delete(`/orders/${id}`)
      console.log('Orders API - Order deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('Orders API - Delete order error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to delete order')
    }
  }
}
