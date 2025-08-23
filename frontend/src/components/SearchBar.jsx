import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Leaf } from 'lucide-react'
import { useQuery } from 'react-query'
import { plantsAPI } from '../services/api'

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)

  // Search plants when query changes
  const { data: searchResults = [], isLoading } = useQuery(
    ['search', query],
    () => plantsAPI.searchPlants(query, {}),
    {
      enabled: query.length >= 1, // Reduced from 2 to 1 character
      staleTime: 5 * 60 * 1000, // 5 minutes
      select: (response) => response.data || [],
      debounceTime: 300 // Add debouncing for better performance
    }
  )

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close search when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query.trim())}`)
      onClose()
      setQuery('')
    }
  }

  const handleResultClick = (plantId) => {
    navigate(`/plant/${plantId}`)
    onClose()
    setQuery('')
  }

  const handleClearSearch = () => {
    setQuery('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div 
        ref={searchRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden"
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400" />
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search plants by name or category..."
                className="w-full border-none outline-none text-lg placeholder-gray-400"
                autoFocus
              />
            </form>
            {query && (
              <button
                onClick={handleClearSearch}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.length < 1 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Start typing to search plants</p>
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Leaf className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No plants found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or browse all plants</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {searchResults.map((plant) => (
                <div
                  key={plant._id}
                  onClick={() => handleResultClick(plant._id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Plant Image */}
                    {plant.imageUrl ? (
                      <img 
                        src={plant.imageUrl} 
                        alt={plant.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    {/* Plant Image Placeholder */}
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    
                    {/* Plant Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {plant.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {plant.description}
                      </p>
                      {plant.categories && plant.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plant.categories.slice(0, 2).map((category) => (
                            <span
                              key={category._id || category}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {category.name || category}
                            </span>
                          ))}
                          {plant.categories.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{plant.categories.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary-600">
                        ₹{plant.price.toFixed(2)}
                      </p>
                      <p className={`text-xs ${
                        plant.availability ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {plant.availability ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Footer */}
        {query.length >= 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {isLoading ? 'Searching...' : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} found`}
              </span>
              <button
                onClick={() => navigate(`/catalog?search=${encodeURIComponent(query)}`)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all results →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
