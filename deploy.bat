@echo off
echo ========================================
echo  Instagram Reel Downloader - Deploy
echo ========================================
echo.

echo Starting deployment process...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo ✓ Node.js found
echo ✓ Python found
echo.

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

REM Install yt-dlp
echo Installing yt-dlp...
pip install yt-dlp
if %errorlevel% neq 0 (
    echo ERROR: Failed to install yt-dlp
    pause
    exit /b 1
)

echo.
echo ✓ All dependencies installed successfully!
echo.

REM Start the server
echo Starting Instagram Reel Downloader...
echo.
echo The server will be accessible from:
echo   - Your computer: http://localhost:3000
echo   - Your phone: http://[YOUR_IP]:3000
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js
