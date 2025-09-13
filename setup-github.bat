@echo off
echo ========================================
echo  GitHub Setup for Global Deployment
echo ========================================
echo.

echo This script will help you set up GitHub for deployment.
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from https://git-scm.com
    pause
    exit /b 1
)

echo ✓ Git found
echo.

REM Initialize git repository
echo Initializing Git repository...
git init

REM Add all files
echo Adding files to Git...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: Instagram Reel Downloader"

echo.
echo ========================================
echo  Next Steps
echo ========================================
echo.
echo 1. Go to https://github.com
echo 2. Create a new repository
echo 3. Copy the repository URL
echo 4. Run these commands:
echo.
echo    git remote add origin YOUR_REPO_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo 5. Then use deploy-global.bat to deploy!
echo.
echo Repository ready for deployment!
pause
