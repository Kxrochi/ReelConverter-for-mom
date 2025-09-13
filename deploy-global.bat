@echo off
echo ========================================
echo  Instagram Reel Downloader - Global Deploy
echo ========================================
echo.

echo This script will help you deploy your app globally!
echo Your app will be accessible from ANY network worldwide.
echo.

echo Choose your deployment platform:
echo 1. Railway (Recommended - Free tier)
echo 2. Render (Free tier)
echo 3. Heroku (Paid)
echo 4. Manual instructions
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto render
if "%choice%"=="3" goto heroku
if "%choice%"=="4" goto manual
goto invalid

:railway
echo.
echo ========================================
echo  Deploying to Railway
echo ========================================
echo.
echo 1. Go to https://railway.app
echo 2. Sign up with GitHub
echo 3. Click "New Project"
echo 4. Select "Deploy from GitHub repo"
echo 5. Choose your repository
echo 6. Railway will auto-deploy!
echo.
echo Your app will be available at: https://your-app.railway.app
echo.
goto end

:render
echo.
echo ========================================
echo  Deploying to Render
echo ========================================
echo.
echo 1. Go to https://render.com
echo 2. Sign up with GitHub
echo 3. Click "New Web Service"
echo 4. Connect your GitHub repo
echo 5. Build Command: npm install
echo 6. Start Command: node server.js
echo 7. Click "Create Web Service"
echo.
echo Your app will be available at: https://your-app.onrender.com
echo.
goto end

:heroku
echo.
echo ========================================
echo  Deploying to Heroku
echo ========================================
echo.
echo 1. Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
echo 2. Run: heroku login
echo 3. Run: heroku create your-app-name
echo 4. Run: git push heroku main
echo.
echo Your app will be available at: https://your-app-name.herokuapp.com
echo.
goto end

:manual
echo.
echo ========================================
echo  Manual Deployment Instructions
echo ========================================
echo.
echo See GLOBAL_DEPLOYMENT.md for detailed instructions
echo.
goto end

:invalid
echo Invalid choice. Please run the script again.
goto end

:end
echo.
echo ========================================
echo  Next Steps
echo ========================================
echo.
echo 1. Deploy using the instructions above
echo 2. Get your app URL (e.g., https://your-app.railway.app)
echo 3. Share the URL with anyone!
echo 4. Access from any device, anywhere in the world!
echo.
echo For detailed instructions, see GLOBAL_DEPLOYMENT.md
echo.
pause
