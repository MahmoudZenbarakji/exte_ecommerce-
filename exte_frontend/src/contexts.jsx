// Clean barrel file - Re-export from separate context files
export { 
  AuthContext, 
  useAuth, 
  AuthProvider, 
  isAdmin 
} from './contexts/AuthContext'

export { 
  CartContext, 
  useCart, 
  CartProvider 
} from './contexts/CartContext'

export { 
  FavoritesContext, 
  useFavorites, 
  FavoritesProvider 
} from './contexts/FavoritesContext'

export { 
  CategoriesContext, 
  useCategories, 
  CategoriesProvider 
} from './contexts/CategoriesContext'
