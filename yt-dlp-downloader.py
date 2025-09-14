#!/usr/bin/env python3
"""
Instagram Reel Downloader using yt-dlp
This script downloads Instagram reels using yt-dlp which is much more reliable
than web scraping approaches.
"""

import sys
import json
import subprocess
import os
import tempfile
from pathlib import Path

def download_instagram_reel(url, output_dir):
    """
    Download Instagram reel using yt-dlp
    
    Args:
        url (str): Instagram reel URL
        output_dir (str): Directory to save the video
        
    Returns:
        dict: Result with success status and file info
    """
    try:
        # Ensure output directory exists
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # yt-dlp command with options optimized for Instagram
        cmd = [
            'yt-dlp',
            '--no-playlist',
            '--format', 'best',  # Use best available format
            '--output', os.path.join(output_dir, '%(title)s.%(ext)s'),
            '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            url
        ]
        
        # Run yt-dlp
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            # Find the downloaded file
            files = list(Path(output_dir).glob('*'))
            video_files = [f for f in files if f.suffix in ['.mp4', '.webm', '.mkv']]
            
            if video_files:
                video_file = video_files[0]
                return {
                    'success': True,
                    'filename': video_file.name,
                    'filepath': str(video_file),
                    'size': video_file.stat().st_size,
                    'message': 'Video downloaded successfully'
                }
            else:
                return {
                    'success': False,
                    'error': f'No video file found after download. Available files: {[f.name for f in files]}'
                }
        else:
            return {
                'success': False,
                'error': f'yt-dlp failed (code {result.returncode}): {result.stderr}'
            }
            
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': 'Download timeout - the video might be too large or the connection is slow'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Download error: {str(e)}'
        }

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) != 3:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python yt-dlp-downloader.py <instagram_url> <output_dir>'
        }))
        sys.exit(1)
    
    url = sys.argv[1]
    output_dir = sys.argv[2]
    
    result = download_instagram_reel(url, output_dir)
    print(json.dumps(result))

if __name__ == '__main__':
    main()
