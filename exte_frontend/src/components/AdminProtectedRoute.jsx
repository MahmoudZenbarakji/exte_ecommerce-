import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts.jsx'

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
  
  return children
}

export default AdminProtectedRoute
