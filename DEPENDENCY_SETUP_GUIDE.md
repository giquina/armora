# Dependency Setup Guide
## React 19 + Node 20 Configuration for Armora

This guide ensures all developers and deployment environments use the correct versions.

---

## Prerequisites

### Required Versions
- **Node.js**: 20.0.0 or higher (20.19.5 recommended)
- **NPM**: 10.0.0 or higher
- **React**: 19.1.1 (installed via npm)
- **TypeScript**: 4.9.5 (installed via npm)

### Why These Versions?

#### Node 20+
- **Firebase 12.3.0** requires Node 20+
- **React 19** is optimized for Node 20+
- Better TypeScript compilation performance
- Modern JavaScript features support

#### React 19.1.1
- Latest stable React version
- Improved performance
- Better TypeScript support
- **react-leaflet 5.0.0** requires React 19

---

## Local Development Setup

### 1. Install Node Version Manager (nvm)

#### macOS/Linux
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### Windows
Download and install: https://github.com/coreybutler/nvm-windows/releases

### 2. Install and Use Node 20

```bash
# Install Node 20
nvm install 20

# Use Node 20 for this project
nvm use 20

# Set as default (optional)
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x or higher
```

### 3. Install Project Dependencies

```bash
# Clone repository
git clone https://github.com/giquina/armora.git
cd armora

# Install dependencies (skips Puppeteer Chrome download)
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Verify React versions
npm ls react react-dom react-leaflet
```

### 4. Run Development Server

```bash
# Standard start
npm start

# With development hooks and agents
npm run dev

# Fresh start (clears cache)
npm run fresh
```

---

## Verification Steps

### Check Node Version
```bash
node --version
# Expected: v20.19.5 or higher
```

### Check NPM Version
```bash
npm --version
# Expected: 10.8.2 or higher
```

### Check Installed React Versions
```bash
npm ls react react-dom react-leaflet @types/react @types/react-dom
```

**Expected Output:**
```
armora-security@0.1.0
├── react@19.1.1
├── react-dom@19.1.1
├── react-leaflet@5.0.0
├── @types/react@19.1.14
└── @types/react-dom@19.1.9
```

### Check for Peer Dependency Conflicts
```bash
npm ls 2>&1 | grep -i "unmet\|invalid" || echo "✅ No conflicts"
```

### Verify Build Works
```bash
npm run build
```

Should complete without React compatibility errors.

---

## Troubleshooting

### Issue: "Unsupported engine" Error

**Symptom:**
```
npm ERR! Unsupported engine
npm ERR! Requires node >=20.0.0
```

**Solution:**
```bash
# Install and use Node 20
nvm install 20
nvm use 20

# Verify
node --version
```

### Issue: "ERESOLVE could not resolve" Error

**Symptom:**
```
npm ERR! ERESOLVE could not resolve
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
PUPPETEER_SKIP_DOWNLOAD=true npm install
```

### Issue: "Cannot be used as a JSX component" Error

**Symptom:**
```
Type 'X' cannot be used as a JSX component
```

**Cause:** Mismatched React types

**Solution:**
```bash
# Verify type versions match
npm ls @types/react @types/react-dom

# Should both be 19.x.x
# If not, reinstall:
npm install --save-dev @types/react@^19.1.12 @types/react-dom@^19.1.9
```

### Issue: react-leaflet Errors

**Symptom:**
```
Module not found: Can't resolve 'react-leaflet'
```

**Cause:** Wrong react-leaflet version

**Solution:**
```bash
# Verify version is 5.x for React 19
npm ls react-leaflet

# Should be 5.0.0 or higher
# If not, reinstall:
npm install react-leaflet@^5.0.0
```

### Issue: Firebase Warnings

**Symptom:**
```
Warning: Firebase 12 requires Node 20+
```

**Solution:**
Already using Node 20+ (no action needed if node --version shows v20.x.x)

---

## CI/CD Configuration

### GitHub Actions

The repository includes `.github/workflows/dependency-check.yml` that:
- ✅ Verifies Node 20 is used
- ✅ Checks for peer dependency conflicts
- ✅ Validates React version compatibility
- ✅ Runs build to detect errors
- ✅ Generates dependency reports

### Vercel Deployment

The `vercel.json` file specifies:
```json
{
  "env": {
    "NODE_VERSION": "20"
  }
}
```

**To verify Vercel is using Node 20:**
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → General
4. Verify Node.js Version is set to 20.x

### Other Platforms

#### Netlify
Add to `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "20"
  PUPPETEER_SKIP_DOWNLOAD = "true"
```

#### Heroku
Add to repository root:
```json
{
  "engines": {
    "node": "20.x",
    "npm": "10.x"
  }
}
```

#### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## Pre-commit Hook

The repository includes `.husky/check-node-version` that runs before each commit to ensure Node 20+ is being used.

### To enable:
```bash
# Install husky (if not already installed)
npm install --save-dev husky

# Initialize husky
npx husky install

# The check-node-version hook will run automatically on commit
```

### To run manually:
```bash
.husky/check-node-version
```

---

## Environment Variables

### Required for Development

Create `.env.local`:
```bash
# Firebase (Cloud Messaging)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=armora-protection.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=armora-protection

# Supabase (Backend & Auth)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (Payments)
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Google Maps (Geocoding)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Required for CI/CD

Set these as secrets in your deployment platform:
- All variables from `.env.local`
- `NODE_VERSION=20`
- `PUPPETEER_SKIP_DOWNLOAD=true`

---

## Package Management Best Practices

### Installing New Packages

```bash
# Always use npm (not yarn or pnpm for consistency)
npm install <package-name>

# Check compatibility after installing
npm ls <package-name>

# Verify no peer dependency issues
npm ls 2>&1 | grep -i "unmet" || echo "✅ OK"
```

### Updating Packages

```bash
# Check what's outdated
npm outdated

# Update specific package
npm update <package-name>

# Update all minor/patch versions
npm update

# Verify build still works
npm run build
```

### Checking for Security Issues

```bash
# Run security audit
npm audit

# Fix automatically fixable issues
npm audit fix

# For critical vulnerabilities
npm audit fix --force
```

---

## Common Questions

### Q: Can I use Node 18?
**A:** No. Firebase 12.3.0 requires Node 20+. Using Node 18 will cause runtime warnings and potential issues.

### Q: Can I use React 18?
**A:** Not recommended. The project uses react-leaflet 5.0.0 which is optimized for React 19. Downgrading to React 18 would require downgrading to react-leaflet 4.x.

### Q: Why not use the latest TypeScript?
**A:** TypeScript 4.9.5 is stable and fully compatible with React 19. Upgrading to TypeScript 5.x is optional and not required.

### Q: Do I need to install Puppeteer?
**A:** No. The project includes Puppeteer for potential E2E testing, but the Chrome download is skipped via `PUPPETEER_SKIP_DOWNLOAD=true` to speed up installation.

### Q: What if I see deprecation warnings?
**A:** Some deprecation warnings are expected:
- `@supabase/auth-helpers-react` is deprecated (migration planned)
- Various Babel plugins (managed by react-scripts)

These don't affect functionality but should be addressed in future updates.

---

## Maintenance Schedule

### Weekly
- [ ] Check for security updates: `npm audit`
- [ ] Review dependency updates: `npm outdated`

### Monthly
- [ ] Update minor versions: `npm update`
- [ ] Test build: `npm run build`
- [ ] Run tests: `npm test`

### Quarterly
- [ ] Review major version updates
- [ ] Update Node.js to latest 20.x LTS
- [ ] Review React ecosystem updates
- [ ] Update documentation

---

## Getting Help

### Resources
- **React 19 Docs**: https://react.dev/
- **Node.js 20 Docs**: https://nodejs.org/docs/latest-v20.x/api/
- **Firebase 12 Docs**: https://firebase.google.com/docs
- **react-leaflet Docs**: https://react-leaflet.js.org/

### Project-Specific Help
- Check `DEPENDENCY_AUDIT_REPORT.md` for detailed compatibility analysis
- Check `CLAUDE.md` for project architecture and development guidelines
- Run `npm run health` for automated health check

### Issues
If you encounter dependency issues:
1. Run: `npm run health`
2. Check: `DEPENDENCY_AUDIT_REPORT.md`
3. Try: `npm run fresh`
4. Open issue with output from above commands

---

**Last Updated**: October 6, 2025  
**Node Version**: 20.19.5  
**React Version**: 19.1.1  
**Status**: ✅ Production Ready
