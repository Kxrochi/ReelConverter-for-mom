# Instagram Reel Downloader

A modern, responsive Instagram Reel downloader built with yt-dlp and Express.js, specifically designed for deployment on Railway. Download Instagram Reels, posts, and IGTV videos quickly and easily.

## 🚀 Features

- **High Quality Downloads**: Download Instagram Reels in the highest available quality
- **Multiple Format Support**: Supports Reels, posts, IGTV, and Stories
- **yt-dlp Powered**: Uses the powerful yt-dlp library for reliable downloads
- **Modern Design**: Clean, responsive UI with Instagram-inspired styling
- **Railway Ready**: Pre-configured for seamless deployment on Railway
- **Express.js Server**: Robust backend with security and performance optimizations
- **Mobile Responsive**: Works perfectly on all devices
- **No Registration**: Download without creating an account
- **Secure**: No data collection or storage of personal information
- **Fast Downloads**: Optimized for speed and reliability

## 📁 Project Structure

```
├── index.html              # Main HTML file
├── styles.css              # CSS styles
├── script.js               # JavaScript functionality
├── server.js               # Express.js server
├── package.json            # Node.js dependencies
├── railway.json            # Railway configuration
├── Procfile               # Process file for Railway
├── .gitignore             # Git ignore file
├── scripts/
│   └── install-ytdlp.js   # yt-dlp installation script
├── downloads/             # Downloaded files directory
└── README.md              # This file
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Download Engine**: yt-dlp
- **Security**: Helmet.js, CORS
- **Performance**: Compression middleware
- **File Management**: fs-extra
- **Deployment**: Railway platform

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd railway-website-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🚂 Railway Deployment

### Method 1: Deploy from GitHub

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign in with your GitHub account
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect the Node.js app and deploy it

### Method 2: Deploy with Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize and deploy**
   ```bash
   railway init
   railway up
   ```

### Method 3: Deploy from Railway Dashboard

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo" or "Deploy from template"
4. Follow the deployment wizard

## ⚙️ Configuration

### Environment Variables

The application uses the following environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### Railway Configuration

The `railway.json` file contains Railway-specific configuration:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 📡 API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/info` - Application information
- `POST /api/download` - Download Instagram content
- `POST /api/contact` - Contact form submission
- `GET /downloads/*` - Serve downloaded files

## 🎨 Customization

### Styling

- Edit `styles.css` to modify the appearance
- The design uses Instagram-inspired colors and gradients
- Responsive breakpoints are defined for mobile, tablet, and desktop

### Content

- Update `index.html` to change the content
- Modify the hero section, features, about, and help sections
- Update the navigation menu as needed

### Functionality

- Add new features in `script.js`
- Create new API endpoints in `server.js`
- Modify download behavior in the `/api/download` endpoint
- Add new pages by creating additional HTML files

### Download Settings

- Modify yt-dlp options in `server.js`
- Change output format and quality settings
- Adjust file cleanup intervals

## 🔧 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (none configured yet)

### Adding Dependencies

```bash
npm install <package-name>
```

### Database Integration

To add a database:

1. Install your preferred database driver
2. Add connection configuration
3. Create models and migrations
4. Update API endpoints to use the database

## 🚀 Performance Optimization

The downloader includes several performance optimizations:

- **Compression**: Gzip compression for all responses
- **Caching**: Static file caching with appropriate headers
- **Security**: Helmet.js for security headers
- **CORS**: Proper CORS configuration
- **Error Handling**: Comprehensive error handling
- **File Cleanup**: Automatic cleanup of old downloaded files
- **yt-dlp Optimization**: Efficient video processing and downloading

## 🔒 Security

Security features included:

- Helmet.js for security headers
- CORS configuration
- Input validation and URL sanitization
- Error handling without sensitive data exposure
- File cleanup to prevent storage abuse
- Instagram URL validation
- No data collection or storage

## 📱 Mobile Responsive

The downloader is fully responsive with:

- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly navigation and download buttons
- Optimized for mobile Instagram usage
- Smooth animations and transitions
- Instagram-inspired UI design

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the PORT environment variable
   - Kill the process using the port

2. **Dependencies not installing**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and package-lock.json, then reinstall

3. **Railway deployment fails**
   - Check the Railway logs
   - Ensure all dependencies are in package.json
   - Verify the start command in package.json
   - Check if yt-dlp is properly installed

4. **Download fails**
   - Verify the Instagram URL is correct
   - Check if the content is public
   - Ensure yt-dlp is properly installed
   - Check server logs for error details

### Getting Help

- Check the [Railway Documentation](https://docs.railway.app)
- Review the [Express.js Documentation](https://expressjs.com)
- Check the [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)
- Open an issue in this repository

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you have any questions or need help:

- Open an issue in this repository
- Check the Railway documentation
- Contact the maintainers

## 🎉 Acknowledgments

- [Railway](https://railway.app) for the amazing deployment platform
- [Express.js](https://expressjs.com) for the web framework
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for the powerful download engine
- [Font Awesome](https://fontawesome.com) for the icons
- [Google Fonts](https://fonts.google.com) for the typography

---

**Happy downloading! 📱**

Built with ❤️ for the Instagram community.

## ⚠️ Legal Notice

This tool is for personal use only. Please respect Instagram's Terms of Service and copyright laws. The developers are not responsible for any misuse of this application.
