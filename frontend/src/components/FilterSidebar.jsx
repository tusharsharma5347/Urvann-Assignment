import { X } from 'lucide-react'

const FilterSidebar = ({
  isOpen,
  onClose,
  categories,
  currentFilters,
  onFilterChange,
  onClearFilters
}) => {
  const filterOptions = {
    careLevel: ['Easy', 'Medium', 'Hard'],
    waterNeeds: ['Low', 'Medium', 'High'],
    lightNeeds: ['Low Light', 'Indirect Light', 'Bright Light', 'Direct Sunlight']
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category._id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category._id}
                      checked={currentFilters.category === category._id}
                      onChange={(e) => onFilterChange('category', e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="availability"
                    value="true"
                    checked={currentFilters.availability === 'true'}
                    onChange={(e) => onFilterChange('availability', e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="availability"
                    value="false"
                    checked={currentFilters.availability === 'false'}
                    onChange={(e) => onFilterChange('availability', e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Out of Stock</span>
                </label>
              </div>
            </div>

            {/* Care Level */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Care Level</h4>
              <div className="space-y-2">
                {filterOptions.careLevel.map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="careLevel"
                      value={level}
                      checked={currentFilters.careLevel === level}
                      onChange={(e) => onFilterChange('careLevel', e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Water Needs */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Water Needs</h4>
              <div className="space-y-2">
                {filterOptions.waterNeeds.map((need) => (
                  <label key={need} className="flex items-center">
                    <input
                      type="radio"
                      name="waterNeeds"
                      value={need}
                      checked={currentFilters.waterNeeds === need}
                      onChange={(e) => onFilterChange('waterNeeds', e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{need}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Light Needs */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Light Needs</h4>
              <div className="space-y-2">
                {filterOptions.lightNeeds.map((need) => (
                  <label key={need} className="flex items-center">
                    <input
                      type="radio"
                      name="lightNeeds"
                      value={need}
                      checked={currentFilters.lightNeeds === need}
                      onChange={(e) => onFilterChange('lightNeeds', e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{need}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={currentFilters.minPrice}
                    onChange={(e) => onFilterChange('minPrice', e.target.value)}
                    className="input-field text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={currentFilters.maxPrice}
                    onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                    className="input-field text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onClearFilters}
              className="w-full btn-outline"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar
