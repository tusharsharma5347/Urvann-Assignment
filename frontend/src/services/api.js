import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
    }
    return Promise.reject(error)
  }
)

// Plants API
export const plantsAPI = {
  // Get all plants with filters
  getPlants: (params = {}) => api.get('/plants', { params }),
  
  // Get single plant by ID
  getPlant: (id) => api.get(`/plants/${id}`),
  
  // Create new plant
  createPlant: (plantData) => api.post('/plants', plantData),
  
  // Update plant
  updatePlant: (id, plantData) => api.put(`/plants/${id}`, plantData),
  
  // Delete plant
  deletePlant: (id) => api.delete(`/plants/${id}`),
  
  // Search plants
  searchPlants: (query, filters = {}) => 
    api.get('/plants/search', { params: { q: query, filters: JSON.stringify(filters) } }),
  
  // Get plants by category
  getPlantsByCategory: (categoryId, params = {}) => 
    api.get(`/plants/categories/${categoryId}`, { params }),
}

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: () => api.get('/categories'),
  
  // Get single category by ID
  getCategory: (id) => api.get(`/categories/${id}`),
  
  // Create new category
  createCategory: (categoryData) => api.post('/categories', categoryData),
  
  // Update category
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  
  // Delete category
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  
  // Get category statistics
  getCategoryStats: () => api.get('/categories/stats/overview'),
}

// Authentication API
export const authAPI = {
  // User registration
  register: (userData) => api.post('/auth/register', userData),
  
  // User login
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Create admin user (admin only)
  createAdmin: (userData) => api.post('/auth/admin/create', userData),
}

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: () => api.get('/cart'),
  
  // Add item to cart
  addToCart: (plantId, quantity = 1) => api.post('/cart/add', { plantId, quantity }),
  
  // Update item quantity
  updateQuantity: (plantId, quantity) => api.put('/cart/update', { plantId, quantity }),
  
  // Remove item from cart
  removeFromCart: (plantId) => api.delete(`/cart/remove/${plantId}`),
  
  // Clear cart
  clearCart: () => api.delete('/cart/clear'),
  
  // Get cart item count
  getCartCount: () => api.get('/cart/count'),
}

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
}

export default api
