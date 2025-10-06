import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/auth'

// Create Auth Context
export const AuthContext = createContext()

// Auth Hook
export const useAuth = () => useContext(AuthContext)

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
      {children || null}
    </AuthContext.Provider>
  )
}
