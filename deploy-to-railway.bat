@echo off
echo Deploying Instagram Reel Downloader to Railway...
echo.

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git is not installed or not in PATH.
    echo Please install Git from https://git-scm.com
    pause
    exit /b 1
)

REM Check if we're in a git repository
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit for Railway deployment"
    echo.
    echo Please add a remote repository and push your code:
    echo git remote add origin YOUR_GITHUB_REPO_URL
    echo git push -u origin main
    echo.
    echo Then deploy to Railway at https://railway.app
    pause
    exit /b 0
)

echo Adding all files to git...
git add .

echo Committing changes...
git commit -m "Update for Railway deployment"

echo.
echo Ready to deploy! Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Go to https://railway.app
echo 3. Create new project from GitHub repo
echo 4. Deploy!
echo.
pause
