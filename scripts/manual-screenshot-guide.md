# Manual Screenshot Capture Guide for Armora Play Store

If the automated script doesn't work or you prefer manual capture, follow this guide.

## Requirements

- Chrome or Edge browser
- App running on http://localhost:3000
- Screenshots needed: **2-8 images** (recommended: 8)
- Format: **1080x1920 pixels (portrait)**

## Setup Chrome DevTools for Screenshots

### Step 1: Open DevTools
1. Start your app: `npm start`
2. Open Chrome and go to http://localhost:3000
3. Press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

### Step 2: Enable Device Toolbar
1. Click the **device icon** in DevTools (or press `Ctrl+Shift+M` / `Cmd+Shift+M`)
2. In the device selector dropdown, choose **"Responsive"**
3. Set dimensions to: **1080 x 1920**
4. Set DPR (Device Pixel Ratio) to **2** or **3** for high quality

### Step 3: Configure for Mobile View
1. In DevTools top bar, ensure "Dimensions" shows `1080 x 1920`
2. Optionally enable "Show device frame" for preview
3. Disable "Throttling" for faster navigation

## Screenshots to Capture

Create a folder first:
```bash
mkdir -p /workspaces/armora/public/playstore/screenshots
```

### Screenshot 1: Hub Dashboard ⭐
**URL:** http://localhost:3000/?view=home or hub

**What to show:**
- NavigationCards layout
- Greeting header with time/date
- Professional security branding
- Bottom navigation

**Capture:**
1. Navigate to hub view
2. Wait for animations to complete (~2 seconds)
3. Right-click anywhere → **Capture screenshot** → **Capture full size screenshot**
4. Save as: `01-hub-dashboard.png`

---

### Screenshot 2: Service Selection ⭐⭐
**URL:** Navigate through booking flow

**What to show:**
- Four protection tiers:
  - Essential (£65/h)
  - Executive (£95/h)
  - Shadow Protocol (£125/h)
  - Client Vehicle (£55/h)
- Professional security branding
- Service descriptions

**Capture:**
1. Click "Request Protection" or navigate to service selection
2. Wait for view to render
3. Capture screenshot
4. Save as: `02-service-selection.png`

---

### Screenshot 3: Where & When (Booking) ⭐⭐⭐
**URL:** Booking flow - WhereWhenView

**What to show:**
- Location input fields (pickup/destination)
- Map integration
- Date/time picker
- Professional UI design

**Capture:**
1. Navigate to "Where & When" step of booking
2. Optionally enter sample addresses
3. Capture screenshot
4. Save as: `03-where-when-booking.png`

---

### Screenshot 4: Live Tracking Map ⭐⭐⭐
**URL:** Active assignment view (may need mock data)

**What to show:**
- Real-time map with CPO location
- Route visualization
- ETA display
- Tracking interface

**Capture:**
1. Navigate to live tracking view (if available)
2. If no active assignment, show map preview
3. Capture screenshot
4. Save as: `04-live-tracking.png`

**Note:** This may require a mock active assignment or demo mode.

---

### Screenshot 5: Enhanced Protection Panel ⭐⭐
**URL:** Hub view with active/collapsed panel

**What to show:**
- EnhancedProtectionPanel in collapsed state (82px)
- CPO credentials and SIA license info
- Status display
- Emergency action buttons (panic, call, etc.)

**Capture:**
1. Navigate to hub with protection panel visible
2. Ensure panel shows CPO information
3. Capture screenshot
4. Save as: `05-protection-panel.png`

---

### Screenshot 6: Payment Screen ⭐
**URL:** Payment integration view

**What to show:**
- Stripe payment form
- Payment summary with pricing
- Secure payment branding
- Professional checkout design

**Capture:**
1. Navigate to payment step in booking flow
2. Show Stripe Elements integration
3. Capture screenshot
4. Save as: `06-payment-screen.png`

---

### Screenshot 7: Assignment History ⭐
**URL:** http://localhost:3000/?view=assignments

**What to show:**
- List of past assignments
- Filtering/sorting options
- Assignment cards with details
- Rating system (if visible)

**Capture:**
1. Navigate to assignments view
2. If no history, show empty state or demo data
3. Capture screenshot
4. Save as: `07-assignment-history.png`

---

### Screenshot 8: Account/Profile ⭐
**URL:** http://localhost:3000/?view=account

**What to show:**
- User profile information
- Account settings
- Preferences
- Professional layout

**Capture:**
1. Navigate to account view
2. Show profile/settings interface
3. Capture screenshot
4. Save as: `08-account-profile.png`

---

## Alternative: Full Page Screenshot

If you need full-page screenshots (scrollable content):

1. In DevTools, press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: **"Capture full size screenshot"**
3. Press Enter
4. Screenshot will download automatically

## Screenshot Checklist

After capturing all screenshots, verify:

- [ ] **Dimensions:** Each image is 1080x1920 pixels
- [ ] **Format:** PNG format
- [ ] **Count:** 2-8 screenshots (minimum 2, recommended 8)
- [ ] **Content:** Shows key app features and professional UI
- [ ] **Quality:** High resolution, no blur or artifacts
- [ ] **Branding:** Armora branding visible (logo, colors)
- [ ] **No sensitive data:** No real user data, phone numbers, or personal info

## Verify Screenshot Dimensions

Run this command to check all screenshots:

```bash
file public/playstore/screenshots/*.png | grep -E "1080 x 1920|1920 x 1080"
```

Or use this Node.js script:

```bash
node -e "
const fs = require('fs');
const path = require('path');
const dir = './public/playstore/screenshots';
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  console.log(\`Found \${files.length} PNG files\`);
  files.forEach(f => console.log(\`  - \${f}\`));
} else {
  console.log('Screenshots directory not found');
}
"
```

## Tips for Best Results

1. **Use real-looking data:** Show populated views, not empty states
2. **Professional appearance:** Clean UI, no debug info or console errors
3. **Consistent branding:** Armora colors (gold, navy, professional)
4. **Mobile-optimized:** Show mobile-friendly layout, not desktop
5. **High quality:** DPR 2x or 3x for crisp images
6. **No personal data:** Use demo/test data only

## Troubleshooting

**Issue: Screenshot is wrong size**
- Solution: Double-check DevTools dimensions are exactly 1080x1920
- Use "Capture full size screenshot" not "Capture screenshot"

**Issue: Screenshot captures only viewport, not full page**
- Solution: This is correct for portrait phone screenshots
- Play Store wants viewport-sized images, not full scrollable pages

**Issue: Images look blurry**
- Solution: Increase DPR to 2 or 3 in DevTools device settings

**Issue: Can't access certain views**
- Solution: You may need to:
  - Sign in first
  - Create test data
  - Navigate through the booking flow
  - Use URL parameters (?view=...)

## Next Steps

Once you have 2-8 screenshots:

1. **Review** all screenshots for quality and content
2. **Rename** if needed to match naming convention (01-08)
3. **Upload to Play Console:**
   - Google Play Console → Your App → Store presence
   - Main store listing → Phone screenshots
   - Upload in order (01, 02, 03, etc.)

## Quick Upload Checklist

- [ ] At least 2 screenshots captured (8 recommended)
- [ ] All screenshots are 1080x1920 pixels
- [ ] PNG format
- [ ] No personal/sensitive data visible
- [ ] Professional appearance
- [ ] Shows key app features
- [ ] Saved in: `/public/playstore/screenshots/`

---

**Ready to upload to Google Play Store!** 🚀
