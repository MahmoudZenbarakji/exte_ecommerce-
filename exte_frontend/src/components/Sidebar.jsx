import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { 
  User as UserIcon,
  ShoppingBag as ShoppingBagIcon,
  Heart as HeartIcon,
  Search as MagnifyingGlassIcon,
  Menu as Bars3Icon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon
} from 'lucide-react'
import { FiX as XMarkIcon } from 'react-icons/fi'
import { useCart, useAuth, useCategories, useFavorites } from '../contexts'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, mobileMenuOpen, setMobileMenuOpen }) {
  const location = useLocation()
  const cartContext = useCart()
  const { cartCount = 0 } = cartContext || {}
  const { isAuthenticated, user, logout } = useAuth()
  const { categories, subcategories, loading, getSubcategories } = useCategories()
  const { favorites } = useFavorites()
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [loadingSubcategories, setLoadingSubcategories] = useState(new Set())


  const handleUserClick = () => {
    if (isAuthenticated) {
      logout()
    } else {
      // Navigate to login - you might want to use useNavigate here
      window.location.href = '/login'
    }
  }

  const handleCategoryClick = async (categoryId, categoryName) => {
    const isExpanded = expandedCategories.has(categoryId)
    
    if (isExpanded) {
      // Collapse category
      setExpandedCategories(prev => {
        const newSet = new Set(prev)
        newSet.delete(categoryId)
        return newSet
      })
    } else {
      // Expand category and load subcategories
      setExpandedCategories(prev => new Set(prev).add(categoryId))
      
      // Load subcategories if not already loaded
      if (!subcategories[categoryId]) {
        setLoadingSubcategories(prev => new Set(prev).add(categoryId))
        try {
          await getSubcategories(categoryId)
        } catch (error) {
          console.error('Error loading subcategories:', error)
        } finally {
          setLoadingSubcategories(prev => {
            const newSet = new Set(prev)
            newSet.delete(categoryId)
            return newSet
          })
        }
      }
    }
  }

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link to="/" className="text-2xl font-bold tracking-wider">
                      <em>extē</em>
                    </Link>
                  </div>
                  
                  {/* Search */}
                  <div className="flex items-center space-x-2">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="flex-1 border-0 bg-transparent text-sm placeholder-gray-500 focus:ring-0"
                    />
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {/* Categories */}
                          {!loading && categories.map((category) => {
                            const isExpanded = expandedCategories.has(category.id)
                            const categorySubcategories = subcategories[category.id] || []
                            const isLoading = loadingSubcategories.has(category.id)
                            
                            return (
                              <li key={category.id}>
                                <div className="space-y-1">
                                  {/* Category Header with Toggle */}
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => handleCategoryClick(category.id, category.name)}
                                      className={classNames(
                                        'group flex flex-1 items-center justify-between rounded-md p-2 text-sm leading-6 font-semibold text-gray-900 hover:text-black hover:bg-gray-50 transition-colors'
                                      )}
                                    >
                                      <span>{category.name}</span>
                                      {isLoading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                                      ) : (
                                        isExpanded ? (
                                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                        ) : (
                                          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                                        )
                                      )}
                                    </button>
                                  </div>
                                  
                                  {/* Subcategories */}
                                  {isExpanded && categorySubcategories.length > 0 && (
                                    <div className="ml-2 border-l-2 border-gray-100 pl-3">
                                      <ul className="space-y-1">
                                        {categorySubcategories.map((subcategory) => (
                                          <li key={subcategory.id}>
                                            <Link
                                              to={`/subcategory/${subcategory.id}`}
                                              className={classNames(
                                                location.pathname === `/subcategory/${subcategory.id}`
                                                  ? 'bg-gray-100 text-gray-900 font-medium'
                                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                                'block rounded-md px-3 py-2 text-sm transition-colors'
                                              )}
                                              onClick={() => setMobileMenuOpen(false)}
                                            >
                                              {subcategory.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {/* View All Category Link */}
                                  <Link
                                    to={`/category/${category.name.toLowerCase()}`}
                                    className={classNames(
                                      location.pathname === `/category/${category.name.toLowerCase()}`
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                      'block rounded-md px-3 py-2 text-sm transition-colors ml-2'
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    View All {category.name}
                                  </Link>
                                </div>
                              </li>
                            )
                          })}
                          
                          {/* Sale */}
                          <li>
                            <a
                              href="#"
                              className="text-gray-700 hover:text-black hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                            >
                              SALE
                            </a>
                          </li>

                          {/* User specific links */}
                          {isAuthenticated && (
                            <>
                              <li>
                                <Link
                                  to="/profile"
                                  className={classNames(
                                    location.pathname === '/profile'
                                      ? 'bg-gray-100 text-gray-900 font-medium'
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-colors'
                                  )}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  PROFILE
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="/favorites"
                                  className={classNames(
                                    location.pathname === '/favorites'
                                      ? 'bg-gray-100 text-gray-900 font-medium'
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-colors'
                                  )}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <HeartIcon className="h-4 w-4" />
                                  FAVORITES
                                  {favorites.length > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                      {favorites.length}
                                    </span>
                                  )}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="/orders"
                                  className={classNames(
                                    location.pathname === '/orders'
                                      ? 'bg-gray-100 text-gray-900 font-medium'
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-colors'
                                  )}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  MY ORDERS
                                </Link>
                              </li>
                            </>
                          )}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      {sidebarOpen && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <>
              <div className="flex h-16 shrink-0 items-center">
                <Link to="/" className="text-2xl font-bold tracking-wider">
                  <em>extē</em>
                </Link>
              </div>
          
              {/* Search */}
              <div className="flex items-center space-x-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 border-0 bg-transparent text-sm placeholder-gray-500 focus:ring-0"
                />
              </div>

              {/* Navigation */}
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {/* Categories */}
                      {!loading && categories.map((category) => {
                        const isExpanded = expandedCategories.has(category.id)
                        const categorySubcategories = subcategories[category.id] || []
                        const isLoading = loadingSubcategories.has(category.id)
                        
                        return (
                          <li key={category.id}>
                            <div className="space-y-1">
                              {/* Category Header with Toggle */}
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleCategoryClick(category.id, category.name)}
                                  className={classNames(
                                    'group flex flex-1 items-center justify-between rounded-md p-2 text-sm leading-6 font-semibold text-gray-900 hover:text-black hover:bg-gray-50 transition-colors'
                                  )}
                                >
                                  <span>{category.name}</span>
                                  {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                                  ) : (
                                    isExpanded ? (
                                      <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                                    )
                                  )}
                                </button>
                              </div>
                              
                              {/* Subcategories */}
                              {isExpanded && categorySubcategories.length > 0 && (
                                <div className="ml-2 border-l-2 border-gray-100 pl-3">
                                  <ul className="space-y-1">
                                    {categorySubcategories.map((subcategory) => (
                                      <li key={subcategory.id}>
                                        <Link
                                          to={`/subcategory/${subcategory.id}`}
                                          className={classNames(
                                            location.pathname === `/subcategory/${subcategory.id}`
                                              ? 'bg-gray-100 text-gray-900 font-medium'
                                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                            'block rounded-md px-3 py-2 text-sm transition-colors'
                                          )}
                                        >
                                          {subcategory.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* View All Category Link */}
                              <Link
                                to={`/category/${category.name.toLowerCase()}`}
                                className={classNames(
                                  location.pathname === `/category/${category.name.toLowerCase()}`
                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                  'block rounded-md px-3 py-2 text-sm transition-colors ml-2'
                                )}
                              >
                                View All {category.name}
                              </Link>
                            </div>
                          </li>
                        )
                      })}
                      
                      {/* Sale */}
                      <li>
                        <a
                          href="#"
                          className="text-gray-700 hover:text-black hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                        >
                          SALE
                        </a>
                      </li>

                      {/* User specific links */}
                      {isAuthenticated && (
                        <>
                          <li>
                            <Link
                              to="/profile"
                              className={classNames(
                                location.pathname === '/profile'
                                  ? 'bg-gray-100 text-gray-900 font-medium'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-colors'
                              )}
                            >
                              PROFILE
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/favorites"
                              className={classNames(
                                location.pathname === '/favorites'
                                  ? 'bg-gray-100 text-gray-900 font-medium'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-colors'
                              )}
                            >
                              <HeartIcon className="h-4 w-4" />
                              FAVORITES
                              {favorites.length > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                  {favorites.length}
                                </span>
                              )}
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/orders"
                              className={classNames(
                                location.pathname === '/orders'
                                  ? 'bg-gray-100 text-gray-900 font-medium'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-colors'
                              )}
                            >
                              MY ORDERS
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                </ul>
              </nav>

              {/* Bottom section with user actions */}
              <div className="flex flex-col space-y-2 pb-4">
                {/* User icon */}
                <div className="flex items-center space-x-2">
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-2">
                      <UserIcon 
                        className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" 
                        onClick={handleUserClick}
                        title={`Logout (${user?.firstName} ${user?.lastName})`}
                      />
                      <span className="text-sm text-gray-600">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ) : (
                    <UserIcon 
                      className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" 
                      onClick={handleUserClick}
                      title="Login"
                    />
                  )}
                </div>

                {/* Cart and favorites */}
                <div className="flex items-center space-x-4">
                  {isAuthenticated && (
                    <Link to="/favorites" className="relative">
                      <HeartIcon className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
                      {favorites.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                  )}
                  <Link to="/cart" className="relative">
                    <ShoppingBagIcon className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </>
          </div>
        </div>
      )}
    </>
  )
}
