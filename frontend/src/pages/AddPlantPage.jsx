import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { Plus, Loader2 } from 'lucide-react'
import { plantsAPI, categoriesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const AddPlantPage = () => {
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])

  // Redirect if not admin or not authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error('Please login to access this page.')
        navigate('/login')
      } else if (!isAdmin) {
        toast.error('Access denied. Admin privileges required.')
        navigate('/')
      }
    }
  }, [isAdmin, isAuthenticated, authLoading, navigate])

  // Fetch categories with error handling
  const { 
    data: categoriesResponse = {}, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useQuery(
    'categories',
    categoriesAPI.getCategories,
    {
      retry: 2,
      onError: (error) => {
        console.error('Categories API error:', error)
        toast.error('Failed to load categories. Please refresh the page.')
      }
    }
  )

  // Extract categories from response
  const categories = categoriesResponse.data || categoriesResponse || []

  // Add plant mutation
  const addPlantMutation = useMutation(plantsAPI.createPlant, {
    onSuccess: () => {
      toast.success('Plant added successfully!')
      navigate('/catalog')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to add plant')
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category')
      return
    }

    const plantData = {
      ...data,
      price: parseFloat(data.price),
      categories: selectedCategories,
      availability: data.availability === 'true',
      isPetFriendly: data.isPetFriendly === 'true',
      isAirPurifying: data.isAirPurifying === 'true',
      height: data.height ? parseFloat(data.height) : undefined,
      potSize: data.potSize || undefined
    }

    addPlantMutation.mutate(plantData)
  }

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not admin
  if (!isAuthenticated || !isAdmin) {
    return null // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Plant</h1>
          <p className="text-gray-600 mt-2">
            Add a new plant to the Urvann collection
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Plant Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Plant name is required' })}
                  className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                  placeholder="Enter plant name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  min="0"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  className={`input-field ${errors.price ? 'border-red-300' : ''}`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className="input-field"
                placeholder="Describe the plant..."
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories *
              </label>
              {categoriesLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-600">Loading categories...</span>
                </div>
              ) : categoriesError ? (
                <div className="text-red-600 text-sm">
                  Error loading categories. Please refresh the page.
                </div>
              ) : categories && categories.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryToggle(category._id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-gray-600 text-sm">
                  No categories available. Please contact an administrator.
                </div>
              )}
              {selectedCategories.length === 0 && (
                <p className="mt-1 text-sm text-red-600">Please select at least one category</p>
              )}
            </div>

            {/* Care Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="careLevel" className="block text-sm font-medium text-gray-700">
                  Care Level
                </label>
                <select
                  id="careLevel"
                  {...register('careLevel')}
                  className="input-field"
                >
                  <option value="">Select care level</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label htmlFor="waterNeeds" className="block text-sm font-medium text-gray-700">
                  Water Needs
                </label>
                <select
                  id="waterNeeds"
                  {...register('waterNeeds')}
                  className="input-field"
                >
                  <option value="">Select water needs</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="lightNeeds" className="block text-sm font-medium text-gray-700">
                  Light Needs
                </label>
                <select
                  id="lightNeeds"
                  {...register('lightNeeds')}
                  className="input-field"
                >
                  <option value="">Select light needs</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Physical Characteristics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  step="0.1"
                  min="0"
                  {...register('height')}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label htmlFor="potSize" className="block text-sm font-medium text-gray-700">
                  Pot Size
                </label>
                <input
                  type="text"
                  id="potSize"
                  {...register('potSize')}
                  className="input-field"
                  placeholder="e.g., 6 inch, 15cm"
                />
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select
                  id="availability"
                  {...register('availability')}
                  className="input-field"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>

              <div>
                <label htmlFor="isPetFriendly" className="block text-sm font-medium text-gray-700">
                  Pet Friendly
                </label>
                <select
                  id="isPetFriendly"
                  {...register('isPetFriendly')}
                  className="input-field"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label htmlFor="isAirPurifying" className="block text-sm font-medium text-gray-700">
                  Air Purifying
                </label>
                <select
                  id="isAirPurifying"
                  {...register('isAirPurifying')}
                  className="input-field"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                {...register('imageUrl')}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/catalog')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addPlantMutation.isLoading}
                className="btn-primary flex items-center space-x-2"
              >
                {addPlantMutation.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding Plant...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Plant</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPlantPage
