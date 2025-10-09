# Google Play Store Submission Guide - Armora Close Protection

## Quick Reference

**Package Name:** com.armora.protection
**Version:** 1.0.0 (Version Code: 1)
**Category:** Business
**Content Rating:** PEGI 3 / Everyone
**Countries:** United Kingdom (England & Wales service area)

---

## Files Created

### 1. Marketing Content
**File:** `/workspaces/armora/playstore-listing.md`
- App title (30 chars): "Armora Close Protection"
- Short description (80 chars)
- Full description (3,997 chars)
- Key features list
- Service tiers explanation
- SIA licensing information
- Security and privacy highlights

### 2. Technical Metadata
**File:** `/workspaces/armora/playstore-metadata.json`
- Complete app configuration
- Permissions with justifications
- Third-party services documentation
- Privacy policy details
- Content rating guidance
- Technical requirements
- Compliance information

### 3. Release Notes
**File:** `/workspaces/armora/release-notes.txt`
- Initial release announcement (500 chars max)
- Multiple versions provided (choose best fit)
- Focus on key features and value proposition

### 4. Existing Marketing Assets
**Location:** `/workspaces/armora/public/playstore/`
- App icon: `armora-icon-512.png` (512x512 PNG)
- Feature graphic: `armora-feature-graphic.png` (1024x500 PNG)
- Documentation: `playstore-assets.md`

---

## Pre-Submission Checklist

### Required Assets ✅

- [x] **App Icon** - 512x512 PNG (armora-icon-512.png)
- [x] **Feature Graphic** - 1024x500 PNG (armora-feature-graphic.png)
- [x] **App Title** - 30 characters max
- [x] **Short Description** - 80 characters max
- [x] **Full Description** - Up to 4000 characters
- [x] **Privacy Policy URL** - https://armora.vercel.app/privacy.html
- [x] **AAB File** - app-release-bundle.aab (1.9M)
- [x] **Content Rating Questionnaire Preparation**
- [ ] **Screenshots** - Minimum 2 phone screenshots required

### Screenshots Needed ⚠️

You need to create at least 2 phone screenshots (recommended 5):

**Recommended Screenshots:**
1. **Hub/Dashboard** - Show the main protection panel with live status
2. **Service Selection** - Display the four protection tiers
3. **Real-Time Tracking** - CPO location tracking on map
4. **Payment Screen** - Secure payment interface
5. **Success/Completion** - Protection assignment completion

**Specifications:**
- Format: PNG or JPEG
- Dimensions: 1080x1920 (portrait) or 1920x1080 (landscape)
- Maximum: 8 screenshots
- Minimum: 2 screenshots

**How to Create:**
```bash
# Option 1: Use device screenshots
1. Open app on Android device
2. Navigate to each screen
3. Take screenshot (Power + Volume Down)
4. Transfer to computer

# Option 2: Use Chrome DevTools
1. Open https://armora.vercel.app in Chrome
2. Open DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Set to Pixel 5 or similar (1080x1920)
5. Navigate through app
6. Take screenshots (Ctrl+Shift+P → "Screenshot")
```

---

## Play Console Submission Steps

### Step 1: Create App in Play Console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Enter app details:
   - **App name:** Armora Close Protection
   - **Default language:** English (United Kingdom) - en-GB
   - **App or game:** App
   - **Free or paid:** Free
4. Accept declarations and click "Create app"

### Step 2: Set Up Store Listing

Navigate to: **Store presence → Main store listing**

**App details:**
- **App name:** Armora Close Protection
- **Short description:** Copy from playstore-listing.md (80 chars)
- **Full description:** Copy from playstore-listing.md (full description section)

**Graphics:**
- **App icon:** Upload `/workspaces/armora/public/playstore/armora-icon-512.png`
- **Feature graphic:** Upload `/workspaces/armora/public/playstore/armora-feature-graphic.png`
- **Phone screenshots:** Upload minimum 2 screenshots (see above)

**Categorization:**
- **App category:** Business
- **Tags:** Close protection, Security, SIA, Executive protection

**Contact details:**
- **Email:** support@armora.security
- **Website:** https://armora.vercel.app
- **Privacy policy:** https://armora.vercel.app/privacy.html

**Save draft**

### Step 3: Content Rating

Navigate to: **Store presence → App content → Content rating**

1. Click "Start questionnaire"
2. Enter email address: support@armora.security
3. Select category: **Utility, Productivity, Communication, or Other**
4. Answer questions:
   - Violence: No
   - Sexual content: No
   - Language: No
   - Controlled substances: No
   - Gambling: No
   - Location sharing: **Yes** (for CPO assignment)
   - Personal information sharing: **Yes** (for service delivery)

5. Expected rating: **PEGI 3 / Everyone**
6. Save rating

### Step 4: Target Audience and Content

Navigate to: **Store presence → App content**

**Target audience:**
- **Age group:** 18+ (professional security services)
- **Ads:** No (no advertising in app)

**News app:** No

**COVID-19 contact tracing/status:** No

**Data safety:**
- Click "Start"
- **Does your app collect or share user data?** Yes
- Fill out data safety form based on playstore-metadata.json permissions section

**Data Collection Summary:**
| Data Type | Collected | Shared | Purpose | Optional |
|-----------|-----------|--------|---------|----------|
| Location (precise) | Yes | Yes (CPO only) | App functionality | No |
| Name | Yes | No | App functionality | No |
| Email | Yes | No | Account management | No |
| Phone number | Yes | Yes (CPO only) | App functionality | No |
| Payment info | Yes | Yes (Stripe) | Purchases | No |
| Photos | Yes | No | Account management | Yes |

**Security practices:**
- [x] Data is encrypted in transit
- [x] Data is encrypted at rest
- [x] Users can request data deletion
- [x] Committed to Google Play Families Policy (if applicable)

### Step 5: Upload App Bundle

Navigate to: **Production → Create new release**

1. Click "Upload" and select `app-release-bundle.aab`
2. Enter release name: "1.0.0 - Initial Release"
3. Copy release notes from `/workspaces/armora/release-notes.txt` (recommended version)
4. Save release

### Step 6: Pricing and Distribution

Navigate to: **Production → Countries/regions**

**Pricing:**
- [x] Free app (in-app payments via Stripe)

**Countries:**
- [x] United Kingdom
- [ ] Other countries (add as service expands)

**Distribution settings:**
- [x] Available on Google Play
- [x] Discoverable in search

### Step 7: Complete All Required Sections

Review dashboard and ensure all sections are complete:

- [x] Store listing
- [x] App content (content rating, target audience, data safety)
- [x] Pricing and distribution
- [x] Production release (AAB uploaded)
- [ ] Screenshots added

---

## Common Questions

### Q: Why is the app categorized as "Business"?
**A:** Armora provides professional security services primarily for corporate executives, business travelers, and professional use cases. While it has lifestyle applications, the primary user base and use cases are business-oriented.

### Q: Why PEGI 3 / Everyone rating?
**A:** The app contains no violent, sexual, or inappropriate content. It's a professional security services platform with standard business functionality. The "Everyone" rating is appropriate.

### Q: What about in-app purchases?
**A:** Armora uses Stripe for payment processing, which is external to Google Play. There are no Google Play in-app purchases or subscriptions. Users pay for services directly through Stripe's secure payment gateway.

### Q: Why request location permissions?
**A:** Location is essential for:
1. Matching users with nearest available CPO
2. Real-time tracking during protection details
3. Regional pricing determination
All location data is deleted 24 hours after service completion per privacy policy.

### Q: What about the "Client Vehicle" tier?
**A:** This tier provides professional security drivers who operate the client's personal vehicle. It's still a security service (SIA-licensed CPO acting as security driver), not a transportation service. The client owns and insures the vehicle.

---

## Post-Submission

### Review Timeline
- **Initial review:** 7-14 days typically
- **Updates:** 1-7 days for subsequent releases

### If Rejected
Common rejection reasons and solutions:

**1. Missing screenshots:**
- Solution: Create and upload minimum 2 phone screenshots

**2. Privacy policy unclear:**
- Solution: Verify https://armora.vercel.app/privacy.html is accessible
- Ensure it covers all data collection mentioned in data safety section

**3. Permissions not justified:**
- Solution: Use justifications from playstore-metadata.json
- Update privacy policy if needed

**4. Content rating questions:**
- Solution: Clarify that location sharing is for service delivery only
- Emphasize professional security nature of app

**5. Age restrictions:**
- Solution: Set minimum age to 18+ if Google flags professional services

### After Approval

1. **Test production version:**
   - Download from Play Store
   - Verify all features work
   - Test payment processing
   - Check location services
   - Verify notifications

2. **Monitor reviews:**
   - Respond to user feedback within 24-48 hours
   - Address technical issues promptly
   - Collect feature requests

3. **Track analytics:**
   - Install counts
   - Active users
   - Crash reports
   - User retention

4. **Plan updates:**
   - Regular monthly feature updates
   - Immediate security patches
   - User-requested improvements

---

## Marketing Copy Quick Reference

### For Copy-Paste into Play Console

**App Title (30 chars):**
```
Armora Close Protection
```

**Short Description (80 chars):**
```
Premium SIA-licensed close protection & executive security across England & Wales
```

**Full Description:**
See `/workspaces/armora/playstore-listing.md` - Full Description section (copy entire section)

**Release Notes (Initial Release):**
```
🛡️ Armora Close Protection - Initial Release

Professional SIA-licensed close protection services across England & Wales. Connect with verified Close Protection Officers in seconds.

FEATURES:
• Real-time CPO tracking and assignment
• Four professional tiers (£55-£125/hour)
• 24/7 emergency support with panic button
• Secure payments via Stripe
• Live protection panel

All officers are SIA-licensed, DBS-checked, and fully insured. UK GDPR compliant.

Experience premium executive security today.
```

---

## Technical Details for Play Console

**Minimum SDK:** API 21 (Android 5.0)
**Target SDK:** API 34 (Android 14)
**App signing:** Managed by Google Play App Signing
**Bundle format:** AAB (Android App Bundle)
**Package name:** com.armora.protection

**SHA-256 Certificate Fingerprint:**
```
19:45:2B:F1:4A:AC:90:49:29:31:BC:F7:8F:B8:AD:EF:AA:EA:A2:77:E5:78:E5:37:2E:CA:70:66:AB:EA:FB:D2
```

**App Links:**
- Domain: armora.vercel.app
- Verification: https://armora.vercel.app/.well-known/assetlinks.json

---

## Support Resources

**Documentation:**
- Privacy Policy: https://armora.vercel.app/privacy.html
- App Website: https://armora.vercel.app
- Asset Links: https://armora.vercel.app/.well-known/assetlinks.json

**Contact:**
- Support: support@armora.security
- Privacy: privacy@armora.security
- DPO: dpo@armora.security

**Company:**
- Legal Name: Giquina Management Holdings Ltd
- Trading As: Armora
- Service Area: England & Wales, United Kingdom

---

## Next Steps

1. **Create Screenshots** (highest priority - required for submission)
   - Use app on device or Chrome DevTools
   - Minimum 2, recommended 5
   - 1080x1920 portrait format

2. **Complete Play Console Submission**
   - Follow steps above
   - Upload all assets
   - Fill out all required forms

3. **Submit for Review**
   - Double-check all sections complete
   - Review preview of store listing
   - Click "Submit for review"

4. **Monitor Submission**
   - Check email for Google Play notifications
   - Respond to any requests for clarification
   - Expect 7-14 days for initial review

---

**Last Updated:** October 2025
**Status:** Ready for submission pending screenshots
**Priority:** Create phone screenshots to complete submission requirements
