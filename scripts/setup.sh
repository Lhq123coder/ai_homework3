#!/bin/bash

# AI Travel Planner Setup Script

set -e

echo "==================================="
echo "AI Travel Planner Setup"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "==================================="
echo "✅ Setup completed successfully!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Configure environment variables:"
echo "   - Copy backend/.env.example to backend/.env"
echo "   - Copy frontend/.env.example to frontend/.env"
echo "   - Fill in your API keys and configuration"
echo ""
echo "2. Set up Supabase database:"
echo "   - Create a Supabase project"
echo "   - Run database/schema.sql in the SQL editor"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "For more information, see README.md"

