# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy the web package files
COPY apps/web/package.json ./apps/web/
# Add this line to copy all source files including styles
COPY apps/web ./apps/web/
# Remove these as they're now included above
# COPY apps/web/src ./apps/web/src
# COPY apps/web/public ./apps/web/public
# COPY apps/web/next.config.ts apps/web/tsconfig.json ./apps/web/

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Set build-time variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
WORKDIR /app/apps/web
RUN pnpm exec next build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/next.config.ts ./apps/web/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
# Add these lines to ensure all Next.js build outputs are copied
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Set working directory to web folder
WORKDIR /app/apps/web

# Set runtime environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Expose port
EXPOSE 3000

# Start the server
CMD ["pnpm", "start"] 