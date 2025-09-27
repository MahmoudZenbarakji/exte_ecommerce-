import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI, cartAPI, favoritesAPI } from './services/api'
import { CategoriesProvider, useCategories } from './contexts/CategoriesContext'

// Create contexts for global state
export const CartContext = createContext()
export const AuthContext = createContext()
export const FavoritesContext = createContext()

export const useCart = () => useContext(CartContext)
export const useAuth = () => useContext(AuthContext)
export const useFavorites = () => useContext(FavoritesContext)
export { useCategories, CategoriesProvider }

// Helper function to check if user is admin
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role === 'ADMIN'
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      
      // Store token and user data
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      
      // Store token and user data
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('isAdmin') // Clear admin status on logout
    setUser(null)
    setIsAuthenticated(false)
  }

  // Admin login function (updates auth context with existing token)
  const adminLogin = (adminUser) => {
    // The token should already be stored in localStorage by the login component
    // Just update the auth context
    setUser(adminUser)
    setIsAuthenticated(true)
    
    return true
  }

  // Check if user is admin
  const checkIsAdmin = () => {
    return user?.role === 'ADMIN'
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    adminLogin,
    isAdmin: checkIsAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // Get auth context safely
  const authContext = useContext(AuthContext)
  const isAuthenticated = authContext?.isAuthenticated || false
  
  // Debug auth context
  console.log('CartProvider - authContext:', authContext)
  console.log('CartProvider - isAuthenticated:', isAuthenticated)

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      console.log('Fetching cart items...')
      const cartData = await cartAPI.getCart()
      console.log('Fetched cart data:', cartData)
      
      // The API returns { items: [...], summary: {...} }
      const items = cartData.items || cartData
      
      // Transform the cart items to match the expected frontend structure
      const transformedItems = items.map(item => ({
        id: item.product.id,
        cartItemId: item.id, // Keep the cart item ID for updates/deletes
        name: item.product.name,
        price: item.product.isOnSale && item.product.salePrice ? item.product.salePrice : item.product.price,
        originalPrice: item.product.price, // Keep original price for display
        isOnSale: item.product.isOnSale,
        salePrice: item.product.salePrice,
        image: item.product.images && item.product.images.length > 0 
          ? (item.product.images[0].url.startsWith('http') 
              ? item.product.images[0].url 
              : `http://localhost:3000${item.product.images[0].url}`)
          : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop',
        category: item.product.category?.name || 'Category',
        color: item.color,
        size: item.size,
        quantity: item.quantity
      }))
      
      console.log('Transformed cart items:', transformedItems)
      setCartItems(transformedItems)
      
      // Use the summary from API if available, otherwise calculate from items
      const totalItems = cartData.summary?.totalItems || transformedItems.reduce((total, item) => total + item.quantity, 0)
      setCartCount(totalItems)
      console.log('Cart count set to:', totalItems)
    } catch (error) {
      console.error('Error fetching cart items:', error)
      setCartItems([])
      setCartCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems()
    } else {
      setCartItems([])
      setCartCount(0)
    }
  }, [isAuthenticated])

  const addToCart = async (product, selectedColor = null, selectedSize = null, quantity = 1) => {
    console.log('addToCart called with:', { product, selectedColor, selectedSize, quantity, isAuthenticated })
    
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart')
    }

    try {
      // Find the appropriate variant
      let variant = null
      if (product.variants && product.variants.length > 0) {
        variant = product.variants.find(v => 
          v.color === selectedColor && v.size === selectedSize
        )
      }

      const cartItemData = {
        productId: String(product.id), // Ensure productId is a string
        quantity: quantity,
        color: selectedColor || (variant ? variant.color : undefined),
        size: selectedSize || (variant ? variant.size : undefined)
      }
      
      // Remove undefined values to avoid sending null to backend
      if (cartItemData.color === undefined) delete cartItemData.color
      if (cartItemData.size === undefined) delete cartItemData.size

      console.log('Product ID type:', typeof product.id)
      console.log('Product ID value:', product.id)
      console.log('Sending cart item data:', cartItemData)
      const result = await cartAPI.addItem(cartItemData)
      console.log('Cart API response:', result)
      
      await fetchCartItems() // Refresh cart
      console.log('Cart refreshed successfully')
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const updateQuantity = async (productId, size, color, newQuantity) => {
    if (!isAuthenticated) return

    try {
      // Find the cart item by product ID, size, and color
      const cartItem = cartItems.find(item => 
        item.id === productId && item.size === size && item.color === color
      )
      
      if (!cartItem) {
        throw new Error('Cart item not found')
      }

      if (newQuantity <= 0) {
        await removeFromCart(productId, size, color)
      } else {
        await cartAPI.updateItem(cartItem.cartItemId, { quantity: newQuantity })
        await fetchCartItems() // Refresh cart
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  const removeFromCart = async (productId, size, color) => {
    if (!isAuthenticated) return

    try {
      // Find the cart item by product ID, size, and color
      const cartItem = cartItems.find(item => 
        item.id === productId && item.size === size && item.color === color
      )
      
      if (!cartItem) {
        throw new Error('Cart item not found')
      }

      await cartAPI.removeItem(cartItem.cartItemId)
      await fetchCartItems() // Refresh cart
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) return

    try {
      await cartAPI.clearCart()
      setCartItems([])
      setCartCount(0)
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    fetchCartItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Favorites Provider Component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const data = await favoritesAPI.getFavorites()
      setFavorites(data)
      setFavoriteIds(new Set(data.map(fav => fav.product.id)))
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Load favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites()
    } else {
      setFavorites([])
      setFavoriteIds(new Set())
    }
  }, [isAuthenticated, fetchFavorites])

  // Add product to favorites
  const addToFavorites = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add favorites')
    }

    try {
      await favoritesAPI.addToFavorites(productId)
      setFavoriteIds(prev => new Set([...prev, productId]))
      // Refresh favorites list
      await fetchFavorites()
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  // Remove product from favorites
  const removeFromFavorites = async (productId) => {
    if (!isAuthenticated) return

    try {
      await favoritesAPI.removeFromFavorites(productId)
      setFavoriteIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
      // Refresh favorites list
      await fetchFavorites()
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  // Toggle favorite status
  const toggleFavorite = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Please login to manage favorites')
    }

    if (favoriteIds.has(productId)) {
      await removeFromFavorites(productId)
    } else {
      await addToFavorites(productId)
    }
  }

  // Check if product is favorite
  const isFavorite = (productId) => {
    return favoriteIds.has(productId)
  }

  const value = {
    favorites,
    favoriteIds,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    fetchFavorites
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
