import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import PlantCatalogPage from './pages/PlantCatalogPage'
import AddPlantPage from './pages/AddPlantPage'
import PlantDetailPage from './pages/PlantDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import NotFoundPage from './pages/NotFoundPage'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<PlantCatalogPage />} />
              <Route path="/add-plant" element={<AddPlantPage />} />
              <Route path="/plant/:id" element={<PlantDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
