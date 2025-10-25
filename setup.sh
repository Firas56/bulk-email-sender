#!/bin/bash

# Bulk Email Sender Setup Script
# This script helps set up the development environment

echo "🚀 Bulk Email Sender Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL (v8 or higher) first."
    echo "   Visit: https://dev.mysql.com/downloads/"
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd Backend
if npm install; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
if npm install; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create .env file if it doesn't exist
if [ ! -f "Backend/.env" ]; then
    echo "📝 Creating .env file..."
    cp Backend/env.example Backend/.env
    echo "✅ .env file created from template"
    echo "⚠️  Please edit Backend/.env with your database credentials"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit Backend/.env with your database credentials"
echo "2. Create MySQL database: CREATE DATABASE bulk_email_sender;"
echo "3. Run database migrations: cd Backend && npx sequelize-cli db:migrate"
echo "4. Start the application:"
echo "   - Backend: cd Backend && npm start"
echo "   - Frontend: cd frontend && ng serve"
echo ""
echo "📚 For detailed instructions, see README.md"
echo "🐛 For issues, visit: https://github.com/yourusername/bulk-email-sender/issues"
