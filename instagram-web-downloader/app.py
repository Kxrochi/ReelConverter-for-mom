"""
Instagram Web Downloader
A Flask web application for downloading Instagram Reels and Posts
"""

import os
import sys
import tempfile
import zipfile
from pathlib import Path
from urllib.parse import urlparse
from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from werkzeug.utils import secure_filename
import instaloader
import yt_dlp
import requests
from PIL import Image
import io
import base64
import json
import time
import threading
from datetime import datetime

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Global variables for download status
download_status = {}
download_results = {}

def is_valid_instagram_url(url: str) -> bool:
    """Validate Instagram URL"""
    try:
        parsed = urlparse(url)
        if parsed.netloc not in ["instagram.com", "www.instagram.com"]:
            return False

        path = parsed.path
        # Check for reel URLs (both /reel/ and /reels/ formats)
        if "/reel/" in path or "/reels/" in path:
            if "/reel/" in path:
                parts = path.split("/reel/", 1)
            else:  # "/reels/" in path
                parts = path.split("/reels/", 1)
            
            if len(parts) < 2 or not parts[1].split("/")[0]:
                return False
            return True

        # Check for post URLs
        if "/p/" in path:
            parts = path.split("/p/", 1)
            if len(parts) < 2 or not parts[1].split("/")[0]:
                return False
            return True

        return False
    except:
        return False

def download_with_instaloader(url, download_options):
    """Download using instaloader"""
    try:
        loader = instaloader.Instaloader()
        loader.download_pictures = 'video' in download_options
        loader.download_videos = 'video' in download_options
        loader.download_video_thumbnails = 'thumbnail' in download_options
        loader.download_geotags = False
        loader.download_comments = False
        loader.save_metadata = False
        
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        
        # Download the post/reel
        post = instaloader.Post.from_shortcode(loader.context, url.split('/')[-2])
        loader.download_post(post, target=temp_dir)
        
        results = {}
        
        # Process downloaded files
        for file_path in Path(temp_dir).rglob('*'):
            if file_path.is_file():
                if file_path.suffix.lower() in ['.mp4', '.mov'] and 'video' in download_options:
                    results['video'] = str(file_path)
                elif file_path.suffix.lower() in ['.jpg', '.jpeg', '.png'] and 'thumbnail' in download_options:
                    results['thumbnail'] = str(file_path)
                elif file_path.suffix.lower() == '.txt' and 'caption' in download_options:
                    results['caption'] = str(file_path)
        
        return results, None
    except Exception as e:
        return None, str(e)

def download_with_ytdlp(url, download_options):
    """Download using yt-dlp"""
    try:
        temp_dir = tempfile.mkdtemp()
        
        ydl_opts = {
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
            'format': 'best[height<=720]',  # Limit quality for web
        }
        
        if 'video' not in download_options:
            ydl_opts['format'] = 'bestaudio/best'
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
        results = {}
        
        # Process downloaded files
        for file_path in Path(temp_dir).rglob('*'):
            if file_path.is_file():
                if file_path.suffix.lower() in ['.mp4', '.mov', '.webm'] and 'video' in download_options:
                    results['video'] = str(file_path)
                elif file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp'] and 'thumbnail' in download_options:
                    results['thumbnail'] = str(file_path)
        
        # Get caption from info
        if 'caption' in download_options and info.get('description'):
            caption_file = os.path.join(temp_dir, 'caption.txt')
            with open(caption_file, 'w', encoding='utf-8') as f:
                f.write(info['description'])
            results['caption'] = caption_file
        
        return results, None
    except Exception as e:
        return None, str(e)

def process_download(url, download_options, download_engine, download_id):
    """Process download in background thread"""
    global download_status, download_results
    
    download_status[download_id] = {'status': 'processing', 'progress': 0}
    
    try:
        if download_engine == 'instaloader':
            results, error = download_with_instaloader(url, download_options)
        else:  # yt-dlp
            results, error = download_with_ytdlp(url, download_options)
        
        if error:
            download_status[download_id] = {'status': 'error', 'error': error}
        else:
            download_status[download_id] = {'status': 'completed', 'progress': 100}
            download_results[download_id] = results
            
    except Exception as e:
        download_status[download_id] = {'status': 'error', 'error': str(e)}

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/download', methods=['POST'])
def start_download():
    """Start download process"""
    data = request.get_json()
    url = data.get('url', '').strip()
    download_options = data.get('options', [])
    download_engine = data.get('engine', 'instaloader')
    
    if not url or not is_valid_instagram_url(url):
        return jsonify({'error': 'Invalid Instagram URL'}), 400
    
    if not download_options:
        return jsonify({'error': 'Please select at least one download option'}), 400
    
    # Generate unique download ID
    download_id = f"download_{int(time.time())}_{hash(url) % 10000}"
    
    # Start download in background thread
    thread = threading.Thread(
        target=process_download,
        args=(url, download_options, download_engine, download_id)
    )
    thread.daemon = True
    thread.start()
    
    return jsonify({'download_id': download_id})

@app.route('/api/status/<download_id>')
def get_download_status(download_id):
    """Get download status"""
    if download_id not in download_status:
        return jsonify({'error': 'Download not found'}), 404
    
    return jsonify(download_status[download_id])

@app.route('/api/download/<download_id>/<file_type>')
def download_file(download_id, file_type):
    """Download specific file"""
    if download_id not in download_results:
        return jsonify({'error': 'Download not found'}), 404
    
    if file_type not in download_results[download_id]:
        return jsonify({'error': 'File type not available'}), 404
    
    file_path = download_results[download_id][file_type]
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(file_path, as_attachment=True)

@app.route('/api/validate', methods=['POST'])
def validate_url():
    """Validate Instagram URL"""
    data = request.get_json()
    url = data.get('url', '').strip()
    
    is_valid = is_valid_instagram_url(url)
    return jsonify({'valid': is_valid})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
