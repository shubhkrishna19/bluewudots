#!/bin/bash
# Pre-deployment validation script
# Runs checks before allowing deployment to proceed

set -e

echo "🔍 Pre-Deployment Validation"
echo "============================"

ERRORS=0
WARNINGS=0

# Check 1: Environment file exists
echo ""
echo "📋 Checking environment configuration..."

if [ -f ".env.production" ]; then
    echo "✅ .env.production exists"
    
    # Check for placeholder values
    if grep -q "your_" .env.production; then
        echo "⚠️ WARNING: .env.production contains placeholder values"
        ((WARNINGS++))
    fi
else
    echo "❌ ERROR: .env.production not found"
    ((ERRORS++))
fi

# Check 2: Package.json has build script
echo ""
echo "📋 Checking build configuration..."

if [ -f "package.json" ]; then
    if grep -q '"build"' package.json; then
        echo "✅ Build script defined in package.json"
    else
        echo "❌ ERROR: No build script found in package.json"
        ((ERRORS++))
    fi
else
    echo "❌ ERROR: package.json not found"
    ((ERRORS++))
fi

# Check 3: Critical files exist
echo ""
echo "📋 Checking critical files..."

CRITICAL_FILES=(
    "src/App.jsx"
    "src/context/DataContext.jsx"
    "src/services/healthCheck.js"
    "src/components/Shared/ErrorBoundary.jsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ ERROR: $file not found"
        ((ERRORS++))
    fi
done

# Check 4: No console.log statements in production (optional warning)
echo ""
echo "📋 Checking for debug statements..."

DEBUG_COUNT=$(grep -r "console.log" src/ --include="*.js" --include="*.jsx" 2>/dev/null | wc -l)
if [ "$DEBUG_COUNT" -gt 0 ]; then
    echo "⚠️ WARNING: $DEBUG_COUNT console.log statements found"
    ((WARNINGS++))
else
    echo "✅ No console.log statements found"
fi

# Summary
echo ""
echo "============================"
echo "Validation Summary:"
echo "  Errors:   $ERRORS"
echo "  Warnings: $WARNINGS"
echo ""

if [ "$ERRORS" -gt 0 ]; then
    echo "❌ VALIDATION FAILED"
    echo "   Fix the errors above before deploying."
    exit 1
else
    if [ "$WARNINGS" -gt 0 ]; then
        echo "✅ VALIDATION PASSED (with warnings)"
    else
        echo "✅ VALIDATION PASSED"
    fi
    echo "   Ready for deployment!"
    exit 0
fi
