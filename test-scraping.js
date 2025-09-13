// Test script to debug Instagram scraping
const https = require('https');
const http = require('http');
const { URL } = require('url');

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0'
            }
        };

        const client = urlObj.protocol === 'https:' ? https : http;
        
        const req = client.request(options, (res) => {
            let data = '';
            
            // Handle gzip compression
            let stream = res;
            if (res.headers['content-encoding'] === 'gzip') {
                const zlib = require('zlib');
                stream = res.pipe(zlib.createGunzip());
            } else if (res.headers['content-encoding'] === 'deflate') {
                const zlib = require('zlib');
                stream = res.pipe(zlib.createInflate());
            } else if (res.headers['content-encoding'] === 'br') {
                const zlib = require('zlib');
                stream = res.pipe(zlib.createBrotliDecompress());
            }
            
            stream.on('data', (chunk) => {
                data += chunk;
            });
            stream.on('end', () => {
                resolve({ data: data, status: res.statusCode, headers: res.headers });
            });
            stream.on('error', (error) => {
                reject(error);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function testInstagramURL(instagramURL) {
    try {
        console.log('Testing URL:', instagramURL);
        const response = await makeRequest(instagramURL);
        
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers['content-type']);
        console.log('Content-Length:', response.headers['content-length']);
        
        if (response.status !== 200) {
            console.log('Failed to fetch page');
            return;
        }

        // Look for video URL using multiple methods
        let videoURL = null;
        
        console.log('\nSearching for video URL...');
        
        // Method 1: Look for video URL in window._sharedData
        const sharedDataMatch = response.data.match(/window\._sharedData\s*=\s*({.+?});/);
        if (sharedDataMatch) {
            try {
                const data = JSON.parse(sharedDataMatch[1]);
                const videoData = data?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media;
                if (videoData?.video_url) {
                    videoURL = videoData.video_url;
                    console.log('✓ Found video URL in _sharedData');
                }
            } catch (e) {
                console.log('✗ Failed to parse _sharedData');
            }
        } else {
            console.log('✗ No _sharedData found');
        }

        // Method 2: Look for video URL in meta tags
        if (!videoURL) {
            const metaMatch = response.data.match(/<meta\s+property="og:video"\s+content="([^"]+)"/);
            if (metaMatch) {
                videoURL = metaMatch[1];
                console.log('✓ Found video URL in meta tags');
            } else {
                console.log('✗ No video meta tag found');
            }
        }

        // Method 3: Look for video URL in script tags
        if (!videoURL) {
            const scriptMatch = response.data.match(/"video_url":"([^"]+)"/);
            if (scriptMatch) {
                videoURL = scriptMatch[1].replace(/\\u0026/g, '&');
                console.log('✓ Found video URL in script tags');
            } else {
                console.log('✗ No video_url in script tags');
            }
        }

        // Method 4: Look for any .mp4 URL
        if (!videoURL) {
            const mp4Match = response.data.match(/(https:\/\/[^"]*\.mp4[^"]*)/);
            if (mp4Match) {
                videoURL = mp4Match[1];
                console.log('✓ Found video URL as .mp4 file');
            } else {
                console.log('✗ No .mp4 URLs found');
            }
        }

        if (videoURL) {
            console.log('\n🎉 Video URL found:', videoURL);
        } else {
            console.log('\n❌ No video URL found');
            console.log('\nPage content preview (first 1000 chars):');
            console.log(response.data.substring(0, 1000));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Test with a sample URL (replace with actual Instagram reel URL)
const testURL = process.argv[2];
if (testURL) {
    testInstagramURL(testURL);
} else {
    console.log('Usage: node test-scraping.js <instagram-url>');
    console.log('Example: node test-scraping.js "https://www.instagram.com/reel/ABC123/"');
}
