import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { favoritesAPI } from '../services/favorites'
import { useAuth } from './AuthContext'

// Create Favorites Context
export const FavoritesContext = createContext()

// Favorites Hook
export const useFavorites = () => useContext(FavoritesContext)

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
      {children || null}
    </FavoritesContext.Provider>
  )
}
