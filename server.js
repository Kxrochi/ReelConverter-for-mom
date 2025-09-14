const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

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
        const python = spawn('python', ['--version']);
        python.on('close', (code) => {
            if (code === 0) {
                // Check if yt-dlp is installed
                const ytdlp = spawn('python', ['-c', 'import yt_dlp; print("yt-dlp available")']);
                ytdlp.on('close', (ytdlpCode) => {
                    resolve(ytdlpCode === 0);
                });
                ytdlp.on('error', () => resolve(false));
            } else {
                resolve(false);
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
        const python = spawn('python', [
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
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Downloads directory: ${downloadsDir}`);
});
