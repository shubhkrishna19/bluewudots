#!/bin/bash

# Bluewud OTS Development Setup & Optimization Script
# Purpose: Ensures a clean, high-performance dev environment.

echo "🚀 Initializing Bluewud OTS Dev Environment..."

# 1. Environment Check
if [ ! -f ".env" ]; then
    echo "⚠️ .env file missing! Creating from template..."
    cp .env.example .env 2>/dev/null || echo "VITE_APP_MODE=development" > .env
fi

# 2. Dependency Audit
echo "📦 Auditing dependencies..."
npm install --quiet

# 3. Cache Purge
echo "🧹 Clearing Vite & Vitest caches..."
rm -rf node_modules/.vite
rm -rf node_modules/.vitest

# 4. Git Hooks Setup (Husky)
echo "⚓ Setting up Git Hooks..."
npx husky install

# 5. Environment Validation
echo "🔍 Validating environment variables..."
if [ -f "validate-env.js" ]; then
    node validate-env.js
else
    echo "✅ Env validation script not found, skipping..."
fi

echo "✨ DEV ENVIRONMENT READY!"
echo "👉 Run 'npm run dev' to start the application."
echo "👉 Run 'npm test' to execute the test suite."
