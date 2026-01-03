# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Dependency caching
COPY package.json package-lock.json ./
RUN npm ci

# Source code
COPY . .

# Build
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
