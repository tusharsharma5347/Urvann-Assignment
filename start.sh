#!/bin/bash

echo "🌱 Starting Urvann Plant Store..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Make sure MongoDB is installed and running."
    echo "   You can use MongoDB Atlas as an alternative."
fi

# Install dependencies if node_modules don't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start the development servers
echo "🚀 Starting development servers..."
echo "   Backend will run on http://localhost:5000"
echo "   Frontend will run on http://localhost:3000"
echo "   Press Ctrl+C to stop all servers"
echo ""

npm run dev
