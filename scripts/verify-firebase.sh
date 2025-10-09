#!/bin/bash
################################################################################
# Armora - Firebase Configuration Verification Script
# Verifies Firebase setup and helps retrieve missing credentials
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

print_header "Firebase Configuration Verification"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local not found"
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    print_warning "Please edit .env.local with your Firebase credentials"
    exit 1
fi

# Source environment variables
source .env.local

# Firebase credentials to check
print_header "Checking Firebase Credentials"

# API Key
if [ -n "$REACT_APP_FIREBASE_API_KEY" ]; then
    if [ "$REACT_APP_FIREBASE_API_KEY" = "your_firebase_api_key_here" ]; then
        print_error "REACT_APP_FIREBASE_API_KEY not configured"
    else
        print_success "REACT_APP_FIREBASE_API_KEY: ${REACT_APP_FIREBASE_API_KEY:0:20}..."
    fi
else
    print_error "REACT_APP_FIREBASE_API_KEY missing"
fi

# Auth Domain
if [ -n "$REACT_APP_FIREBASE_AUTH_DOMAIN" ]; then
    print_success "REACT_APP_FIREBASE_AUTH_DOMAIN: $REACT_APP_FIREBASE_AUTH_DOMAIN"
else
    print_error "REACT_APP_FIREBASE_AUTH_DOMAIN missing"
fi

# Project ID
if [ -n "$REACT_APP_FIREBASE_PROJECT_ID" ]; then
    print_success "REACT_APP_FIREBASE_PROJECT_ID: $REACT_APP_FIREBASE_PROJECT_ID"
else
    print_error "REACT_APP_FIREBASE_PROJECT_ID missing"
fi

# Messaging Sender ID
if [ -n "$REACT_APP_FIREBASE_MESSAGING_SENDER_ID" ]; then
    print_success "REACT_APP_FIREBASE_MESSAGING_SENDER_ID: $REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
else
    print_error "REACT_APP_FIREBASE_MESSAGING_SENDER_ID missing"
fi

# App ID
if [ -n "$REACT_APP_FIREBASE_APP_ID" ]; then
    if [ "$REACT_APP_FIREBASE_APP_ID" = "your_app_id_here" ]; then
        print_error "REACT_APP_FIREBASE_APP_ID not configured"
        echo ""
        print_info "To get your Firebase App ID:"
        echo "  1. Visit: https://console.firebase.google.com/project/armora-protection"
        echo "  2. Click gear icon → Project Settings"
        echo "  3. Scroll to 'Your apps' section"
        echo "  4. Find your web app"
        echo "  5. Copy the 'App ID' value"
        echo "  6. Format: 1:1010601153585:web:xxxxxxxxxxxx"
    else
        print_success "REACT_APP_FIREBASE_APP_ID: $REACT_APP_FIREBASE_APP_ID"
    fi
else
    print_error "REACT_APP_FIREBASE_APP_ID missing"
fi

# VAPID Key
if [ -n "$REACT_APP_FIREBASE_VAPID_KEY" ]; then
    if [ "$REACT_APP_FIREBASE_VAPID_KEY" = "your_vapid_key_here" ]; then
        print_error "REACT_APP_FIREBASE_VAPID_KEY not configured"
        echo ""
        print_info "To get your VAPID key:"
        echo "  1. Visit: https://console.firebase.google.com/project/armora-protection"
        echo "  2. Click gear icon → Project Settings"
        echo "  3. Go to 'Cloud Messaging' tab"
        echo "  4. Scroll to 'Web Push certificates'"
        echo "  5. Copy the key pair value"
    else
        print_success "REACT_APP_FIREBASE_VAPID_KEY: ${REACT_APP_FIREBASE_VAPID_KEY:0:30}..."
    fi
else
    print_error "REACT_APP_FIREBASE_VAPID_KEY missing"
fi

# Check service worker file
print_header "Checking Service Worker Configuration"

SW_FILE="public/firebase-messaging-sw.js"

if [ -f "$SW_FILE" ]; then
    print_success "Service worker file exists: $SW_FILE"

    # Check if App ID is configured in service worker
    if grep -q "YOUR_APP_ID_HERE" "$SW_FILE"; then
        print_error "Service worker still has placeholder App ID"
        print_info "Update line 28 in $SW_FILE with actual Firebase App ID"
    else
        print_success "Service worker App ID appears configured"
    fi

    # Check API key
    if grep -q "AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU" "$SW_FILE"; then
        print_success "Service worker has correct API key"
    else
        print_warning "Service worker API key may need updating"
    fi
else
    print_error "Service worker not found: $SW_FILE"
fi

# Check if Firebase lib exists
print_header "Checking Firebase SDK"

if [ -f "src/lib/firebase.ts" ]; then
    print_success "Firebase SDK wrapper exists: src/lib/firebase.ts"
else
    print_warning "Firebase SDK wrapper not found (optional)"
fi

# Test Firebase URLs
print_header "Testing Firebase Endpoints"

# Test Auth Domain
if [ -n "$REACT_APP_FIREBASE_AUTH_DOMAIN" ]; then
    if curl -s --head "https://$REACT_APP_FIREBASE_AUTH_DOMAIN" | grep "200 OK" > /dev/null; then
        print_success "Auth domain is accessible"
    else
        print_warning "Auth domain connectivity check failed (may be firewall/network)"
    fi
fi

# Check node_modules
print_header "Checking Firebase Dependencies"

if [ -d "node_modules/firebase" ]; then
    FIREBASE_VERSION=$(node -p "require('./node_modules/firebase/package.json').version" 2>/dev/null || echo "unknown")
    print_success "Firebase SDK installed: v$FIREBASE_VERSION"
else
    print_error "Firebase SDK not installed"
    print_info "Run: npm install firebase"
fi

# Summary
print_header "Verification Summary"

ISSUES=0

# Count issues
[ -z "$REACT_APP_FIREBASE_API_KEY" ] && ((ISSUES++))
[ "$REACT_APP_FIREBASE_API_KEY" = "your_firebase_api_key_here" ] && ((ISSUES++))
[ -z "$REACT_APP_FIREBASE_APP_ID" ] && ((ISSUES++))
[ "$REACT_APP_FIREBASE_APP_ID" = "your_app_id_here" ] && ((ISSUES++))
[ -z "$REACT_APP_FIREBASE_VAPID_KEY" ] && ((ISSUES++))
[ "$REACT_APP_FIREBASE_VAPID_KEY" = "your_vapid_key_here" ] && ((ISSUES++))

if [ "$ISSUES" -eq 0 ]; then
    print_success "All Firebase credentials are configured!"
    echo ""
    echo "Next steps:"
    echo "  1. Test notifications: npm start"
    echo "  2. Check browser console for Firebase initialization"
    echo "  3. Request notification permissions"
    echo "  4. Send test message from Firebase Console"
else
    print_warning "Found $ISSUES configuration issue(s)"
    echo ""
    echo "To fix:"
    echo "  1. Edit .env.local with correct Firebase credentials"
    echo "  2. Update $SW_FILE if App ID is still placeholder"
    echo "  3. Run this script again: bash scripts/verify-firebase.sh"
    echo "  4. Restart dev server: npm start"
fi

echo ""
print_info "Documentation:"
echo "  • FIREBASE_SETUP.md - Complete setup guide"
echo "  • Firebase Console: https://console.firebase.google.com/project/armora-protection"
echo ""
