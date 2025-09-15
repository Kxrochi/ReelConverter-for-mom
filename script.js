// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Download form handler
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
        
        const urlInput = document.getElementById('reelUrl');
        const url = urlInput.value.trim();
        
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

// Validate Instagram URL
function isValidInstagramUrl(url) {
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?/;
    return instagramRegex.test(url);
}

// Show error message
function showError(message) {
    // Create or update error message
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            text-align: center;
        `;
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
        
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        updateProgress(60, 'Processing video...');
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Download failed');
        }
        
        const data = await response.json();
        
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
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
}

// Update progress
function updateProgress(percent, text) {
    progressBar.style.width = percent + '%';
    progressText.textContent = text;
}

// Hide progress bar
function hideProgress() {
    progressContainer.style.display = 'none';
}

// Show download results
function showResults(data) {
    resultContent.innerHTML = '';
    
    if (data.videos && data.videos.length > 0) {
        data.videos.forEach((video, index) => {
            const videoDiv = document.createElement('div');
            videoDiv.className = 'download-item';
            videoDiv.innerHTML = `
                <div class="download-info">
                    <h4>${video.title || `Video ${index + 1}`}</h4>
                    <p>Quality: ${video.quality || 'Unknown'} | Size: ${video.size || 'Unknown'}</p>
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
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    document.getElementById('reelUrl').value = '';
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .about-text, .contact-info, .contact-form');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Button click animations
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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
