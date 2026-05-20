# Use official Node.js Alpine image for a lightweight multi-stage build
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lockfile
COPY package.json package-lock.json ./

# Install dependencies using clean install
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner

WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose Next.js port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
