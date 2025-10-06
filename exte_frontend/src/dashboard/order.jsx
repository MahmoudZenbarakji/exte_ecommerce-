import { useState, useEffect } from 'react'
import { Eye as EyeIcon, Phone as PhoneIcon, MapPin as MapPinIcon, User as UserIcon, Calendar as CalendarIcon, DollarSign as CurrencyDollarIcon } from 'lucide-react'
import { Button } from './components/ui/button'
import {Dialog,  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,} from './components/ui/dialog'
import { ordersAPI } from '../services'




export default function Orders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const ordersData = await ordersAPI.getAll(statusFilter === 'All' ? undefined : statusFilter)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // Refetch orders when status filter changes
  useEffect(() => {
    if (statusFilter !== 'All') {
      fetchOrders()
    } else {
      fetchOrders()
    }
  }, [statusFilter])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus)
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
      setError('Failed to update order status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING':
        return 'bg-gray-100 text-gray-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchOrders}>Try Again</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage customer orders, including order details and shipping information.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="All">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.id.slice(-8)}</div>
                          <div className="text-sm text-gray-500">{order.items?.length || 0} item(s)</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User'}
                            </div>
                            <div className="text-sm text-gray-500">{order.user?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            {order.status === 'CANCELLED' && order.notes?.includes('Cancellation Reason:') && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></span>
                                Reason Provided
                              </span>
                            )}
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="text-xs rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id.slice(-8)}</DialogTitle>
            <DialogDescription>
              Complete order information and customer details
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">
                      {selectedOrder.user ? `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}` : 'Guest User'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedOrder.user?.email || 'No email'}</p>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{selectedOrder.user?.phone || 'No phone'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <img
                        src={item.product?.images?.[0]?.url ? `http://localhost:3000${item.product.images[0].url}` : '/placeholder-image.jpg'}
                        alt={item.product?.name || 'Product'}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.product?.name || 'Product'}</h4>
                        <p className="text-sm text-gray-500">
                          {item.color && item.size ? `Color: ${item.color} • Size: ${item.size}` : 'One Size'} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="text-gray-900">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping:</span>
                    <span className="text-gray-900">${selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax:</span>
                    <span className="text-gray-900">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Status & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Order Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Order Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Payment:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Order Date:</span>
                      <span className="text-gray-900 ml-2">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Order Notes & Information</h4>
                    <div className="space-y-3">
                      {/* Shipping Address */}
                      {selectedOrder.notes.includes('Shipping Address:') && (
                        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                          <h5 className="text-sm font-medium text-blue-800 mb-1">Shipping Address</h5>
                          <p className="text-sm text-blue-700">
                            {selectedOrder.notes.split('Shipping Address:')[1]?.split('Payment Method:')[0]?.trim()}
                          </p>
                        </div>
                      )}
                      
                      {/* Payment Method */}
                      {selectedOrder.notes.includes('Payment Method:') && (
                        <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                          <h5 className="text-sm font-medium text-green-800 mb-1">Payment Method</h5>
                          <p className="text-sm text-green-700">
                            {selectedOrder.notes.split('Payment Method:')[1]?.split('Cancellation Reason:')[0]?.trim()}
                          </p>
                        </div>
                      )}
                      
                      {/* Cancellation Reason */}
                      {selectedOrder.notes.includes('Cancellation Reason:') && (
                        <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                          <h5 className="text-sm font-medium text-red-800 mb-1">Cancellation Reason</h5>
                          <p className="text-sm text-red-700">
                            {selectedOrder.notes.split('Cancellation Reason:')[1]?.split('Cancelled on:')[0]?.trim()}
                          </p>
                          {selectedOrder.notes.includes('Cancelled on:') && (
                            <p className="text-xs text-red-600 mt-1">
                              Cancelled on: {selectedOrder.notes.split('Cancelled on:')[1]?.trim()}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Other Notes */}
                      {selectedOrder.notes && !selectedOrder.notes.includes('Shipping Address:') && !selectedOrder.notes.includes('Payment Method:') && !selectedOrder.notes.includes('Cancellation Reason:') && (
                        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                          <h5 className="text-sm font-medium text-yellow-800 mb-1">Customer Notes</h5>
                          <p className="text-sm text-yellow-700">
                            {selectedOrder.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
