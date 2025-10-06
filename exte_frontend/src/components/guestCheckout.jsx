import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts'
import { ordersAPI } from '../services'
import { Button } from './ui/button'

function GuestCheckout() {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Syria'
  })
  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery')
  const [notes, setNotes] = useState('')
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [error, setError] = useState('')

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }
  }, [cartItems.length, navigate])

  const handleProceedToCheckout = async () => {
    // Validate required fields
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
      setError('Please fill in all required customer information')
      return
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      setError('Please fill in all required shipping address fields')
      return
    }

    setIsCreatingOrder(true)
    setError('')

    try {
      // Prepare order items from cart with prices
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size
      }))

      // Format shipping address
      const formattedShippingAddress = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}, ${shippingAddress.country}`

      const orderData = {
        userId: 1, // Guest user ID - you might want to create a guest user in your system
        items: orderItems,
        shippingAddress: formattedShippingAddress,
        paymentMethod: paymentMethod,
        totalAmount: total,
        notes: notes.trim() || `Customer: ${customerInfo.firstName} ${customerInfo.lastName} (${customerInfo.email})`
      }

      console.log('Creating guest order with data:', orderData)
      const order = await ordersAPI.createOrder(orderData)
      console.log('Guest order created successfully:', order)

      // Clear cart after successful order
      await clearCart()
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error('Error creating guest order:', error)
      setError(error.message || 'Failed to create order. Please try again.')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const calculateTotals = () => {
    const subtotal = getCartTotal()
    const shipping = subtotal > 50 ? 0 : 10 // Free shipping over $50
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + shipping + tax
    
    return { subtotal, shipping, tax, total }
  }

  const { subtotal, shipping, tax, total } = calculateTotals()

  if (cartItems.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Guest Checkout</h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            {/* Customer Information */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CashOnDelivery"
                    checked={paymentMethod === 'CashOnDelivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">Cash on Delivery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CreditCard"
                    checked={paymentMethod === 'CreditCard'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">Credit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BankTransfer"
                    checked={paymentMethod === 'BankTransfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">Bank Transfer</span>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for your order..."
                rows={3}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.color && item.size ? `${item.color}, ${item.size}` : 'One Size'}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-medium text-gray-900">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleProceedToCheckout}
                  disabled={isCreatingOrder}
                  className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {isCreatingOrder ? 'Creating Order...' : 'Complete Order'}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/cart')}
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestCheckout
