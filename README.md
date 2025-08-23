# 🌱 Online Plant Store

A full-stack Online Plant Store application built with React, Node.js, Express, and MongoDB. This project demonstrates modern web development practices with a focus on user experience, scalability, and clean code architecture.

## ✨ Features

### 🌿 Plant Catalog
- **Comprehensive Plant Display**: View plants with detailed information including name, price, categories, and availability
- **Rich Plant Data**: Each plant includes care level, water needs, light requirements, height, pot size, and special features
- **Multiple Categories**: Plants can belong to multiple categories (Indoor, Outdoor, Succulent, Air Purifying, etc.)

### 🔍 Search & Filter
- **Smart Search**: Case-insensitive search by plant name and category keywords
- **Advanced Filtering**: Filter by category, availability, care level, water needs, light needs, and price range
- **Real-time Results**: Instant search results with debounced input handling

### ➕ Add Plant (Admin Feature)
- **Comprehensive Form**: Add new plants with all required fields and validation
- **Category Selection**: Multi-category selection with visual feedback
- **Form Validation**: Client-side and server-side validation for data integrity
- **Rich Input Fields**: Support for various data types including checkboxes, selects, and number inputs

### 📱 Responsive Design
- **Mobile-First Approach**: Optimized for all device sizes
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### 🚀 Performance & Scalability
- **Optimized API**: RESTful API with pagination, filtering, and search
- **Database Indexing**: MongoDB indexes for fast queries
- **Caching**: React Query for efficient data fetching and caching
- **Compression**: Gzip compression for faster response times

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Rate Limiting** - API rate limiting for security
- **Compression** - Response compression

## 📁 Project Structure

```
Urvann-Assignment/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   └── index.html          # HTML template
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Urvann-Assignment
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp env.example .env
   # Edit .env with your MongoDB connection string
   
   # Start the server
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Seed the database** (optional)
   ```bash
   cd backend
   npm run seed
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=YOUR MONGODB URI
NODE_ENV=development
```

## 📊 Database Schema

### Plant Model
- **Basic Info**: name, price, description, availability
- **Categories**: Array of category references
- **Care Details**: careLevel, waterNeeds, lightNeeds
- **Physical Details**: height, potSize
- **Features**: isPetFriendly, isAirPurifying
- **Timestamps**: createdAt, updatedAt

### Category Model
- **Basic Info**: name, description, icon, color
- **Status**: isActive flag for soft deletion
- **Timestamps**: createdAt, updatedAt

## 🔌 API Endpoints

### Plants
- `GET /api/plants` - Get all plants with pagination and filtering
- `GET /api/plants/:id` - Get single plant by ID
- `POST /api/plants` - Create new plant
- `PUT /api/plants/:id` - Update plant
- `DELETE /api/plants/:id` - Delete plant
- `GET /api/plants/search` - Advanced search with filters

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Soft delete category

## 🎨 UI Components

### Reusable Components
- **PlantCard**: Displays plant information in grid/list views
- **FilterSidebar**: Advanced filtering options
- **LoadingSpinner**: Loading states with customizable sizes
- **Layout**: Main layout with header, navigation, and footer

### Pages
- **HomePage**: Landing page with hero section and featured plants
- **PlantCatalogPage**: Main catalog with search, filters, and pagination
- **AddPlantPage**: Admin form for adding new plants
- **PlantDetailPage**: Detailed view of individual plants
- **NotFoundPage**: 404 error page

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Helmet.js for security headers
- **CORS Configuration**: Proper CORS setup for production
- **Data Sanitization**: Input sanitization and validation

## 📱 Responsive Design

- **Mobile-First**: Designed for mobile devices first
- **Breakpoints**: Responsive breakpoints for tablet and desktop
- **Touch-Friendly**: Optimized for touch interactions
- **Flexible Layouts**: Grid and flexbox layouts that adapt to screen size

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Set up reverse proxy (Nginx/Apache)
4. Configure SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, AWS S3)
3. Configure environment variables
4. Set up custom domain and SSL



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

