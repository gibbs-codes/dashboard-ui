# Multi-stage build for Vite React app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

# Runtime dependencies and static file server
RUN apk add --no-cache curl \
  && npm install -g serve@14

# Create app directory
WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Metadata
LABEL app=dashboard-ui \
  component=frontend

# Environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/projector.html || curl -f http://localhost:3000/ || exit 1

# Start the app
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3000"]
