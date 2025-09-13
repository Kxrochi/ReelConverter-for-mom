# Instagram Reel Downloader

A modern web application that allows you to download Instagram reels by simply pasting the URL. Built with Node.js, Express, and powered by yt-dlp for reliable downloading.

## Features

- 🎬 Download Instagram reels with just a URL
- 📱 Responsive design that works on all devices
- ⚡ Fast and efficient downloading using yt-dlp
- 🎨 Modern, Instagram-inspired UI
- 🔒 Secure and private (no data stored)
- 📁 Automatic file organization
- 🛠️ Dual-engine approach for maximum reliability

## Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.6 or higher) - Required for yt-dlp
- **yt-dlp** - Will be installed automatically

## Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd instagram-reel-downloader
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install yt-dlp (Python)**
   - **Windows**: Double-click `install-yt-dlp.bat`
   - **Mac/Linux**: Run `pip install yt-dlp`

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

1. Open the web application in your browser
2. Paste an Instagram reel URL into the input field
3. Click the "Download" button
4. Wait for the download to complete
5. Click "Download Video" to save the file to your device

### Supported URL Formats

- `https://www.instagram.com/reel/ABC123/`
- `https://www.instagram.com/p/XYZ789/`
- `https://instagram.com/reel/ABC123/` (without www)

## Development

To run in development mode with auto-restart:

```bash
npm run dev
```

## Technical Details

### Backend
- **Node.js** with Express.js
- **yt-dlp** for reliable video downloading
- **Python integration** for advanced downloading capabilities
- **CORS** enabled for cross-origin requests

### Frontend
- **Vanilla JavaScript** (no frameworks)
- **CSS3** with modern features
- **Font Awesome** icons
- **Responsive design**

### How It Works

1. The app validates the Instagram URL format
2. It checks if yt-dlp is available
3. It uses yt-dlp to download the video directly from Instagram
4. It saves the video file to the server
5. It provides a download link to the user

### Why yt-dlp?

- **More reliable** than web scraping approaches
- **Actively maintained** and updated regularly
- **Handles Instagram's anti-bot measures** better
- **Supports multiple formats** and quality options
- **Used by professional tools** like the [insta-downloader-gui](https://github.com/uikraft-hub/insta-downloader-gui)

## File Structure

```
instagram-reel-downloader/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styles
│   └── script.js           # Frontend JavaScript
├── downloads/              # Downloaded videos (auto-created)
├── server.js              # Backend server
├── yt-dlp-downloader.py   # Python script for yt-dlp integration
├── install-yt-dlp.bat     # Windows installation script
├── test-scraping.js       # Debug script (legacy)
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## Important Notes

⚠️ **Legal Disclaimer**: This tool is for educational purposes only. Please respect Instagram's Terms of Service and only download content you have permission to download.

⚠️ **Rate Limiting**: Instagram may rate limit requests. If downloads fail, wait a few minutes before trying again.

⚠️ **Content Rights**: Always respect copyright and only download content you own or have permission to download.

## Troubleshooting

### Common Issues

1. **"yt-dlp is not installed"**
   - Run `install-yt-dlp.bat` (Windows) or `pip install yt-dlp` (Mac/Linux)
   - Make sure Python is installed on your system

2. **"Download failed"**
   - The Instagram post might be private or restricted
   - Try with a different reel
   - Check if the URL is correct
   - The post might have been deleted

3. **"Python not found"**
   - Install Python from https://python.org
   - Make sure Python is added to your system PATH

4. **"Download timeout"**
   - The video might be very large
   - Check your internet connection
   - Try again with a different reel

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify the Instagram URL is correct and public
3. Try with a different reel
4. Check your internet connection

## License

MIT License - feel free to use this project for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Happy downloading! 🎬✨**
