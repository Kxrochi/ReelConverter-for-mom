// DOM elements
const urlInput = document.getElementById('urlInput');
const downloadBtn = document.getElementById('downloadBtn');
const statusSection = document.getElementById('statusSection');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const spinner = document.getElementById('spinner');
const statusText = document.getElementById('statusText');
const resultMessage = document.getElementById('resultMessage');
const errorMessage = document.getElementById('errorMessage');
const downloadLink = document.getElementById('downloadLink');
const newDownloadBtn = document.getElementById('newDownloadBtn');
const retryBtn = document.getElementById('retryBtn');

// State management
let isDownloading = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    urlInput.focus();
});

// Setup event listeners
function setupEventListeners() {
    downloadBtn.addEventListener('click', handleDownload);
    newDownloadBtn.addEventListener('click', resetForm);
    retryBtn.addEventListener('click', resetForm);
    
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !isDownloading) {
            handleDownload();
        }
    });
    
    urlInput.addEventListener('input', function() {
        // Clear any previous error states when user starts typing
        if (!errorSection.classList.contains('hidden')) {
            hideAllSections();
        }
    });
}

// Handle download button click
async function handleDownload() {
    if (isDownloading) return;
    
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter an Instagram reel URL');
        return;
    }
    
    if (!isValidInstagramURL(url)) {
        showError('Please enter a valid Instagram reel URL');
        return;
    }
    
    try {
        isDownloading = true;
        showStatus('Preparing download...');
        
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data);
        } else {
            showError(data.error || 'Download failed');
        }
    } catch (error) {
        console.error('Download error:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        isDownloading = false;
    }
}

// Validate Instagram URL
function isValidInstagramURL(url) {
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/?/;
    return instagramRegex.test(url);
}

// Show status section
function showStatus(message) {
    hideAllSections();
    statusText.textContent = message;
    statusSection.classList.remove('hidden');
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
}

// Show success section
function showSuccess(data) {
    hideAllSections();
    resultMessage.textContent = data.message || 'Your video has been downloaded successfully.';
    downloadLink.href = data.downloadUrl;
    downloadLink.download = data.filename || 'instagram_reel.mp4';
    resultSection.classList.remove('hidden');
}

// Show error section
function showError(message) {
    hideAllSections();
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
}

// Hide all sections
function hideAllSections() {
    statusSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

// Reset form
function resetForm() {
    hideAllSections();
    urlInput.value = '';
    urlInput.focus();
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
}

// Add some visual feedback for URL validation
urlInput.addEventListener('blur', function() {
    const url = this.value.trim();
    if (url && !isValidInstagramURL(url)) {
        this.style.borderColor = '#f44336';
    } else {
        this.style.borderColor = '#e1e5e9';
    }
});

urlInput.addEventListener('input', function() {
    this.style.borderColor = '#e1e5e9';
});

// Add loading animation to the download button
function animateDownloadButton() {
    const button = downloadBtn;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Add click animation
downloadBtn.addEventListener('click', animateDownloadButton);

// Add some nice hover effects
const buttons = document.querySelectorAll('button, .download-link-btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        if (!this.disabled) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to download
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isDownloading) {
            handleDownload();
        }
    }
    
    // Escape to reset form
    if (e.key === 'Escape') {
        resetForm();
    }
});

// Add some visual feedback for successful operations
function showSuccessAnimation() {
    const successIcon = document.querySelector('.success-icon');
    successIcon.style.transform = 'scale(0)';
    successIcon.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        successIcon.style.transform = 'scale(1)';
    }, 100);
}

// Add success animation when showing success
const originalShowSuccess = showSuccess;
showSuccess = function(data) {
    originalShowSuccess(data);
    setTimeout(showSuccessAnimation, 100);
};

// Add some helpful tooltips
function addTooltips() {
    const input = urlInput;
    input.title = 'Paste your Instagram reel URL here. Example: https://www.instagram.com/reel/ABC123/';
    
    const button = downloadBtn;
    button.title = 'Click to download the Instagram reel (Ctrl+Enter)';
}

// Initialize tooltips
addTooltips();

// Add some nice transitions
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Add some console styling for debugging
console.log('%c🎬 Instagram Reel Downloader', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cReady to download some reels!', 'color: #666; font-size: 14px;');
