import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { plantsAPI, categoriesAPI } from '../services/api'
import PlantCard from '../components/PlantCard'
import LoadingSpinner from '../components/LoadingSpinner'
import FilterSidebar from '../components/FilterSidebar'

const PlantCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('') // Local search input state

  // Get current filters from URL
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const availability = searchParams.get('availability') || ''
  const careLevel = searchParams.get('careLevel') || ''
  const waterNeeds = searchParams.get('waterNeeds') || ''
  const lightNeeds = searchParams.get('lightNeeds') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = searchParams.get('sortOrder') || 'asc'

  // Sync search input with URL search param
  useEffect(() => {
    setSearchInput(search)
  }, [search])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        handleSearch(searchInput)
      }
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchInput])

  // Build query params
  const queryParams = {
    page,
    limit: 12,
    search: search || undefined,
    categories: category || undefined,
    availability: availability || undefined,
    careLevel: careLevel || undefined,
    waterNeeds: waterNeeds || undefined,
    lightNeeds: lightNeeds || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sortBy,
    sortOrder
  }

  // Fetch plants
  const { data: plantsData, isLoading, error } = useQuery(
    ['plants', page, search, category, availability, careLevel, waterNeeds, lightNeeds, minPrice, maxPrice, sortBy, sortOrder],
    () => plantsAPI.getPlants(queryParams),
    { 
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  )

  // Fetch categories for filter sidebar
  const { data: categoriesData } = useQuery(
    ['categories'],
    categoriesAPI.getCategories
  )

  const plants = plantsData?.data || []
  const pagination = plantsData?.pagination || {}
  const categories = categoriesData?.data || []

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to first page when filters change
    params.set('page', '1')
    setSearchParams(params)
  }

  // Handle search
  const handleSearch = (searchTerm) => {
    // Always reset to page 1 when searching
    const params = new URLSearchParams(searchParams)
    
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim())
    } else {
      params.delete('search')
    }
    
    // Reset to first page for new searches
    params.set('page', '1')
    setSearchParams(params)
  }

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value })
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    console.log('Changing to page:', newPage)
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    console.log('New URL params:', params.toString())
    setSearchParams(params)
  }

  // Debug pagination state
  useEffect(() => {
    console.log('Current page:', page)
    console.log('Current search params:', searchParams.toString())
    console.log('Pagination data:', pagination)
  }, [page, searchParams, pagination])

  // Handle sorting
  const handleSort = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc'
    updateFilters({ sortBy: newSortBy, sortOrder: newSortOrder })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({ page: '1' })
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Unable to load plants. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Plant Catalog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our collection of beautiful plants for every space and style. 
            From easy-care succulents to statement tropical plants, find your perfect green companion.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Type plant name or category..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchInput)
                  }
                }}
                className={`input-field pl-12 pr-24 transition-all duration-200 rounded-xl ${
                  searchInput && searchInput !== search 
                    ? 'ring-2 ring-primary-200 border-primary-300' 
                    : ''
                }`}
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('')
                    handleSearch('')
                  }}
                  className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleSearch(searchInput)}
                disabled={!searchInput.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchInput.trim() 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="Search plants"
              >
                Search
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn-outline inline-flex items-center space-x-2 px-6 py-3 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
          
          {/* Search Results Indicator */}
          {search && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Search results for "{search}"
                </span>
                <span className="text-primary-600 font-medium">
                  {pagination.totalItems} plant{pagination.totalItems !== 1 ? 's' : ''} found
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {searchInput !== search && (
                  <span>Press Enter or click Search to apply "{searchInput}"</span>
                )}
              </div>
            </div>
          )}
          
          {/* Search Input Status */}
          {searchInput && searchInput !== search && (
            <div className="mt-2 text-xs text-gray-500">
              <span>Type to search, press Enter, or click Search button</span>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            categories={categories}
            currentFilters={{
              category,
              availability,
              careLevel,
              waterNeeds,
              lightNeeds,
              minPrice,
              maxPrice
            }}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  'Loading...'
                ) : (
                  `Showing ${pagination.totalItems || 0} plants`
                )}
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-')
                    handleSort(newSortBy)
                  }}
                  className="input-field text-sm py-1 px-2"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="price-desc">Price High-Low</option>
                </select>
              </div>
            </div>

            {/* Plants Grid */}
            {isLoading ? (
              <LoadingSpinner />
            ) : plants.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-8 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {plants.map((plant) => (
                    <PlantCard key={plant._id} plant={plant} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center mt-12">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-4">
                        {search ? (
                          <span>
                            Showing page {pagination.currentPage} of {pagination.totalPages} 
                            ({pagination.totalItems} total results for "{search}")
                          </span>
                        ) : (
                          <span>
                            Showing page {pagination.currentPage} of {pagination.totalPages} 
                            ({pagination.totalItems} total plants)
                          </span>
                        )}
                      </div>
                      
                      {/* Debug Pagination */}
                      <div className="text-xs text-gray-500 mb-2">
                        Debug: Page {page} | URL Page: {searchParams.get('page')} | Current: {pagination.currentPage}
                      </div>
                      
                      {/* Test Pagination Buttons */}
                      <div className="flex justify-center space-x-2 mb-4">
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Test Page 1
                        </button>
                        <button
                          onClick={() => handlePageChange(2)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Test Page 2
                        </button>
                        <button
                          onClick={() => handlePageChange(3)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Test Page 3
                        </button>
                      </div>
                      <nav className="flex items-center space-x-1">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrevPage}
                          className="p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-all duration-200"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => {
                              console.log('Page button clicked:', pageNum)
                              handlePageChange(pageNum)
                            }}
                            className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                              pageNum === pagination.currentPage
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                          className="p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-all duration-200"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantCatalogPage
