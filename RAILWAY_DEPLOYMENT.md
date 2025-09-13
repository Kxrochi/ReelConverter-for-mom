# 🚀 Railway Deployment Guide

## Deploy Your Instagram Reel Downloader to Railway

This guide will help you deploy your Instagram Reel Downloader to Railway, a modern cloud platform.

## 📋 Prerequisites

- GitHub account
- Railway account (free at [railway.app](https://railway.app))
- Your code pushed to a GitHub repository

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Make sure all files are committed to your GitHub repository:

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 2. Deploy to Railway

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Deployment**
   - Railway will automatically detect it's a Node.js project
   - The `nixpacks.toml` file will handle Python and yt-dlp installation
   - No additional configuration needed!

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Your app will be live!

## 🔧 Configuration Files

The following files are included for Railway deployment:

- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Build configuration for Python + Node.js
- `Procfile` - Process definition
- `requirements.txt` - Python dependencies
- `.dockerignore` - Files to exclude from build

## 🌐 Access Your App

Once deployed, Railway will provide you with:
- A public URL (e.g., `https://your-app-name.railway.app`)
- Automatic HTTPS
- Custom domain support (Pro plan)

## 📊 Monitoring

Railway provides:
- Real-time logs
- Resource usage monitoring
- Automatic restarts on failure
- Health checks

## 🔒 Environment Variables

Railway automatically sets:
- `PORT` - The port your app should listen on
- `NODE_ENV` - Set to "production"

## 💰 Pricing

- **Free Tier**: 500 hours/month, 1GB RAM, 1GB storage
- **Pro Plan**: $5/month for unlimited usage

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check the logs in Railway dashboard
   - Ensure all files are committed to GitHub

2. **App Won't Start**
   - Verify the PORT environment variable is used
   - Check that yt-dlp is installed correctly

3. **Downloads Not Working**
   - Instagram may block cloud IPs
   - Consider using a proxy or different approach

### Logs

View logs in Railway dashboard:
- Go to your project
- Click on the service
- View "Deployments" tab
- Click on a deployment to see logs

## 🎯 Production Tips

1. **Set up monitoring** - Use Railway's built-in monitoring
2. **Configure custom domain** - Add your own domain
3. **Set up CI/CD** - Automatic deployments on git push
4. **Monitor usage** - Keep track of your free tier usage

## 🆘 Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- GitHub Issues: Create an issue in your repository

## 🎉 Success!

Once deployed, your Instagram Reel Downloader will be available worldwide at your Railway URL!

**Happy deploying! 🚀**
