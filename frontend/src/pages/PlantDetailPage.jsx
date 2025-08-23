import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowLeft, ShoppingCart, Heart, Leaf, Droplets, Sun, Ruler, Package, Shield, Zap } from 'lucide-react'
import { plantsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const PlantDetailPage = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { addToCart, isInCart, getItemQuantity } = useCart()

  const { data: plant, isLoading, error } = useQuery(
    ['plant', id],
    () => plantsAPI.getPlant(id),
    {
      select: (response) => response.data
    }
  )

  const handleAddToCart = async () => {
    await addToCart(id, 1)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Plant Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The plant you're looking for doesn't exist or has been removed.
          </p>
          <div className="space-x-4">
            <Link to="/catalog" className="btn-primary">
              Browse Plants
            </Link>
            <Link to="/" className="btn-secondary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentQuantity = getItemQuantity(plant._id)
  const inCart = isInCart(plant._id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/catalog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plant Image */}
          {plant.imageUrl ? (
            <div className="aspect-square overflow-hidden rounded-lg">
              <img 
                src={plant.imageUrl} 
                alt={plant.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              {/* Fallback placeholder */}
              <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center hidden">
                <Leaf className="w-32 h-32 text-green-600 opacity-60" />
              </div>
            </div>
          ) : (
            <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <Leaf className="w-32 h-32 text-green-600 opacity-60" />
            </div>
          )}

          {/* Plant Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{plant.name}</h1>
              <div className="text-3xl font-bold text-primary-600 mb-4">
                ₹{plant.price.toFixed(2)}
              </div>
              
              {/* Categories */}
              {plant.categories && plant.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {plant.categories.map((category) => (
                    <span
                      key={category._id || category}
                      className="badge badge-primary"
                      style={{
                        backgroundColor: category.color ? `${category.color}20` : undefined,
                        color: category.color || undefined
                      }}
                    >
                      {category.name || category}
                    </span>
                  ))}
                </div>
              )}

              {/* Availability */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                plant.availability
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {plant.availability ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>

            {/* Description */}
            {plant.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{plant.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!plant.availability}
                className={`flex-1 btn-primary flex items-center justify-center space-x-2 ${
                  !plant.availability ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title={inCart ? 'Already in cart' : 'Add to cart'}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {inCart ? `In Cart (${currentQuantity})` : 'Add to Cart'}
                </span>
              </button>
              
              <button className="flex-1 btn-outline flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Care Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plant.careLevel && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    plant.careLevel === 'Easy' ? 'bg-green-500' :
                    plant.careLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Care Level</p>
                    <p className="text-sm text-gray-600">{plant.careLevel}</p>
                  </div>
                </div>
              )}

              {plant.waterNeeds && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Water Needs</p>
                    <p className="text-sm text-gray-600">{plant.waterNeeds}</p>
                  </div>
                </div>
              )}

              {plant.lightNeeds && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Light Needs</p>
                    <p className="text-sm text-gray-600">{plant.lightNeeds}</p>
                  </div>
                </div>
              )}

              {plant.height && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Ruler className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Height</p>
                    <p className="text-sm text-gray-600">{plant.height} cm</p>
                  </div>
                </div>
              )}

              {plant.potSize && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pot Size</p>
                    <p className="text-sm text-gray-600">{plant.potSize}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3">
              {plant.isPetFriendly && (
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">Pet Friendly</span>
                </div>
              )}
              
              {plant.isAirPurifying && (
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Air Purifying</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDetailPage
