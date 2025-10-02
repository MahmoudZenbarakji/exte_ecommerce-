import { createContext, useContext, useState, useEffect } from 'react'
import { categoriesAPI, subcategoriesAPI } from '../services/api'

// Create context for categories
export const CategoriesContext = createContext()

export const useCategories = () => useContext(CategoriesContext)

// Categories Provider Component
export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState({}) // Store subcategories by category ID
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesAPI.getAll()
      // Filter only active categories and sort them
      const activeCategories = data
        .filter(category => category.isActive)
        .sort((a, b) => {
          // Sort MAN and WOMAN first, then alphabetically
          const priority = { 'MAN': 1, 'WOMAN': 2 }
          const aPriority = priority[a.name.toUpperCase()] || 999
          const bPriority = priority[b.name.toUpperCase()] || 999
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority
          }
          return a.name.localeCompare(b.name)
        })
      setCategories(activeCategories)
      setError(null)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to fetch categories')
      // Set default categories if API fails
      setCategories([
        { id: 'man', name: 'MAN', description: 'Men\'s clothing', isActive: true },
        { id: 'woman', name: 'WOMAN', description: 'Women\'s clothing', isActive: true }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fetch subcategories for a specific category
  const fetchSubcategories = async (categoryId) => {
    try {
      const data = await subcategoriesAPI.getByCategory(categoryId)
      const activeSubcategories = data.filter(sub => sub.isActive)
      setSubcategories(prev => ({
        ...prev,
        [categoryId]: activeSubcategories
      }))
      return activeSubcategories
    } catch (err) {
      console.error('Error fetching subcategories:', err)
      return []
    }
  }

  // Add a new category
  const addCategory = (newCategory) => {
    setCategories(prev => {
      const updated = [...prev, newCategory]
      // Re-sort categories
      return updated.sort((a, b) => {
        const priority = { 'MAN': 1, 'WOMAN': 2 }
        const aPriority = priority[a.name.toUpperCase()] || 999
        const bPriority = priority[b.name.toUpperCase()] || 999
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority
        }
        return a.name.localeCompare(b.name)
      })
    })
  }

  // Update a category
  const updateCategory = (updatedCategory) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    )
  }

  // Remove a category
  const removeCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
  }

  // Refresh categories from API
  const refreshCategories = () => {
    fetchCategories()
  }

  // Get subcategories for a category (from cache or fetch)
  const getSubcategories = async (categoryId) => {
    if (subcategories[categoryId]) {
      return subcategories[categoryId]
    }
    return await fetchSubcategories(categoryId)
  }

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const value = {
    categories,
    subcategories,
    loading,
    error,
    addCategory,
    updateCategory,
    removeCategory,
    refreshCategories,
    fetchSubcategories,
    getSubcategories
  }

  return (
    <CategoriesContext.Provider value={value}>
      {children || null}
    </CategoriesContext.Provider>
  )
}
