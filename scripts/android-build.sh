#!/bin/bash
################################################################################
# Armora - Android TWA Build Script
# Automated build process for Google Play Store deployment
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running from project root
if [ ! -f "package.json" ]; then
    print_error "Error: Must run from project root directory"
    exit 1
fi

print_header "Armora Android TWA Build Process"

# Step 1: Check Prerequisites
print_header "Step 1/6: Checking Prerequisites"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Java (JDK 17 required)
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    print_success "Java installed: $JAVA_VERSION"
    if [[ ! "$JAVA_VERSION" =~ ^17\. ]]; then
        print_warning "JDK 17 is recommended. Current version: $JAVA_VERSION"
    fi
else
    print_error "Java (JDK) not installed. Please install JDK 17."
    exit 1
fi

# Check Bubblewrap CLI
if command -v bubblewrap &> /dev/null; then
    BUBBLEWRAP_VERSION=$(bubblewrap --version 2>&1 | head -n1)
    print_success "Bubblewrap CLI installed: $BUBBLEWRAP_VERSION"
else
    print_warning "Bubblewrap CLI not found. Installing now..."
    npm install -g @bubblewrap/cli
    print_success "Bubblewrap CLI installed"
fi

# Step 2: Verify Environment Variables
print_header "Step 2/6: Verifying Environment Variables"

REQUIRED_VARS=(
    "REACT_APP_SUPABASE_URL"
    "REACT_APP_SUPABASE_ANON_KEY"
    "REACT_APP_FIREBASE_API_KEY"
    "REACT_APP_FIREBASE_PROJECT_ID"
    "REACT_APP_GOOGLE_MAPS_API_KEY"
    "REACT_APP_STRIPE_PUBLISHABLE_KEY"
)

MISSING_VARS=()

if [ -f ".env.local" ]; then
    source .env.local
    print_success "Found .env.local file"
else
    print_warning ".env.local not found, checking environment variables"
fi

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
        print_warning "Missing: $var"
    else
        print_success "Found: $var"
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    print_error "Missing required environment variables. Please configure .env.local"
    exit 1
fi

# Step 3: Build Production React App
print_header "Step 3/6: Building Production React App"

print_success "Running npm run build..."
npm run build

if [ ! -d "build" ]; then
    print_error "Build directory not found. Build failed."
    exit 1
fi

print_success "Production build complete"

# Step 4: Run Bubblewrap Doctor
print_header "Step 4/6: Checking Bubblewrap Configuration"

bubblewrap doctor || {
    print_error "Bubblewrap doctor checks failed. Please fix configuration issues."
    print_warning "Run: bubblewrap updateConfig"
    exit 1
}

print_success "Bubblewrap configuration verified"

# Step 5: Initialize or Update TWA Project
print_header "Step 5/6: TWA Project Setup"

if [ -f "twa-manifest.json" ]; then
    print_success "Found existing twa-manifest.json"

    # Ask user if they want to update
    read -p "Update TWA project? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_success "Updating TWA project..."
        bubblewrap update
    fi
else
    print_warning "twa-manifest.json not found. Initializing TWA project..."
    print_warning "You'll need to provide configuration details."

    bubblewrap init --manifest=https://armora.vercel.app/manifest.json
fi

# Step 6: Build Android App
print_header "Step 6/6: Building Android App (AAB + APK)"

print_success "Building Android app bundle and APK..."
bubblewrap build

# Verify build outputs
if [ -f "app-release-bundle.aab" ]; then
    AAB_SIZE=$(du -h app-release-bundle.aab | cut -f1)
    print_success "AAB created: app-release-bundle.aab ($AAB_SIZE)"
else
    print_error "AAB file not created"
    exit 1
fi

if [ -f "app-release-signed.apk" ]; then
    APK_SIZE=$(du -h app-release-signed.apk | cut -f1)
    print_success "APK created: app-release-signed.apk ($APK_SIZE)"
else
    print_warning "APK file not created (optional)"
fi

# Final Summary
print_header "Build Complete!"

echo -e "${GREEN}✓ Android app built successfully!${NC}\n"
echo "Files created:"
echo "  • app-release-bundle.aab - Upload to Google Play Store"
echo "  • app-release-signed.apk - Direct install for testing"
echo ""
echo "Next steps:"
echo "  1. Test locally: adb install app-release-signed.apk"
echo "  2. Verify Digital Asset Links work (no URL bar)"
echo "  3. Upload AAB to Play Store Console"
echo ""
echo "Documentation: See PLAYSTORE_DEPLOYMENT.md for complete guide"
echo ""

# Optional: Install on connected device
read -p "Install APK on connected device? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v adb &> /dev/null; then
        print_success "Installing on device..."
        adb install -r app-release-signed.apk
        print_success "Installation complete!"
    else
        print_warning "adb not found. Install Android SDK Platform Tools first."
    fi
fi

print_success "Build process complete!"
