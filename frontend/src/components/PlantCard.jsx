import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Leaf } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const PlantCard = ({ plant }) => {
  const { isAuthenticated } = useAuth()
  const { addToCart, isInCart, getItemQuantity } = useCart()
  
  const {
    _id,
    name,
    price,
    categories = [],
    availability,
    description,
    careLevel,
    isPetFriendly,
    isAirPurifying,
    imageUrl
  } = plant

  const handleAddToCart = async () => {
    await addToCart(_id, 1)
  }

  const currentQuantity = getItemQuantity(_id)
  const inCart = isInCart(_id)

  return (
    <div className="card group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Plant Image - Clickable to go to details */}
      <Link to={`/plant/${_id}`} className="block">
        {imageUrl ? (
          <div className="aspect-square overflow-hidden">
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            {/* Fallback placeholder */}
            <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center hidden">
              <Leaf className="w-16 h-16 text-green-600 opacity-60" />
            </div>
          </div>
        ) : (
          <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <Leaf className="w-16 h-16 text-green-600 opacity-60" />
          </div>
        )}
      </Link>
      
      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <Link to={`/plant/${_id}`} className="flex-1 group-hover:text-primary-600 transition-colors duration-200">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1 text-lg">
              {name}
            </h3>
          </Link>
          <div className="flex items-center space-x-1 ml-2">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50">
              <Heart className="w-4 h-4" />
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={!availability}
              className={`p-2 transition-all duration-200 rounded-full ${
                inCart 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
              } ${!availability ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={inCart ? 'Already in cart' : 'Add to cart'}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-primary-600">
            ₹{price.toFixed(2)}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.slice(0, 3).map((category) => (
              <span
                key={category._id || category}
                className="badge badge-primary text-xs px-2 py-1"
                style={{
                  backgroundColor: category.color ? `${category.color}20` : undefined,
                  color: category.color || undefined
                }}
              >
                {category.name || category}
              </span>
            ))}
            {categories.length > 3 && (
              <span className="badge badge-secondary text-xs px-2 py-1">
                +{categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Features */}
        <div className="flex items-center space-x-4 mb-4 text-xs text-gray-500">
          {careLevel && (
            <span className="flex items-center space-x-1">
              <Leaf className="w-3 h-3" />
              <span>{careLevel}</span>
            </span>
          )}
          {isPetFriendly && (
            <span className="flex items-center space-x-1 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Pet Safe</span>
            </span>
          )}
          {isAirPurifying && (
            <span className="flex items-center space-x-1 text-blue-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Air Purifying</span>
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={!availability}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              inCart
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : availability
                ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {inCart ? 'In Cart' : availability ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlantCard
