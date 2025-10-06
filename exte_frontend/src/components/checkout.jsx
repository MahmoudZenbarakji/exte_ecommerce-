import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useAuth } from '../contexts'
import { ordersAPI } from '../services'
import { Button } from './ui/button'

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Syria'
  })
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [notes, setNotes] = useState('')
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }
  }, [isAuthenticated, cartItems.length, navigate])

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addressesData = await ordersAPI.getMyAddresses()
        setAddresses(addressesData)
        // Set default address if available
        const defaultAddress = addressesData.find(addr => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      }
    }

    if (isAuthenticated) {
      fetchAddresses()
    }
  }, [isAuthenticated])

  const handleCreateAddress = async (e) => {
    e.preventDefault()
    try {
      const addressData = await ordersAPI.createAddress(newAddress)
      setAddresses(prev => [...prev, addressData])
      setSelectedAddressId(addressData.id)
      setShowNewAddressForm(false)
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Syria'
      })
    } catch (error) {
      setError(error.message)
    }
  }

  const handleProceedToCheckout = async () => {
    if (!selectedAddressId) {
      setError('Please select or create a shipping address')
      return
    }

    setIsCreatingOrder(true)
    setError('')

    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        throw new Error('User not found. Please login again.')
      }

      // Get selected address
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId)
      if (!selectedAddress) {
        throw new Error('Selected address not found')
      }

      // Prepare order items from cart with prices
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size
      }))

      // Format shipping address
      const shippingAddress = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}, ${selectedAddress.country}`

      const orderData = {
        userId: user.id,
        items: orderItems,
        shippingAddress: shippingAddress,
        paymentMethod: 'CashOnDelivery', // Default payment method
        totalAmount: total,
        notes: notes.trim() || undefined
      }

      console.log('Creating order with data:', orderData)
      const order = await ordersAPI.createOrder(orderData)
      console.log('Order created successfully:', order)

      // Clear cart after successful order
      await clearCart()
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error('Error creating order:', error)
      setError(error.message || 'Failed to create order. Please try again.')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const calculateTotals = () => {
    const subtotal = getCartTotal()
    const shipping = subtotal > 50 ? 0 : 10 // Free shipping over SYP 50
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + shipping + tax
    
    return { subtotal, shipping, tax, total }
  }

  const { subtotal, shipping, tax, total } = calculateTotals()

  if (!isAuthenticated || cartItems.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Checkout</h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            {/* Shipping Address */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
              
              {addresses.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Address
                  </label>
                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <label key={address.id} className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-500">{address.country}</p>
                          {address.isDefault && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="mb-4 bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                {showNewAddressForm ? 'Cancel' : 'Add New Address'}
              </Button>

              {showNewAddressForm && (
                <form onSubmit={handleCreateAddress} className="border-t pt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.country}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                      Save Address
                    </Button>
                  </div>
                </form>
              )}
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
                    <div className="text-sm font-medium text-gray-900">
                      {item.isOnSale && item.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 font-bold">SYP {(item.salePrice * item.quantity).toFixed(2)}</span>
                          <span className="text-gray-500 line-through text-xs">SYP {(item.originalPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ) : (
                        <span>SYP {(item.price * item.quantity).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">SYP {subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">
                    {shipping === 0 ? 'Free' : `SYP ${shipping.toFixed(2)}`}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-sm font-medium text-gray-900">SYP {tax.toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-medium text-gray-900">
                      SYP {total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleProceedToCheckout}
                  disabled={isCreatingOrder || !selectedAddressId}
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

export default Checkout
