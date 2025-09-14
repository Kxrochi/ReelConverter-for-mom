# Instagram Web Downloader

A mobile-friendly web application for downloading Instagram Reels, Videos, and Posts. Built with Flask and designed to work perfectly on iOS devices.

## Features

- 📱 **Mobile-First Design**: Optimized for iOS Safari and mobile browsers
- 🎥 **Download Videos**: Get Instagram Reels and Posts as MP4 files
- 🎵 **Extract Audio**: Download audio tracks as MP3 files
- 🖼️ **Save Thumbnails**: Download video thumbnails as JPG files
- 📝 **Get Captions**: Extract post captions as text files
- 🔄 **Dual Engines**: Choose between instaloader and yt-dlp
- ⚡ **Real-time Progress**: Live download status updates
- 📦 **Batch Downloads**: Download multiple file types at once

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Option 2: Deploy via GitHub

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a Python app and deploy it

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Upload the project folder
4. Vercel will handle the deployment

## Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the app:
   ```bash
   python app.py
   ```

3. Open http://localhost:5000 in your browser

## Usage

1. **Paste Instagram URL**: Enter any Instagram Reel or Post URL
2. **Select Options**: Choose what you want to download
3. **Pick Engine**: Select instaloader or yt-dlp
4. **Start Download**: Click the download button
5. **Get Files**: Download your files when ready

## Supported URL Formats

- `https://www.instagram.com/reels/ABC123/`
- `https://www.instagram.com/reel/ABC123/`
- `https://www.instagram.com/p/ABC123/`
- `https://instagram.com/reels/ABC123/` (without www)

## Mobile Usage

This app is specifically designed for mobile devices:

- **iOS Safari**: Works perfectly on iPhones and iPads
- **Android Chrome**: Compatible with Android browsers
- **Responsive Design**: Adapts to any screen size
- **Touch-Friendly**: Optimized for touch interactions

## Technical Details

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Download Engines**: instaloader, yt-dlp
- **Deployment**: Vercel (Serverless)
- **File Processing**: PIL, requests

## License

MIT License - Feel free to use and modify!
