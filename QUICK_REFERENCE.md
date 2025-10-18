# Armora Android - Quick Reference Card

## 📱 App Identity
```
Package:     com.armora.protection
Version:     1.0.0 (1)
Target SDK:  35 (Android 15)
Min SDK:     22 (Android 5.1)
```

## 🔑 Keystore Credentials (KEEP SECURE!)
```
File:        armora-release-key.jks
Alias:       armora
Password:    Grp1989des@
Type:        RSA 2048-bit SHA256
Expires:     March 5, 2053
```

## 🔒 SHA-256 Fingerprint
```
CC:2D:C1:EE:4A:B6:C6:0E:D9:34:DC:C1:0D:7E:06:25:EE:43:15:EF:AC:97:C2:98:CF:7C:25:BD:B8:D4:B8:74
```

## 📦 Files to Upload
```
Play Store AAB:  release-aab/armora-production-signed.aab (3.7MB)
App Icon:        public/playstore/armora-icon-512.png
Feature Graphic: public/playstore/armora-feature-graphic.png
```

## 🌐 URLs
```
PWA:             https://armora.vercel.app
App Links:       https://armora.vercel.app/.well-known/assetlinks.json
Play Console:    https://play.google.com/console
Firebase:        https://console.firebase.google.com/project/armora-protection
```

## ⚡ Quick Commands

### Re-sign AAB
```bash
cd /workspaces/armora
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore armora-release-key.jks \
  release-aab/armora-production-signed.aab armora
# Password: Grp1989des@
```

### Verify Signature
```bash
jarsigner -verify -verbose -certs release-aab/armora-production-signed.aab
```

### Check Fingerprint
```bash
keytool -list -v -keystore armora-release-key.jks -alias armora
# Password: Grp1989des@
```

### Deploy App Links Update
```bash
git add public/.well-known/assetlinks.json
git commit -m "Update App Links fingerprint"
git push origin main
# Wait 2-3 min, then verify:
curl https://armora.vercel.app/.well-known/assetlinks.json
```

## 📸 Screenshot Requirements
```
Type:        Phone screenshots (2-8 required)
Dimensions:  16:9 or 9:16 aspect ratio
Min Size:    320px (short edge)
Max Size:    3840px (short edge)
Format:      JPG or 24-bit PNG (no alpha)
```

## ✅ Submission Checklist
```
[ ] Deploy assetlinks.json to production
[ ] Capture 2-8 phone screenshots
[ ] Create Google Play developer account ($25)
[ ] Create new app in Play Console
[ ] Complete store listing
[ ] Upload AAB file
[ ] Complete content rating
[ ] Set target audience (18+)
[ ] Submit for review
```

## 🚨 Emergency: Lost Password?
**WARNING**: Without the keystore password, you cannot update the app!
- Backup keystore file to secure location NOW
- Store password in password manager
- Consider creating encrypted backup

## 📞 Support
```
Play Console Help:  https://support.google.com/googleplay/android-developer
App Signing Guide:  https://developer.android.com/studio/publish/app-signing
Capacitor Docs:     https://capacitorjs.com/docs/android
```

---

**Last Updated**: 2025-10-18
**Status**: ✅ PRODUCTION READY
