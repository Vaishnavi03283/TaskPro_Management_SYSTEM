# Backend Dockerfile (Dev Mode)

FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose backend port (IMPORTANT)
EXPOSE 5001

# Run backend
CMD ["npm", "run", "dev"]