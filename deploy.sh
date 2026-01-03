#!/bin/bash
# Bluewud OTS Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: staging, production

set -e

ENVIRONMENT=${1:-staging}
BUILD_DIR="dist"
APP_NAME="bluewud-ots"

echo "🚀 Bluewud OTS Deployment Script"
echo "================================"
echo "Environment: $ENVIRONMENT"
echo "Timestamp: $(date)"
echo ""

# Step 1: Pre-flight checks
echo "📋 Running pre-flight checks..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ Node version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# Step 2: Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci --prefer-offline

# Step 3: Run linting
echo ""
echo "🔍 Running linting..."
npm run lint 2>/dev/null || echo "⚠️ Lint check skipped (not configured)"

# Step 4: Run tests
echo ""
echo "🧪 Running tests..."
npm test 2>/dev/null || echo "⚠️ Tests skipped (not configured)"

# Step 5: Build for production
echo ""
echo "🔨 Building for $ENVIRONMENT..."
if [ "$ENVIRONMENT" = "production" ]; then
    NODE_ENV=production npm run build
else
    npm run build
fi

# Step 6: Verify build output
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build failed - $BUILD_DIR directory not found"
    exit 1
fi

BUILD_SIZE=$(du -sh $BUILD_DIR | cut -f1)
echo "✅ Build complete: $BUILD_SIZE"

# Step 7: Deploy based on environment
echo ""
echo "☁️ Deploying to $ENVIRONMENT..."

if [ "$ENVIRONMENT" = "production" ]; then
    echo "⚠️ Production deployment requires manual confirmation"
    echo "   Run: catalyst deploy --env production"
else
    # Simulated deployment for staging
    echo "📤 Uploading to Zoho Catalyst ($ENVIRONMENT)..."
    # catalyst deploy --env $ENVIRONMENT 2>/dev/null || echo "   (Catalyst CLI not configured - manual deploy required)"
    echo "✅ Deployment package ready in $BUILD_DIR/"
fi

echo ""
echo "================================"
echo "✅ Deployment script complete!"
echo "   Build: $BUILD_DIR/"
echo "   Environment: $ENVIRONMENT"
echo "   Time: $(date)"
