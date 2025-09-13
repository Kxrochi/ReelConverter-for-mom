# 🔧 Railway Deployment Troubleshooting

## Common Issues and Solutions

### Issue: "Using Detected Dockerfile" Error

**Problem**: Railway is trying to use a Dockerfile instead of nixpacks.

**Solution**: 
1. Make sure there's no `Dockerfile` in your repository
2. Ensure `nixpacks.toml` is present
3. Verify `railway.json` specifies `"builder": "NIXPACKS"`

### Issue: "curl: not found" Error

**Problem**: The base image doesn't have curl installed.

**Solution**: 
- This is fixed by using nixpacks instead of Dockerfile
- nixpacks handles all dependencies automatically

### Issue: Python/Node.js Not Found

**Problem**: The build environment doesn't have the required tools.

**Solution**: 
- nixpacks.toml specifies both Python 3.11 and Node.js 18
- Railway will install these automatically

## ✅ Current Configuration

Your app is configured with:

```toml
# nixpacks.toml
[phases.setup]
nixPkgs = ["python311", "python311Packages.pip", "nodejs_18", "npm"]

[phases.install]
cmds = [
  "pip install -r requirements.txt",
  "npm install"
]

[start]
cmd = "npm start"
```

## 🚀 Deployment Steps

1. **Remove any Dockerfile** (if present)
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Fix Railway deployment configuration"
   git push origin main
   ```
3. **Redeploy on Railway**:
   - Go to your Railway project
   - Click "Redeploy" or push new changes
   - Railway will use nixpacks automatically

## 🔍 Debugging

### Check Build Logs
1. Go to Railway dashboard
2. Click on your project
3. Click on the service
4. View "Deployments" tab
5. Click on the latest deployment
6. Check the build logs

### Common Build Issues

1. **"No package.json found"**
   - Make sure package.json is in the root directory
   - Check that it's committed to git

2. **"Python not found"**
   - nixpacks should install Python automatically
   - Check that requirements.txt exists

3. **"yt-dlp not found"**
   - Verify requirements.txt contains `yt-dlp>=2023.12.30`
   - Check that pip install runs successfully

## 📞 Getting Help

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Check Railway status: [status.railway.app](https://status.railway.app)

## 🎯 Success Indicators

Your deployment is successful when you see:
- ✅ Build completes without errors
- ✅ App starts and shows "Server is running"
- ✅ Health check at `/health` returns 200
- ✅ You can access the web interface

**Happy deploying! 🚀**
