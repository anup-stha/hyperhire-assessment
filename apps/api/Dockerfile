# Build stage
FROM node:18-alpine AS buildstage
WORKDIR /app

# Install pnpm and dependencies required for Prisma
RUN npm install -g pnpm
RUN apk add --no-cache libc6-compat openssl

# Copy root workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy the API package files
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json apps/api/tsconfig.build.json apps/api/nest-cli.json ./apps/api/

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
WORKDIR /app/apps/api
RUN pnpm exec prisma generate

# Build the application
RUN pnpm exec nest build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install pnpm and runtime dependencies
RUN npm install -g pnpm
RUN apk add --no-cache libc6-compat openssl

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma

# Install production dependencies
WORKDIR /app/apps/api
RUN pnpm install prisma
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma Client in production stage
RUN pnpm exec prisma generate

# Copy built application from buildstage
COPY --from=buildstage /app/apps/api/dist ./dist

# Set environment variable for Prisma
ENV NODE_ENV=production

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "dist/main"]
