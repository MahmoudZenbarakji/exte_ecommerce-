import { Link } from 'react-router-dom'
import { 
  CubeIcon, 
  TagIcon, 
  FolderIcon, 
  PercentBadgeIcon,
  ShoppingCartIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { useDashboardStatistics } from '../hooks/useDashboard'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardStatistics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.statistics ? [
    { 
      name: 'Total Products', 
      stat: dashboardData.statistics.totalProducts.value.toString(), 
      icon: CubeIcon, 
      change: dashboardData.statistics.totalProducts.change, 
      changeType: dashboardData.statistics.totalProducts.changeType,
      link: '/dashboard/products'
    },
    { 
      name: 'Categories', 
      stat: dashboardData.statistics.totalCategories.value.toString(), 
      icon: TagIcon, 
      change: dashboardData.statistics.totalCategories.change, 
      changeType: dashboardData.statistics.totalCategories.changeType,
      link: '/dashboard/categories'
    },
    { 
      name: 'Collections', 
      stat: dashboardData.statistics.totalCollections.value.toString(), 
      icon: FolderIcon, 
      change: dashboardData.statistics.totalCollections.change, 
      changeType: dashboardData.statistics.totalCollections.changeType,
      link: '/dashboard/collections'
    },
    { 
      name: 'Active Sales', 
      stat: dashboardData.statistics.activeSales.value.toString(), 
      icon: PercentBadgeIcon, 
      change: dashboardData.statistics.activeSales.change, 
      changeType: dashboardData.statistics.activeSales.changeType,
      link: '/dashboard/sales'
    },
    { 
      name: 'Orders Today', 
      stat: dashboardData.statistics.todayOrders.value.toString(), 
      icon: ShoppingCartIcon, 
      change: dashboardData.statistics.todayOrders.change, 
      changeType: dashboardData.statistics.todayOrders.changeType,
      link: '/dashboard/orders'
    },
    { 
      name: 'Total Customers', 
      stat: dashboardData.statistics.totalUsers.value.toString(), 
      icon: UsersIcon, 
      change: dashboardData.statistics.totalUsers.change, 
      changeType: dashboardData.statistics.totalUsers.changeType, 
      link: '/dashboard/users' 
    },
  ] : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome to your EXTE admin dashboard. Here's an overview of your store.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={classNames(
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {item.changeType === 'increase' ? '+' : '-'}
                {item.change}
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View all<span className="sr-only"> {item.name} stats</span>
                    </Link>
                  ) : (
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View all<span className="sr-only"> {item.name} stats</span>
                    </a>
                  )}
                </div>
              </div>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul role="list" className="-mb-10">
                  {dashboardData?.recentActivity?.products?.slice(0, 3).map((product, index) => (
                    <li key={product.id}>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <CubeIcon className="h-5 w-5 text-white" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">
                                New product <span className="font-medium text-gray-900">{product.name}</span> added
                              </p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              <time dateTime={product.createdAt}>
                                {new Date(product.createdAt).toLocaleDateString()}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  
                  {dashboardData?.recentActivity?.orders?.slice(0, 2).map((order, index) => (
                    <li key={order.id}>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <ShoppingCartIcon className="h-5 w-5 text-white" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">
                                New order <span className="font-medium text-gray-900">#{order.id.slice(-8)}</span> from {order.user.firstName} {order.user.lastName}
                              </p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              <time dateTime={order.createdAt}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  
                  {dashboardData?.recentActivity?.users?.slice(0, 1).map((user, index) => (
                    <li key={user.id}>
                      <div className="relative">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                              <UsersIcon className="h-5 w-5 text-white" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">
                                New customer <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span> registered
                              </p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              <time dateTime={user.createdAt}>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

