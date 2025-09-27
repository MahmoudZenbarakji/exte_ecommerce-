import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Package, Calendar, MapPin, CreditCard, Eye, Truck, CheckCircle, Clock, XCircle, Edit, X, AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { useAuth } from '../contexts.jsx'
import { ordersAPI } from '../services/api.js'

function Orders() {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  
  // Order actions state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const ordersData = await ordersAPI.getMyOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // Utility function to get full image URL
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop'
    if (url.startsWith('http')) return url
    return `http://localhost:3000${url}`
  }

  // Image modal functions
  const openImageModal = useCallback((imageUrl) => {
    setSelectedImageUrl(imageUrl)
    setIsImageModalOpen(true)
  }, [])

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false)
    setSelectedImageUrl('')
  }, [])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isImageModalOpen) {
        closeImageModal()
      }
    }

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isImageModalOpen, closeImageModal])

  // Order action functions
  const canEditOrder = (order) => {
    return order.status === 'PENDING' || order.status === 'PROCESSING'
  }

  const canCancelOrder = (order) => {
    return order.status === 'PENDING' || order.status === 'PROCESSING'
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    setEditNotes(order.notes || '')
    setIsEditModalOpen(true)
  }

  const handleCancelOrder = (order) => {
    setSelectedOrder(order)
    setCancelReason('')
    setIsCancelModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedOrder) return

    try {
      setActionLoading(true)
      await ordersAPI.updateOrder(selectedOrder.id, { notes: editNotes })
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, notes: editNotes }
          : order
      ))
      
      setIsEditModalOpen(false)
      setSelectedOrder(null)
      setEditNotes('')
    } catch (error) {
      console.error('Error updating order:', error)
      setError('Failed to update order')
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmCancel = async () => {
    if (!selectedOrder || !cancelReason.trim()) return

    try {
      setActionLoading(true)
      await ordersAPI.cancelOrder(selectedOrder.id, { reason: cancelReason })
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'CANCELLED', notes: `${order.notes || ''}\nCancellation Reason: ${cancelReason}`.trim() }
          : order
      ))
      
      setIsCancelModalOpen(false)
      setSelectedOrder(null)
      setCancelReason('')
    } catch (error) {
      console.error('Error cancelling order:', error)
      setError('Failed to cancel order')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'PROCESSING':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'SHIPPED':
        return <Truck className="h-4 w-4 text-purple-500" />
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900">Please login to view your orders</h2>
            <p className="text-gray-600 mt-2">You need to be logged in to access your order history.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900">Error loading orders</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button onClick={fetchOrders} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Edit Order Modal
  const EditOrderModal = () => {
    return (
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update the notes or special instructions for your order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Order Notes</Label>
              <Textarea
                id="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add any special instructions or notes for this order..."
                rows={4}
                autoFocus
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Cancel Order Modal
  const CancelOrderModal = () => {
    return (
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Cancel Order
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for canceling this order. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cancel-reason">Cancellation Reason *</Label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please explain why you want to cancel this order..."
                rows={4}
                required
                autoFocus
                className="resize-none"
              />
              {!cancelReason.trim() && (
                <p className="text-sm text-red-600">Please provide a reason for cancellation.</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCancelModalOpen(false)}
              disabled={actionLoading}
            >
              Keep Order
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={actionLoading || !cancelReason.trim()}
            >
              {actionLoading ? 'Canceling...' : 'Cancel Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Image Modal Component
  const ImageModal = () => {
    if (!isImageModalOpen || !selectedImageUrl) return null

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
        onClick={closeImageModal}
      >
        <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
          {/* Close Button */}
          <button
            onClick={closeImageModal}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image Container */}
          <div 
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImageUrl}
              alt="Product image"
              className="w-full h-auto max-h-[80vh] object-contain"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-2xl font-light text-gray-900">No orders yet</h2>
            <p className="mt-2 text-gray-600">Start shopping to see your orders here.</p>
            <Link to="/">
              <Button className="mt-6 bg-black text-white hover:bg-gray-800">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </div>
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img
                              src={getImageUrl(item.product?.images?.[0]?.url)}
                              alt={item.product?.name}
                              className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity duration-200"
                              onClick={() => openImageModal(getImageUrl(item.product?.images?.[0]?.url))}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop'
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {item.product?.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                                {item.color && ` • Color: ${item.color}`}
                                {item.size && ` • Size: ${item.size}`}
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">${order.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">${order.shipping?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">${order.tax?.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Total</span>
                            <span className="font-medium">${order.total?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.notes && order.notes.includes('Shipping Address:') && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                              <div>
                                <p>{order.notes.split('Shipping Address:')[1]?.split('Payment Method:')[0]?.trim()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Notes */}
                      {order.notes && !order.notes.includes('Shipping Address:') && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {/* Edit Order Button */}
                        {canEditOrder(order) && (
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Order
                          </Button>
                        )}
                        
                        {/* Cancel Order Button */}
                        {canCancelOrder(order) && (
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancelOrder(order)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}
                        
                        {/* Reorder Button */}
                        {order.status === 'DELIVERED' && (
                          <Button variant="outline" className="w-full justify-start">
                            <Package className="h-4 w-4 mr-2" />
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Modals */}
      <EditOrderModal />
      <CancelOrderModal />
      <ImageModal />
    </div>
  )
}

export default Orders
