# 🔐 Complete GitHub Secrets Setup Guide for Both Apps

## 📱 Apps to Configure:
1. **armora** (Client App) - github.com/giquina/armora
2. **armoracpo** (CPO App) - github.com/giquina/armoracpo

---

## ⚡ QUICK SETUP (5 Minutes Per App)

### Step 1: Copy Environment Variables from Vercel

Since your apps are already deployed on Vercel, the easiest way is to copy secrets from there:

#### For **armora**:
1. Go to: https://vercel.com/giquinas-projects/armoracpo/settings/environment-variables
2. Copy each variable value

#### For **armoracpo**:
1. Go to: https://vercel.com/giquinas-projects/armoracpo/settings/environment-variables  
2. Copy each variable value

---

### Step 2: Add Secrets to GitHub

#### For **armora** repository:
**URL:** https://github.com/giquina/armora/settings/secrets/actions

Click "New repository secret" and add these **11 secrets**:

| Secret Name | Where to Find Value |
|------------|---------------------|
| `REACT_APP_SUPABASE_URL` | Vercel env vars OR Supabase Dashboard |
| `REACT_APP_SUPABASE_ANON_KEY` | Vercel env vars OR Supabase Dashboard |
| `REACT_APP_FIREBASE_API_KEY` | Vercel env vars OR Firebase Console |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Vercel env vars OR Firebase Console |
| `REACT_APP_FIREBASE_PROJECT_ID` | Vercel env vars OR Firebase Console |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Vercel env vars OR Firebase Console |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Vercel env vars OR Firebase Console |
| `REACT_APP_FIREBASE_APP_ID` | Vercel env vars OR Firebase Console |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Vercel env vars OR Stripe Dashboard |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Vercel env vars OR Google Cloud Console |
| `REACT_APP_SENTRY_DSN` | **IMPORTANT: Get from sentry.io** |

#### For **armoracpo** repository:
**URL:** https://github.com/giquina/armoracpo/settings/secrets/actions

Add the **same 11 secrets** (same values, same names)

---

## 🚨 CRITICAL: Sentry DSN Setup

**This is the ONLY missing piece preventing deployment!**

### Get Your Sentry DSN:
1. Go to https://sentry.io and login
2. Select your "Armora" project (or create one)
3. Go to Settings → Projects → [Your Project] → Client Keys (DSN)
4. Copy the DSN (format: `https://xxxxx@o123456.ingest.sentry.io/123456`)
5. Add to both GitHub repos as `REACT_APP_SENTRY_DSN`

**Without Sentry DSN, the build will fail!**

---

## 🤖 Step 3: Setup armoracpo Repository

I've already set up the **armora** repository with:
- ✅ GitHub Actions workflow
- ✅ Capacitor configuration  
- ✅ Documentation

Now let's do the same for **armoracpo**:

### Option A: Automated Script (Fastest - 30 seconds)

Run this in the armoracpo repository:

```bash
# Clone the workflow from armora
cd /path/to/armoracpo
git pull

# Copy the files from armora repo
curl -o .github/workflows/android-build.yml \
  https://raw.githubusercontent.com/giquina/armora/main/.github/workflows/android-build.yml

curl -o capacitor.config.ts \
  https://raw.githubusercontent.com/giquina/armora/main/capacitor.config.ts

curl -o ANDROID_BUILD_SETUP.md \
  https://raw.githubusercontent.com/giquina/armora/main/ANDROID_BUILD_SETUP.md

# Update capacitor.config.ts for CPO app
sed -i "s/uk.co.armora.client/uk.co.armora.cpo/g" capacitor.config.ts
sed -i "s/Armora Security Transport/Armora CPO/g" capacitor.config.ts

# Commit and push
git add .github capacitor.config.ts ANDROID_BUILD_SETUP.md
git commit -m "feat: add Android build automation for CPO app"
git push origin main
```

### Option B: Manual Setup (5 minutes)

1. Go to https://github.com/giquina/armora
2. Download these files:
   - `.github/workflows/android-build.yml`
   - `capacitor.config.ts`
   - `ANDROID_BUILD_SETUP.md`
3. In `capacitor.config.ts`, change:
   - `appId: 'uk.co.armora.cpo'`
   - `appName: 'Armora CPO'`
4. Upload to armoracpo repository
5. Commit and push

---

## 🚀 Step 4: Trigger Builds

Once secrets are added and workflows are in place:

### For armora:
1. Go to: https://github.com/giquina/armora/actions
2. Click "🤖 Build Android App for Play Store"
3. Click "Run workflow" → Select "release" → Run
4. Wait 10-15 minutes
5. Download AAB from artifacts

### For armoracpo:
1. Go to: https://github.com/giquina/armoracpo/actions
2. Click "🤖 Build Android App for Play Store"
3. Click "Run workflow" → Select "release" → Run
4. Wait 10-15 minutes
5. Download AAB from artifacts

---

## 📊 Build Status Checklist

After triggering builds, check:

- [ ] **armora** build started
- [ ] **armora** build completed successfully
- [ ] **armora** AAB artifact available
- [ ] **armoracpo** build started
- [ ] **armoracpo** build completed successfully
- [ ] **armoracpo** AAB artifact available

---

## 🎯 What You'll Have After This:

✅ **armora-release.aab** - Client app for end users  
✅ **armoracpo-release.aab** - CPO app for security officers  
✅ Both ready for Google Play Store submission  
✅ Automated builds on every push  
✅ GitHub issues created automatically with build summaries  

---

## 📱 Google Play Store Submission (After Builds Complete)

### You'll Need:

#### 1. Google Play Developer Account
- Cost: $25 (one-time)
- URL: https://play.google.com/console/signup
- Takes 48 hours to approve

#### 2. App Assets (for EACH app)
- **App Icon**: 512x512 PNG
- **Feature Graphic**: 1024x500 PNG  
- **Screenshots**: 2-8 images
  - Phone: 1080x1920px
  - Tablet: 2048x1536px (optional)
- **Privacy Policy**: Must be hosted online
- **App Description**: Short (80 chars) and Full (4000 chars)

#### 3. Content Rating
- Complete IARC questionnaire in Play Console
- Expected rating: PEGI 3 / ESRB Everyone

#### 4. Data Safety Form
Must declare:
- ✅ Collects user location (GPS tracking)
- ✅ Collects personal info (names, emails, phone)
- ✅ Collects financial info (payment processing)
- ✅ Data encrypted in transit
- ✅ Users can request data deletion

---

## ✅ Final Checklist Before Play Store

### Technical Requirements:
- [x] AAB files generated
- [ ] AAB files tested on physical devices
- [ ] All app features working (login, payments, GPS, messaging)
- [ ] No crashes or critical bugs
- [ ] App loads quickly (<3 seconds)
- [ ] Works on Android 8.0+ (API 26+)

### Business Requirements:
- [ ] Google Play Developer account created
- [ ] Privacy Policy written and hosted
- [ ] App icons and graphics ready
- [ ] App descriptions written
- [ ] Content rating completed
- [ ] Data safety form completed

### Deployment Steps:
1. **Upload AAB** to Play Console
2. **Create Internal Testing** release first
3. **Test with 5-10 users** for 1-2 weeks
4. **Fix any issues** found
5. **Create Production Release**
6. **Submit for Review** (takes 1-7 days)
7. **App Goes Live!** 🎉

---

## 🔄 After Launch - Updates

To release updates:
1. Make code changes
2. Update version in `package.json`
3. Push to main branch
4. GitHub Actions builds new AAB automatically
5. Download new AAB
6. Upload to Play Console as new release

---

## 🆘 Troubleshooting

### Build Fails:
- Check all 11 secrets are added correctly
- Verify secret names match exactly (case-sensitive)
- Check workflow logs for specific errors

### Sentry DSN Missing:
- Most common failure reason
- Go to sentry.io → Get DSN → Add to GitHub secrets
- Re-run workflow

### Can't Download Artifacts:
- Artifacts expire after 90 days
- Re-run workflow to generate new ones
- Artifacts are at bottom of workflow run page

---

## 🎉 SUCCESS CRITERIA

You'll know everything is ready when:

✅ Both workflows complete successfully  
✅ Both AAB files download without errors  
✅ Both APKs install on Android devices  
✅ Both apps launch and function correctly  
✅ All features work: login, payments, GPS, notifications  
✅ No crashes during testing  

**Then you're ready for Google Play Store submission!** 🚀

---

## ⏱️ Time Estimates

- **Adding GitHub Secrets**: 5 min per repo = 10 min total
- **Setup armoracpo workflow**: 5 min
- **Trigger both builds**: 2 min (just clicking buttons)
- **Wait for builds**: 15-20 min (automated)
- **Download and test**: 30 min
- **Google Play Console setup**: 2-3 hours (one-time)
- **App submission**: 1 hour per app
- **Google review**: 1-7 days

**Total Active Work: ~4-5 hours**  
**Total Calendar Time: 1-2 weeks** (including Google review)

---

## 📞 Next Steps - IN ORDER:

1. ✅ **Get Sentry DSN** (5 min) - Critical!
2. ✅ **Add secrets to armora repo** (5 min)
3. ✅ **Setup armoracpo with workflows** (5 min)
4. ✅ **Add secrets to armoracpo repo** (5 min)
5. ✅ **Trigger both builds** (2 min)
6. ⏳ **Wait for builds to complete** (15 min automated)
7. ✅ **Download both AAB files** (2 min)
8. ✅ **Test on Android devices** (30 min)
9. ✅ **Create Google Play account** (if not done)
10. ✅ **Prepare app assets** (2 hours)
11. ✅ **Submit to Play Store** (1 hour per app)
12. ⏳ **Wait for Google review** (1-7 days)
13. 🎉 **Apps go live!**

**You're ~30 minutes of work away from having production-ready Android apps!**

