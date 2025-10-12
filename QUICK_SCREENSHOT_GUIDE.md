# Quick Screenshot Guide - Top 3 Pages

**Server:** http://localhost:3000 (starting now...)
**Device:** Pixel 5 (1080x1920)
**Format:** PNG

---

## How to Capture (Chrome DevTools)

1. **Open Chrome** and navigate to http://localhost:3000
2. **Open DevTools**: Press `F12` (or Cmd+Option+I on Mac)
3. **Toggle Device Toolbar**: Press `Ctrl+Shift+M` (or Cmd+Shift+M on Mac)
4. **Select Device**: Choose "Pixel 5" from dropdown (or custom 1080x1920)
5. **Capture Screenshot**:
   - Click the three dots (⋮) in device toolbar
   - Select "Capture screenshot"
   - Save to `public/playstore/`

---

## Top 3 Pages to Screenshot

### 1. Hub Dashboard (Home Screen)
**URL:** http://localhost:3000/?view=home

**What you'll see:**
- Greeting header (e.g., "Good Evening, Principal")
- Current date and time
- Navigation cards (Request Protection, View Assignments, etc.)
- Professional navy/gold branding

**Save as:** `public/playstore/screenshot-1-hub.png`

---

### 2. Service Selection (Booking Flow)
**URL:** http://localhost:3000 (start booking flow)

**Steps:**
1. Go to http://localhost:3000/?view=home
2. Click "Request Protection" card
3. You'll see the service tier selection screen

**What you'll see:**
- 4 protection tiers in card grid:
  - Essential (£65/h) - SIA Level 2
  - Executive (£95/h) - SIA Level 3, Corporate Bodyguard
  - Shadow Protocol (£125/h) - Special Forces Trained
  - Client Vehicle (£55/h) - Security Driver
- Professional descriptions
- Selection buttons

**Save as:** `public/playstore/screenshot-2-service-tiers.png`

---

### 3. Booking Flow - Where & When
**URL:** Continue from service selection

**Steps:**
1. From service selection screen, choose any tier
2. Click "Continue" or "Select"
3. You'll be on the Where & When view

**What you'll see:**
- Pickup location input with map icon
- Dropoff location input with map icon
- Date picker (calendar icon)
- Time picker (clock icon)
- Interactive map (Google Maps)
- "Continue to Payment" button

**Save as:** `public/playstore/screenshot-3-booking-flow.png`

---

## Quick Checklist

Before taking screenshots:
- [ ] Dev server running (http://localhost:3000)
- [ ] Chrome DevTools open
- [ ] Device toolbar set to Pixel 5 (1080x1920)
- [ ] No console errors visible
- [ ] Professional appearance (no test data like "test test 123")

After capturing:
- [ ] All 3 screenshots saved to `public/playstore/`
- [ ] Files named correctly (screenshot-1-hub.png, etc.)
- [ ] Dimensions are 1080x1920 pixels
- [ ] File sizes are reasonable (200KB-2MB each)

---

## Verify Screenshots

```bash
# Check files exist and dimensions
ls -lh public/playstore/screenshot-*.png

# Verify dimensions (if imagemagick installed)
identify public/playstore/screenshot-*.png
```

---

## Alternative: Direct URLs

If you want to navigate directly:

```bash
# Hub Dashboard
http://localhost:3000/?view=home

# For other views, you need to navigate through the app
# (view routing is state-based, not URL-based)
```

---

## Tips for Best Screenshots

1. **Use realistic data** - England/Wales locations
2. **Professional times** - Business hours (9:00-18:00)
3. **Clean interface** - No browser UI, no DevTools visible
4. **Good lighting** - Default theme colors show well
5. **No errors** - Check console is clean

---

**Ready to capture!** Open http://localhost:3000 in Chrome and follow the steps above.
