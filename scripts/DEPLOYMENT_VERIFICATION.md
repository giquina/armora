# Deployment Verification Script

## Overview

The `verify-deployment.js` script performs comprehensive health checks on the Armora production deployment to ensure all critical services are functioning correctly.

## Usage

### Basic Usage

```bash
# Using npm script (recommended)
npm run verify

# Or directly with node
node scripts/verify-deployment.js

# Custom production URL
PRODUCTION_URL=https://custom-url.vercel.app npm run verify
```

### CI/CD Integration

The script exits with appropriate codes for CI/CD pipelines:

- **Exit Code 0**: All tests passed (may have warnings)
- **Exit Code 1**: One or more critical tests failed

Example GitHub Actions workflow:

```yaml
- name: Verify Deployment
  run: npm run verify
  env:
    PRODUCTION_URL: ${{ secrets.PRODUCTION_URL }}
```

## Tests Performed

### 1. Production URL Accessibility
- Checks if the production URL is accessible (HTTP 200)
- Validates Armora branding is present
- Confirms React root element exists
- Measures initial page load time

**Success Criteria**: Returns 200 status, contains expected content

### 2. Service Worker Registration
- Checks for Service Worker file at `/sw.js`
- Validates Service Worker JavaScript content
- Confirms PWA capabilities

**Success Criteria**: Service Worker file exists and contains valid code

### 3. Firebase Connectivity
- Detects Firebase references in application
- Validates Firebase project configuration
- Checks Cloud Messaging setup

**Success Criteria**: Firebase integration detected

**Note**: Firebase and Supabase clients are bundled in the JavaScript files, not visible in HTML source.

### 4. Supabase Health
- Checks for Supabase client integration
- Validates configuration references

**Success Criteria**: Supabase client detected

### 5. Google Maps API
- Detects Google Maps or Leaflet integration
- Validates mapping functionality

**Success Criteria**: Maps library references found

### 6. Sentry Initialization
- Checks for Sentry error tracking setup
- Validates error monitoring integration

**Note**: Sentry is currently a dev dependency and may not be active in production.

### 7. Asset Links Verification (TWA)
- Validates `/.well-known/assetlinks.json` accessibility
- Checks Android package name configuration
- Verifies SHA-256 certificate fingerprint

**Success Criteria**:
- Asset links file returns 200
- Valid JSON structure
- Correct package name: `com.armora.protection`
- SHA-256 fingerprint present

### 8. Performance Metrics
- Measures page load time
  - Fast: <1000ms
  - Moderate: 1000-3000ms
  - Slow: >3000ms
- Analyzes HTML bundle size
- Checks compression headers
- Validates cache control settings

**Success Criteria**: Load time <1000ms, HTML <100KB

## Output Format

The script provides color-coded output:

- ✅ **Green**: Test passed
- ⚠️ **Yellow**: Warning (non-critical issue)
- ❌ **Red**: Test failed (critical issue)
- ℹ️ **Cyan**: Informational message

### Example Output

```
======================================================================
  ARMORA DEPLOYMENT VERIFICATION
  Professional Close Protection Services Platform
======================================================================

ℹ️  Target URL: https://armora.vercel.app
ℹ️  Timestamp: 2025-10-08T09:05:30.994Z

1. Testing Production URL Accessibility
ℹ️  Target: https://armora.vercel.app
✅ Production URL accessible (89ms)
✅ Page contains Armora branding
✅ React root element found

...

======================================================================
SUMMARY

✅ Passed: 13
   - Production URL accessible (89ms)
   - Page contains Armora branding
   - ...

⚠️  Warnings: 4
   - No Firebase references found in page source
   - ...

======================================================================

✅ Verification PASSED with warnings - Review warnings above
```

## Configuration

### Environment Variables

- **PRODUCTION_URL**: Override default production URL
  - Default: `https://armora.vercel.app`
  - Example: `PRODUCTION_URL=https://staging.armora.vercel.app npm run verify`

### Timeouts

- Default request timeout: 10 seconds (10000ms)
- Configurable in script: `TIMEOUT_MS` constant

## Common Warnings

### "No Firebase/Supabase references found in page source"

This is normal behavior. Firebase and Supabase are loaded as JavaScript bundles and initialized at runtime. The verification script only inspects the initial HTML response, so these services won't be visible there.

**What to check**:
- Ensure environment variables are set in Vercel
- Check browser console for initialization errors
- Verify service credentials in Vercel project settings

### "Content compression not detected"

Vercel may handle compression at the CDN level rather than at the application level.

**What to check**:
- Check actual response headers in browser DevTools
- Verify Vercel compression settings in project configuration

### "No maps library references found"

Similar to Firebase/Supabase, Leaflet and Google Maps are loaded dynamically.

**What to check**:
- Verify `REACT_APP_GOOGLE_MAPS_API_KEY` is set in Vercel
- Check browser console for map initialization

## Troubleshooting

### Script Fails with Network Errors

**Possible causes**:
- Production URL is down or unreachable
- Network connectivity issues
- Firewall blocking outbound HTTPS requests

**Solutions**:
```bash
# Test basic connectivity
curl -I https://armora.vercel.app

# Use custom timeout
# Edit TIMEOUT_MS in script to increase timeout
```

### 401 Unauthorized Errors

**Cause**: Deployment is password-protected (Vercel preview deployments)

**Solution**: Use the main production URL without password protection, or temporarily disable Vercel deployment protection for verification.

### All Tests Pass But Application Doesn't Work

**Cause**: The script tests basic accessibility, not full functionality.

**Solution**:
- Run end-to-end tests: `npm run test:e2e`
- Check browser console for JavaScript errors
- Verify all environment variables in Vercel
- Test critical user flows manually

## Integration with Development Workflow

### Pre-Deployment Checklist

1. Run local build: `npm run build`
2. Test locally: `serve -s build`
3. Run verification on staging deployment
4. Review warnings and fix critical issues
5. Deploy to production
6. Run verification on production
7. Monitor Sentry for errors (when configured)

### Continuous Monitoring

Add to CI/CD pipeline:

```yaml
# .github/workflows/verify-deployment.yml
name: Verify Production Deployment

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run verify
      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 Production Deployment Verification Failed',
              body: 'Automated verification detected issues with production deployment.',
              labels: ['production', 'urgent']
            })
```

## Related Scripts

- `npm run health` - Local development health check
- `npm run build` - Production build with TypeScript checking
- `npm run test:e2e` - Playwright end-to-end tests
- `npm run project-health` - Comprehensive project health analysis

## Dependencies

The script uses only Node.js built-in modules:
- `https` - HTTPS requests
- `http` - HTTP requests (if needed)

No external dependencies required. Works in any Node.js environment ≥14.x.

## Contributing

When adding new tests:

1. Follow the existing test pattern
2. Add appropriate success/failure/warning logging
3. Update this documentation
4. Ensure exit code behavior is maintained
5. Test with both passing and failing scenarios

## License

Part of Armora Protection Services Platform
© 2025 Armora Security
