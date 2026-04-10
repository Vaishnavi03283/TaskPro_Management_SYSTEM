# Frontend Dockerfile (Vite Dev Mode)

FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose Vite port
EXPOSE 5173

# Run frontend
CMD ["npm", "run", "dev"]