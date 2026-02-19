# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Enable legacy peer deps for build
ENV NPM_CONFIG_LEGACY_PEER_DEPS=true

COPY package*.json ./

# Install all dependencies (including devDeps for build)
RUN npm ci

COPY . .

# Build args for frontend
# You can override this at build time: --build-arg VITE_API_URL=http://your-backend-url
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build


# ---- Production Stage ----
FROM node:22-alpine AS runner

WORKDIR /app

# Install a lightweight static server
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose frontend port (standard for serve is 3000)
EXPOSE 3000

# Serve the built app on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
