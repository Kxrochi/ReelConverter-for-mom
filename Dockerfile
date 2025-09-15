# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install system dependencies including yt-dlp
RUN apk add --no-cache \
    python3 \
    py3-pip \
    curl \
    ffmpeg \
    yt-dlp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy application files
COPY . .

# Create downloads directory
RUN mkdir -p downloads

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
