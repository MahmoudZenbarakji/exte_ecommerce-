import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../services/cart'
import { useAuth } from './AuthContext'

// Create Cart Context
export const CartContext = createContext()

// Cart Hook
export const useCart = () => useContext(CartContext)

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // Get auth context safely
  const authContext = useAuth()
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
              : `https://backend-exte.onrender.com${item.product.images[0].url}`)
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
      {children || null}
    </CartContext.Provider>
  )
}
