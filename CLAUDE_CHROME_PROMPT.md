# Claude Chrome Extension - Final Armora Deployment Prompt

Copy and paste this entire prompt to Claude Chrome extension to complete the final 1% of Armora deployment.

---

## Context

You are helping complete the **final 1%** of the Armora project - a professional close protection services platform. The project is **99% complete** with all code, documentation, and preparation work finished. Only execution tasks remain.

**Project Details:**
- **Live URL:** https://armora.vercel.app
- **Package:** com.armora.protection
- **Status:** Production-ready PWA, needs Android app build and Play Store submission

**Current Environment:**
- All source code complete and deployed
- Firebase Cloud Messaging configured (289-line service worker)
- Build automation scripts ready (`scripts/android-build.sh`)
- Play Store marketing materials complete (`playstore-listing.md`)
- Privacy policy deployed online
- Digital Asset Links configured

---

## Your Tasks (2 hours total)

### Task 1: Take 8 Screenshots (45 minutes)

**Requirements:**
- Dimensions: **1080x1920 pixels** (portrait, phone)
- Format: PNG or JPEG
- Minimum: 2 screenshots
- Recommended: 8 screenshots

**Screens to Capture:**

1. **Hub Dashboard** (`/?view=home`)
   - Shows NavigationCards and greeting header
   - Demonstrates main navigation

2. **Service Selection** (During booking flow)
   - Shows 4 tiers: Essential (£65/h), Executive (£95/h), Shadow Protocol (£125/h), Client Vehicle (£55/h)
   - Professional security branding

3. **Booking Flow - Where & When** (`WhereWhenView`)
   - Location inputs with map
   - Date/time picker
   - Shows professional UI

4. **Live Tracking Map** (`LiveTrackingMap`)
   - Real-time CPO location
   - Route visualization
   - ETA display

5. **EnhancedProtectionPanel** (During active assignment)
   - Shows collapsed state (82px height)
   - CPO credentials with SIA license
   - Emergency buttons

6. **Payment Screen** (`PaymentIntegration`)
   - Stripe Elements integration
   - Payment summary
   - Professional design

7. **Assignment History** (`AssignmentHistory`)
   - Past assignments list
   - Filtering and sorting
   - Rating system

8. **Account/Profile View**
   - User information
   - Settings
   - Professional layout

**How to Capture:**
1. Open https://armora.vercel.app in Chrome
2. Open DevTools (F12)
3. Click "Toggle device toolbar" (Ctrl+Shift+M)
4. Select "Pixel 5" or custom: 1080x1920
5. Navigate to each screen
6. Take screenshots (DevTools screenshot or Ctrl+Shift+S in Firefox)
7. Save to: `public/playstore/screenshot-1.png` through `screenshot-8.png`

**Important:**
- Remove any test data (use guest mode or create clean test account)
- Ensure professional appearance (no debug info, console errors)
- Show actual locations in England/Wales
- Use realistic protection scenarios (not "test test 123")

---

### Task 2: Build Android AAB (30 minutes)

**Prerequisites Check:**
```bash
# Check Node.js (16+ required)
node -v

# Check/Install JDK 17 (required for Android SDK 35)
java -version
# If not JDK 17, install from: https://adoptium.net/temurin/releases/?version=17

# Install Bubblewrap CLI globally
npm install -g @bubblewrap/cli

# Verify installation
bubblewrap --version
```

**Build Process:**

```bash
# Navigate to project directory
cd /path/to/armora

# Run automated build script
npm run android:build

# Or manual steps:
npm run build                 # Build React production
bubblewrap doctor             # Verify configuration
bubblewrap update             # Update TWA project (if twa-manifest.json exists)
# OR
bubblewrap init --manifest=https://armora.vercel.app/manifest.json  # First time setup
bubblewrap build              # Build AAB + APK
```

**Expected Output:**
- `app-release-bundle.aab` (~2-3 MB) - Upload to Play Store
- `app-release-signed.apk` (~2-3 MB) - For testing
- `android.keystore` - Signing key (KEEP SECURE, backup!)

**Troubleshooting:**

If `bubblewrap init` prompts for configuration:
- **App name:** Armora Close Protection
- **Package name:** com.armora.protection
- **Host:** armora.vercel.app
- **Start URL:** /
- **Display mode:** standalone
- **Theme color:** #1a1a1a
- **Background color:** #000000
- **Icon:** public/logo512.png
- **Target SDK:** 35
- **Min SDK:** 21

If JDK error:
```bash
# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS
brew install openjdk@17

# Windows
# Download from https://adoptium.net/
```

---

### Task 3: Upload to Google Play Store (45 minutes)

**Step 1: Access Play Console**
1. Go to: https://play.google.com/console
2. Sign in with Google account
3. If first time: Pay $25 one-time developer fee
4. Wait for account verification (1-48 hours, usually same day)

**Step 2: Create New App**
1. Click "Create app"
2. Fill in:
   - **App name:** Armora Close Protection
   - **Default language:** English (UK)
   - **App or game:** App
   - **Free or paid:** Free
3. Accept declarations
4. Click "Create app"

**Step 3: Upload AAB**
1. Left menu → "Release" → "Production"
2. Click "Create new release"
3. Click "Upload" and select `app-release-bundle.aab`
4. Enable "Google Play App Signing" (recommended)
5. **Important:** After enabling signing, download the Play Store signing certificate SHA-256 fingerprint

**Step 4: Update Digital Asset Links**
After enabling Play Store signing, you'll get a second SHA-256 fingerprint. Add it to assetlinks.json:

1. Get the Play Store SHA-256 from Play Console
2. Update `/public/.well-known/assetlinks.json`:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.armora.protection",
       "sha256_cert_fingerprints": [
         "19:45:2B:F1:4A:AC:90:49:29:31:BC:F7:8F:B8:AD:EF:AA:EA:A2:77:E5:78:E5:37:2E:CA:70:66:AB:EA:FB:D2",
         "XX:XX:XX:XX:..."  // Add Play Store fingerprint here
       ]
     }
   }]
   ```
3. Deploy to Vercel (git commit + push, or Vercel dashboard)
4. Verify at: https://armora.vercel.app/.well-known/assetlinks.json

**Step 5: Complete Store Listing**

All content is pre-written in `/workspaces/armora/playstore-listing.md`. Copy and paste:

**App Details:**
- **Short description** (80 chars max):
  ```
  Professional close protection by SIA-licensed CPOs across England & Wales 24/7
  ```

- **Full description** (4000 chars max):
  Copy from `playstore-listing.md` lines 50-120

**Graphics:**
1. **App icon:** Upload `public/playstore/icon-512.png` (512x512)
2. **Feature graphic:** Upload `public/playstore/feature-graphic.png` (1024x500)
3. **Phone screenshots:** Upload all 8 screenshots from Task 1 (1080x1920)
4. Optional: **Tablet screenshots** (can skip for initial release)

**Categorization:**
- **Category:** Business
- **Tags:** Security, Protection, Safety, Bodyguard

**Contact details:**
- **Email:** support@armora.protection (or your business email)
- **Website:** https://armora.vercel.app
- **Privacy policy:** https://armora.vercel.app/privacy.html

**Step 6: Data Safety Section**

Copy from `playstore-metadata.json`:

**Data collected:**
- ✅ Location (precise, collected, required)
  - Purpose: Service delivery, route tracking
- ✅ Personal info (name, email, phone)
  - Purpose: Account management, communication
- ✅ Financial info (payment info, purchase history)
  - Purpose: Payment processing via Stripe

**Security practices:**
- ✅ Data encrypted in transit (HTTPS)
- ✅ Data encrypted at rest (Supabase)
- ✅ Users can request data deletion
- ✅ GDPR compliant

**Data sharing:**
- Shared with: Stripe (payment processing), Google Maps (geocoding)
- Purpose: Essential service functionality

**Step 7: Content Rating**
1. Click "Content rating"
2. Select questionnaire: "All categories"
3. Answer questions honestly:
   - Violence: None
   - Sex/nudity: None
   - Language: None
   - Controlled substances: None
   - Gambling: None
4. Expected rating: **PEGI 3 / Everyone**

**Step 8: Pricing & Distribution**
1. **Pricing:** Free
2. **In-app purchases:** Yes (protection services £55-125/hour)
3. **Countries:**
   - Select: United Kingdom
   - Add: All English-speaking countries if desired
4. **Content guidelines:** Yes (confirm compliance)
5. **US export laws:** Yes (confirm compliance)

**Step 9: Submit for Review**
1. Review all sections (must have green checkmarks)
2. Click "Send for review"
3. Initial review takes 3-7 days typically
4. You'll receive email when approved or if changes needed

---

## Verification Checklist

Before submitting to Play Store:

- [ ] 8 screenshots created and saved to `public/playstore/`
- [ ] AAB file built successfully (`app-release-bundle.aab` exists)
- [ ] APK tested locally (optional but recommended)
- [ ] Digital Asset Links updated with Play Store fingerprint
- [ ] All store listing content copied from prepared files
- [ ] Privacy policy accessible at https://armora.vercel.app/privacy.html
- [ ] Content rating completed
- [ ] Data safety section filled
- [ ] All sections have green checkmarks in Play Console

---

## Expected Timeline

- **Screenshots:** 45 minutes
- **AAB build:** 30 minutes (first time) or 10 minutes (subsequent)
- **Play Store upload:** 45 minutes
- **Google review:** 3-7 days (typically 1-3 days)
- **Total to submission:** ~2 hours active work
- **Total to live:** 1 week including review

---

## Important Files Reference

All these files are ready and contain the content you need:

- **Build script:** `/workspaces/armora/scripts/android-build.sh`
- **Store listing:** `/workspaces/armora/playstore-listing.md`
- **Metadata:** `/workspaces/armora/playstore-metadata.json`
- **Release notes:** `/workspaces/armora/release-notes.txt`
- **Full guide:** `/workspaces/armora/PLAYSTORE_DEPLOYMENT.md`
- **Quick reference:** `/workspaces/armora/playstore-copy-paste.txt`
- **Submission guide:** `/workspaces/armora/playstore-submission-guide.md`

---

## After Submission

**Internal Testing (Recommended):**
1. Create internal test track before production
2. Add your email as test user
3. Install from Play Store internal track
4. Verify:
   - No URL bar appears (Digital Asset Links working)
   - Push notifications work
   - All features functional
   - Payment processing works
   - Live tracking operational

**Staged Rollout:**
1. Start with 10% of users
2. Monitor for crashes/errors
3. Increase to 50%
4. Full rollout to 100%

**Monitoring:**
- Play Console → Vitals (crash reports)
- Firebase Console (FCM delivery)
- Supabase Dashboard (API usage)
- Stripe Dashboard (payments)

---

## Support

If you encounter issues:

1. **Build errors:** Check `/workspaces/armora/PLAYSTORE_DEPLOYMENT.md` (500+ lines, covers 50+ scenarios)
2. **JDK issues:** Must be JDK 17 for Android SDK 35
3. **Bubblewrap errors:** Run `bubblewrap doctor` for diagnostics
4. **Digital Asset Links:** Verify at https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://armora.vercel.app&relation=delegate_permission/common.handle_all_urls
5. **Play Store rejection:** Usually quick fixes, check reviewer feedback

---

## Success Confirmation

You'll know you're successful when:

✅ AAB file uploads to Play Console without errors
✅ All store listing sections have green checkmarks
✅ Play Console shows "Under review" status
✅ Test APK installs and runs with NO URL bar
✅ Push notifications work when app is closed
✅ You receive "App published" email from Google (after review)

---

## Quick Command Reference

```bash
# Full automated build
npm run android:build

# Just verify configuration
npm run android:prepare

# Check Firebase config
npm run firebase:verify

# Install on connected Android device
adb install app-release-signed.apk

# Check device connection
adb devices

# View app logs (while running on device)
adb logcat | grep -i armora
```

---

**You've got this!** Everything is prepared - you're just executing the final steps. The hard work (99%) is already done.

Good luck! 🚀
