# Google Play Store Assets - Download & Upload Guide

This guide will walk you through downloading all Play Store assets and uploading them to Google Play Console.

---

## ✅ ALL ASSETS READY

### App Icon & Feature Graphic ✓
**Location:** `/workspaces/armora/play-store-assets/`
1. **App Icon:** `armora-icon-512x512.png` (28 KB, 512×512 PNG)
2. **Feature Graphic:** `armora-feature-graphic-1024x500.png` (68 KB, 1024×500 PNG)

### Phone Screenshots ✓
**Location:** `/workspaces/armora/play-store-assets/screenshots/`
**Resolution:** 2160x3840 pixels (portrait, high-quality 2x scale)
**Total Size:** ~29 MB

### Screenshot Files:
1. `01-hub-dashboard.png` (4.2 MB) - Main command center
2. `02-service-selection.png` (4.1 MB) - Four protection tiers with pricing
3. `03-where-when-booking.png` (4.1 MB) - Location inputs with date/time picker
4. `04-live-tracking.png` (4.2 MB) - Real-time CPO tracking map
5. `05-protection-panel.png` (4.2 MB) - CPO credentials and emergency buttons
6. `06-payment-screen.png` (4.1 MB) - Stripe payment integration
7. `07-assignment-history.png` (4.2 MB) - Past assignments with rating
8. `08-account-profile.png` (32 KB) - User profile and settings

---

## 📥 STEP 1: DOWNLOAD ASSETS FROM CODESPACES

### Method A: Download via VS Code (Easiest - RECOMMENDED)

1. **Open the VS Code Explorer** (left sidebar, Files icon)

2. **Download the entire play-store-assets folder** (contains everything you need):
   - Right-click on `play-store-assets` folder
   - Select **"Download..."**
   - Save to your computer (e.g., `~/Downloads/play-store-assets`)
   - **This includes:**
     - App icon (512x512)
     - Feature graphic (1024x500)
     - All 8 screenshots (in `/screenshots/` subfolder)

3. **Alternative - Download individual files:**
   - Navigate to `play-store-assets/`
   - Right-click on `armora-icon-512x512.png` → Download
   - Right-click on `armora-feature-graphic-1024x500.png` → Download
   - Right-click on `screenshots` folder → Download

### Method B: Download via GitHub Codespaces Web UI

1. In the file explorer, navigate to each folder
2. Right-click on the folder name
3. Choose "Download"
4. Your browser will download as a ZIP file

### Method C: Download via Command Line (Advanced)

If you have GitHub CLI installed locally:

```bash
# Clone the repo or pull latest changes
git clone https://github.com/your-username/armora.git
cd armora

# The assets are at:
# - play-store-assets/screenshots/
# - public/playstore/
```

---

## 📤 STEP 2: UPLOAD TO GOOGLE PLAY CONSOLE

### Prerequisites
- Google Play Developer account ($25 one-time fee)
- Access to Google Play Console: https://play.google.com/console

### Upload Process

#### A. Navigate to Your App

1. Go to https://play.google.com/console
2. Click on **"Armora"** (or create new app if first time)
3. If creating new app:
   - Click **"Create app"**
   - App name: `Armora Protection Services`
   - Default language: English (United Kingdom)
   - App type: App
   - Free or paid: Free

#### B. Upload App Icon (512x512)

1. In left sidebar → **"Store presence" → "Main store listing"**
2. Scroll to **"App icon"** section
3. Click **"Upload"** or drag-and-drop
4. Upload: `armora-icon-512x512.png` (28 KB)
5. Google will validate dimensions (512x512 required) ✓
6. **Design:** Premium gold shield with "A" emblem on navy background

#### C. Upload Feature Graphic (1024x500)

1. Still in **"Main store listing"**
2. Scroll to **"Feature graphic"** section
3. Click **"Upload"** or drag-and-drop
4. Upload: `armora-feature-graphic-1024x500.png` (68 KB)
5. This banner appears at top of your store listing
6. **Design:** Shield logo with "ARMORA" branding and tagline

#### D. Upload Phone Screenshots

1. Still in **"Main store listing"**
2. Scroll to **"Phone screenshots"**
3. Click **"Add screenshots"**
4. Upload ALL 8 screenshots **in order**:
   - `01-hub-dashboard.png`
   - `02-service-selection.png`
   - `03-where-when-booking.png`
   - `04-live-tracking.png`
   - `05-protection-panel.png`
   - `06-payment-screen.png`
   - `07-assignment-history.png`
   - `08-account-profile.png`

5. **IMPORTANT:** Drag screenshots to reorder if needed (01 should be first)
6. Google Play requirements:
   - Minimum: 2 screenshots
   - Maximum: 8 screenshots ✓
   - Accepted formats: PNG, JPEG
   - Dimensions: 16:9 or 9:16 aspect ratio ✓ (we have 9:16)

#### E. Save Changes

1. Scroll to bottom of page
2. Click **"Save"** button
3. Google will validate all assets
4. Green checkmarks should appear next to each section

---

## 📝 STEP 3: COMPLETE STORE LISTING (If Not Already Done)

You'll need to fill out additional information:

### Required Fields:

1. **App name:** `Armora Protection Services`
2. **Short description** (80 chars max):
   ```
   Premium SIA-licensed close protection services across England & Wales
   ```

3. **Full description** (4000 chars max):
   ```
   Professional Close Protection Services - Your Safety, Our Priority

   Armora connects you with SIA-licensed Close Protection Officers (CPOs) across England and Wales. From essential security to special forces-trained Shadow Protocol details, we provide professional protection for every threat level.

   🛡️ PROTECTION TIERS
   • Essential (£65/h) - SIA Level 2 certified protection
   • Executive (£95/h) - Corporate bodyguard specialists
   • Shadow Protocol (£125/h) - Special forces trained operatives
   • Client Vehicle (£55/h) - Security driver for your vehicle

   ⚡ KEY FEATURES
   • Real-time CPO tracking with live location updates
   • Instant emergency panic button with rapid response
   • SIA license verification for all officers
   • Secure encrypted communications
   • 24/7 professional monitoring and support
   • Comprehensive risk assessments
   • Corporate & individual protection services

   🔒 SECURITY & COMPLIANCE
   • All CPOs are SIA licensed and vetted
   • Martyn's Law compliant operations
   • GDPR-compliant data handling
   • DBS-checked security professionals
   • Comprehensive insurance coverage

   📱 SMART BOOKING
   • Schedule protection in advance or request immediate deployment
   • AI-powered risk assessment and threat analysis
   • Multiple payment options with secure Stripe processing
   • Corporate account management with VAT invoicing

   🎯 WHO WE SERVE
   • Corporate executives and business leaders
   • High-net-worth individuals and families
   • Celebrities and public figures
   • Event security and VIP protection
   • Secure transportation and logistics

   📍 COVERAGE AREA
   Complete coverage across England & Wales with specialized services in:
   • London and Greater London
   • Manchester, Birmingham, Leeds
   • All major UK airports (Heathrow, Gatwick, Manchester, etc.)
   • Regional hubs and rural areas

   🏆 PROFESSIONAL STANDARDS
   • ISO-compliant security protocols
   • Continuous professional development for all CPOs
   • Advanced tactical training programs
   • Regular license and credential verification

   Download now and experience professional close protection at your fingertips.

   ---
   For support: https://armora.vercel.app
   Terms of Service: https://armora.vercel.app/terms
   Privacy Policy: https://armora.vercel.app/privacy
   ```

4. **App category:** Lifestyle or Travel & Local
5. **Contact details:**
   - Email: your-support-email@example.com
   - Phone: (optional)
   - Website: https://armora.vercel.app

6. **Privacy Policy URL:** https://armora.vercel.app/privacy

---

## 🎨 ADDITIONAL ASSETS (Optional)

These can enhance your store listing:

### Tablet Screenshots (Optional)
- If you want tablet support, create 7-10" screenshots
- Dimensions: 1080x1920 to 1440x2560

### Promotional Video (Optional - Highly Recommended)
- YouTube video showing app in action
- 30-second minimum, 2-minute maximum
- Shows protection booking flow, live tracking, etc.

### TV Banner (Optional)
- Only if supporting Android TV
- 1280x720 PNG

---

## ✅ VERIFICATION CHECKLIST

Before submitting for review:

### Assets Ready (All in `/workspaces/armora/play-store-assets/`)
- [x] App icon created (512x512 PNG) - `armora-icon-512x512.png` (28 KB)
- [x] Feature graphic created (1024x500 PNG) - `armora-feature-graphic-1024x500.png` (68 KB)
- [x] All 8 phone screenshots captured (2160x3840 each, ~29 MB total)

### Google Play Console Upload
- [ ] App icon uploaded to Play Console
- [ ] Feature graphic uploaded to Play Console
- [ ] All 8 phone screenshots uploaded in correct order (01-08)
- [ ] App name filled out: "Armora Protection Services"
- [ ] Short description (80 chars max)
- [ ] Full description (detailed, under 4000 chars)
- [ ] App category selected (Lifestyle or Travel & Local)
- [ ] Contact email provided
- [ ] Privacy policy URL added (https://armora.vercel.app/privacy)
- [ ] Target audience set (18+)
- [ ] Content rating completed
- [ ] Store listing saved successfully

---

## 🚀 STEP 4: UPLOAD AAB FILE

After screenshots are uploaded:

1. In left sidebar → **"Release" → "Production"**
2. Click **"Create new release"**
3. Upload your AAB file:
   - Local file: `app-release-bundle.aab` (not in repo)
   - If you need to rebuild: Run `bubblewrap build` locally

4. Fill out release notes
5. Click **"Save"** then **"Review release"**
6. Submit for review (Google review takes 1-7 days)

---

## 📞 NEED HELP?

### Common Issues:

**Q: Screenshots are too large to upload**
A: Google Play accepts up to 8MB per screenshot. Our files are 4-5MB each, which is fine.

**Q: Wrong aspect ratio error**
A: Our screenshots are 2160x3840 (9:16 ratio), which is correct for portrait phone screenshots.

**Q: Can't find download option in VS Code**
A: Make sure you're in the file explorer (not search). Right-click directly on folder name.

**Q: Download is slow**
A: The screenshot folder is 29MB. It may take a minute depending on your connection.

---

## 🎉 SUCCESS!

Once uploaded, your Play Store listing will show:
- Professional app icon in search results
- Feature graphic at top of listing page
- Beautiful screenshot carousel showing all 8 screens
- Complete app description and details

Good luck with your Play Store launch! 🚀
