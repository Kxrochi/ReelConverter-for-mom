# 🚀 Deploy to Vercel - Quick Guide

## Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from this folder:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - Project name: **instagram-downloader** (or any name you like)
   - Directory: **./** (current directory)
   - Override settings? **N**

## Method 2: GitHub + Vercel

1. **Create a GitHub repository:**
   - Go to GitHub.com
   - Click "New repository"
   - Name it "instagram-downloader"
   - Make it public
   - Don't initialize with README

2. **Push this code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/instagram-downloader.git
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Python and deploy

## Method 3: Direct Upload

1. **Zip this folder:**
   - Select all files in `instagram-web-downloader`
   - Create a ZIP file

2. **Upload to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Upload the ZIP file
   - Vercel will handle the rest

## After Deployment

Your app will be available at:
`https://your-app-name.vercel.app`

## Testing on iOS

1. **Open Safari on your iPhone/iPad**
2. **Go to your Vercel URL**
3. **Add to Home Screen** (optional):
   - Tap the Share button
   - Select "Add to Home Screen"
   - Now it works like a native app!

## Features Available

✅ **Mobile-optimized interface**  
✅ **Instagram URL validation**  
✅ **Multiple download options**  
✅ **Real-time progress tracking**  
✅ **File downloads**  
✅ **Works on iOS Safari**  

## Troubleshooting

If deployment fails:
1. Check that all files are in the root directory
2. Ensure `requirements.txt` is present
3. Make sure `vercel.json` is configured correctly
4. Check Vercel logs for specific errors

## Support

If you need help:
1. Check Vercel deployment logs
2. Test locally first: `python app.py`
3. Verify all dependencies are installed
