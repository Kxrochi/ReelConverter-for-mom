const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create downloads directory
const downloadsDir = path.join(__dirname, 'downloads');
fs.ensureDirSync(downloadsDir);

// Function to validate Instagram URL
function isValidInstagramURL(url) {
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/?/;
    return instagramRegex.test(url);
}

// Function to check if yt-dlp is available
function checkYtDlpAvailable() {
    return new Promise((resolve) => {
        // Try python3 first (common in cloud environments)
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
        const python = spawn(pythonCmd, ['--version']);
        python.on('close', (code) => {
            if (code === 0) {
                // Check if yt-dlp is installed
                const ytdlp = spawn(pythonCmd, ['-c', 'import yt_dlp; print("yt-dlp available")']);
                ytdlp.on('close', (ytdlpCode) => {
                    resolve(ytdlpCode === 0);
                });
                ytdlp.on('error', () => resolve(false));
            } else {
                // Try python as fallback
                const pythonFallback = spawn('python', ['--version']);
                pythonFallback.on('close', (fallbackCode) => {
                    if (fallbackCode === 0) {
                        const ytdlp = spawn('python', ['-c', 'import yt_dlp; print("yt-dlp available")']);
                        ytdlp.on('close', (ytdlpCode) => {
                            resolve(ytdlpCode === 0);
                        });
                        ytdlp.on('error', () => resolve(false));
                    } else {
                        resolve(false);
                    }
                });
                pythonFallback.on('error', () => resolve(false));
            }
        });
        python.on('error', () => resolve(false));
    });
}

// Function to download Instagram reel using yt-dlp
async function downloadInstagramReel(instagramURL) {
    return new Promise((resolve, reject) => {
        console.log('Starting download with yt-dlp...');
        
        // Use our Python script
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
        const python = spawn(pythonCmd, [
            path.join(__dirname, 'yt-dlp-downloader.py'),
            instagramURL,
            downloadsDir
        ]);

        let output = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => {
            output += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        python.on('close', (code) => {
            try {
                const result = JSON.parse(output);
                if (result.success) {
                    console.log('Download successful:', result.filename);
                    resolve(result);
                } else {
                    console.error('Download failed:', result.error);
                    reject(new Error(result.error));
                }
            } catch (e) {
                console.error('Failed to parse yt-dlp output:', errorOutput);
                reject(new Error('Failed to download video: ' + errorOutput));
            }
        });

        python.on('error', (error) => {
            console.error('Python process error:', error);
            reject(new Error('Failed to start download process: ' + error.message));
        });

        // Set timeout
        setTimeout(() => {
            python.kill();
            reject(new Error('Download timeout'));
        }, 300000); // 5 minutes
    });
}

// API endpoint to download Instagram reel
app.post('/api/download', async (req, res) => {
    try {
        const { url } = req.body;
        console.log('Download request for URL:', url);

        if (!url || !isValidInstagramURL(url)) {
            console.log('Invalid URL provided:', url);
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid Instagram reel URL'
            });
        }

        console.log('URL is valid, checking yt-dlp availability...');
        
        // Check if yt-dlp is available
        const ytdlpAvailable = await checkYtDlpAvailable();
        if (!ytdlpAvailable) {
            return res.status(500).json({
                success: false,
                error: 'yt-dlp is not installed. Please run install-yt-dlp.bat to install it first.'
            });
        }

        console.log('yt-dlp is available, starting download...');
        
        // Download video using yt-dlp
        const result = await downloadInstagramReel(url);

        console.log('Video downloaded successfully:', result.filename);

        res.json({
            success: true,
            message: 'Video downloaded successfully',
            filename: result.filename,
            downloadUrl: `/downloads/${result.filename}`,
            size: result.size
        });

    } catch (error) {
        console.error('Download error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'An error occurred while downloading the video'
        });
    }
});

// Serve downloaded files
app.use('/downloads', express.static(downloadsDir));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, HOST, () => {
    if (NODE_ENV === 'production') {
        console.log(`🚀 Instagram Reel Downloader is live!`);
        console.log(`🌐 Global access: https://your-app.railway.app`);
        console.log(`📱 Access from anywhere in the world!`);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Network access: http://${getLocalIPAddress()}:${PORT}`);
        console.log(`Downloads directory: ${downloadsDir}`);
        console.log(`\n📱 To access from your phone:`);
        console.log(`   1. Make sure your phone is on the same WiFi network`);
        console.log(`   2. Open browser and go to: http://${getLocalIPAddress()}:${PORT}`);
        console.log(`   3. Start downloading Instagram reels!`);
    }
});

// Function to get local IP address
function getLocalIPAddress() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}
