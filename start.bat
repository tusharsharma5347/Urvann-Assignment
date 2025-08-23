@echo off
echo 🌱 Starting Urvann Plant Store...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies if node_modules don't exist
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend && npm install && cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

REM Start the development servers
echo 🚀 Starting development servers...
echo    Backend will run on http://localhost:5000
echo    Frontend will run on http://localhost:3000
echo    Press Ctrl+C to stop all servers
echo.

npm run dev

pause
