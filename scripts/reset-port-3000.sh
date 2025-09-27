#!/bin/bash

# Reset Port 3000 Script - Fixes all caching issues
echo "🔧 Resetting Port 3000 to clean state..."

# Step 1: Kill all running Node/React processes
echo "📍 Step 1: Killing all server processes..."
pkill -f "react-scripts" 2>/dev/null
pkill -f "node" 2>/dev/null
pkill -f "webpack" 2>/dev/null
sleep 2

# Step 2: Clear all webpack and build caches
echo "📍 Step 2: Clearing all cache directories..."
rm -rf node_modules/.cache 2>/dev/null
rm -rf build 2>/dev/null
rm -rf dist 2>/dev/null
rm -rf .parcel-cache 2>/dev/null
rm -rf /tmp/webpack-* 2>/dev/null
rm -rf ~/.npm/_cacache 2>/dev/null

# Step 3: Clear Create React App specific caches
echo "📍 Step 3: Clearing CRA caches..."
rm -rf $TMPDIR/react-* 2>/dev/null
rm -rf /tmp/react-* 2>/dev/null

# Step 4: Clear any port 3000 specific files
echo "📍 Step 4: Clearing port-specific cache..."
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Step 5: Clean npm cache
echo "📍 Step 5: Cleaning npm cache..."
npm cache clean --force 2>/dev/null

# Step 6: Reset GitHub Codespaces port forwarding (if in Codespaces)
if [ -n "$CODESPACES" ]; then
    echo "📍 Step 6: Resetting Codespaces port forwarding..."
    gh codespace ports visibility 3000:private 2>/dev/null
fi

echo "✅ Port 3000 has been reset successfully!"
echo "🚀 You can now start the server with: npm run fresh"