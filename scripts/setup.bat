@echo off
REM AI Travel Planner Setup Script for Windows

echo ===================================
echo AI Travel Planner Setup
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 20+ first.
    exit /b 1
)

echo OK Node.js version:
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X npm is not installed.
    exit /b 1
)

echo OK npm version:
npm --version
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install root dependencies
    exit /b 1
)

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install frontend dependencies
    exit /b 1
)
cd ..

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install backend dependencies
    exit /b 1
)
cd ..

echo.
echo ===================================
echo OK Setup completed successfully!
echo ===================================
echo.
echo Next steps:
echo 1. Configure environment variables:
echo    - Copy backend\.env.example to backend\.env
echo    - Copy frontend\.env.example to frontend\.env
echo    - Fill in your API keys and configuration
echo.
echo 2. Set up Supabase database:
echo    - Create a Supabase project
echo    - Run database\schema.sql in the SQL editor
echo.
echo 3. Start the development server:
echo    npm run dev
echo.
echo For more information, see README.md

pause

