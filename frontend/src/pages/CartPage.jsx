import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, LogIn } from 'lucide-react'
import { toast } from 'react-hot-toast'

const CartPage = () => {
  const { isAuthenticated } = useAuth()
  const { 
    cart, 
    loading, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getCartTotal 
  } = useCart()

  const [updatingItems, setUpdatingItems] = useState(new Set())

  const handleQuantityChange = async (plantId, newQuantity) => {
    if (newQuantity < 1) return
    
    setUpdatingItems(prev => new Set(prev).add(plantId))
    try {
      await updateQuantity(plantId, newQuantity)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(plantId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (plantId) => {
    try {
      await removeFromCart(plantId)
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart()
      } catch (error) {
        toast.error('Failed to clear cart')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any plants to your cart yet.
          </p>
          <Link to="/catalog" className="btn-primary">
            Browse Plants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/catalog" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-2">
                {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            
            {/* Guest User Notice */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
                <div className="flex items-start space-x-3">
                  <LogIn className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Guest User</p>
                    <p className="text-blue-700 mt-1">
                      Your cart is saved locally. 
                      <Link to="/login" className="font-medium hover:underline ml-1">
                        Login
                      </Link> to sync with your account.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.plant._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {/* Plant Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                      </div>

                      {/* Plant Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.plant.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.plant.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          {item.plant.categories?.map((category) => (
                            <span
                              key={category._id || category}
                              className="badge badge-primary text-xs"
                              style={{
                                backgroundColor: category.color ? `${category.color}20` : undefined,
                                color: category.color || undefined
                              }}
                            >
                              {category.name || category}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.plant._id, item.quantity - 1)}
                          disabled={updatingItems.has(item.plant._id)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-gray-900 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.plant._id, item.quantity + 1)}
                          disabled={updatingItems.has(item.plant._id)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary-600">
                          ₹{(item.plant.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{item.plant.price.toFixed(2)} each
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.plant._id)}
                          className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
                  <span className="text-gray-900">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full btn-primary text-lg py-3">
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
