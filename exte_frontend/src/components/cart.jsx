import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts'
import { Button } from './ui/button'

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-2xl font-light text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Start shopping to add items to your cart.</p>
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
        <h1 className="text-3xl font-light text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow-sm rounded-lg">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.size}-${item.color}`} className="p-6">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-md"
                      />
                      <div className="ml-6 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              <Link to={`/product/${item.id}`} className="hover:text-gray-700">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            <p className="mt-1 text-sm text-gray-500">
                              Color: {item.color} | Size: {item.size}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.isOnSale && item.salePrice ? (
                              <div className="flex items-center gap-2">
                                <span className="text-red-600 font-bold">SYP {item.salePrice}</span>
                                <span className="text-gray-500 line-through text-xs">SYP {item.originalPrice}</span>
                              </div>
                            ) : (
                              <span>SYP {item.price}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-3 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                            className="text-red-600 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">SYP {getCartTotal().toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">Free</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-sm font-medium text-gray-900">SYP {(getCartTotal() * 0.1).toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-medium text-gray-900">
                      SYP {(getCartTotal() * 1.1).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/checkout">
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-500">
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900">Free shipping & returns</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Free shipping on orders over SYP 50. Free returns within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

