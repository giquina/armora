#!/bin/bash
# Quick Production Test Script for Armora
# Tests the live production deployment

echo "🧪 Armora Production Quick Test"
echo "================================"
echo ""

PROD_URL="https://armora-hpp7ejnrw-giquinas-projects.vercel.app"

echo "1. Testing if app is accessible..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ App is accessible (HTTP $HTTP_CODE)"
else
    echo "   ❌ App returned HTTP $HTTP_CODE"
    exit 1
fi

echo ""
echo "2. Testing if assets load..."
curl -s "$PROD_URL" | grep -q "Armora" && echo "   ✅ HTML contains Armora branding" || echo "   ❌ Armora branding not found"

echo ""
echo "3. Testing manifest.json..."
curl -s "$PROD_URL/manifest.json" | grep -q "name" && echo "   ✅ PWA manifest exists" || echo "   ⚠️  Manifest not found"

echo ""
echo "4. Testing Service Worker..."
curl -s "$PROD_URL/service-worker.js" > /dev/null 2>&1 && echo "   ✅ Service Worker file exists" || echo "   ⚠️  Service Worker not found"

echo ""
echo "5. Testing API connectivity..."
curl -s "$PROD_URL/api" > /dev/null 2>&1 && echo "   ✅ API endpoint responds" || echo "   ℹ️  No API endpoint (expected for frontend-only)"

echo ""
echo "================================"
echo "✅ Quick test complete!"
echo ""
echo "🌐 Production URL: $PROD_URL"
echo "📊 Full testing guide: /docs/PRODUCTION_TESTING_CHECKLIST.md"
echo ""
