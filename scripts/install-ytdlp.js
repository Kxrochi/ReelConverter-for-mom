const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Installing yt-dlp...');

try {
    // Check if we're on Railway or local development
    const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production';
    
    if (isRailway) {
        // On Railway, install yt-dlp using apt
        console.log('Installing yt-dlp via apt (Railway environment)...');
        try {
            execSync('apt-get update', { stdio: 'inherit' });
            execSync('apt-get install -y yt-dlp', { stdio: 'inherit' });
        } catch (error) {
            console.log('apt-get failed, trying alternative installation...');
            // Alternative installation method
            execSync('curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp', { stdio: 'inherit' });
            execSync('chmod a+rx /usr/local/bin/yt-dlp', { stdio: 'inherit' });
        }
    } else {
        // On local development, try to install via pip
        console.log('Installing yt-dlp via pip (local development)...');
        try {
            execSync('pip install yt-dlp', { stdio: 'inherit' });
        } catch (error) {
            console.log('pip install failed, trying pip3...');
            execSync('pip3 install yt-dlp', { stdio: 'inherit' });
        }
    }
    
    // Verify installation
    try {
        const version = execSync('yt-dlp --version', { encoding: 'utf8' }).trim();
        console.log(`✅ yt-dlp installed successfully! Version: ${version}`);
    } catch (error) {
        console.log('⚠️  yt-dlp installation verification failed, but continuing...');
    }
    
} catch (error) {
    console.log('⚠️  yt-dlp installation failed:', error.message);
    console.log('The application will still work, but downloads may not function properly.');
    console.log('Please install yt-dlp manually: https://github.com/yt-dlp/yt-dlp');
}
