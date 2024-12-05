# Stage 1: Build
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Install Prisma CLI locally (for build phase)
RUN npm install prisma --save-dev

# Copy the rest of the application code
COPY . .

# Run prisma generate to create the Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-slim AS production

# Set working directory inside the container
WORKDIR /usr/src/app

# Install OpenSSL to avoid the Prisma warning
RUN apt-get update -y && apt-get install -y openssl


# Copy package files
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Install Prisma CLI globally in production stage
RUN npm install -g prisma

# Copy built application and prisma folder from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma/

# Copy .env file into production container (for runtime)
COPY --from=builder /usr/src/app/.env .env

# Expose the application's port (default for NestJS is 3000)
EXPOSE 8000

# Command to run the application
CMD ["npm", "run", "start:migrate:prod"]
