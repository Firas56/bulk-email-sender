@echo off
REM Bulk Email Sender Setup Script for Windows
REM This script helps set up the development environment

echo 🚀 Bulk Email Sender Setup Script
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher) first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MySQL is not installed. Please install MySQL (v8 or higher) first.
    echo    Visit: https://dev.mysql.com/downloads/
)

echo 📦 Installing dependencies...

REM Install backend dependencies
echo Installing backend dependencies...
cd Backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully

cd ..

REM Create .env file if it doesn't exist
if not exist "Backend\.env" (
    echo 📝 Creating .env file...
    copy "Backend\env.example" "Backend\.env" >nul
    echo ✅ .env file created from template
    echo ⚠️  Please edit Backend\.env with your database credentials
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Edit Backend\.env with your database credentials
echo 2. Create MySQL database: CREATE DATABASE bulk_email_sender;
echo 3. Run database migrations: cd Backend ^&^& npx sequelize-cli db:migrate
echo 4. Start the application:
echo    - Backend: cd Backend ^&^& npm start
echo    - Frontend: cd frontend ^&^& ng serve
echo.
echo 📚 For detailed instructions, see README.md
echo 🐛 For issues, visit: https://github.com/yourusername/bulk-email-sender/issues
echo.
pause
