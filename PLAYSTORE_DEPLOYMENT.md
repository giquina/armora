# Google Play Store Deployment Guide

**Complete deployment documentation for Armora Security Transport Android app**

Last Updated: 2025-10-09

---

## Table of Contents

1. [Pre-Submission Checklist](#1-pre-submission-checklist)
2. [Firebase Setup](#2-firebase-setup)
3. [TWA/Capacitor Build Process](#3-twacapacitor-build-process)
4. [Play Store Console Steps](#4-play-store-console-steps)
5. [GitHub Actions Workflow](#5-github-actions-workflow)
6. [Post-Deployment](#6-post-deployment)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Pre-Submission Checklist

### Required Files Verification

Run this checklist before attempting deployment:

```bash
# Verify all required files exist
ls -la /workspaces/armora/public/.well-known/assetlinks.json  # Android App Links
ls -la /workspaces/armora/public/manifest.json                # PWA manifest
ls -la /workspaces/armora/public/privacy.html                 # Privacy policy
ls -la /workspaces/armora/capacitor.config.ts                 # Capacitor config
ls -la /workspaces/armora/public/playstore/                   # Play Store assets
```

### App Package Details

| Property | Value |
|----------|-------|
| **Package Name** | `com.armora.protection` |
| **App Name** | Armora Security Transport |
| **Version Code** | Auto-incremented in CI/CD |
| **Version Name** | Follows semver (e.g., 1.0.0) |
| **Target SDK** | 34 (Android 14) |
| **Min SDK** | 23 (Android 6.0) |

### Environment Variables Checklist

**Local Development** (`.env.local`):
```bash
# Firebase (Cloud Messaging)
REACT_APP_FIREBASE_API_KEY=AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU
REACT_APP_FIREBASE_AUTH_DOMAIN=armora-protection.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=armora-protection
REACT_APP_FIREBASE_STORAGE_BUCKET=armora-protection.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1010601153585
REACT_APP_FIREBASE_APP_ID=1:1010601153585:web:YOUR_APP_ID

# Supabase (Backend & Auth)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Stripe (Payments)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key

# Google Maps (Geocoding)
REACT_APP_GOOGLE_MAPS_API_KEY=your-maps-api-key
```

**Vercel Production** (Set in Vercel Dashboard):
- Go to https://vercel.com/your-org/armora/settings/environment-variables
- Add all the above variables
- Ensure they're available for Production environment

**GitHub Secrets** (Set in GitHub Settings > Secrets and variables > Actions):

```bash
# Required for build
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_STRIPE_PUBLISHABLE_KEY
REACT_APP_GOOGLE_MAPS_API_KEY

# Required for signing (release builds only)
ANDROID_KEYSTORE_BASE64      # Base64-encoded keystore file
ANDROID_KEYSTORE_PASSWORD    # Keystore password
ANDROID_KEY_ALIAS            # Key alias name
ANDROID_KEY_PASSWORD         # Key password
```

### Signing Key Verification

**Generate SHA-256 Fingerprint** (needed for Firebase, Play Console, assetlinks.json):

```bash
# From your keystore file
keytool -list -v -keystore /workspaces/armora/armora-release.keystore -alias armora

# Expected output includes:
# SHA256: 19:45:2B:F1:4A:AC:90:49:29:31:BC:F7:8F:B8:AD:EF:AA:EA:A2:77:E5:78:E5:37:2E:CA:70:66:AB:EA:FB:D2
```

**Verify assetlinks.json matches your signing key**:

```bash
curl https://armora.vercel.app/.well-known/assetlinks.json
# Should return JSON with matching SHA-256 fingerprint
```

### Asset Verification

**Icons & Graphics** (located in `/workspaces/armora/public/playstore/`):

- ✅ `armora-icon-512.png` - App icon (512x512, 32-bit PNG with alpha)
- ✅ `armora-feature-graphic.png` - Feature graphic (1024x500)
- 📸 Screenshots (REQUIRED, not yet created):
  - Phone screenshots: 2-8 images, 16:9 or 9:16 ratio
  - 7-inch tablet screenshots: 2-8 images (optional)
  - 10-inch tablet screenshots: 2-8 images (optional)

**Create Screenshots**:
```bash
# Use Chrome DevTools or Android emulator
# Recommended sizes:
# - Phone: 1080x1920 or 1440x2560
# - 7" tablet: 1200x1920
# - 10" tablet: 1600x2560

# Show key app features:
# 1. Welcome/Login screen
# 2. Hub with protection status
# 3. Protection booking flow
# 4. CPO details and credentials
# 5. Enhanced protection panel
```

---

## 2. Firebase Setup

### Initial Firebase Project Setup

1. **Access Firebase Console**:
   ```bash
   # Open in browser
   https://console.firebase.google.com/project/armora-protection
   ```

2. **Verify Cloud Messaging Configuration**:
   - Navigate to Project Settings → Cloud Messaging
   - Ensure Cloud Messaging API is **enabled**
   - Note your Sender ID: `1010601153585`

3. **Add Android App to Firebase**:
   ```
   Project Settings → General → Your apps → Add app → Android

   Android package name: com.armora.protection
   App nickname: Armora Security Transport
   Debug signing certificate SHA-1: (optional for development)
   ```

4. **Download google-services.json**:
   ```bash
   # After adding Android app, download google-services.json
   # Place it in: /workspaces/armora/android/app/google-services.json

   # IMPORTANT: Add to .gitignore to avoid committing sensitive data
   echo "android/app/google-services.json" >> .gitignore
   ```

### Configure Cloud Messaging for Web (PWA)

5. **Generate VAPID Key**:
   ```
   Firebase Console → Project Settings → Cloud Messaging → Web configuration
   Click "Generate key pair"
   Copy the key pair
   ```

6. **Add VAPID Key to Environment**:
   ```bash
   # Add to .env.local
   REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key-here

   # Add to Vercel environment variables
   # Add to GitHub secrets for CI/CD
   ```

### Service Worker Registration

7. **Verify Firebase Messaging in App**:

   Check `/workspaces/armora/src/firebase-config.ts` or similar:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getMessaging, getToken, onMessage } from 'firebase/messaging';

   const firebaseConfig = {
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.REACT_APP_FIREBASE_APP_ID,
   };

   const app = initializeApp(firebaseConfig);
   const messaging = getMessaging(app);
   ```

8. **Test Firebase Notifications**:
   ```bash
   # In Firebase Console → Cloud Messaging → Send test message
   # Enter your FCM token (get from browser console)
   # Send notification and verify receipt
   ```

### Firebase Android Configuration

9. **Add Firebase SDK to Android App**:

   In `/workspaces/armora/android/app/build.gradle`, verify:
   ```gradle
   dependencies {
     implementation platform('com.google.firebase:firebase-bom:32.7.0')
     implementation 'com.google.firebase:firebase-messaging'
   }
   ```

   In `/workspaces/armora/android/build.gradle`:
   ```gradle
   buildscript {
     dependencies {
       classpath 'com.google.gms:google-services:4.4.0'
     }
   }
   ```

   At the end of `/workspaces/armora/android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

---

## 3. TWA/Capacitor Build Process

### Current Setup: Capacitor (Recommended)

The project uses **Capacitor** for Android builds (more flexibility than TWA).

### Install Capacitor (if not already installed)

```bash
# Install Capacitor CLI and Android platform
npm install -D @capacitor/cli
npm install @capacitor/core @capacitor/android

# Initialize Capacitor (only if not already done)
npx cap init "Armora Security Transport" "com.armora.protection" --web-dir=build
```

### Verify Capacitor Configuration

Check `/workspaces/armora/capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.armora.protection',
  appName: 'Armora Security Transport',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a2e",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#FFD700"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
```

### Build Process (Local)

```bash
# 1. Build React app for production
npm run build

# 2. Add Android platform (first time only)
npx cap add android

# 3. Sync web assets to Android project
npx cap sync android

# 4. Open Android Studio (for manual builds)
npx cap open android

# In Android Studio:
# - Build → Generate Signed Bundle / APK
# - Choose "Android App Bundle"
# - Select your keystore file
# - Enter keystore password and key alias
# - Choose "release" build variant
# - Click Finish
```

### Build Process (Command Line)

```bash
# Build AAB (Android App Bundle) for Play Store
cd android
./gradlew bundleRelease

# Build APK for testing
./gradlew assembleRelease

# Output locations:
# AAB: android/app/build/outputs/bundle/release/app-release.aab
# APK: android/app/build/outputs/apk/release/app-release.apk
```

### Sign the App Bundle (Manual)

```bash
# Sign the AAB with your keystore
jarsigner -verbose \
  -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore /workspaces/armora/armora-release.keystore \
  android/app/build/outputs/bundle/release/app-release.aab \
  armora

# Verify signature
jarsigner -verify -verbose -certs \
  android/app/build/outputs/bundle/release/app-release.aab
```

### Configure Automatic Signing in Gradle

Edit `/workspaces/armora/android/app/build.gradle`:

```gradle
android {
    // ... other config

    signingConfigs {
        release {
            if (project.hasProperty('RELEASE_STORE_FILE')) {
                storeFile file(RELEASE_STORE_FILE)
                storePassword RELEASE_STORE_PASSWORD
                keyAlias RELEASE_KEY_ALIAS
                keyPassword RELEASE_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

Create `/workspaces/armora/android/gradle.properties`:
```properties
# DO NOT commit this file - add to .gitignore
RELEASE_STORE_FILE=../armora-release.keystore
RELEASE_STORE_PASSWORD=your_keystore_password
RELEASE_KEY_ALIAS=armora
RELEASE_KEY_PASSWORD=your_key_password
```

### Alternative: TWA with Bubblewrap (Legacy)

If you prefer Trusted Web Activity approach:

```bash
# Install Bubblewrap globally
npm install -g @bubblewrap/cli

# Initialize TWA project
bubblewrap init --manifest https://armora.vercel.app/manifest.json

# Update TWA
bubblewrap update

# Build AAB and APK
bubblewrap build

# Output in: app-release-bundle.aab and app-release.apk
```

### Testing the Build Locally

```bash
# Install APK on connected device or emulator
adb install android/app/build/outputs/apk/release/app-release.apk

# Or use bundletool to test AAB
bundletool build-apks --bundle=android/app/build/outputs/bundle/release/app-release.aab \
  --output=armora.apks \
  --ks=/workspaces/armora/armora-release.keystore \
  --ks-pass=pass:your_password \
  --ks-key-alias=armora \
  --key-pass=pass:your_key_password

bundletool install-apks --apks=armora.apks
```

---

## 4. Play Store Console Steps

### Create Google Play Developer Account

1. **Sign up**: https://play.google.com/console/signup
   - One-time $25 registration fee
   - Requires valid payment method
   - Verification can take 1-2 days

2. **Complete account verification**:
   - Verify email address
   - Provide developer details
   - Accept Developer Distribution Agreement

### Create New App

3. **Navigate to Google Play Console**:
   ```
   https://play.google.com/console/
   Click "Create app"
   ```

4. **Fill App Details**:
   ```
   App name: Armora Security Transport
   Default language: English (United Kingdom) - en-GB
   App or game: App
   Free or paid: Free

   Declarations:
   ☑ Developer Program Policies
   ☑ US export laws
   ```

### Dashboard Setup Tasks

5. **Set up your app** (Dashboard Tasks):

   **Store settings**:
   - App category: Business
   - Tags: Security, Professional Services, Transportation
   - Contact details:
     - Email: support@armora.co.uk (or your support email)
     - Phone: (optional)
     - Website: https://armora.vercel.app
   - Store listing contact: (same as above)

   **Main store listing**:
   ```
   App name: Armora Security Transport

   Short description (80 chars max):
   Professional SIA-licensed close protection and executive security services

   Full description (4000 chars max):
   Armora delivers premium close protection services across England & Wales. Our SIA-licensed Close Protection Officers (CPOs) provide professional executive security, bodyguard services, and secure transport for high-profile individuals, corporate executives, and VIPs.

   🛡️ PROFESSIONAL SECURITY SERVICES
   - Essential Protection: SIA Level 2 certified CPOs (£65/hour)
   - Executive Protection: SIA Level 3 corporate bodyguards (£95/hour)
   - Shadow Protocol: Special Forces trained security (£125/hour)
   - Client Vehicle Service: Professional security driver (£55/hour)

   ✅ FULLY SIA COMPLIANT
   All protection officers are Security Industry Authority licensed with verified credentials, extensive background checks, and professional training. We maintain full compliance with UK security regulations and Martyn's Law requirements.

   📱 PROFESSIONAL FEATURES
   - Real-time CPO tracking and status updates
   - Secure principal-CPO communication
   - Professional risk assessment
   - 24/7 protection coordination
   - Detailed assignment history

   🎯 NATIONWIDE COVERAGE
   Complete service across England & Wales including:
   - London and Greater London
   - Major cities and airports
   - Regional protection services
   - Specialized venue security

   🔒 SECURITY & PRIVACY
   Military-grade encryption, secure data handling, and strict privacy protocols ensure your information remains confidential.

   For discerning individuals and organizations requiring professional close protection services, Armora provides unmatched security expertise and professional discretion.
   ```

   **App icon**: Upload `/workspaces/armora/public/playstore/armora-icon-512.png`

   **Feature graphic**: Upload `/workspaces/armora/public/playstore/armora-feature-graphic.png`

   **Phone screenshots**: Upload 2-8 screenshots (create these first - see Asset Verification section)

6. **Privacy Policy**:
   ```
   Privacy policy URL: https://armora.vercel.app/privacy.html
   ```

7. **App access**:
   - Choose "All functionality is available without special access"
   - Or if you have restricted features: "All or some functionality is restricted"
   - Provide test credentials if needed

8. **Ads**:
   - "No, this app does not contain ads"

9. **Content rating**:
   - Click "Start questionnaire"
   - Category: Utility, Productivity, Communication, or Other
   - Target age group: 18+
   - Answer all security/content questions (typically all "No" for business app)
   - Submit for rating

10. **Target audience**:
    - Target age: 18 and older only
    - Appeal to children: No

11. **News apps** (if applicable):
    - Select "No" unless app provides news content

12. **COVID-19 contact tracing and status apps**:
    - Select "No"

13. **Data safety**:

    **Important**: This section requires detailed information about data collection and sharing.

    Data types collected:
    - ✅ Location (approximate and precise) - for protection services
    - ✅ Personal info (name, email, phone) - for account management
    - ✅ Financial info (payment info) - for service payments
    - ✅ App activity (app interactions) - for service optimization
    - ❌ Photos/videos - not collected
    - ❌ Audio files - not collected
    - ❌ Files/docs - not collected
    - ❌ Calendar - not collected
    - ❌ Contacts - not collected

    Data sharing: No (data not shared with third parties)

    Security practices:
    - ✅ Data encrypted in transit
    - ✅ Data encrypted at rest
    - ✅ Users can request data deletion
    - ✅ Committed to Play Families Policy

### Upload App Bundle

14. **Production release**:
    ```
    Dashboard → Production → Create new release

    Upload your AAB file:
    android/app/build/outputs/bundle/release/app-release.aab

    Release name: 1.0.0 (matches your version)

    Release notes (500 chars, each language):
    🚀 Initial release of Armora Security Transport

    ✅ Professional SIA-licensed close protection services
    ✅ Real-time CPO tracking and communication
    ✅ Four protection tiers: Essential, Executive, Shadow Protocol, Client Vehicle
    ✅ Complete England & Wales coverage
    ✅ Secure payment integration
    ✅ 24/7 professional security coordination

    Download now for premium close protection services.
    ```

15. **Countries/regions**:
    - Add countries: United Kingdom (primary)
    - Optionally: Other English-speaking countries if expanding

16. **Save and review**:
    - Review all sections for completeness
    - Fix any warnings or errors
    - Click "Save"

### Submit for Review

17. **Final submission**:
    ```
    Dashboard → Production → Send X version for review

    Review typically takes 1-7 days
    You'll receive email notification when:
    - Review starts
    - App is approved
    - App is published
    - Or if changes are required
    ```

### Pre-launch Report

18. **Review pre-launch report** (automatic after upload):
    - Google tests your app on real devices
    - Check for crashes, performance issues, accessibility
    - Address any critical issues before publishing

---

## 5. GitHub Actions Workflow

### Workflow Overview

The Android build is automated via GitHub Actions in `/workspaces/armora/.github/workflows/android-build.yml`.

**Workflow triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch with build type selection

### Setting Up GitHub Secrets

1. **Navigate to GitHub Settings**:
   ```
   https://github.com/your-org/armora/settings/secrets/actions
   ```

2. **Add Repository Secrets**:

   **Environment Variables** (required for build):
   ```
   REACT_APP_SUPABASE_URL
   REACT_APP_SUPABASE_ANON_KEY
   REACT_APP_FIREBASE_API_KEY
   REACT_APP_FIREBASE_AUTH_DOMAIN
   REACT_APP_FIREBASE_PROJECT_ID
   REACT_APP_FIREBASE_STORAGE_BUCKET
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID
   REACT_APP_FIREBASE_APP_ID
   REACT_APP_STRIPE_PUBLISHABLE_KEY
   REACT_APP_GOOGLE_MAPS_API_KEY
   REACT_APP_SENTRY_DSN (optional)
   ```

   **Signing Secrets** (required for release builds):

   **ANDROID_KEYSTORE_BASE64**:
   ```bash
   # Convert keystore to Base64
   base64 -i /workspaces/armora/armora-release.keystore | tr -d '\n' > keystore.txt

   # Copy content of keystore.txt and add as GitHub secret
   cat keystore.txt
   ```

   **ANDROID_KEYSTORE_PASSWORD**: Your keystore password

   **ANDROID_KEY_ALIAS**: Your key alias (e.g., `armora`)

   **ANDROID_KEY_PASSWORD**: Your key password (often same as keystore password)

### Workflow Structure

**Prepare Job**:
- Checks out repository
- Sets up Node.js
- Installs dependencies
- Builds React production bundle
- Initializes Capacitor
- Adds/syncs Android platform
- Patches Gradle versions for compatibility
- Uploads Android project as artifact

**Build Job**:
- Downloads Android project artifact
- Sets up Java 17 and Android SDK
- Configures signing (if secrets available)
- Builds debug APK or release AAB based on input
- Uploads build artifacts
- Creates build summary

### Triggering Builds

**Automatic builds** (on push/PR):
```bash
# Commit and push to main or develop
git add .
git commit -m "feat: update Android app"
git push origin main
```

**Manual builds**:
```
1. Go to: https://github.com/your-org/armora/actions
2. Select "Android CI (Capacitor) – Build APK & AAB"
3. Click "Run workflow"
4. Choose branch and build type (debug/release)
5. Click "Run workflow"
```

### Downloading Build Artifacts

After successful build:
```
1. Go to workflow run page
2. Scroll to "Artifacts" section
3. Download:
   - "armora-debug-apk" (for testing)
   - "armora-release-aab" (for Play Store submission)
4. Extract and use
```

### Workflow Customization

Edit `/workspaces/armora/.github/workflows/android-build.yml`:

**Change app version**:
```yaml
env:
  VERSION_CODE: 1  # Increment for each release
  VERSION_NAME: "1.0.0"  # Semantic versioning
```

**Change build configuration**:
```yaml
env:
  ANDROID_API_LEVEL: 34  # Target SDK
  JAVA_VERSION: '17'     # Java version
  GRADLE_DISTRIBUTION: 8.7  # Gradle version
```

### CI/CD Best Practices

1. **Version Bumping**: Increment `VERSION_CODE` for each release
2. **Branch Protection**: Require successful builds before merging to main
3. **Release Tags**: Create Git tags for releases (e.g., `v1.0.0`)
4. **Artifact Retention**: Workflows retain artifacts for 30 days
5. **Secret Rotation**: Rotate signing keys and passwords periodically

---

## 6. Post-Deployment

### Monitor Play Store Listing

1. **Check App Status**:
   ```
   Play Console → Dashboard → Production

   Status indicators:
   - In review: Google is reviewing your app
   - Approved: App passed review
   - Published: Live on Play Store
   - Rejected: Changes required
   ```

2. **View Play Store Listing**:
   ```
   https://play.google.com/store/apps/details?id=com.armora.protection

   Verify:
   - App icon and graphics display correctly
   - Screenshots show properly
   - Description is formatted well
   - Privacy policy link works
   - Download/install works on devices
   ```

### Using MCP Google Play Tools (npm scripts)

The project includes Google Play MCP tools for management:

```bash
# List all apps in your developer account
npm run play:list

# Get detailed app information
npm run play:info

# View release status
npm run play:status

# Check reviews and ratings
npm run play:reviews

# View download statistics
npm run play:stats
```

**Setup MCP Google Play** (if not configured):
```bash
# Install MCP server
npm install -D @blocktopus/mcp-google-play

# Configure with Play Console credentials
# Follow: https://github.com/blocktopus/mcp-google-play#setup
```

### Update the App

**Version Management**:
```
Play Console → Production → Create new release

Version code: Must be higher than previous (e.g., 1 → 2 → 3)
Version name: Semantic versioning (e.g., 1.0.0 → 1.0.1 → 1.1.0)
```

**Release Types**:

1. **Staged Rollout** (recommended for major updates):
   ```
   Production → Create new release → Rollout percentage

   Start: 5% → 10% → 25% → 50% → 100%
   Monitor crash rates and reviews between stages
   Halt rollout if issues detected
   ```

2. **Full Rollout** (for minor updates/fixes):
   ```
   Production → Create new release → 100% rollout
   Immediate deployment to all users
   ```

3. **Internal Testing** (for alpha builds):
   ```
   Testing → Internal testing → Create new release
   Share with internal testers only
   ```

4. **Closed Testing** (for beta builds):
   ```
   Testing → Closed testing → Create new release
   Invite specific testers via email list
   ```

**Update Process**:
```bash
# 1. Make changes to your code
# 2. Increment version in package.json and Capacitor config
npm version patch  # 1.0.0 → 1.0.1 (bug fixes)
npm version minor  # 1.0.0 → 1.1.0 (new features)
npm version major  # 1.0.0 → 2.0.0 (breaking changes)

# 3. Build new AAB
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease

# 4. Upload to Play Console
# Production → Create new release → Upload AAB

# 5. Add release notes
# 6. Review and rollout
```

### Handle User Feedback

**Monitor Reviews**:
```
Play Console → Ratings and reviews

- Respond to reviews (especially negative ones)
- Address common issues in updates
- Thank users for positive feedback
```

**Reply to Reviews** (within 7 days recommended):
```
Play Console → Ratings and reviews → Click review → Reply

Template:
"Thank you for your feedback! We're working on [issue] and will release an update soon. Please contact support@armora.co.uk for immediate assistance."
```

**Track Crashes**:
```
Play Console → Quality → Android vitals → Crashes & ANRs

- Monitor crash rate (target: <0.5%)
- Address top crashes first
- Use stack traces to debug
```

### Marketing & ASO (App Store Optimization)

1. **Optimize Store Listing**:
   - A/B test app icons and screenshots
   - Refine description based on user feedback
   - Update keywords for better discoverability

2. **Promote Your App**:
   - Share Play Store link on website
   - Social media announcements
   - Email campaigns to existing users
   - Press releases for major updates

3. **Track Performance**:
   ```
   Play Console → Statistics

   Monitor:
   - Installs by device, country, Android version
   - Retention rates (1-day, 7-day, 30-day)
   - Uninstall rates
   - Store listing conversions
   ```

---

## 7. Troubleshooting

### Common Build Errors

#### Error: "Failed to find Build Tools revision X.X.X"

**Solution**:
```bash
# Update Build Tools version in workflow or gradle.properties
# Or install specific version:
sdkmanager "build-tools;34.0.0"
```

#### Error: "Execution failed for task ':app:lintVitalRelease'"

**Solution**:
```gradle
// In android/app/build.gradle
android {
    lintOptions {
        checkReleaseBuilds false
        // Or
        abortOnError false
    }
}
```

#### Error: "AAPT: error: resource android:attr/lStar not found"

**Solution**:
```gradle
// In android/app/build.gradle
android {
    compileSdkVersion 34  // Must match target SDK
}
```

#### Error: "Keystore was tampered with, or password was incorrect"

**Solution**:
```bash
# Verify keystore password
keytool -list -v -keystore /workspaces/armora/armora-release.keystore

# Re-encode keystore for GitHub secret
base64 -i /workspaces/armora/armora-release.keystore | tr -d '\n'

# Update GitHub secret ANDROID_KEYSTORE_BASE64
```

### Asset Links Verification Issues

#### Error: "Unable to verify domain association"

**Solution**:
```bash
# 1. Verify assetlinks.json is accessible
curl https://armora.vercel.app/.well-known/assetlinks.json

# 2. Ensure correct package name and SHA-256
cat /workspaces/armora/public/.well-known/assetlinks.json

# 3. Verify SHA-256 matches your keystore
keytool -list -v -keystore /workspaces/armora/armora-release.keystore -alias armora | grep SHA256

# 4. Test with Google's validator
# https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://armora.vercel.app&relation=delegate_permission/common.handle_all_urls
```

#### Error: "App not verified to open links"

**Solution**:
```xml
<!-- In android/app/src/main/AndroidManifest.xml -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="armora.vercel.app" />
</intent-filter>
```

### Signing Problems

#### Error: "App not signed with production key"

**Solution**:
```bash
# Ensure using release keystore, not debug
# In android/app/build.gradle:
android {
    signingConfigs {
        release {
            storeFile file('../armora-release.keystore')  # Correct path
            storePassword 'your_password'
            keyAlias 'armora'
            keyPassword 'your_password'
        }
    }
}
```

#### Error: "Signature does not match previous version"

**Solution**:
- You must use the SAME keystore for all updates
- If you lost your keystore, you CANNOT update the app
- You'll need to publish a new app with a different package name
- **Always backup your keystore securely**

### Firebase Notification Testing

#### Notifications not received on device

**Solution**:
```bash
# 1. Verify Firebase configuration
# Check firebase-config.ts has correct credentials

# 2. Test FCM token generation
# In browser console (when app is running):
# Should see FCM token logged

# 3. Send test notification from Firebase Console
# Cloud Messaging → Send test message → Paste FCM token

# 4. Check notification permissions
# Ensure app has notification permissions enabled

# 5. Verify service worker is registered
# DevTools → Application → Service Workers
```

#### Error: "messaging/failed-service-worker-registration"

**Solution**:
```javascript
// Ensure service worker is properly registered
// In public/sw.js or public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU",
  authDomain: "armora-protection.firebaseapp.com",
  projectId: "armora-protection",
  storageBucket: "armora-protection.firebasestorage.app",
  messagingSenderId: "1010601153585",
  appId: "1:1010601153585:web:YOUR_APP_ID"
});

const messaging = firebase.messaging();
```

### Play Console Rejection Reasons

#### Reason: "Misleading claims about functionality"

**Fix**:
- Ensure all features described in listing are present in app
- Remove exaggerated claims
- Update screenshots to show actual app features

#### Reason: "Privacy policy does not disclose data collection"

**Fix**:
```
Update /workspaces/armora/public/privacy.html to include:
- What data is collected (location, personal info, payment)
- How data is used (service delivery, payments, support)
- Third-party sharing (if any)
- Data retention policies
- User rights (access, deletion, opt-out)
- Contact information
```

#### Reason: "Requires permissions not used in app"

**Fix**:
```xml
<!-- In android/app/src/main/AndroidManifest.xml -->
<!-- Remove unused permissions -->
<!-- Only include necessary permissions like: -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

#### Reason: "Content rating incorrect"

**Fix**:
- Retake content rating questionnaire
- Answer accurately based on app content
- Ensure target age is 18+ for security services

### CI/CD Issues

#### Secrets not available in workflow

**Solution**:
```bash
# 1. Verify secrets are set in GitHub Settings → Secrets and variables → Actions
# 2. Check secret names match exactly in workflow YAML
# 3. Ensure workflow has permissions to access secrets
# 4. For organization repos, check organization-level restrictions

# Test secret availability:
# Add to workflow step:
- name: Debug secrets
  run: |
    if [ -z "${{ secrets.REACT_APP_SUPABASE_URL }}" ]; then
      echo "ERROR: REACT_APP_SUPABASE_URL not set"
      exit 1
    fi
```

#### Workflow timeout

**Solution**:
```yaml
# In .github/workflows/android-build.yml
jobs:
  build:
    timeout-minutes: 60  # Increase from default 30
```

#### Gradle build fails with OOM

**Solution**:
```gradle
// In android/gradle.properties
org.gradle.jvmargs=-Xmx4g -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.caching=true
```

### Getting Help

**Google Play Console Support**:
- https://support.google.com/googleplay/android-developer
- Policy support: https://support.google.com/googleplay/android-developer/answer/9859455

**Capacitor Documentation**:
- https://capacitorjs.com/docs/android
- https://capacitorjs.com/docs/apis/push-notifications

**Firebase Documentation**:
- https://firebase.google.com/docs/cloud-messaging
- https://firebase.google.com/docs/android/setup

**Community Support**:
- Stack Overflow: Tag your questions with `android`, `capacitor`, `google-play`
- Capacitor Discord: https://discord.gg/UPYYRhtyzp
- Android Developers: https://www.reddit.com/r/androiddev

---

## Quick Reference Commands

```bash
# Build production React app
npm run build

# Sync to Android
npx cap sync android

# Build release AAB
cd android && ./gradlew bundleRelease

# Build debug APK
cd android && ./gradlew assembleDebug

# Open Android Studio
npx cap open android

# Install on device
adb install android/app/build/outputs/apk/release/app-release.apk

# Check keystore
keytool -list -v -keystore armora-release.keystore

# Encode keystore for GitHub
base64 -i armora-release.keystore | tr -d '\n'

# Test assetlinks.json
curl https://armora.vercel.app/.well-known/assetlinks.json

# Verify deployment
npm run verify

# View Play Store apps
npm run play:list

# Check build health
npm run health
```

---

## Next Steps After Approval

1. ✅ **Celebrate!** Your app is live on Google Play Store
2. 📊 Set up analytics (Google Analytics, Firebase Analytics)
3. 🔔 Configure Firebase Cloud Messaging for production
4. 💳 Complete Stripe payment integration
5. 🧪 Expand test coverage (see CLAUDE.md for testing commands)
6. 🚀 Plan version 1.1.0 with new features
7. 📈 Monitor user feedback and crash reports
8. 🎯 Implement feature requests from users
9. 🔄 Set up automated release pipeline
10. 🌍 Consider expanding to other markets

---

**Document maintained by**: Armora Development Team
**Last updated**: 2025-10-09
**For questions**: Refer to CLAUDE.md or create GitHub issue
