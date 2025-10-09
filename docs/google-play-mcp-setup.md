# Google Play MCP Server Setup Guide

## Overview

This guide covers the installation and configuration of the Google Play MCP (Model Context Protocol) server for automated Google Play Store deployments. The MCP server enables AI assistants like Claude to manage Android app releases, reviews, and store listings programmatically.

**Installation Date:** October 9, 2025
**Package:** `@blocktopus/mcp-google-play` v0.1.2
**Provider:** Blocktopus Ltd
**License:** MIT

## Why This MCP Server?

After evaluating three Google Play MCP server options, we selected **@blocktopus/mcp-google-play** because:

1. **Node.js Native** - Written in TypeScript/JavaScript, seamlessly integrates with our npm-based project
2. **Comprehensive Feature Set** - 8 tools covering releases, reviews, statistics, and store listings
3. **Simple Installation** - One-line npm install, no additional runtime dependencies (unlike Java-based alternatives)
4. **Active Development** - Well-maintained by Blocktopus on GitHub
5. **Better Automation** - Designed specifically for AI-powered workflows

### Comparison with Alternatives

| Feature | Blocktopus MCP | DevExpert MCP | Pipedream MCP |
|---------|----------------|---------------|---------------|
| Language | TypeScript | Kotlin | API-based |
| Installation | npm | Gradle build | OAuth setup |
| Tools Available | 8 | 3 | Multiple |
| Integration | Native | JAR required | External service |
| Best For | CI/CD automation | Manual deploys | Multi-platform |

## Installation

The package has been installed as a dev dependency:

```bash
npm install --save-dev @blocktopus/mcp-google-play
```

**Installed Version:** 0.1.2
**Location:** `/workspaces/armora/node_modules/@blocktopus/mcp-google-play`

## Configuration

### 1. Google Cloud Service Account Setup

To use the MCP server, you need a Google Cloud service account with Play Console API access.

#### Step 1: Create Google Cloud Project (if not exists)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing: `armora-protection`
3. Note your Project ID

#### Step 2: Enable Google Play Developer API

1. Navigate to **APIs & Services > Library**
2. Search for "Google Play Developer API"
3. Click **Enable**

#### Step 3: Create Service Account

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > Service Account**
3. Fill in details:
   - **Name:** `google-play-deploy-bot`
   - **Description:** `Service account for automated Play Store deployments via MCP server`
   - **Role:** Select "Service Account User"
4. Click **Done**

#### Step 4: Generate Service Account Key

1. Click on the newly created service account
2. Go to **Keys** tab
3. Click **Add Key > Create New Key**
4. Choose **JSON** format
5. Click **Create** - this downloads the JSON key file
6. **IMPORTANT:** Rename the file to `google-play-service-account.json`
7. Store securely - **DO NOT commit to Git**

#### Step 5: Grant Play Console Access

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app or developer account
3. Navigate to **Setup > API access**
4. Find your service account in the list
5. Click **Grant Access**
6. Assign permissions:
   - ✅ View app information
   - ✅ Manage production releases
   - ✅ Manage testing track releases
   - ✅ Reply to reviews
7. Click **Invite User** and then **Send Invite**

### 2. Environment Configuration

Add the service account key path to your environment:

#### For Local Development

Create or update `.env.local`:

```bash
# Google Play MCP Configuration
GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH=/workspaces/armora/google-play-service-account.json
```

#### For CI/CD (GitHub Actions)

Add as a GitHub Secret:

1. Go to **Settings > Secrets and variables > Actions**
2. Click **New repository secret**
3. Name: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
4. Value: Paste the entire contents of your JSON key file
5. Click **Add secret**

Then create the file in your workflow:

```yaml
- name: Create service account key
  run: echo '${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON }}' > google-play-service-account.json

- name: Set environment variable
  run: echo "GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH=${{ github.workspace }}/google-play-service-account.json" >> $GITHUB_ENV
```

### 3. MCP Server Configuration File

The configuration file is located at `/workspaces/armora/mcp-google-play.config.json`:

```json
{
  "mcpServers": {
    "google-play": {
      "command": "npx",
      "args": [
        "@blocktopus/mcp-google-play",
        "--api-key",
        "${GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH}"
      ],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "${GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH}"
      }
    }
  }
}
```

### 4. Security Best Practices

**CRITICAL:** The service account key file contains sensitive credentials.

Add to `.gitignore` (already configured):

```gitignore
# Google Play Service Account
google-play-service-account.json
*.serviceaccount.json
```

**Never:**
- Commit service account keys to version control
- Share keys in documentation or chat
- Store keys in plain text in public locations
- Use the same key for multiple environments

**Always:**
- Store keys securely (password manager, secrets vault)
- Rotate keys periodically (every 90 days recommended)
- Use separate service accounts for dev/staging/prod
- Monitor API usage in Google Cloud Console
- Revoke access immediately if key is compromised

## Available npm Scripts

The following npm scripts have been added to `package.json` for common Play Store operations:

### List Apps
```bash
npm run play:list
```
Lists all apps in your Google Play Console account.

### Deploy Release
```bash
npm run play:deploy
```
Creates a new release. You'll need to provide:
- Package name (com.armora.protection)
- Track (internal/alpha/beta/production)
- AAB file path
- Version code
- Release notes

### Check Release Status
```bash
npm run play:status
```
Lists all releases for your app with their current status.

### Get App Information
```bash
npm run play:info
```
Retrieves detailed information about your app.

### View Reviews
```bash
npm run play:reviews
```
Fetches recent user reviews from the Play Store.

### View Statistics
```bash
npm run play:stats
```
Gets app performance metrics and statistics.

## MCP Server Tools Reference

The server provides 8 tools accessible via the MCP protocol:

### 1. `list_apps`
Lists all applications in your Play Console account.

**Parameters:** None
**Returns:** Array of app objects with package names and titles

### 2. `get_app_info`
Retrieves detailed information about a specific app.

**Parameters:**
- `packageName` (string): App package name (e.g., com.armora.protection)

**Returns:** App details including current version, listings, etc.

### 3. `list_releases`
Lists all releases for an app.

**Parameters:**
- `packageName` (string): App package name

**Returns:** Array of releases with version codes, tracks, and status

### 4. `create_release`
Creates a new app release.

**Parameters:**
- `packageName` (string): App package name
- `track` (string): Release track (internal/alpha/beta/production)
- `aabPath` (string): Path to AAB file
- `versionCode` (number): Version code
- `releaseNotes` (object): Release notes by locale

**Returns:** Release creation status

### 5. `update_listing`
Updates app store listing information.

**Parameters:**
- `packageName` (string): App package name
- `locale` (string): Locale code (e.g., en-US)
- `title` (string): App title
- `shortDescription` (string): Short description
- `fullDescription` (string): Full description

**Returns:** Update status

### 6. `get_reviews`
Retrieves user reviews.

**Parameters:**
- `packageName` (string): App package name
- `maxResults` (number, optional): Maximum reviews to fetch

**Returns:** Array of review objects

### 7. `reply_to_review`
Replies to a user review.

**Parameters:**
- `packageName` (string): App package name
- `reviewId` (string): Review ID
- `replyText` (string): Reply message

**Returns:** Reply status

### 8. `get_statistics`
Gets app statistics and metrics.

**Parameters:**
- `packageName` (string): App package name

**Returns:** Statistics object with downloads, ratings, etc.

## Usage Examples

### Example 1: List All Apps

```bash
npm run play:list
```

This will execute the MCP server and return all apps in your account.

### Example 2: Deploy New Release (via AI Assistant)

When using Claude Code or another MCP-compatible AI assistant:

```
User: Deploy the new Armora app release to internal testing

Claude: I'll create a new internal release for you.
[Uses MCP server to call create_release with appropriate parameters]
```

### Example 3: Manual Deployment Script

Create a deployment script at `scripts/deploy-to-play-store.js`:

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');

const PACKAGE_NAME = 'com.armora.protection';
const AAB_PATH = './android/app/build/outputs/bundle/release/app-release-bundle.aab';
const VERSION_CODE = process.env.VERSION_CODE || 1;
const TRACK = process.env.RELEASE_TRACK || 'internal';

console.log(`Deploying to ${TRACK} track...`);

try {
  execSync(`npx @blocktopus/mcp-google-play create_release \
    --package-name ${PACKAGE_NAME} \
    --track ${TRACK} \
    --aab-path ${AAB_PATH} \
    --version-code ${VERSION_CODE}`,
    { stdio: 'inherit' }
  );

  console.log('Deployment successful!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
```

Then add to `package.json`:

```json
"play:deploy-auto": "node scripts/deploy-to-play-store.js"
```

## Integration with GitHub Actions

Update `.github/workflows/android-build.yml` to include deployment:

```yaml
name: Android Build and Deploy

on:
  push:
    branches: [main]
    paths:
      - 'android/**'
      - '.github/workflows/android-build.yml'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build AAB
        run: |
          cd android
          ./gradlew bundleRelease

      - name: Create service account key
        run: echo '${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON }}' > google-play-service-account.json

      - name: Deploy to Play Store Internal Testing
        env:
          GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH: ${{ github.workspace }}/google-play-service-account.json
        run: npm run play:deploy

      - name: Clean up credentials
        if: always()
        run: rm -f google-play-service-account.json
```

## Troubleshooting

### Issue: "Service account not found"

**Solution:** Ensure the service account JSON file exists at the path specified in `GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH`.

```bash
ls -la $GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH
```

### Issue: "Permission denied" errors

**Solution:** Verify the service account has been granted access in Play Console:
1. Go to Play Console > Setup > API access
2. Check service account has necessary permissions
3. Wait 10-15 minutes after granting access (propagation delay)

### Issue: "Package not found"

**Solution:** Ensure your app is already created in Play Console. The MCP server cannot create new apps, only manage existing ones.

### Issue: npm scripts not working

**Solution:** Verify the package is installed:

```bash
npm list @blocktopus/mcp-google-play
```

If not found, reinstall:

```bash
npm install --save-dev @blocktopus/mcp-google-play
```

## Required Credentials Checklist

Before using the MCP server, ensure you have:

- [ ] Google Cloud Project created (Project ID: armora-protection)
- [ ] Google Play Developer API enabled in Cloud Console
- [ ] Service account created with appropriate role
- [ ] Service account JSON key file downloaded
- [ ] Service account granted access in Play Console
- [ ] Key file stored securely (NOT in Git)
- [ ] Environment variable `GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH` configured
- [ ] GitHub Secret `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` added (for CI/CD)
- [ ] App already published to Play Console (at least in internal testing)

## Next Steps

1. **Complete Service Account Setup** - Follow the steps in "Google Cloud Service Account Setup" section
2. **Test Installation** - Run `npm run play:list` to verify configuration
3. **Document Credentials** - Store service account details in password manager
4. **Configure CI/CD** - Add GitHub secrets for automated deployments
5. **Create Deployment Workflow** - Update GitHub Actions workflow for automatic releases
6. **Test Deployment** - Deploy to internal testing track first
7. **Monitor API Usage** - Check Google Cloud Console for API quota usage

## Additional Resources

- [Google Play Developer API Documentation](https://developers.google.com/android-publisher)
- [Blocktopus MCP Google Play GitHub](https://github.com/BlocktopusLtd/mcp-google-play)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Armora Android Build Setup](../ANDROID_BUILD_SETUP.md)
- [GitHub Secrets Setup Guide](../GITHUB_SECRETS_SETUP_GUIDE.md)

## Support

For issues with:
- **MCP Server:** Open issue on [GitHub](https://github.com/BlocktopusLtd/mcp-google-play/issues)
- **Google Play API:** Check [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- **Service Accounts:** Review [Google Cloud IAM Documentation](https://cloud.google.com/iam/docs/service-accounts)

---

**Last Updated:** 2025-10-09
**Document Version:** 1.0
**Status:** Complete - Ready for implementation
