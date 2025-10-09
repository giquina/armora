# 🤖 Automated Android Build Setup with GitHub Actions

This repository is configured to automatically build Android APK/AAB files using GitHub Actions, leveraging Capacitor to wrap the React PWA into a native Android app.

## 🎯 What This Automation Does

The GitHub Actions workflow will:

1. **Install Capacitor** - Automatically adds Capacitor to the project
2. **Initialize Android Project** - Creates the Android platform if it doesn't exist
3. **Build React App** - Compiles your React TypeScript PWA
4. **Sync to Android** - Copies web assets to the Android project
5. **Build APK/AAB** - Generates installable Android packages
6. **Create GitHub Issue** - Automatically creates a tracking issue with build results
7. **Upload Artifacts** - Makes the builds available for download

## 🚀 How to Trigger the Build

### Option 1: Automatic (on push)
Simply push to the `main` or `develop` branch:
```bash
git add .
git commit -m "feat: trigger Android build"
git push origin main
```

### Option 2: Manual Trigger
1. Go to GitHub Actions tab
2. Select "🤖 Build Android App for Play Store"
3. Click "Run workflow"
4. Choose build type: `debug` or `release`
5. Click "Run workflow" button

## 📋 Required GitHub Secrets

Before running the workflow, configure these secrets in GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

### Essential Secrets (Required):
```
REACT_APP_SUPABASE_URL=<your_supabase_url>
REACT_APP_SUPABASE_ANON_KEY=<your_supabase_anon_key>
REACT_APP_FIREBASE_API_KEY=<your_firebase_api_key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your_project>.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=<your_project_id>
REACT_APP_FIREBASE_STORAGE_BUCKET=<your_project>.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
REACT_APP_FIREBASE_APP_ID=<your_app_id>
REACT_APP_STRIPE_PUBLISHABLE_KEY=<your_stripe_key>
REACT_APP_GOOGLE_MAPS_API_KEY=<your_maps_key>
REACT_APP_SENTRY_DSN=<your_sentry_dsn>
```

### For Release Builds (Optional but recommended):
```
ANDROID_KEYSTORE_BASE64=<base64_encoded_keystore>
ANDROID_KEYSTORE_PASSWORD=<keystore_password>
ANDROID_KEY_ALIAS=<key_alias>
ANDROID_KEY_PASSWORD=<key_password>
```

## 🔐 Creating an Android Signing Keystore

For Play Store releases, you need a signed keystore:

```bash
# Generate keystore
keytool -genkey -v -keystore armora-release.keystore \
  -alias armora -keyalg RSA -keysize 2048 -validity 10000

# Convert to base64 for GitHub secrets
cat armora-release.keystore | base64 > keystore.base64

# Copy the contents and add to GitHub secrets as ANDROID_KEYSTORE_BASE64
cat keystore.base64
```

## 📱 Build Outputs

After the workflow completes:

### Debug Build:
- **Artifact Name:** `armora-debug-apk`
- **File:** `app-debug.apk`
- **Use For:** Testing on devices, internal distribution
- **Installation:** Can be installed directly on Android devices with "Unknown sources" enabled

### Release Build:
- **Artifact Name:** `armora-release-aab`
- **File:** `app-release.aab`
- **Use For:** Google Play Store submission
- **Installation:** Must be uploaded to Play Console (AAB format)

## 📥 Downloading Build Artifacts

1. Go to the workflow run in GitHub Actions
2. Scroll to the bottom "Artifacts" section
3. Click the artifact name to download
4. Extract the ZIP file
5. Install APK on device OR upload AAB to Play Console

## 🎬 Workflow Jobs Breakdown

### Job 1: `setup-capacitor`
- Checks out code
- Installs Node.js and dependencies
- Adds Capacitor to the project
- Builds the React app with all environment variables
- Creates Android project structure
- Uploads Android project as artifact

### Job 2: `build-android-debug`
- Downloads Android project
- Builds unsigned debug APK
- Suitable for testing
- Comments on PRs with download info

### Job 3: `build-android-release`
- Downloads Android project
- Signs the AAB (if keystore provided)
- Builds production-ready AAB
- Ready for Play Store submission
- Generates detailed build report

### Job 4: `create-github-issue`
- Creates tracking issue with build summary
- Includes checklist for Play Store submission
- Provides direct links to artifacts

## 🛠️ Troubleshooting

### Build Fails at "npm run build"
- Check that all environment secrets are configured in GitHub
- Verify secret names match exactly (case-sensitive)
- Ensure no syntax errors in your React code

### Gradle Build Fails
- Check Java version (should be 17)
- Ensure Android SDK versions are compatible
- Look for specific error in workflow logs

### Capacitor Init Fails
- Usually happens if capacitor.config.ts has syntax errors
- Check that webDir is set to 'build' (React's output directory)

### APK/AAB Not Generated
- Check workflow logs for specific errors
- Ensure gradlew has executable permissions
- Verify Android project structure is correct

## 📚 Next Steps After Build

### For Debug APK:
1. Download the APK artifact
2. Transfer to Android device
3. Enable "Install unknown apps" for your file manager
4. Install and test all features
5. Check for crashes and performance issues

### For Release AAB:
1. Download the AAB artifact
2. Create Google Play Developer account ($25)
3. Create new app in Play Console
4. Upload AAB to Internal Testing track
5. Test with internal testers
6. Complete Play Store listing:
   - App name, description
   - Screenshots (2-8)
   - Feature graphic
   - Privacy policy URL
   - Data safety form
7. Submit for review

## 🔄 Updating the App

To release updates:
1. Make changes to your code
2. Update version in `package.json`
3. Push to main branch
4. Workflow automatically builds new version
5. Download new AAB
6. Upload to Play Console as new release

## 📊 Monitoring Builds

- Check Actions tab for build status
- Review auto-created issues for build summaries
- Download artifacts within 30-90 days (before expiry)
- Set up notifications for workflow failures

## 🎯 Best Practices

1. **Always test debug builds** before creating release
2. **Keep keystore secure** - Store securely, never commit to repo
3. **Use environment branches** - develop for testing, main for production
4. **Monitor build times** - Optimize if builds take too long
5. **Review Capacitor updates** - Keep dependencies updated
6. **Test on real devices** - Emulators don't catch all issues

## 🆘 Getting Help

If you encounter issues:
1. Check workflow logs in Actions tab
2. Review this documentation
3. Check Capacitor docs: https://capacitorjs.com
4. Review GitHub Actions docs: https://docs.github.com/actions
5. Check existing GitHub issues in the repo

---

## 🎉 Success Criteria

You know the setup is working when:
- ✅ Workflow completes without errors
- ✅ Artifacts are generated and downloadable
- ✅ Debug APK installs on Android device
- ✅ App launches and functions correctly
- ✅ Release AAB can be uploaded to Play Console
- ✅ All features work in Android app (authentication, payments, GPS, etc.)

**🚀 You're now ready to build and deploy Android apps automatically!**
