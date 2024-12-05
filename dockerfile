# Stage 1: Build
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-slim AS production

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy dependencies from the builder stage
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copy built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the application's port (default for NestJS is 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]
