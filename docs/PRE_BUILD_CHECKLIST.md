# Android AAB Build Prerequisites Checklist

**Generated:** 2025-10-12
**Package Name:** com.armora.protection
**Target:** Google Play Store Deployment

---

## Executive Summary

### Overall Status: ⚠️ PARTIALLY READY

- ✅ **Core Configuration:** Complete
- ⚠️ **Environment Variables:** Partially configured
- ✅ **Build Scripts:** Ready and executable
- ❌ **TWA Project:** Not initialized (BLOCKING)
- ❌ **Android Keystore:** Missing (BLOCKING)
- ✅ **Digital Asset Links:** Configured correctly
- ⚠️ **Development Tools:** Java ready, Bubblewrap needs verification

### Estimated Time to Fix Blocking Issues: **30-45 minutes**

---

## 1. Environment Variables Status

### Required Variables for Build

| Variable | Status | Location | Notes |
|----------|--------|----------|-------|
| `REACT_APP_SUPABASE_URL` | ✅ **FOUND** | `.env` | Configured |
| `REACT_APP_SUPABASE_ANON_KEY` | ✅ **FOUND** | `.env` | Configured |
| `REACT_APP_FIREBASE_API_KEY` | ❌ **MISSING** | None | **REQUIRED** |
| `REACT_APP_FIREBASE_PROJECT_ID` | ❌ **MISSING** | None | **REQUIRED** |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | ❌ **MISSING** | None | **REQUIRED** |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | ❌ **MISSING** | None | **REQUIRED** |
| `REACT_APP_FIREBASE_APP_ID` | ❌ **MISSING** | None | **REQUIRED** |
| `REACT_APP_FIREBASE_VAPID_KEY` | ❌ **MISSING** | None | **REQUIRED** |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | ❌ **MISSING** | None | **REQUIRED** |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | ❌ **MISSING** | None | **REQUIRED** |

**Note:** `.env.local` file does not exist. Only `.env` found with limited configuration.

### How to Fix

1. **Create `.env.local` file** in project root:
```bash
cp .env .env.local
```

2. **Add Firebase credentials** (from Firebase Console → Project Settings → General):
```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU
REACT_APP_FIREBASE_AUTH_DOMAIN=armora-protection.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=armora-protection
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1010601153585
REACT_APP_FIREBASE_APP_ID=1:1010601153585:web:YOUR_WEB_APP_ID
REACT_APP_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_HERE
```

3. **Add Google Maps API Key** (from Google Cloud Console):
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY
```

4. **Add Stripe Publishable Key** (from Stripe Dashboard):
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_KEY
```

### Verification Command
```bash
bash scripts/verify-firebase.sh
```

**Estimated Time:** 10-15 minutes (gathering credentials + configuration)

---

## 2. Build Scripts Status

### Build Script Files

| Script | Status | Executable | Lines | Purpose |
|--------|--------|-----------|-------|---------|
| `scripts/android-build.sh` | ✅ **READY** | Yes (777) | 208 | Main build automation |
| `scripts/verify-firebase.sh` | ✅ **READY** | Yes (777) | 207 | Firebase config verification |
| `scripts/prepare-playstore.sh` | ✅ **READY** | Yes (777) | 344 | Pre-submission checklist |

All scripts are executable and properly configured. No action needed.

### Verification Command
```bash
ls -lah scripts/*.sh
```

---

## 3. TWA (Trusted Web Activity) Configuration

### Status: ❌ **MISSING - BLOCKING ISSUE**

| Item | Status | Notes |
|------|--------|-------|
| `twa-manifest.json` | ❌ **NOT FOUND** | Must be initialized |
| TWA project structure | ❌ **NOT CREATED** | Bubblewrap not initialized |
| AAB file | ❌ **NOT FOUND** | Will be created after build |

### How to Fix

The TWA project has not been initialized yet. This is required before building the AAB file.

**Step 1: Install Bubblewrap CLI** (if not already installed)
```bash
npm install -g @bubblewrap/cli
```

**Step 2: Verify Bubblewrap installation**
```bash
bubblewrap --version
```

**Step 3: Run Bubblewrap doctor** (checks Java, Android SDK)
```bash
bubblewrap doctor
```

**Step 4: Initialize TWA project**
```bash
bubblewrap init --manifest=https://armora.vercel.app/manifest.json
```

You'll be prompted for:
- Package name: `com.armora.protection` ✅ (already known)
- App name: `Armora`
- Host URL: `https://armora.vercel.app`
- Theme color: `#1a1a2e`
- Background color: `#1a1a2e`
- Start URL: `/`
- Display mode: `standalone`

**Estimated Time:** 10-15 minutes (includes tool verification)

---

## 4. Android Keystore Status

### Status: ❌ **MISSING - BLOCKING ISSUE**

| Item | Status | Notes |
|------|--------|-------|
| `android.keystore` | ❌ **NOT FOUND** | Required for signing AAB |
| Keystore credentials | ❌ **NOT CONFIGURED** | Need to create |

### How to Fix

The Android keystore is required for signing the AAB file. It must be created once and stored securely.

**Create Keystore:**
```bash
keytool -genkey -v -keystore android.keystore \
  -alias armora-release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You'll be prompted for:
- Keystore password (SAVE THIS SECURELY!)
- Key password (SAVE THIS SECURELY!)
- Your name/organization details

**CRITICAL:** Store the keystore password and key alias password in a secure location (password manager, secure notes). You'll need these for:
1. Building the AAB
2. Future updates (same keystore required)
3. Play Store submission

**After creating keystore:**
```bash
# Verify keystore was created
ls -lh android.keystore

# Get SHA-256 fingerprint (needed for Digital Asset Links)
keytool -list -v -keystore android.keystore -alias armora-release | grep SHA256
```

**Security Note:** The `android.keystore` file should NEVER be committed to Git (already in .gitignore).

**Estimated Time:** 5 minutes (creation + documentation)

---

## 5. Digital Asset Links Status

### Status: ✅ **CONFIGURED CORRECTLY**

| Item | Status | Details |
|------|--------|---------|
| `public/.well-known/assetlinks.json` | ✅ **EXISTS** | Valid JSON |
| Package name | ✅ **CORRECT** | `com.armora.protection` |
| SHA-256 fingerprint | ✅ **CONFIGURED** | `19:45:2B:F1:4A:AC:90:49:29:31:BC:F7:8F:B8:AD:EF:AA:EA:A2:77:E5:78:E5:37:2E:CA:70:66:AB:EA:FB:D2` |
| Production URL | ✅ **ACCESSIBLE** | https://armora.vercel.app/.well-known/assetlinks.json |

No action needed. Digital Asset Links are properly configured.

### Verification Command
```bash
curl -s https://armora.vercel.app/.well-known/assetlinks.json | jq .
```

**Note:** After creating a new keystore, you may need to update the SHA-256 fingerprint in `assetlinks.json` if it differs from the current value.

---

## 6. PWA Manifest Status

### Status: ✅ **VALID**

| Item | Status | Details |
|------|--------|---------|
| `public/manifest.json` | ✅ **EXISTS** | Valid JSON |
| App name | ✅ **CORRECT** | "Armora - Professional Close Protection Services" |
| Icons (192x192) | ✅ **CONFIGURED** | `logo192.png` |
| Icons (512x512) | ✅ **CONFIGURED** | `logo512.png` |
| Start URL | ✅ **CORRECT** | `/` |
| Display mode | ✅ **CORRECT** | `standalone` |
| Theme/Background | ✅ **CORRECT** | `#1a1a2e` |

No action needed. PWA manifest is valid and ready for TWA conversion.

### Verification Command
```bash
cat public/manifest.json | jq .
```

---

## 7. Firebase Service Worker Status

### Status: ✅ **CONFIGURED**

| Item | Status | Details |
|------|--------|---------|
| `public/firebase-messaging-sw.js` | ✅ **EXISTS** | 289 lines |
| Firebase API Key | ✅ **CONFIGURED** | AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU |
| Project ID | ✅ **CONFIGURED** | armora-protection |
| Messaging Sender ID | ✅ **CONFIGURED** | 1010601153585 |
| App ID | ✅ **CONFIGURED** | Android app ID |

No action needed. Service worker is properly configured for Firebase Cloud Messaging.

---

## 8. Development Tools Status

### Required Tools

| Tool | Status | Version | Notes |
|------|--------|---------|-------|
| Node.js | ✅ **INSTALLED** | (check with `node -v`) | Required 16+ |
| Java (JDK) | ✅ **INSTALLED** | OpenJDK 17.0.16 | ✅ Correct version |
| Bubblewrap CLI | ⚠️ **NEEDS VERIFICATION** | Unknown | Check installation |
| Android SDK | ⚠️ **UNKNOWN** | TBD | Needed for `bubblewrap doctor` |

### Verification Commands

**Check Node.js:**
```bash
node -v
# Should be v16.x or higher
```

**Check Java:**
```bash
java -version
# Should show OpenJDK 17.x (current: 17.0.16 ✅)
```

**Check/Install Bubblewrap:**
```bash
bubblewrap --version
# If not found, install:
npm install -g @bubblewrap/cli
```

**Run Bubblewrap Doctor:**
```bash
bubblewrap doctor
# This will check all prerequisites and guide you through any missing tools
```

**Estimated Time:** 5-10 minutes (verification + potential Android SDK setup)

---

## 9. Play Store Assets Status

### Status: ✅ **MOSTLY COMPLETE**

| Item | Status | Location | Dimensions | Notes |
|------|--------|----------|------------|-------|
| Feature Graphic | ✅ **READY** | `public/playstore/armoracpo-feature-graphic.png` | 1024x500 | Multiple versions available |
| App Icon | ✅ **READY** | `public/playstore/armoracpo-icon-512.png` | 512x512 | Multiple versions available |
| Screenshots | ⚠️ **OPTIONAL** | `public/playstore/` | N/A | Not required but recommended |
| Privacy Policy | ✅ **READY** | `public/privacy.html` | N/A | Accessible at production URL |

### Store Listing Content

| File | Status | Purpose |
|------|--------|---------|
| `playstore-listing.md` | ✅ **READY** | App store copy and descriptions |
| `playstore-metadata.json` | ✅ **READY** | Structured metadata |
| `playstore-submission-guide.md` | ✅ **READY** | Submission instructions |
| `release-notes.txt` | ✅ **READY** | Version release notes |

No immediate action needed. Screenshots can be added later (30-60 minutes estimated).

---

## 10. Build Process Workflow

Once all prerequisites are met, follow this workflow:

### Step 1: Verify Environment (5 min)
```bash
bash scripts/verify-firebase.sh
```

### Step 2: Run Production Build (5-10 min)
```bash
npm run build
```

### Step 3: Run Pre-submission Check (2 min)
```bash
bash scripts/prepare-playstore.sh
```

### Step 4: Build Android AAB (10-15 min)
```bash
bash scripts/android-build.sh
```

### Step 5: Verify Output
Expected files after successful build:
- `app-release-bundle.aab` (1.5-2.5 MB) - **Upload to Play Store**
- `app-release-signed.apk` (Optional) - For local testing
- `twa-manifest.json` - TWA configuration

---

## Summary of Blocking Issues

### Critical Issues (Must Fix Before Building)

1. **❌ TWA Project Not Initialized**
   - Action: Run `bubblewrap init --manifest=https://armora.vercel.app/manifest.json`
   - Time: 10-15 minutes
   - Impact: Cannot build AAB without TWA project

2. **❌ Android Keystore Missing**
   - Action: Generate keystore using `keytool`
   - Time: 5 minutes
   - Impact: Cannot sign AAB for Play Store

3. **❌ Environment Variables Missing**
   - Action: Create `.env.local` with all Firebase, Google Maps, and Stripe credentials
   - Time: 10-15 minutes
   - Impact: Production build will fail without complete configuration

### Total Estimated Fix Time: **30-45 minutes**

---

## Warnings (Non-Blocking)

1. **⚠️ Bubblewrap Installation Needs Verification**
   - May need to install with `npm install -g @bubblewrap/cli`
   - Time: 2-3 minutes

2. **⚠️ Android SDK May Need Setup**
   - `bubblewrap doctor` will guide you through this
   - Time: 10-20 minutes (if needed)

3. **⚠️ Play Store Screenshots Not Created**
   - Optional for initial submission
   - Can be added later
   - Time: 30-60 minutes (if creating now)

---

## Recommended Action Plan

### Phase 1: Environment Setup (15-20 min)

1. Create `.env.local` with all required credentials
2. Run `bash scripts/verify-firebase.sh` to verify
3. Install/verify Bubblewrap CLI: `npm install -g @bubblewrap/cli`

### Phase 2: TWA Initialization (10-15 min)

4. Run `bubblewrap doctor` to check prerequisites
5. Initialize TWA project: `bubblewrap init --manifest=https://armora.vercel.app/manifest.json`
6. Generate keystore if needed

### Phase 3: Build (15-20 min)

7. Run production build: `npm run build`
8. Run pre-submission check: `bash scripts/prepare-playstore.sh`
9. Build AAB: `bash scripts/android-build.sh`

### Phase 4: Verification (5-10 min)

10. Verify AAB file exists and size is reasonable (1.5-2.5 MB)
11. Test APK on device (if available): `adb install app-release-signed.apk`
12. Verify no URL bar appears (Digital Asset Links working)

### Total Time: **45-65 minutes**

---

## Quick Verification Commands

```bash
# Check all prerequisites at once
echo "=== Environment Variables ===" && \
  [ -f .env.local ] && echo "✅ .env.local exists" || echo "❌ .env.local missing" && \
echo "" && \
echo "=== TWA Configuration ===" && \
  [ -f twa-manifest.json ] && echo "✅ twa-manifest.json exists" || echo "❌ twa-manifest.json missing" && \
echo "" && \
echo "=== Android Keystore ===" && \
  [ -f android.keystore ] && echo "✅ android.keystore exists" || echo "❌ android.keystore missing" && \
echo "" && \
echo "=== Build Scripts ===" && \
  [ -x scripts/android-build.sh ] && echo "✅ android-build.sh executable" || echo "❌ android-build.sh not executable" && \
echo "" && \
echo "=== Tools ===" && \
  command -v node >/dev/null && echo "✅ Node.js: $(node -v)" || echo "❌ Node.js not found" && \
  command -v java >/dev/null && echo "✅ Java: $(java -version 2>&1 | head -1)" || echo "❌ Java not found" && \
  command -v bubblewrap >/dev/null && echo "✅ Bubblewrap: $(bubblewrap --version 2>&1 | head -1)" || echo "⚠️ Bubblewrap not found"
```

---

## Support Resources

- **Firebase Setup Guide:** `FIREBASE_SETUP.md`
- **Play Store Deployment Guide:** `PLAYSTORE_DEPLOYMENT.md`
- **Play Store Submission Guide:** `playstore-submission-guide.md`
- **Build Scripts:**
  - `scripts/android-build.sh` - Main build script
  - `scripts/verify-firebase.sh` - Firebase verification
  - `scripts/prepare-playstore.sh` - Pre-submission checklist

---

## Conclusion

**Current Status:** ⚠️ **NOT READY TO BUILD**

**Blocking Issues:** 3 critical items must be resolved first
- TWA project initialization
- Android keystore creation
- Environment variables configuration

**Recommendation:** **DO NOT PROCEED** with build until all blocking issues are resolved.

Follow the Action Plan above to systematically address each issue. Estimated total time to be build-ready: **30-45 minutes**.

Once blocking issues are resolved, re-run this checklist verification:
```bash
bash scripts/prepare-playstore.sh
```

---

**Document Generated:** 2025-10-12
**Last Updated:** 2025-10-12
**Version:** 1.0
