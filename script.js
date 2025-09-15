// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Instagram Reel Downloader loaded');
});

// Download form handler
document.addEventListener('DOMContentLoaded', function() {
    const downloadForm = document.getElementById('downloadForm');
    const downloadBtn = document.getElementById('downloadBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const downloadResults = document.getElementById('downloadResults');
    const resultContent = document.getElementById('resultContent');

    if (downloadForm) {
        downloadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const urlInput = document.getElementById('reelUrl');
            const url = urlInput.value.trim();
            
            console.log('URL entered:', url);
            
            // Validate URL
            if (!url) {
                showError('Please enter an Instagram URL');
                return;
            }
            
            if (!isValidInstagramUrl(url)) {
                showError('Please enter a valid Instagram URL');
                return;
            }
            
            // Start download process
            await startDownload(url);
        });
    }
});

// Validate Instagram URL
function isValidInstagramUrl(url) {
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+\/?/;
    return instagramRegex.test(url);
}

// Show error message
function showError(message) {
    console.log('Showing error:', message);
    // Create or update error message
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        const downloadForm = document.getElementById('downloadForm');
        downloadForm.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.remove();
        }
    }, 5000);
}

// Start download process
async function startDownload(url) {
    try {
        console.log('Starting download for URL:', url);
        
        // Get elements
        const downloadBtn = document.getElementById('downloadBtn');
        const downloadResults = document.getElementById('downloadResults');
        
        // Show progress
        showProgress();
        updateProgress(10, 'Validating URL...');
        
        // Disable form
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        
        // Hide previous results
        downloadResults.style.display = 'none';
        
        // Make API call
        updateProgress(30, 'Fetching video information...');
        
        console.log('Making API call to /api/download');
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        console.log('Response status:', response.status);
        updateProgress(60, 'Processing video...');
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error:', errorData);
            throw new Error(errorData.message || 'Download failed');
        }
        
        const data = await response.json();
        console.log('Download data received:', data);
        
        updateProgress(90, 'Preparing download...');
        
        // Show results
        setTimeout(() => {
            showResults(data);
            hideProgress();
            resetForm();
        }, 1000);
        
    } catch (error) {
        console.error('Download error:', error);
        showError(error.message || 'Download failed. Please try again.');
        hideProgress();
        resetForm();
    }
}

// Show progress bar
function showProgress() {
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
}

// Update progress
function updateProgress(percent, text) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    progressBar.style.width = percent + '%';
    progressText.textContent = text;
}

// Hide progress bar
function hideProgress() {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.style.display = 'none';
}

// Show download results
function showResults(data) {
    const resultContent = document.getElementById('resultContent');
    const downloadResults = document.getElementById('downloadResults');
    
    resultContent.innerHTML = '';
    
    if (data.videos && data.videos.length > 0) {
        data.videos.forEach((video, index) => {
            const videoDiv = document.createElement('div');
            videoDiv.className = 'download-item';
            videoDiv.innerHTML = `
                <div class="download-info">
                    <h4>${video.title || `Video ${index + 1}`}</h4>
                    <p>Quality: ${video.quality || 'Unknown'} | Size: ${video.size || 'Unknown'}</p>
                    ${video.caption ? `<div class="caption"><strong>Caption:</strong> ${video.caption}</div>` : ''}
                </div>
                <a href="${video.downloadUrl}" class="download-btn" download>
                    <i class="fas fa-download"></i> Download
                </a>
            `;
            resultContent.appendChild(videoDiv);
        });
    } else if (data.downloadUrl) {
        const videoDiv = document.createElement('div');
        videoDiv.className = 'download-item';
        videoDiv.innerHTML = `
            <div class="download-info">
                <h4>${data.title || 'Instagram Video'}</h4>
                <p>Quality: ${data.quality || 'High'} | Size: ${data.size || 'Unknown'}</p>
                ${data.caption ? `<div class="caption"><strong>Caption:</strong> ${data.caption}</div>` : ''}
            </div>
            <a href="${data.downloadUrl}" class="download-btn" download>
                <i class="fas fa-download"></i> Download
            </a>
        `;
        resultContent.appendChild(videoDiv);
    } else {
        resultContent.innerHTML = '<p>No downloadable content found.</p>';
    }
    
    downloadResults.style.display = 'block';
    
    // Scroll to results
    downloadResults.scrollIntoView({ behavior: 'smooth' });
}

// Reset form
function resetForm() {
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    document.getElementById('reelUrl').value = '';
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Console welcome message
console.log(`
📱 Welcome to Instagram Reel Downloader!
   
   Download Instagram Reels, posts, and IGTV videos easily.
   Features:
   ✅ High-quality downloads
   ✅ Multiple format support
   ✅ Fast and secure
   ✅ Mobile responsive
   
   Start downloading! 🎉
`);
