#!/bin/bash
# Bluewud OTS Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: staging, production

set -e

ENVIRONMENT=${1:-staging}
BUILD_DIR="dist"
APP_NAME="bluewud-ots"
BACKUP_DIR=".deploy_backup"
LOG_FILE="deploy_$(date +%Y%m%d_%H%M%S).log"

echo "🚀 Bluewud OTS Deployment Script"
echo "================================"
echo "Environment: $ENVIRONMENT"
echo "Timestamp: $(date)"
echo "Log file: $LOG_FILE"
echo ""

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting deployment for $ENVIRONMENT"

# Step 1: Pre-flight checks
log "📋 Running pre-flight checks..."

if ! command -v node &> /dev/null; then
    log "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log "❌ npm is not installed"
    exit 1
fi

log "✅ Node version: $(node -v)"
log "✅ npm version: $(npm -v)"

# Step 1.5: Validate environment variables
log ""
log "🔐 Validating environment configuration..."
if [ -f "scripts/validate-env.js" ]; then
    if ! node scripts/validate-env.js --env=$ENVIRONMENT; then
        log "❌ Environment validation failed"
        log "   Run: node scripts/validate-env.js --env=$ENVIRONMENT --generate-template"
        exit 1
    fi
    log "✅ Environment validation passed"
else
    log "⚠️  Environment validation script not found, skipping..."
fi

# Step 2: Create backup of current build
if [ -d "$BUILD_DIR" ]; then
    log ""
    log "💾 Creating backup of current build..."
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    cp -r "$BUILD_DIR" "$BACKUP_DIR/$BACKUP_NAME"
    log "✅ Backup created: $BACKUP_DIR/$BACKUP_NAME"
fi

# Step 3: Install dependencies
log ""
log "📦 Installing dependencies..."
npm ci --prefer-offline

# Step 4: Run linting
log ""
log "🔍 Running linting..."
npm run lint 2>/dev/null || log "⚠️ Lint check skipped (not configured)"

# Step 5: Run tests
log ""
log "🧪 Running tests..."
if npm test -- --run 2>/dev/null; then
    log "✅ All tests passed"
else
    log "⚠️ Tests failed or not configured"
    if [ "$ENVIRONMENT" = "production" ]; then
        log "❌ Cannot deploy to production with failing tests"
        exit 1
    fi
fi

# Step 6: Build for production
log ""
log "🔨 Building for $ENVIRONMENT..."
if [ "$ENVIRONMENT" = "production" ]; then
    NODE_ENV=production npm run build
else
    npm run build
fi

# Step 7: Verify build output
if [ ! -d "$BUILD_DIR" ]; then
    log "❌ Build failed - $BUILD_DIR directory not found"
    
    # Rollback if backup exists
    if [ -d "$BACKUP_DIR" ]; then
        log "🔄 Rolling back to previous build..."
        LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -1)
        if [ -n "$LATEST_BACKUP" ]; then
            rm -rf "$BUILD_DIR"
            cp -r "$BACKUP_DIR/$LATEST_BACKUP" "$BUILD_DIR"
            log "✅ Rollback complete"
        fi
    fi
    exit 1
fi

BUILD_SIZE=$(du -sh $BUILD_DIR | cut -f1)
log "✅ Build complete: $BUILD_SIZE"

# Step 8: Health check on build
log ""
log "🏥 Running build health checks..."
if [ -f "$BUILD_DIR/index.html" ]; then
    log "✅ index.html found"
else
    log "❌ index.html missing from build"
    exit 1
fi

if [ -d "$BUILD_DIR/assets" ]; then
    ASSET_COUNT=$(find "$BUILD_DIR/assets" -type f | wc -l)
    log "✅ Assets directory found ($ASSET_COUNT files)"
else
    log "⚠️  No assets directory found"
fi

# Step 9: Deploy based on environment
log ""
log "☁️ Deploying to $ENVIRONMENT..."

if [ "$ENVIRONMENT" = "production" ]; then
    log "⚠️ Production deployment requires manual confirmation"
    log "   Build is ready in $BUILD_DIR/"
    log "   Run: catalyst deploy --env production"
    log "   Or manually upload to your hosting service"
else
    # Simulated deployment for staging
    log "📤 Preparing deployment package for $ENVIRONMENT..."
    # catalyst deploy --env $ENVIRONMENT 2>/dev/null || log "   (Catalyst CLI not configured - manual deploy required)"
    log "✅ Deployment package ready in $BUILD_DIR/"
fi

# Cleanup old backups (keep last 5)
if [ -d "$BACKUP_DIR" ]; then
    log ""
    log "🧹 Cleaning up old backups..."
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR" | wc -l)
    if [ "$BACKUP_COUNT" -gt 5 ]; then
        ls -t "$BACKUP_DIR" | tail -n +6 | xargs -I {} rm -rf "$BACKUP_DIR/{}"
        log "✅ Removed $(($BACKUP_COUNT - 5)) old backup(s)"
    fi
fi

log ""
log "================================"
log "✅ Deployment script complete!"
log "   Build: $BUILD_DIR/"
log "   Environment: $ENVIRONMENT"
log "   Log: $LOG_FILE"
log "   Time: $(date)"
log "================================"
