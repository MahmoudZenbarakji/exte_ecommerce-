import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts.jsx'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // Safely handle children - prevent null/undefined children from causing React Children error
  return children || null
}

export default ProtectedRoute
