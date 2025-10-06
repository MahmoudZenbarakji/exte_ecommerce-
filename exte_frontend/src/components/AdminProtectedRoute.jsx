import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts'

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth()
  
  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  // If authenticated but not admin, redirect to admin login
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />
  }
  
  // Safely handle children - prevent null/undefined children from causing React Children error
  return children || null
}

export default AdminProtectedRoute
