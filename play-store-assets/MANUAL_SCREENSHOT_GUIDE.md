# Manual Screenshot Capture Guide (Backup Method)

If the automated Playwright script doesn't work, use this manual method to capture screenshots.

---

## 🖥️ SETUP: Chrome DevTools Device Emulation

### Step 1: Open Your App
1. Open Google Chrome browser
2. Navigate to: `http://localhost:3000`
3. Make sure the app is running (run `npm start` if needed)

### Step 2: Enable Device Emulation
1. Press **F12** to open Chrome DevTools
2. Click the **"Toggle device toolbar"** icon (📱 phone/tablet icon)
   - Or press: **Ctrl+Shift+M** (Windows) / **Cmd+Shift+M** (Mac)
3. At the top, select device: **"Pixel 5"** or custom dimensions
4. Set dimensions: **1080 x 1920** (portrait)
5. Set DPR (Device Pixel Ratio): **2.0** for high quality

### Step 3: Configure Screenshot Settings
1. Click the **3-dot menu** (⋮) in DevTools toolbar
2. Choose **"Capture screenshot"** to test
3. For high-quality: Right-click page → **"Inspect"** → Click 3-dots → **"Capture full size screenshot"**

---

## 📸 SCREENSHOTS TO CAPTURE (8 Required)

### Screenshot 1: Hub Dashboard
**File name:** `01-hub-dashboard.png`
**URL:** `http://localhost:3000/?view=home` or `/?view=hub`
**What to show:**
- Main command center with navigation cards
- Current date and time
- Status cards showing protection services
- Bottom navigation visible

**Steps:**
1. Navigate to home/hub view
2. Wait 2 seconds for animations to complete
3. Capture full-page screenshot
4. Save as `01-hub-dashboard.png`

---

### Screenshot 2: Service Selection
**File name:** `02-service-selection.png`
**URL:** Navigate from hub → "Request Protection"
**What to show:**
- Four protection tier cards:
  - Essential (£65/h)
  - Executive (£95/h)
  - Shadow Protocol (£125/h)
  - Client Vehicle (£55/h)
- Each card showing price and SIA certification
- Selection UI visible

**Steps:**
1. From hub, tap "Request Protection" or similar button
2. View should show protection tier selection
3. Wait for cards to fully render
4. Capture screenshot
5. Save as `02-service-selection.png`

---

### Screenshot 3: Where & When Booking
**File name:** `03-where-when-booking.png`
**URL:** Continue booking flow after service selection
**What to show:**
- Location input fields (pickup/destination)
- Date/time picker
- Map preview (if visible)
- Continue button at bottom

**Steps:**
1. After selecting a protection tier, proceed to booking
2. Should show WhereWhenView with location inputs
3. Capture with empty or partially filled form
4. Save as `03-where-when-booking.png`

---

### Screenshot 4: Live Tracking Map
**File name:** `04-live-tracking.png`
**URL:** `http://localhost:3000/?view=hub` (with active assignment if possible)
**What to show:**
- Map view with route visualization
- CPO location marker
- Principal location
- Route line connecting them
- Live tracking controls

**Steps:**
1. Navigate to hub with an active assignment (demo mode may work)
2. Map should be visible showing tracking
3. Wait for map tiles to fully load
4. Capture screenshot
5. Save as `04-live-tracking.png`

**Note:** If no active assignment, the map may show placeholder. That's okay.

---

### Screenshot 5: Enhanced Protection Panel
**File name:** `05-protection-panel.png`
**URL:** `http://localhost:3000/?view=hub` (with active assignment)
**What to show:**
- EnhancedProtectionPanel component
- CPO photo and credentials
- SIA license badge
- Emergency action buttons (panic, call, extend, etc.)
- Status information

**Steps:**
1. From hub view with protection panel visible
2. Panel should show CPO details and action buttons
3. Capture with panel in half or full-expanded state
4. Save as `05-protection-panel.png`

---

### Screenshot 6: Payment Integration
**File name:** `06-payment-screen.png`
**URL:** Continue through booking flow to payment
**What to show:**
- Stripe Elements payment form
- Card input fields
- Payment summary (price, service details)
- Secure payment badges
- Confirm button

**Steps:**
1. Navigate through complete booking flow to payment screen
2. Payment form should be visible (empty is fine)
3. Capture showing Stripe integration
4. Save as `06-payment-screen.png`

---

### Screenshot 7: Assignment History
**File name:** `07-assignment-history.png`
**URL:** `http://localhost:3000/?view=assignments`
**What to show:**
- List of past assignments
- Assignment cards with details (CPO, date, service type)
- Filter/sort options
- Rating/review capability

**Steps:**
1. Navigate to: `http://localhost:3000/?view=assignments`
2. Wait for assignment history to load
3. May show empty state or demo data
4. Capture screenshot
5. Save as `07-assignment-history.png`

---

### Screenshot 8: Account Profile
**File name:** `08-account-profile.png`
**URL:** `http://localhost:3000/?view=account`
**What to show:**
- User profile information
- Settings options
- Account preferences
- Logout/security options

**Steps:**
1. Navigate to: `http://localhost:3000/?view=account`
2. Wait for profile page to fully render
3. Capture screenshot
4. Save as `08-account-profile.png`

---

## 💾 SAVING SCREENSHOTS

### Option A: Chrome Built-in Capture
1. With DevTools open and device emulation on
2. Press **Ctrl+Shift+P** (Windows) / **Cmd+Shift+P** (Mac)
3. Type: "Capture full size screenshot"
4. Press Enter
5. Chrome will download PNG automatically
6. Rename file to match naming convention above

### Option B: Operating System Screenshot
1. Position the emulated viewport in view
2. Use OS screenshot tool:
   - **Windows:** Win+Shift+S (Snipping Tool)
   - **Mac:** Cmd+Shift+4 (select area)
   - **Linux:** Print Screen or Shift+Print Screen
3. Crop to exact device viewport (avoid DevTools borders)
4. Save as PNG with correct filename

---

## ✅ VERIFICATION

After capturing all 8 screenshots:

1. **Check dimensions:**
   - Right-click file → Properties → Details tab (Windows)
   - Or use image viewer to check resolution
   - Should be: 1080x1920 or 2160x3840 pixels

2. **Check file sizes:**
   - Each screenshot should be 500KB - 5MB
   - PNG format
   - No transparent backgrounds

3. **Check quality:**
   - Text is sharp and readable
   - Colors are vibrant
   - No DevTools UI visible in screenshot
   - No browser chrome (address bar) visible

4. **Check naming:**
   - Files named: `01-hub-dashboard.png` through `08-account-profile.png`
   - Sequential numbering maintained

---

## 📁 FINAL ORGANIZATION

Save all 8 screenshots to:
```
play-store-assets/screenshots/
├── 01-hub-dashboard.png
├── 02-service-selection.png
├── 03-where-when-booking.png
├── 04-live-tracking.png
├── 05-protection-panel.png
├── 06-payment-screen.png
├── 07-assignment-history.png
└── 08-account-profile.png
```

Then follow the main **DOWNLOAD_AND_UPLOAD_GUIDE.md** to upload to Play Store.

---

## 🆘 TROUBLESHOOTING

**Problem:** App not loading at localhost:3000
**Solution:** Run `npm start` in terminal and wait for "Compiled successfully!"

**Problem:** DevTools device emulation not available
**Solution:** Update Chrome to latest version. Emulation requires Chrome 70+

**Problem:** Screenshots are wrong dimensions
**Solution:**
- Make sure DPR is set to 2.0 in DevTools
- Use "Capture full size screenshot" not regular screenshot
- Check custom dimensions are exactly 1080x1920

**Problem:** Can't navigate to certain views
**Solution:**
- Try manually typing URL: `http://localhost:3000/?view=account`
- Some views may require authentication - use guest mode or login first

**Problem:** Map not loading in screenshot 4
**Solution:**
- Check Google Maps API key is configured
- Wait 5-10 seconds for tiles to load
- May need active internet connection

---

## 🎯 TIPS FOR BEST RESULTS

1. **Wait for animations:** Always wait 2-3 seconds after navigation before capturing
2. **Disable animations:** Add to Chrome DevTools → Settings → Preferences → "Disable animations"
3. **High contrast:** Ensure good lighting/contrast for text readability
4. **Clean data:** Use demo mode or guest mode for clean, professional screenshots
5. **Consistent state:** Try to keep UI state consistent across screenshots
6. **Test upload:** Upload one screenshot to Play Console first to verify dimensions

---

Good luck with your manual captures! 📸
