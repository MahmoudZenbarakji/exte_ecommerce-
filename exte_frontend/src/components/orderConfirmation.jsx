import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts'
import { ordersAPI } from '../services'
import { Button } from './ui/button'

function OrderConfirmation() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchOrder = async () => {
      try {
        const orderData = await ordersAPI.getOrder(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error('Error fetching order:', error)
        setError('Order not found or access denied')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900">Order Not Found</h2>
            <p className="mt-2 text-gray-600">{error || 'The order you are looking for does not exist.'}</p>
            <Link to="/">
              <Button className="mt-6 bg-black text-white hover:bg-gray-800">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-light text-gray-900">Order Confirmed!</h1>
          <p className="mt-2 text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Order #{order.id}</h2>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900">
                ${order.total.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Status: <span className="capitalize">{order.status.toLowerCase()}</span>
              </p>
            </div>
          </div>

          {/* Customer Information */}
          {order.user && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {order.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {order.user.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.notes && order.notes.includes('Shipping Address:') && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p>{order.notes.split('Shipping Address:')[1]?.split('Payment Method:')[0]?.trim()}</p>
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order.notes && !order.notes.includes('Shipping Address:') && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Order Notes</h3>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <img
                    src={item.product?.images?.[0]?.url ? `http://localhost:3000${item.product.images[0].url}` : '/placeholder-image.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-20 h-24 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {item.product?.name || 'Product Name'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {item.product?.description || 'No description available'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Variant:</span> {item.color && item.size ? `${item.color}, ${item.size}` : 'One Size'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">SKU:</span> {item.product?.sku || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Quantity:</span> {item.quantity}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Unit Price:</span> SYP {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-lg font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium">
                  {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax</span>
                <span className="text-sm font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/orders">
            <Button className="w-full sm:w-auto bg-gray-100 text-gray-900 hover:bg-gray-200">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
