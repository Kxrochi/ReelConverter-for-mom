@echo off
echo Installing yt-dlp for Instagram Reel Downloader...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo Python found. Installing yt-dlp...
pip install yt-dlp

if %errorlevel% neq 0 (
    echo Failed to install yt-dlp.
    pause
    exit /b 1
)

echo.
echo yt-dlp installed successfully!
echo You can now use the Instagram Reel Downloader.
pause
