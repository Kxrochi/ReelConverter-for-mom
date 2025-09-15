const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3000;

// Create downloads directory
const downloadsDir = path.join(__dirname, 'downloads');
fs.ensureDirSync(downloadsDir);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.railway.app'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// Serve downloads directory
app.use('/downloads', express.static(downloadsDir));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// yt-dlp health check endpoint
app.get('/api/ytdlp-check', async (req, res) => {
    try {
        const { stdout } = await execAsync('yt-dlp --version');
        res.json({
            status: 'OK',
            ytdlp_version: stdout.trim(),
            message: 'yt-dlp is working correctly'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'yt-dlp is not available',
            error: error.message
        });
    }
});

app.get('/api/info', (req, res) => {
    res.json({
        name: 'Instagram Reel Downloader',
        version: '1.0.0',
        description: 'Download Instagram Reels, posts, and IGTV videos easily',
        features: [
            'High Quality Downloads',
            'Multiple Format Support',
            'Fast & Secure',
            'Mobile Responsive',
            'No Registration Required',
            'yt-dlp Powered'
        ]
    });
});

// Instagram download endpoint
app.post('/api/download', async (req, res) => {
    try {
        console.log('Download endpoint hit');
        console.log('Request body:', req.body);
        
        const { url } = req.body;
        
        // Validate URL
        if (!url) {
            console.log('No URL provided');
            return res.status(400).json({
                success: false,
                message: 'URL is required'
            });
        }
        
        // Validate Instagram URL
        const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+\/?/;
        if (!instagramRegex.test(url)) {
            console.log('Invalid Instagram URL:', url);
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid Instagram URL'
            });
        }
        
        console.log('Download request for URL:', url);
        
        // Generate unique filename
        const timestamp = Date.now();
        const outputTemplate = path.join(downloadsDir, `%(title)s_${timestamp}.%(ext)s`);
        
        // yt-dlp command with caption extraction
        const command = `yt-dlp --no-playlist --write-info-json --write-sub --sub-langs "en" --output "${outputTemplate}" "${url}"`;
        
        try {
            // Check if yt-dlp is available
            try {
                await execAsync('yt-dlp --version');
            } catch (error) {
                console.log('yt-dlp not found, trying alternative installation...');
                try {
                    await execAsync('pip install yt-dlp');
                } catch (pipError) {
                    console.log('pip install failed, trying direct download...');
                    await execAsync('curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /tmp/yt-dlp && chmod +x /tmp/yt-dlp');
                    // Use the downloaded version
                    const commandWithPath = command.replace('yt-dlp', '/tmp/yt-dlp');
                    const { stdout, stderr } = await execAsync(commandWithPath);
                    console.log('yt-dlp stdout:', stdout);
                    if (stderr) console.log('yt-dlp stderr:', stderr);
                }
            }
            
            // Execute yt-dlp command
            const { stdout, stderr } = await execAsync(command);
            console.log('yt-dlp stdout:', stdout);
            if (stderr) console.log('yt-dlp stderr:', stderr);
            
            // Find downloaded files
            const files = await fs.readdir(downloadsDir);
            const downloadedFiles = files.filter(file => file.includes(timestamp.toString()));
            
            if (downloadedFiles.length === 0) {
                throw new Error('No files were downloaded');
            }
            
            // Process downloaded files
            const results = [];
            let caption = '';
            let title = '';
            
            // Try to extract caption from info.json file
            try {
                const infoFiles = downloadedFiles.filter(f => f.endsWith('.info.json'));
                if (infoFiles.length > 0) {
                    const infoPath = path.join(downloadsDir, infoFiles[0]);
                    const infoData = await fs.readJson(infoPath);
                    
                    // Extract caption from metadata
                    if (infoData.description) {
                        caption = infoData.description;
                    } else if (infoData.title) {
                        caption = infoData.title;
                    }
                    
                    // Extract title
                    if (infoData.title) {
                        title = infoData.title;
                    } else if (infoData.uploader) {
                        title = `Video by ${infoData.uploader}`;
                    }
                }
            } catch (error) {
                console.log('Could not extract caption from metadata:', error.message);
            }
            
            for (const file of downloadedFiles) {
                const filePath = path.join(downloadsDir, file);
                const stats = await fs.stat(filePath);
                
                // Skip info files and subtitle files
                if (file.endsWith('.info.json') || file.endsWith('.vtt') || file.endsWith('.srt')) continue;
                
                const fileUrl = `/downloads/${file}`;
                const fileSize = formatFileSize(stats.size);
                
                results.push({
                    title: title || file.replace(/\.[^/.]+$/, ''), // Remove extension
                    downloadUrl: fileUrl,
                    size: fileSize,
                    quality: 'High',
                    filename: file,
                    caption: caption || 'No caption available'
                });
            }
            
            // Clean up old files (older than 1 hour)
            await cleanupOldFiles();
            
            res.json({
                success: true,
                videos: results,
                message: 'Download completed successfully'
            });
            
        } catch (error) {
            console.error('yt-dlp error:', error);
            throw new Error('Failed to download video. Please check the URL and try again.');
        }
        
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Download failed. Please try again later.'
        });
    }
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to clean up old files
async function cleanupOldFiles() {
    try {
        const files = await fs.readdir(downloadsDir);
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const file of files) {
            const filePath = path.join(downloadsDir, file);
            const stats = await fs.stat(filePath);
            
            if (stats.mtime.getTime() < oneHourAgo) {
                await fs.remove(filePath);
                console.log('Cleaned up old file:', file);
            }
        }
    } catch (error) {
        console.error('Cleanup error:', error);
    }
}

// Contact form submission endpoint
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }
        
        // In a real application, you would:
        // 1. Save to database
        // 2. Send email notification
        // 3. Add to CRM system
        
        console.log('Contact form submission:', { name, email, message });
        
        res.json({
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.'
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
📱 Instagram Reel Downloader Server Started!
   
   📍 Server running on port ${PORT}
   🌐 Environment: ${process.env.NODE_ENV || 'development'}
   🔗 Local: http://localhost:${PORT}
   📊 Health check: http://localhost:${PORT}/api/health
   📁 Downloads: http://localhost:${PORT}/downloads
   
   Ready to download Instagram content! 🎉
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
