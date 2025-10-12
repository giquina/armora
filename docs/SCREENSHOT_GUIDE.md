# Google Play Store Screenshot Guide

**Version:** 1.0.0
**Last Updated:** 2025-10-12
**Purpose:** Comprehensive guide for capturing Play Store screenshots for Armora app submission

---

## Table of Contents

1. [Technical Requirements](#1-technical-requirements)
2. [Screenshot Specifications](#2-screenshot-specifications)
3. [8 Required Screenshots](#3-8-required-screenshots)
4. [Capture Methods](#4-capture-methods)
5. [Best Practices](#5-best-practices)
6. [File Naming Convention](#6-file-naming-convention)
7. [Quality Checklist](#7-quality-checklist)
8. [Upload Instructions](#8-upload-instructions)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Technical Requirements

### Play Store Screenshot Requirements

| Property | Value |
|----------|-------|
| **Dimensions** | 1080x1920 pixels (9:16 portrait) |
| **Format** | PNG or JPEG |
| **Maximum file size** | 8MB per screenshot |
| **Minimum required** | 2 screenshots |
| **Recommended** | 8 screenshots |
| **Aspect ratio** | 9:16 (portrait) or 16:9 (landscape) |
| **Minimum dimension** | 320px shortest side |
| **Maximum dimension** | 3840px longest side |

### File Storage Location

All screenshots must be saved to:
```
/workspaces/armora/public/playstore/
```

### Color Profile
- **Color space:** sRGB
- **Bit depth:** 24-bit (PNG) or 8-bit per channel (JPEG)
- **Compression:** Medium to high quality (JPEG 85-95%)

---

## 2. Screenshot Specifications

### Recommended Configuration

**Device Emulation:**
- Device: Google Pixel 5 or similar
- Screen resolution: 1080x1920
- Pixel density: 2.0x or 3.0x
- Browser: Chrome or Firefox with device toolbar

**Production URL:**
```
https://armora.vercel.app
```

**Test Accounts:**
- Registered user (for full features)
- Guest user (for limited features)

---

## 3. 8 Required Screenshots

### Screenshot 1: Hub Dashboard (Command Center)

**Purpose:** Show the main interface users see after login
**View:** `currentView=hub` or navigate to Assignments
**URL:** `https://armora.vercel.app/?view=hub`

**What to Capture:**
- Full Hub interface with greeting (time/date display)
- Navigation cards in single-column layout
- "Request Protection" card prominently visible
- Clean, professional interface
- Armora branding visible

**Caption for Play Store:**
```
Your Security Command Center - Manage Protection Assignments 24/7
```

**Key Elements:**
- Hub greeting text: Large 42px bold
- Date and time display
- NavigationCards showing available actions
- Professional navy/gold color scheme

---

### Screenshot 2: Service Selection (4 Protection Tiers)

**Purpose:** Display all protection tier options
**View:** Service selection during booking flow
**URL:** Navigate from Hub → Request Protection → View tiers

**What to Capture:**
- All 4 service tier cards visible:
  - Essential Protection (£65/hour) - SIA Level 2
  - Executive Protection (£95/hour) - SIA Level 3
  - Shadow Protocol (£125/hour) - Special Forces
  - Client Vehicle Service (£55/hour) - Security Driver
- Professional descriptions for each tier
- Clear pricing display
- SIA certification badges

**Caption for Play Store:**
```
Choose Your Protection Level - From Essential to Special Forces Trained
```

**Key Elements:**
- Service tier cards with icons
- Pricing clearly visible
- Professional descriptions
- Selection interface

---

### Screenshot 3: Booking Flow (WhereWhenView)

**Purpose:** Show how users book protection services
**View:** `WhereWhenView` component
**URL:** Navigate from Hub → Request Protection → Enter details

**What to Capture:**
- Map showing England & Wales
- Commencement point input field (with example: "London Heathrow")
- Secure destination input field (with example: "Central London")
- Date/time picker showing professional interface
- "Calculate Protection Fee" or similar button
- Professional form layout

**Caption for Play Store:**
```
Request Protection in Seconds - Simple, Professional Booking Process
```

**Key Elements:**
- Interactive map (England & Wales coverage)
- Location input fields with realistic addresses
- Date/time selection interface
- Professional form design
- Clear call-to-action button

**Realistic Locations to Use:**
- Commencement: "London Heathrow Terminal 5" or "Birmingham New Street Station"
- Destination: "Canary Wharf" or "Manchester City Centre"

---

### Screenshot 4: Live Tracking Map (Real-Time CPO Location)

**Purpose:** Demonstrate real-time tracking capability
**View:** Active protection panel with map visible
**URL:** Mock active assignment or demo mode

**What to Capture:**
- Map showing CPO location marker
- Route visualization (if available)
- Real-time status indicators
- Distance/ETA information
- Professional map interface with Armora branding

**Caption for Play Store:**
```
Real-Time CPO Tracking - Know Your Protection Officer's Location Always
```

**Key Elements:**
- Map with CPO marker (use professional icon)
- Route line showing path
- Status text: "CPO Approaching Principal" or "Protection Detail Active"
- Clean map UI without clutter
- England/Wales geographic context visible

**Note:** If live tracking isn't fully implemented, use static mockup with professional appearance

---

### Screenshot 5: EnhancedProtectionPanel (Collapsed State with SIA Credentials)

**Purpose:** Show professional CPO information and credentials
**View:** EnhancedProtectionPanel in collapsed state (82px height)
**URL:** Active assignment view

**What to Capture:**
- Collapsed panel showing 3-line left-aligned layout:
  - Line 1: Status (e.g., "Protection Detail Active")
  - Line 2: CPO information with SIA badge
  - Line 3: Journey details (time/distance)
- Professional CPO details:
  - Name: "Marcus Reynolds" (or similar professional name)
  - SIA License badge visible
  - Professional background: "Ex-Military" or "Former Police"
  - Rating: 4.9 stars
- Clean, professional presentation

**Caption for Play Store:**
```
Elite SIA-Licensed Officers - Former Military & Police Professionals
```

**Key Elements:**
- CPO name and credentials
- SIA license verification badge (gold)
- Professional background text
- Star rating display
- Status indicators
- Left-aligned 3-line collapsed layout

**Professional CPO Names to Use:**
- Marcus Reynolds (Ex-Special Forces)
- James Mitchell (Former Police)
- Alexander Hunt (Military Background)

---

### Screenshot 6: EnhancedProtectionPanel (Full State - Action Buttons)

**Purpose:** Display all professional security controls available
**View:** EnhancedProtectionPanel in full state (75vh height)
**URL:** Active assignment with panel expanded

**What to Capture:**
- Full protection panel with all 6 action buttons in 2x3 grid:
  1. **Emergency/Panic** (red) - Icon, "Emergency", "Immediate response"
  2. **Call CPO** (green) - Icon, "Call", "Direct contact"
  3. **Extend Assignment** (amber) - Icon, "Extend", "Add time"
  4. **View Route** (blue) - Icon, "Route", "Journey details"
  5. **Message CPO** (purple) - Icon, "Message", "Secure chat"
  6. **Share Location** (gray/green) - Icon, "Location", "Share position"
- No scroll visible (all buttons fit)
- Professional button styling with gradients
- Clear icon, label, and subtext on each button

**Caption for Play Store:**
```
Complete Protection Control - Emergency Response & Direct CPO Communication
```

**Key Elements:**
- 2x3 button grid layout
- All 6 buttons clearly visible
- Professional gradient backgrounds
- Icon + Label + Subtext format
- 110px minimum button height
- Professional color coding (red=emergency, green=call, etc.)

---

### Screenshot 7: Assignment History (Past Assignments)

**Purpose:** Show assignment tracking and history features
**View:** Assignments list or history section
**URL:** Hub → View past assignments

**What to Capture:**
- List of completed/past assignments
- Assignment cards showing:
  - Date/time of assignment
  - CPO name and credentials
  - Route (commencement → destination)
  - Service tier used
  - Status (Completed, In Progress)
  - Cost/duration
- Professional card layout
- Filter options (if available)
- Search functionality (if available)

**Caption for Play Store:**
```
Complete Assignment History - Professional Security Records & Reporting
```

**Key Elements:**
- Multiple assignment cards (3-4 visible)
- Professional card design
- Clear status indicators
- Date/time stamps
- CPO information
- Service tier badges

**Example Assignment Data:**
- Assignment 1: Heathrow → Central London, Executive Protection, Completed
- Assignment 2: Birmingham → Manchester, Essential Protection, Completed
- Assignment 3: Gatwick → Surrey, Shadow Protocol, In Progress

---

### Screenshot 8: Account/Profile Settings

**Purpose:** Display user profile and account management
**View:** `currentView=account`
**URL:** `https://armora.vercel.app/?view=account`

**What to Capture:**
- User profile section:
  - Name and profile photo area
  - Account type (Registered/Guest/Google)
  - Rewards balance (50% discount display)
  - Professional membership status
- Settings options:
  - Personal information
  - Security settings
  - Payment methods
  - Notification preferences
  - Help & support
  - Legal links (Privacy, Terms, GDPR, SIA Compliance)
- Recruitment widget (if visible on account page)
- Professional, clean interface

**Caption for Play Store:**
```
Secure Account Management - Profile, Settings & Protection Rewards
```

**Key Elements:**
- Profile information section
- Rewards/discount display (50% for registered users)
- Settings menu items
- Professional layout
- Legal compliance links visible
- Clean, organized interface

**User Info to Display:**
- Name: "Professional User" or realistic name
- Account type: "Registered Member"
- Rewards: "50% Protection Discount Active"

---

## 4. Capture Methods

### Method 1: Chrome DevTools (Recommended)

**Step-by-step:**

1. **Open Chrome Browser**
   ```
   Navigate to: https://armora.vercel.app
   ```

2. **Open DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Or: Right-click → "Inspect"

3. **Toggle Device Toolbar**
   - Click device icon in DevTools (or press `Cmd+Shift+M` / `Ctrl+Shift+M`)
   - Device toolbar appears at top

4. **Select Device**
   - Device dropdown → "Edit..."
   - Add custom device:
     - Name: "Play Store Screenshot"
     - Width: 1080
     - Height: 1920
     - Device pixel ratio: 2.0
   - Or use: "Pixel 5" (1080x2340, crop to 1920)

5. **Navigate to View**
   - Use URL parameters: `?view=hub` or `?view=account`
   - Or navigate through app interface

6. **Capture Screenshot**
   - Right-click on page → "Capture screenshot"
   - Or: DevTools menu (⋮) → "Capture screenshot"
   - **Important:** Use "Capture full size screenshot" for full page

7. **Crop if Needed**
   - Use image editor to crop to exactly 1080x1920
   - Remove browser chrome (address bar, etc.)

**Chrome DevTools Keyboard Shortcuts:**
- `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows): Command menu → "Capture screenshot"
- `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows): Toggle device toolbar

---

### Method 2: Firefox Responsive Design Mode

**Step-by-step:**

1. **Open Firefox**
   ```
   Navigate to: https://armora.vercel.app
   ```

2. **Open Responsive Design Mode**
   - Press `Cmd+Option+M` (Mac) / `Ctrl+Shift+M` (Windows)
   - Or: Tools → Browser Tools → Responsive Design Mode

3. **Set Dimensions**
   - Enter dimensions: 1080 x 1920
   - Device pixel ratio: 2.0
   - Touch simulation: Enabled

4. **Navigate to View**
   - Navigate through app or use URL parameters

5. **Take Screenshot**
   - Click camera icon in Responsive Design Mode toolbar
   - Screenshot automatically captures at correct dimensions
   - Save to `/workspaces/armora/public/playstore/`

6. **Verify Dimensions**
   - Check saved file is exactly 1080x1920

---

### Method 3: Android Emulator (Real Device Experience)

**Step-by-step:**

1. **Start Android Studio**
   ```bash
   # If Android Studio is installed
   ~/Library/Android/sdk/emulator/emulator -avd Pixel_5_API_34
   ```

2. **Install App**
   ```bash
   # Build and install APK
   cd /workspaces/armora
   npm run build
   npx cap sync android
   cd android && ./gradlew assembleDebug
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Navigate to Screens**
   - Open app on emulator
   - Navigate to each screen

4. **Capture Screenshot**
   - Android Studio: Tools → Device Manager → Screenshot
   - Or: `adb shell screencap -p /sdcard/screenshot.png`
   - Or: Use emulator screenshot button

5. **Pull Screenshot**
   ```bash
   adb pull /sdcard/screenshot.png ./public/playstore/screenshot-X-name.png
   ```

6. **Resize if Needed**
   - Pixel 5 is 1080x2340, crop to 1080x1920
   - Use ImageMagick:
   ```bash
   convert screenshot.png -resize 1080x1920^ -gravity center -extent 1080x1920 screenshot-cropped.png
   ```

---

### Method 4: Third-Party Tools

**Option A: Screenshotmachine.com / Similar Services**
- Not recommended (external watermarks, quality issues)
- Use Chrome DevTools instead

**Option B: Playwright/Puppeteer (Automated)**

```javascript
// Example script: scripts/capture-screenshots.js
const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // Capture Hub
  await page.goto('https://armora.vercel.app/?view=hub');
  await page.screenshot({ path: 'public/playstore/screenshot-1-hub.png' });

  // Capture Account
  await page.goto('https://armora.vercel.app/?view=account');
  await page.screenshot({ path: 'public/playstore/screenshot-8-account.png' });

  // ... more screenshots

  await browser.close();
})();
```

**To Run:**
```bash
npm install playwright
node scripts/capture-screenshots.js
```

---

## 5. Best Practices

### Professional Appearance

1. **Use Realistic Data**
   - Professional names: "Marcus Reynolds", "James Mitchell"
   - Real UK locations: "London Heathrow", "Birmingham New Street"
   - Realistic times: Business hours (09:00-18:00)
   - Professional dates: Current or near-future dates

2. **Remove Test/Debug Elements**
   - No console logs visible
   - No debug overlays
   - No "test" or "demo" labels
   - No development tools visible
   - No error messages or warnings

3. **Clean Interface**
   - Close any modal dialogs or overlays (unless showcasing feature)
   - Remove browser UI (address bar, bookmarks, etc.)
   - No cursor visible in screenshots
   - Professional content only

4. **Consistent Branding**
   - Armora logo visible where appropriate
   - Gold (#FFD700) and Navy (#1a1a2e) color scheme
   - Professional typography
   - SIA compliance badges visible

### Geographic Accuracy

**England & Wales Locations Only:**
- London: "Heathrow Airport T5", "Canary Wharf", "Westminster"
- Birmingham: "New Street Station", "Birmingham Airport"
- Manchester: "Manchester Airport", "City Centre"
- Leeds, Bristol, Cardiff: Major city centers
- **Avoid:** Scotland, Northern Ireland (outside service area)

### Time and Date Display

**Professional Times:**
- Business hours: 09:00-18:00 GMT
- Airport transfers: Early morning (06:00-08:00) or evening (18:00-20:00)
- Dates: Current month or 1-2 weeks ahead
- **Avoid:** Late night times (may imply unprofessional use)

### User Types

**Registered User (Preferred for Screenshots):**
- Shows full features
- 50% discount badge visible
- Complete assignment history
- Professional profile

**Guest User (If Needed):**
- Quote-only mode
- Limited features
- Use for showing accessible entry point

### Device Orientation

**Portrait Mode (Required):**
- All screenshots must be portrait (1080x1920)
- Mobile-first design
- Professional app layout
- **Never use landscape** for Play Store phone screenshots

---

## 6. File Naming Convention

### Standard Format

```
screenshot-[number]-[screen-name].png
```

### 8 Screenshot Files

| File Name | Screen | Purpose |
|-----------|--------|---------|
| `screenshot-1-hub.png` | Hub Dashboard | Command center interface |
| `screenshot-2-service-tiers.png` | Service Selection | 4 protection tier options |
| `screenshot-3-booking-flow.png` | WhereWhenView | Location/date booking form |
| `screenshot-4-live-tracking.png` | Live Map | Real-time CPO tracking |
| `screenshot-5-cpo-credentials.png` | EnhancedPanel Collapsed | SIA credentials display |
| `screenshot-6-action-buttons.png` | EnhancedPanel Full | Security control buttons |
| `screenshot-7-assignment-history.png` | Assignments List | Past assignment records |
| `screenshot-8-account.png` | Account View | Profile and settings |

### File Properties

**Naming Rules:**
- Lowercase only
- Hyphens (not underscores or spaces)
- Descriptive names
- Sequential numbering (1-8)

**Storage Location:**
```
/workspaces/armora/public/playstore/
```

**Verification Command:**
```bash
ls -lh /workspaces/armora/public/playstore/screenshot-*.png
```

---

## 7. Quality Checklist

### Before Saving Each Screenshot

- [ ] **Dimensions:** Exactly 1080x1920 pixels
- [ ] **Format:** PNG (preferred) or high-quality JPEG (90%+)
- [ ] **File size:** Under 8MB (typically 200KB-2MB is ideal)
- [ ] **Color profile:** sRGB color space
- [ ] **Content:** No browser UI, address bars, or bookmarks visible
- [ ] **Data:** Realistic professional information displayed
- [ ] **Errors:** No console errors, warnings, or debug text
- [ ] **Branding:** Armora logo and colors correct
- [ ] **Text:** All text readable at mobile size
- [ ] **Aspect ratio:** No stretching or distortion
- [ ] **Location:** Saved to `/workspaces/armora/public/playstore/`

### Verification Commands

**Check dimensions:**
```bash
identify /workspaces/armora/public/playstore/screenshot-1-hub.png
# Expected output: screenshot-1-hub.png PNG 1080x1920
```

**Check all screenshots:**
```bash
for file in /workspaces/armora/public/playstore/screenshot-*.png; do
  identify "$file" | grep -q "1080x1920" && echo "✓ $file" || echo "✗ $file WRONG SIZE"
done
```

**Check file sizes:**
```bash
du -h /workspaces/armora/public/playstore/screenshot-*.png
# Each should be under 8MB, ideally 200KB-2MB
```

---

## 8. Upload Instructions

### Google Play Console Upload

1. **Navigate to Play Console**
   ```
   https://play.google.com/console/
   → Select Armora app
   → Main store listing
   → Phone screenshots
   ```

2. **Upload Screenshots**
   - Click "Upload screenshot" or drag files
   - Upload all 8 screenshots in order (1-8)
   - Screenshots display in order uploaded

3. **Add Captions (Optional but Recommended)**
   - Screenshot 1: "Your Security Command Center - Manage Protection Assignments 24/7"
   - Screenshot 2: "Choose Your Protection Level - From Essential to Special Forces Trained"
   - Screenshot 3: "Request Protection in Seconds - Simple, Professional Booking Process"
   - Screenshot 4: "Real-Time CPO Tracking - Know Your Protection Officer's Location Always"
   - Screenshot 5: "Elite SIA-Licensed Officers - Former Military & Police Professionals"
   - Screenshot 6: "Complete Protection Control - Emergency Response & Direct CPO Communication"
   - Screenshot 7: "Complete Assignment History - Professional Security Records & Reporting"
   - Screenshot 8: "Secure Account Management - Profile, Settings & Protection Rewards"

4. **Reorder if Needed**
   - Drag screenshots to reorder
   - First screenshot is most important (appears in search results)
   - Recommended order: Hub → Service Tiers → Booking → Live Tracking → CPO Info → Controls → History → Account

5. **Preview**
   - Click "Preview" to see how screenshots appear in store
   - Check on different device sizes
   - Verify captions display correctly

6. **Save Changes**
   - Click "Save" at bottom of page
   - Changes take effect immediately (or after review for new apps)

---

## 9. Troubleshooting

### Common Issues and Solutions

#### Issue: Screenshot dimensions wrong (not 1080x1920)

**Solution:**
```bash
# Resize with ImageMagick
convert screenshot.png -resize 1080x1920^ -gravity center -extent 1080x1920 screenshot-fixed.png

# Or crop/resize with specific dimensions
convert screenshot.png -resize 1080x1920! screenshot-fixed.png
```

#### Issue: Browser UI visible in screenshot

**Solution:**
- Use Chrome DevTools "Capture screenshot" instead of native screenshot
- In DevTools, use "Capture full size screenshot" for viewport only
- Crop manually using image editor if needed

#### Issue: File size too large (over 8MB)

**Solution:**
```bash
# Optimize PNG with pngquant
pngquant --quality=80-95 screenshot.png -o screenshot-optimized.png

# Convert to high-quality JPEG
convert screenshot.png -quality 90 screenshot.jpg

# Or use ImageMagick to compress
convert screenshot.png -define png:compression-level=9 screenshot-compressed.png
```

#### Issue: Screenshot looks blurry or pixelated

**Solution:**
- Ensure device pixel ratio is 2.0 or higher in DevTools
- Capture at exact dimensions (1080x1920), don't upscale
- Use PNG format (not JPEG) for sharp UI elements
- Verify sRGB color profile

#### Issue: Content not loading properly

**Solution:**
- Wait for page to fully load before capturing
- Check network connectivity
- Clear browser cache and reload
- Use production URL (https://armora.vercel.app) not localhost
- Verify environment variables are configured

#### Issue: Test data visible instead of professional content

**Solution:**
- Use query parameters to navigate: `?view=hub`
- Log in with test account that has realistic data
- Manually edit test data in browser DevTools before capture
- Create mock data in app specifically for screenshots

#### Issue: Dark mode or wrong theme

**Solution:**
- Verify app is using correct theme (Armora uses dark theme with gold accents)
- Clear localStorage if theme is cached
- Check CSS variables are loading correctly
- Refresh page and wait for styles to fully load

---

## Additional Resources

### Image Editing Tools

**Command Line:**
- **ImageMagick:** `convert`, `identify`, `mogrify`
- **pngquant:** PNG compression
- **optipng:** PNG optimization

**GUI Tools:**
- **GIMP:** Free, cross-platform image editor
- **Adobe Photoshop:** Professional image editing
- **Figma/Sketch:** Design tools with export capabilities

### Installation Commands

```bash
# Install ImageMagick (macOS)
brew install imagemagick

# Install ImageMagick (Ubuntu/Debian)
sudo apt-get install imagemagick

# Install pngquant
brew install pngquant  # macOS
sudo apt-get install pngquant  # Ubuntu/Debian
```

### Quick Reference Commands

```bash
# Check screenshot dimensions
identify screenshot.png

# Resize to exact dimensions
convert input.png -resize 1080x1920! output.png

# Crop to 1080x1920 from center
convert input.png -resize 1080x1920^ -gravity center -extent 1080x1920 output.png

# Optimize PNG file size
pngquant --quality=80-95 input.png -o output.png

# Convert to JPEG with quality
convert input.png -quality 90 output.jpg

# Batch process all screenshots
for f in screenshot-*.png; do
  convert "$f" -resize 1080x1920^ -gravity center -extent 1080x1920 "fixed-$f"
done
```

---

## Related Documentation

- `/workspaces/armora/PLAYSTORE_DEPLOYMENT.md` - Complete deployment guide
- `/workspaces/armora/docs/PLAY_STORE_LISTING.md` - Store listing content
- `/workspaces/armora/public/playstore/playstore-assets.md` - Icon and feature graphic assets
- `/workspaces/armora/CLAUDE.md` - Project overview and development guidelines

---

## Checklist Summary

### Pre-Capture Checklist
- [ ] Production URL accessible (https://armora.vercel.app)
- [ ] Test account with realistic data created
- [ ] Chrome DevTools or Firefox Responsive Design Mode set to 1080x1920
- [ ] Professional content prepared (no test data)
- [ ] All 8 screens identified and accessible

### During Capture
- [ ] Screenshot 1: Hub Dashboard captured
- [ ] Screenshot 2: Service Tiers captured
- [ ] Screenshot 3: Booking Flow captured
- [ ] Screenshot 4: Live Tracking captured
- [ ] Screenshot 5: CPO Credentials captured
- [ ] Screenshot 6: Action Buttons captured
- [ ] Screenshot 7: Assignment History captured
- [ ] Screenshot 8: Account View captured

### Post-Capture Verification
- [ ] All 8 files saved to `/workspaces/armora/public/playstore/`
- [ ] File names follow convention: `screenshot-1-hub.png` through `screenshot-8-account.png`
- [ ] Dimensions verified: All exactly 1080x1920 pixels
- [ ] File sizes under 8MB each (ideally 200KB-2MB)
- [ ] Format: PNG or high-quality JPEG
- [ ] Quality checked: No blurriness, artifacts, or distortion
- [ ] Content verified: Professional data, no debug info, no errors
- [ ] Branding consistent: Armora colors and logo correct

### Upload Checklist
- [ ] All 8 screenshots uploaded to Play Console
- [ ] Captions added (optional but recommended)
- [ ] Screenshot order correct (1-8 as intended)
- [ ] Preview checked in Play Console
- [ ] Changes saved in Play Console

---

## Time Estimate

**Total Time:** 30-60 minutes

- Setup and preparation: 5-10 minutes
- Capturing 8 screenshots: 15-30 minutes (2-4 minutes per screenshot)
- Verification and optimization: 5-10 minutes
- Upload to Play Console: 5-10 minutes

**Pro Tip:** Capture all screenshots in one session to ensure consistency in appearance, timing, and data.

---

**Document Status:** Ready for use
**Last Reviewed:** 2025-10-12
**Maintained By:** Armora Development Team
**For Questions:** Refer to CLAUDE.md or create GitHub issue
