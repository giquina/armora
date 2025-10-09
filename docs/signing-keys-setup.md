# Android App Signing Keys Setup Guide

## Overview

This document provides comprehensive instructions for managing the production signing keys for both Armora Android applications. These keys are used to sign the APK/AAB files for distribution on the Google Play Store.

## Generated Keystores

### 1. Armora Client App
- **Keystore File**: `armora-release.keystore`
- **Alias**: `armora`
- **Algorithm**: RSA 2048-bit
- **Validity**: 10,000 days (~27 years)
- **Distinguished Name**: CN=Armora Client, OU=Mobile, O=Armora, L=London, ST=England, C=GB

### 2. Armora CPO App
- **Keystore File**: `armoracpo-release.keystore`
- **Alias**: `armoracpo`
- **Algorithm**: RSA 2048-bit
- **Validity**: 10,000 days (~27 years)
- **Distinguished Name**: CN=Armora CPO, OU=Mobile, O=Armora, L=London, ST=England, C=GB

## Security Fingerprints

### Armora Client App
```
SHA-1: E8:17:F6:55:E4:58:54:D9:5C:38:C9:66:6D:AA:D0:2D:45:FD:CB:32
SHA-256: 97:21:FF:38:66:16:C0:4A:23:BB:66:01:AB:7D:9D:00:F6:A4:3D:43:64:9E:0F:C0:C8:3C:0C:EF:10:27:9D:9B
```

### Armora CPO App
```
SHA-1: 18:6F:EE:83:CB:6D:E4:8B:77:66:67:56:E1:65:16:CE:6E:E0:0B:FB
SHA-256: 60:CC:33:AF:EF:82:5B:1A:09:85:81:8C:96:7D:09:3D:41:9D:00:63:54:13:EF:9F:8B:AA:93:DA:6E:02:EF:37
```

These fingerprints are required for:
- Google Play App Signing configuration
- Firebase Cloud Messaging setup
- Google Sign-In OAuth configuration
- Android App Links verification

## Generation Commands

The keystores were generated using the following commands:

### Armora Client App
```bash
keytool -genkeypair -v \
  -keystore armora-release.keystore \
  -alias armora \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "CHANGE_ME_CLIENT_PASSWORD" \
  -keypass "CHANGE_ME_CLIENT_PASSWORD" \
  -dname "CN=Armora Client, OU=Mobile, O=Armora, L=London, ST=England, C=GB"
```

### Armora CPO App
```bash
keytool -genkeypair -v \
  -keystore armoracpo-release.keystore \
  -alias armoracpo \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "CHANGE_ME_CPO_PASSWORD" \
  -keypass "CHANGE_ME_CPO_PASSWORD" \
  -dname "CN=Armora CPO, OU=Mobile, O=Armora, L=London, ST=England, C=GB"
```

## GitHub Secrets Configuration

To use these keystores in GitHub Actions workflows, you need to configure the following secrets in your repository settings.

### Armora Client App Secrets

1. **ANDROID_KEYSTORE_BASE64**
```
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
```

2. **ANDROID_KEYSTORE_ALIAS**
```
armora
```

3. **ANDROID_KEYSTORE_PASSWORD**
```
[Your secure password - CHANGE FROM PLACEHOLDER]
```

4. **ANDROID_KEY_PASSWORD**
```
[Your secure password - CHANGE FROM PLACEHOLDER]
```

### Armora CPO App Secrets

1. **ANDROID_CPO_KEYSTORE_BASE64**
```
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
```

2. **ANDROID_CPO_KEYSTORE_ALIAS**
```
armoracpo
```

3. **ANDROID_CPO_KEYSTORE_PASSWORD**
```
[Your secure password - CHANGE FROM PLACEHOLDER]
```

4. **ANDROID_CPO_KEY_PASSWORD**
```
[Your secure password - CHANGE FROM PLACEHOLDER]
```

### How to Add Secrets to GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value as specified above
5. Click **Add secret** to save

## Secure Storage Instructions

### CRITICAL SECURITY REQUIREMENTS

1. **Change Placeholder Passwords Immediately**
   - The keystores were generated with placeholder passwords: `CHANGE_ME_CLIENT_PASSWORD` and `CHANGE_ME_CPO_PASSWORD`
   - You MUST change these to strong, unique passwords before using the keystores in production
   - Use a password manager to generate and store secure passwords (minimum 20 characters, alphanumeric + special characters)

2. **Keystore File Storage**
   - Store the `.keystore` files in a secure location (NOT in version control)
   - Recommended: Use a secure password manager or encrypted vault
   - Keep backup copies in at least 2 separate secure locations
   - These files are permanently protected by `.gitignore`

3. **Base64 Encoded Files**
   - The `.base64` files are for GitHub Secrets only
   - After uploading to GitHub Secrets, securely delete the `.base64` files
   - Never commit these files to version control

4. **Password Management**
   - Store passwords in a secure password manager
   - Never share passwords via email or unencrypted channels
   - Use different passwords for each keystore
   - Document who has access to the keystores

### Recommended Storage Locations

1. **Secure Password Manager** (Recommended)
   - 1Password, LastPass, Bitwarden, or similar
   - Store keystores as secure attachments
   - Store passwords as secure notes

2. **Encrypted Cloud Storage**
   - Google Drive with encryption
   - Dropbox with encryption
   - OneDrive with BitLocker

3. **Hardware Security**
   - USB drive stored in safe
   - Encrypted external hard drive
   - Hardware security module (HSM) for enterprise

## Changing Keystore Passwords

If you need to change the keystore passwords from the placeholders:

### Change Store Password
```bash
keytool -storepasswd \
  -keystore armora-release.keystore \
  -storepass "CHANGE_ME_CLIENT_PASSWORD" \
  -new "YOUR_NEW_SECURE_PASSWORD"
```

### Change Key Password
```bash
keytool -keypasswd \
  -keystore armora-release.keystore \
  -alias armora \
  -storepass "YOUR_NEW_STORE_PASSWORD" \
  -keypass "CHANGE_ME_CLIENT_PASSWORD" \
  -new "YOUR_NEW_KEY_PASSWORD"
```

Repeat the same process for the CPO keystore with appropriate values.

## Using Keystores in GitHub Actions

Your workflow file should reference the secrets like this:

```yaml
- name: Decode keystore
  run: |
    echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > release.keystore

- name: Build signed APK/AAB
  run: ./gradlew bundleRelease
  env:
    KEYSTORE_FILE: release.keystore
    KEYSTORE_ALIAS: ${{ secrets.ANDROID_KEYSTORE_ALIAS }}
    KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
    KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
```

## Verification Commands

### View Keystore Information
```bash
keytool -list -v -keystore armora-release.keystore -storepass "YOUR_PASSWORD"
```

### Verify Certificate
```bash
keytool -list -v -keystore armora-release.keystore -alias armora -storepass "YOUR_PASSWORD"
```

### Extract Public Certificate
```bash
keytool -export -alias armora -keystore armora-release.keystore -file armora.crt -storepass "YOUR_PASSWORD"
```

## Google Play Console Configuration

### App Signing Configuration

1. Go to Google Play Console
2. Select your app
3. Navigate to **Release** > **Setup** > **App signing**
4. Upload your keystore or let Google manage it
5. Add the SHA-256 fingerprint to your Firebase project if using Firebase services

### Required Fingerprints for Services

Add these fingerprints to:

1. **Firebase Console**
   - Project Settings > Your apps > Android app
   - Add SHA-256 fingerprint for Cloud Messaging

2. **Google Cloud Console**
   - APIs & Services > Credentials
   - Add SHA-256 for OAuth 2.0 Client IDs

3. **Google Play Console**
   - App signing configuration
   - Verify fingerprints match

## Troubleshooting

### Keystore Not Found
- Ensure the keystore file path is correct
- Verify file permissions (should be readable)

### Wrong Password
- Verify you're using the correct password
- Check if passwords were changed after generation

### Signature Verification Failed
- Ensure you're using the correct keystore for the app
- Verify the alias matches the keystore

### GitHub Actions Failing
- Verify base64 encoding is correct (no line breaks)
- Check secret names match exactly
- Ensure secrets are available in the repository

## Security Best Practices

1. **Never commit keystores** to version control
2. **Use different keystores** for debug and release builds
3. **Rotate passwords** periodically (annually recommended)
4. **Limit access** to keystores to essential personnel only
5. **Monitor usage** of keystores in CI/CD logs
6. **Backup regularly** in multiple secure locations
7. **Document everything** including who has access
8. **Use MFA** on accounts that can access keystores

## Emergency Recovery

If keystores are lost or compromised:

1. **Lost Keystore**
   - Check all backup locations
   - Contact Google Play support (they may have a copy if you used Play App Signing)
   - If truly lost, you cannot update the app (must publish as new app)

2. **Compromised Keystore**
   - Immediately revoke access to the keystore
   - Generate new keystores
   - Update GitHub Secrets
   - Contact Google Play support for app transfer process

## Contact Information

For quefind . -name "build.gradle" -type f 2>/dev/null | head -36hIf5EDfmVbwyXbX9JNByions about keystores or access requests:
- **Repository**: /workspaces/armora
- **Generated**: 2025-10-09
- **Validity**: 10,000 days from generation
- **Expiration**: ~2052-10-09

## Appendix: File Locations

All files are stored in the project root:
- `/workspaces/armora/armora-release.keystore` (Client app keystore)
- `/workspaces/armora/armoracpo-release.keystore` (CPO app keystore)
- `/workspaces/armora/armora-release.keystore.base64` (Client base64 - delete after upload)
- `/workspaces/armora/armoracpo-release.keystore.base64` (CPO base64 - delete after upload)

These files are protected by `.gitignore` and will never be committed to version control.

---

**Last Updated**: October 9, 2025
**Version**: 1.0


---

Last updated: 2025-10-09T08:08:25.966Z
