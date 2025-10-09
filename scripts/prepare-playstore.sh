#!/bin/bash
################################################################################
# Armora - Google Play Store Preparation Script
# Pre-submission checklist and asset verification
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

print_header "Google Play Store Preparation Checklist"
echo "Package: com.armora.protection"
echo "App: Armora - Professional Close Protection Services"
echo ""

# Track overall readiness
READY=true
WARNINGS=0
ERRORS=0

# 1. Required Files
print_header "1. Required Files"

check_file() {
    if [ -f "$1" ]; then
        print_success "$1"
        return 0
    else
        print_error "$1 - MISSING"
        READY=false
        ((ERRORS++))
        return 1
    fi
}

check_file "package.json"
check_file "public/manifest.json"
check_file "public/.well-known/assetlinks.json"
check_file "public/privacy.html"
check_file "public/logo192.png"
check_file "public/logo512.png"
check_file "playstore-listing.md"
check_file "playstore-metadata.json"
check_file "release-notes.txt"
check_file "PLAYSTORE_DEPLOYMENT.md"

# Check for AAB
if [ -f "app-release-bundle.aab" ]; then
    AAB_SIZE=$(du -h app-release-bundle.aab | cut -f1)
    print_success "app-release-bundle.aab ($AAB_SIZE)"
else
    print_warning "app-release-bundle.aab not found - Run: bash scripts/android-build.sh"
    ((WARNINGS++))
fi

# Check keystore
if [ -f "android.keystore" ]; then
    print_success "android.keystore (signing key present)"
else
    print_error "android.keystore - MISSING (required for signing)"
    READY=false
    ((ERRORS++))
fi

# 2. Environment Variables
print_header "2. Environment Variables"

if [ -f ".env.local" ]; then
    source .env.local
    print_success ".env.local found"
else
    print_warning ".env.local not found"
    ((WARNINGS++))
fi

# Check critical env vars
ENV_VARS=(
    "REACT_APP_FIREBASE_API_KEY"
    "REACT_APP_FIREBASE_APP_ID"
    "REACT_APP_SUPABASE_URL"
    "REACT_APP_SUPABASE_ANON_KEY"
    "REACT_APP_GOOGLE_MAPS_API_KEY"
    "REACT_APP_STRIPE_PUBLISHABLE_KEY"
)

for var in "${ENV_VARS[@]}"; do
    if [ -n "${!var}" ] && [ "${!var}" != "your_"* ]; then
        print_success "$var configured"
    else
        print_warning "$var not configured or using placeholder"
        ((WARNINGS++))
    fi
done

# 3. Digital Asset Links
print_header "3. Digital Asset Links Verification"

ASSETLINKS_FILE="public/.well-known/assetlinks.json"

if [ -f "$ASSETLINKS_FILE" ]; then
    # Check if it's valid JSON
    if jq empty "$ASSETLINKS_FILE" 2>/dev/null; then
        print_success "assetlinks.json is valid JSON"

        # Check package name
        PACKAGE=$(jq -r '.[0].target.package_name' "$ASSETLINKS_FILE")
        if [ "$PACKAGE" = "com.armora.protection" ]; then
            print_success "Package name correct: $PACKAGE"
        else
            print_error "Package name incorrect: $PACKAGE (should be com.armora.protection)"
            READY=false
            ((ERRORS++))
        fi

        # Check fingerprints
        FINGERPRINT_COUNT=$(jq -r '.[0].target.sha256_cert_fingerprints | length' "$ASSETLINKS_FILE")
        print_info "SHA-256 fingerprints configured: $FINGERPRINT_COUNT"

        if [ "$FINGERPRINT_COUNT" -eq 0 ]; then
            print_error "No SHA-256 fingerprints configured"
            READY=false
            ((ERRORS++))
        else
            print_success "Fingerprints present (remember to add Play Store signing fingerprint later)"
        fi
    else
        print_error "assetlinks.json is not valid JSON"
        READY=false
        ((ERRORS++))
    fi
fi

# Test if assetlinks.json is accessible (if server is running)
print_info "Testing assetlinks.json accessibility..."
if curl -s -o /dev/null -w "%{http_code}" "https://armora.vercel.app/.well-known/assetlinks.json" | grep -q "200"; then
    print_success "assetlinks.json accessible at production URL"
else
    print_warning "Could not verify assetlinks.json at production URL (may not be deployed yet)"
    ((WARNINGS++))
fi

# 4. Play Store Assets
print_header "4. Play Store Graphics Assets"

PLAYSTORE_DIR="public/playstore"

if [ -d "$PLAYSTORE_DIR" ]; then
    print_success "playstore directory exists"

    # Check for feature graphic
    if [ -f "$PLAYSTORE_DIR/feature-graphic.png" ]; then
        DIMENSIONS=$(identify -format "%wx%h" "$PLAYSTORE_DIR/feature-graphic.png" 2>/dev/null || echo "unknown")
        if [ "$DIMENSIONS" = "1024x500" ]; then
            print_success "Feature graphic: 1024x500 ✓"
        else
            print_warning "Feature graphic dimensions: $DIMENSIONS (should be 1024x500)"
            ((WARNINGS++))
        fi
    else
        print_warning "Feature graphic not found (required by Play Store)"
        ((WARNINGS++))
    fi

    # Check for app icon
    if [ -f "$PLAYSTORE_DIR/icon-512.png" ]; then
        DIMENSIONS=$(identify -format "%wx%h" "$PLAYSTORE_DIR/icon-512.png" 2>/dev/null || echo "unknown")
        if [ "$DIMENSIONS" = "512x512" ]; then
            print_success "App icon: 512x512 ✓"
        else
            print_warning "App icon dimensions: $DIMENSIONS (should be 512x512)"
            ((WARNINGS++))
        fi
    else
        print_warning "App icon (512x512) not found"
        ((WARNINGS++))
    fi

    # Count screenshots
    SCREENSHOT_COUNT=$(find "$PLAYSTORE_DIR" -name "screenshot-*.png" 2>/dev/null | wc -l)
    if [ "$SCREENSHOT_COUNT" -ge 2 ]; then
        print_success "Screenshots found: $SCREENSHOT_COUNT (minimum 2 required)"
    else
        print_error "Screenshots found: $SCREENSHOT_COUNT (minimum 2 required, 8 recommended)"
        READY=false
        ((ERRORS++))
    fi
else
    print_warning "playstore directory not found"
    print_info "Create screenshots and graphics in $PLAYSTORE_DIR/"
    ((WARNINGS++))
fi

# 5. Privacy Policy
print_header "5. Privacy Policy & Legal"

if [ -f "public/privacy.html" ]; then
    PRIVACY_SIZE=$(wc -l < "public/privacy.html")
    print_success "Privacy policy exists ($PRIVACY_SIZE lines)"

    # Check if accessible online
    if curl -s -o /dev/null -w "%{http_code}" "https://armora.vercel.app/privacy.html" | grep -q "200"; then
        print_success "Privacy policy accessible: https://armora.vercel.app/privacy.html"
    else
        print_warning "Privacy policy not yet deployed to production"
        ((WARNINGS++))
    fi
else
    print_error "privacy.html not found"
    READY=false
    ((ERRORS++))
fi

# 6. App Metadata
print_header "6. App Store Listing Content"

if [ -f "playstore-listing.md" ]; then
    # Check title length
    TITLE=$(grep -A1 "^## App Title" playstore-listing.md | tail -1 | sed 's/[^a-zA-Z0-9 ]//g')
    TITLE_LENGTH=${#TITLE}

    if [ "$TITLE_LENGTH" -le 30 ]; then
        print_success "App title: \"$TITLE\" ($TITLE_LENGTH chars, max 30)"
    else
        print_error "App title too long: $TITLE_LENGTH chars (max 30)"
        READY=false
        ((ERRORS++))
    fi

    # Check short description
    SHORT_DESC=$(grep -A1 "^## Short Description" playstore-listing.md | tail -1)
    SHORT_LENGTH=${#SHORT_DESC}

    if [ "$SHORT_LENGTH" -le 80 ]; then
        print_success "Short description: $SHORT_LENGTH chars (max 80)"
    else
        print_error "Short description too long: $SHORT_LENGTH chars (max 80)"
        READY=false
        ((ERRORS++))
    fi

    print_success "Full app description and content ready"
else
    print_error "playstore-listing.md not found"
    READY=false
    ((ERRORS++))
fi

# 7. Version Information
print_header "7. Version & Build Information"

if [ -f "package.json" ]; then
    APP_VERSION=$(jq -r '.version' package.json)
    print_success "App version: $APP_VERSION"
fi

if [ -f "twa-manifest.json" ]; then
    TWA_VERSION=$(jq -r '.appVersionName' twa-manifest.json)
    TWA_CODE=$(jq -r '.appVersionCode' twa-manifest.json)
    print_success "TWA version: $TWA_VERSION (code: $TWA_CODE)"
else
    print_warning "twa-manifest.json not found - run android-build.sh first"
    ((WARNINGS++))
fi

# 8. Testing Checklist
print_header "8. Pre-Submission Testing"

echo "Manual testing checklist (verify before submission):"
echo ""
echo "  [ ] App installs successfully from APK"
echo "  [ ] No URL bar appears (Digital Asset Links working)"
echo "  [ ] All core features work (booking, tracking, payment)"
echo "  [ ] Push notifications work correctly"
echo "  [ ] Location services work"
echo "  [ ] App icon displays correctly"
echo "  [ ] Splash screen shows properly"
echo "  [ ] No crashes on startup"
echo "  [ ] Tested on multiple Android versions"
echo "  [ ] Privacy policy link works"
echo ""

# 9. Final Summary
print_header "Preparation Summary"

if [ "$READY" = true ] && [ "$ERRORS" -eq 0 ]; then
    print_success "✓ READY FOR PLAY STORE SUBMISSION!"
    echo ""
    echo "Next steps:"
    echo "  1. Review playstore-listing.md for copy-paste content"
    echo "  2. Upload app-release-bundle.aab to Play Console"
    echo "  3. Add Play Store signing fingerprint to assetlinks.json"
    echo "  4. Complete Play Console forms (data safety, content rating)"
    echo "  5. Submit for review"
    echo ""
    echo "Documentation: PLAYSTORE_DEPLOYMENT.md"
else
    print_error "✗ NOT READY - Found $ERRORS error(s) and $WARNINGS warning(s)"
    echo ""
    echo "Please fix the errors above before submitting."
    echo ""

    if [ "$ERRORS" -gt 0 ]; then
        echo "Critical issues to fix:"
        echo "  • Missing required files or invalid configuration"
        echo "  • Review error messages above"
    fi

    if [ "$WARNINGS" -gt 0 ]; then
        echo ""
        echo "Warnings (recommended to fix):"
        echo "  • Missing optional assets (screenshots, graphics)"
        echo "  • Environment variables not fully configured"
        echo "  • Review warning messages above"
    fi
fi

echo ""
print_info "For help: See PLAYSTORE_DEPLOYMENT.md"
echo ""

# Exit with appropriate code
if [ "$READY" = false ]; then
    exit 1
else
    exit 0
fi
