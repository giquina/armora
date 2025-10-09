# Google Play Store - Quick Start Guide

**Status**: 99% Complete | **Time to Production**: 1-2 weeks

---

## 🔥 Critical Path (3 Steps)

### 1. Get Firebase App ID (5 minutes)
```bash
# Visit Firebase Console
https://console.firebase.google.com/project/armora-protection

# Navigate: ⚙️ Settings → Project Settings → Your apps
# Copy App ID: 1:1010601153585:web:xxxxxxxxxxxx

# Update service worker
nano public/firebase-messaging-sw.js  # Line 28

# Update environment
echo "REACT_APP_FIREBASE_APP_ID=1:1010601153585:web:xxxxx" >> .env.local
```

### 2. Create Screenshots (30-60 minutes)
```bash
# Open production app
open https://armora.vercel.app

# Required screens (1080x1920 portrait):
1. Hub dashboard
2. Service selection (Essential/Executive/Shadow/Client Vehicle)
3. Booking flow with location picker
4. Real-time tracking map
5. Payment screen
6. Assignment history
7. Profile/credentials
8. EnhancedProtectionPanel

# Save to:
mkdir -p public/playstore
# Save as: screenshot-01.png, screenshot-02.png, etc.
```

### 3. Build & Submit (30 minutes)
```bash
# Verify configuration
npm run firebase:verify

# Run pre-flight checks
npm run android:prepare

# Build Android app
npm run android:build

# Result: app-release-bundle.aab (upload to Play Console)
```

---

## 📚 Documentation Quick Links

| Need | Document | Location |
|------|----------|----------|
| **Start here** | PLAYSTORE_COMPLETION_SUMMARY.md | Root directory |
| **Complete guide** | PLAYSTORE_DEPLOYMENT.md | Root directory |
| **Firebase setup** | FIREBASE_SETUP.md | Root directory |
| **App listing copy** | playstore-listing.md | Root directory |
| **Quick reference** | playstore-copy-paste.txt | Root directory |

---

## 🎯 Pre-Flight Checklist

Run this before building:

```bash
npm run android:prepare
```

This checks:
- ✅ Required files present
- ✅ Environment variables configured
- ✅ Digital Asset Links valid
- ✅ Graphics assets ready
- ✅ Privacy policy accessible
- ✅ App metadata complete

---

## 🚀 Build Commands

```bash
# Full build process
npm run android:build

# Or step-by-step:
npm run build              # React production build
bubblewrap init           # First time only
bubblewrap build          # Create AAB/APK
```

---

## 📱 Testing Locally

```bash
# Install on connected device
adb install app-release-signed.apk

# Verify Digital Asset Links working (no URL bar should appear)
# Test all features work correctly
```

---

## 🔑 What You Need

### Firebase Console
- **URL**: https://console.firebase.google.com/project/armora-protection
- **Need**: Firebase App ID

### Google Play Console
- **URL**: https://play.google.com/console (after account creation)
- **Cost**: $25 one-time registration fee
- **Upload**: app-release-bundle.aab

### Vercel Dashboard
- **URL**: https://vercel.com/dashboard
- **Update**: Add REACT_APP_FIREBASE_APP_ID environment variable

---

## ⚡ NPM Scripts

```bash
npm run android:build      # Build Android AAB/APK
npm run android:prepare    # Pre-submission checklist
npm run firebase:verify    # Firebase configuration check

npm run play:list          # List apps on Play Store
npm run play:status        # Check release status
npm run play:reviews       # View user reviews
```

---

## 🎨 Required Graphics

All graphics already exist in `public/playstore/`:

- ✅ **Feature Graphic**: 1024x500 PNG
- ✅ **App Icon**: 512x512 PNG
- ⚠️ **Screenshots**: Need 2-8 screenshots (1080x1920)

---

## 📝 App Details (Copy-Paste Ready)

```
Package Name: com.armora.protection
App Name: Armora - Professional Close Protection Services
Short Name: Armora CPO
Category: Business
Content Rating: PEGI 3 / Everyone

Privacy Policy: https://armora.vercel.app/privacy.html
Website: https://armora.vercel.app
Support Email: [Your support email]
```

Full copy available in: `playstore-listing.md`

---

## 🔒 Digital Asset Links

Current status: ✅ Configured

**File**: `public/.well-known/assetlinks.json`
**URL**: https://armora.vercel.app/.well-known/assetlinks.json

**After Play Store upload**:
1. Go to Play Console → Setup → App Integrity
2. Copy SHA-256 fingerprint from "App signing key certificate"
3. Add to assetlinks.json (keep existing fingerprint too)
4. Deploy updated file to Vercel

---

## 🐛 Troubleshooting

### URL Bar Appears
- Check Digital Asset Links accessible online
- Verify SHA-256 fingerprint matches
- Add Play Store signing fingerprint after upload
- Clear Play Services cache on device

### Build Fails
```bash
# Check prerequisites
bubblewrap doctor

# Fix JDK path
bubblewrap updateConfig

# Clean and retry
npm run fresh
npm run android:build
```

### Firebase Errors
```bash
# Verify configuration
npm run firebase:verify

# Check service worker
cat public/firebase-messaging-sw.js | grep "YOUR_APP_ID_HERE"
# Should return nothing (means it's configured)
```

---

## 🎉 Success Criteria

Before submitting to Play Store:

- [ ] Firebase App ID configured
- [ ] Screenshots created (minimum 2)
- [ ] `npm run android:prepare` passes all checks
- [ ] AAB file created successfully
- [ ] APK installs and runs on test device
- [ ] No URL bar appears (Digital Asset Links verified)
- [ ] Push notifications work
- [ ] All features functional

---

## 📞 Support

**Questions?** See comprehensive guides:
- PLAYSTORE_DEPLOYMENT.md - Complete deployment process
- FIREBASE_SETUP.md - FCM configuration
- PLAYSTORE_COMPLETION_SUMMARY.md - Overall status

**Issues?** Check troubleshooting sections in documentation

---

**Last Updated**: October 9, 2025
**Project Status**: 99% Complete
**Next Milestone**: Firebase App ID + Screenshots → 100% Complete
