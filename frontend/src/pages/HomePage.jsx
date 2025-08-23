import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowRight, Leaf, Sparkles, Shield, Zap, Plus } from 'lucide-react'
import { plantsAPI, categoriesAPI } from '../services/api'
import PlantCard from '../components/PlantCard'
import LoadingSpinner from '../components/LoadingSpinner'

const HomePage = () => {
  // Fetch featured plants (first 6 plants)
  const { data: plantsData, isLoading: plantsLoading } = useQuery(
    ['featured-plants'],
    () => plantsAPI.getPlants({ limit: 6, page: 1 })
  )

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    ['categories'],
    categoriesAPI.getCategories
  )

  const featuredPlants = plantsData?.data || []
  const categories = categoriesData?.data || []

  const features = [
    {
      icon: Leaf,
      title: 'Wide Variety',
      description: 'Choose from hundreds of carefully selected plants for every space and style.'
    },
    {
      icon: Shield,
      title: 'Pet Safe',
      description: 'Many of our plants are pet-friendly, ensuring your furry friends stay safe.'
    },
    {
      icon: Zap,
      title: 'Air Purifying',
      description: 'Transform your home with plants that naturally clean and purify the air.'
    },
    {
      icon: Sparkles,
      title: 'Expert Care',
      description: 'Get detailed care instructions and tips from our plant experts.'
    }
  ]

  if (plantsLoading || categoriesLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-green-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Your Perfect
              <span className="text-primary-600"> Plant Match</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From lush indoor jungles to vibrant outdoor gardens, find the perfect plants 
              to transform your space and bring nature indoors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <span>Browse Plants</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/add-plant"
                className="btn-outline text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <span>Add New Plant</span>
                <Plus className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Urvann?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're passionate about helping you create beautiful, thriving plant spaces 
              that bring joy and wellness to your life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Plants Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Plants
              </h2>
              <p className="text-gray-600">
                Discover our most popular and beautiful plant selections
              </p>
            </div>
            <Link
              to="/catalog"
              className="btn-outline inline-flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect plants for your specific needs and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/catalog?category=${category._id}`}
                className="group block"
              >
                <div className="bg-gray-50 rounded-lg p-6 text-center hover:bg-primary-50 transition-colors duration-200">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Plant Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy plant parents who have transformed their spaces 
            with our beautiful selection.
          </p>
          <Link
            to="/catalog"
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
