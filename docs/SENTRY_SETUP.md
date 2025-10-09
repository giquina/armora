# Sentry Error Tracking Setup Guide for Armora

Complete step-by-step guide to set up Sentry error tracking for the Armora Protection Services platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Your Sentry DSN](#getting-your-sentry-dsn)
3. [Installing Sentry Packages](#installing-sentry-packages)
4. [Vercel Environment Variables](#vercel-environment-variables)
5. [Local Development Setup](#local-development-setup)
6. [Testing Error Tracking](#testing-error-tracking)
7. [Using Sentry MCP with Claude Code](#using-sentry-mcp-with-claude-code)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Create a Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Click **"Get Started"** or **"Sign Up"**
3. Choose one of:
   - Sign up with email and password
   - Sign in with GitHub (recommended for easier integration)
   - Sign in with Google
4. Complete the registration process

### 2. Create a New Sentry Project

After logging in for the first time, you'll see the onboarding flow:

1. **Select Platform**: Click **"React"**
2. **Set Alert Frequency**: Choose your preference (recommended: "Alert me on every new issue")
3. **Name Your Project**: Enter `armora-principal` (for the main app)
4. **Team**: Select your default team or create a new one
5. Click **"Create Project"**

**Note**: If you've skipped onboarding, create a project manually:
- Click **Projects** in the left sidebar
- Click **"Create Project"** button (top right)
- Follow the same steps above

---

## Getting Your Sentry DSN

The DSN (Data Source Name) is your unique project identifier that connects your app to Sentry.

### Step-by-Step Navigation

1. **Go to Your Project Settings**:
   - Click on **"Projects"** in the left sidebar
   - Click on **"armora-principal"** (or your project name)
   - Click the **gear icon (⚙️)** next to the project name, OR
   - Click **"Settings"** in the top navigation

2. **Find Your DSN**:
   - In the left sidebar of Settings, click **"Client Keys (DSN)"** under **SDK SETUP**
   - You'll see a section called **"Client Keys"**
   - Look for **"DSN"** - it will look like this:
     ```
     https://abc123def456@o123456.ingest.sentry.io/7890123
     ```
   - Click the **copy icon** next to the DSN to copy it

3. **Important Values to Note**:
   - **DSN**: The full URL (copy this)
   - **Organization Slug**: Found in the URL (e.g., `https://sentry.io/organizations/your-org-slug/`)
   - **Project Name**: The name you chose (e.g., `armora-principal`)
   - **Auth Token**: You'll need this for MCP (see section 7)

### Getting an Auth Token (for MCP and API access)

1. Click your **profile icon** (bottom left)
2. Select **"User settings"**
3. In the left sidebar, click **"Auth Tokens"**
4. Click **"Create New Token"**
5. Configure the token:
   - **Name**: `Claude Code MCP Token`
   - **Scopes**: Select:
     - `project:read`
     - `project:releases`
     - `event:read`
     - `org:read`
6. Click **"Create Token"**
7. **Copy the token immediately** (you won't see it again!)
8. Store it safely - you'll need it for the MCP setup

---

## Installing Sentry Packages

### 1. Install Required NPM Packages

Run this command in your project root:

```bash
npm install --save @sentry/react @sentry/tracing
```

This installs:
- `@sentry/react` - Core Sentry SDK for React
- `@sentry/tracing` - Performance monitoring and tracing

### 2. Verify Installation

Check that packages were added:

```bash
npm list | grep @sentry
```

You should see:
```
├── @sentry/react@X.X.X
├── @sentry/tracing@X.X.X
├── @sentry/mcp-server@0.18.0 (already installed)
```

---

## Vercel Environment Variables

### Adding Environment Variables in Vercel Dashboard

1. **Navigate to Your Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your **"armora"** project

2. **Open Environment Variables**:
   - Click **"Settings"** tab (top navigation)
   - In the left sidebar, click **"Environment Variables"**

3. **Add Sentry DSN**:
   - Click **"Add New"** button
   - **Key**: `REACT_APP_SENTRY_DSN`
   - **Value**: Paste your DSN from Sentry (e.g., `https://abc123def456@o123456.ingest.sentry.io/7890123`)
   - **Environments**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

4. **Add Environment Name** (optional but recommended):
   - Click **"Add New"** button again
   - **Key**: `REACT_APP_SENTRY_ENVIRONMENT`
   - **Value**: `production`
   - **Environments**: Check only **Production**
   - Click **"Save"**

5. **Add Additional Variables** (recommended):

   **Release Version**:
   - **Key**: `REACT_APP_SENTRY_RELEASE`
   - **Value**: `armora-principal@1.0.0` (update version as needed)
   - **Environments**: All
   - Click **"Save"**

   **Sample Rate** (optional - controls how many errors are tracked):
   - **Key**: `REACT_APP_SENTRY_TRACES_SAMPLE_RATE`
   - **Value**: `1.0` (100% in development/staging) or `0.1` (10% in production for high traffic)
   - **Environments**: All
   - Click **"Save"**

### Triggering a Redeploy

After adding environment variables:

1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **three dots (•••)** menu on the right
4. Select **"Redeploy"**
5. Keep **"Use existing Build Cache"** unchecked
6. Click **"Redeploy"**

**OR** push a new commit to trigger automatic deployment:

```bash
git commit --allow-empty -m "chore: trigger redeploy for Sentry env vars"
git push origin main
```

---

## Local Development Setup

### 1. Update `.env.local` File

Open or create `/workspaces/armora/.env.local` and add:

```bash
# ====================
# SENTRY ERROR TRACKING
# ====================
# Get your DSN from: https://sentry.io/settings/[your-org]/projects/armora-principal/keys/
REACT_APP_SENTRY_DSN=https://YOUR_DSN_HERE@o123456.ingest.sentry.io/7890123

# Environment name (helps filter errors in Sentry dashboard)
REACT_APP_SENTRY_ENVIRONMENT=development

# Release version (optional, helps track which version caused errors)
REACT_APP_SENTRY_RELEASE=armora-principal@0.1.0

# Performance monitoring - percentage of transactions to sample
# 1.0 = 100% (use in development), 0.1 = 10% (use in production)
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=1.0

# Optional: Enable debug mode (logs Sentry initialization)
REACT_APP_SENTRY_DEBUG=true
```

### 2. Update `.env.example` File

Add Sentry variables to the template (for other developers):

```bash
# ====================
# SENTRY ERROR TRACKING
# ====================
# Get from: https://sentry.io/settings/[your-org]/projects/armora-principal/keys/
REACT_APP_SENTRY_DSN=https://your_sentry_dsn_here@o123456.ingest.sentry.io/7890123
REACT_APP_SENTRY_ENVIRONMENT=development
REACT_APP_SENTRY_RELEASE=armora-principal@0.1.0
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=1.0
```

### 3. Create Sentry Initialization File

Create `/workspaces/armora/src/lib/sentry.ts`:

```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Initialize Sentry error tracking for Armora Principal App
 *
 * Features:
 * - Error tracking and reporting
 * - Performance monitoring
 * - User context tracking
 * - Release tracking
 * - Environment separation
 */
export const initSentry = () => {
  const dsn = process.env.REACT_APP_SENTRY_DSN;

  // Only initialize if DSN is provided
  if (!dsn) {
    console.warn('Sentry DSN not found. Error tracking disabled.');
    return;
  }

  const environment = process.env.REACT_APP_SENTRY_ENVIRONMENT ||
    process.env.NODE_ENV ||
    'development';

  const release = process.env.REACT_APP_SENTRY_RELEASE ||
    `armora-principal@${process.env.REACT_APP_VERSION || '0.1.0'}`;

  const tracesSampleRate = parseFloat(
    process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE || '1.0'
  );

  Sentry.init({
    dsn,
    environment,
    release,

    // Performance Monitoring
    integrations: [
      new BrowserTracing({
        // Set sampling rate for performance monitoring
        tracingOrigins: [
          'localhost',
          'armora.vercel.app',
          /^\//,  // Same-origin requests
        ],
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          // We use view-based routing, not react-router
          // This can be customized based on your navigation
        ),
      }),
    ],

    // Percentage of transactions to monitor (1.0 = 100%)
    tracesSampleRate,

    // Sample rate for error events (1.0 = 100%)
    sampleRate: 1.0,

    // Enable debug mode in development
    debug: process.env.REACT_APP_SENTRY_DEBUG === 'true',

    // Tag all events with app identifier
    initialScope: {
      tags: {
        app: 'armora-principal',
        platform: 'web',
      },
    },

    // Filter out localhost errors in production
    beforeSend(event, hint) {
      // Don't send errors from localhost in production
      if (environment === 'production' && event.request?.url?.includes('localhost')) {
        return null;
      }

      // Filter out browser extension errors
      if (hint.originalException instanceof Error) {
        const message = hint.originalException.message;
        if (
          message.includes('chrome-extension://') ||
          message.includes('moz-extension://') ||
          message.includes('safari-extension://')
        ) {
          return null;
        }
      }

      return event;
    },
  });
};

/**
 * Set user context in Sentry for better error tracking
 * Call this after user authentication
 */
export const setSentryUser = (user: {
  id: string;
  email?: string;
  role?: string;
  username?: string;
}) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });
};

/**
 * Clear user context from Sentry
 * Call this on logout
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

/**
 * Manually capture an exception
 * Use for caught errors that you want to track
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: context,
    tags: {
      manual_capture: true,
    },
  });
};

/**
 * Set context for the current scope
 * Useful for adding assignment/booking information
 */
export const setSentryContext = (name: string, context: Record<string, any>) => {
  Sentry.setContext(name, context);
};

/**
 * Add breadcrumb for user actions
 * Helps understand what led to an error
 */
export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
};
```

### 4. Initialize Sentry in Your App

Update `/workspaces/armora/src/index.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initSentry } from './lib/sentry';  // Add this import

// Initialize Sentry BEFORE rendering the app
initSentry();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

### 5. Add Sentry Error Boundary to App

Update `/workspaces/armora/src/App.tsx`:

```typescript
import React from 'react';
import * as Sentry from '@sentry/react';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
// ... other imports

function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '4rem auto'
        }}>
          <h1>Something went wrong</h1>
          <p>We've been notified and are working on a fix.</p>
          <button
            onClick={resetError}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: '2rem',
              textAlign: 'left',
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '12px'
            }}>
              {error.toString()}
            </pre>
          )}
        </div>
      )}
      showDialog={false}
    >
      <AuthProvider>
        <AppProvider>
          {/* Your app content */}
        </AppProvider>
      </AuthProvider>
    </Sentry.ErrorBoundary>
  );
}

export default Sentry.withProfiler(App);
```

### 6. Track User Context in AuthContext

Update `/workspaces/armora/src/contexts/AuthContext.tsx`:

```typescript
import { setSentryUser, clearSentryUser } from '../lib/sentry';

// In your login/auth success handler:
const handleAuthSuccess = (user) => {
  // ... your existing auth logic

  // Add Sentry user context
  setSentryUser({
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.email?.split('@')[0] || user.id,
  });
};

// In your logout handler:
const handleLogout = () => {
  // ... your existing logout logic

  // Clear Sentry user context
  clearSentryUser();
};
```

### 7. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

You should see a message in the console if Sentry initialized successfully (when `REACT_APP_SENTRY_DEBUG=true`).

---

## Testing Error Tracking

### 1. Create a Test Error Button

Add this component anywhere in your app (e.g., in a dev tools panel):

```typescript
// src/components/SentryTestButton.tsx
import React from 'react';
import * as Sentry from '@sentry/react';
import { captureException, addBreadcrumb } from '../lib/sentry';

export const SentryTestButton: React.FC = () => {
  const testError = () => {
    addBreadcrumb('User clicked test error button', 'user_action');

    try {
      throw new Error('Test error from Armora Principal App');
    } catch (error) {
      captureException(error as Error, {
        test: {
          type: 'manual_test',
          timestamp: new Date().toISOString(),
        },
      });
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={testError}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 24px',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        zIndex: 9999,
      }}
    >
      Test Sentry Error
    </button>
  );
};
```

Add to your App.tsx (in development only):

```typescript
import { SentryTestButton } from './components/SentryTestButton';

function App() {
  return (
    <>
      <SentryTestButton />
      {/* Rest of your app */}
    </>
  );
}
```

### 2. Trigger a Test Error

1. Start your dev server: `npm start`
2. Look for the red "Test Sentry Error" button (bottom right)
3. Click the button
4. Check your browser console - you should see Sentry logs (if debug is enabled)

### 3. View Error in Sentry Dashboard

1. Go to [sentry.io](https://sentry.io)
2. Click **"Issues"** in the left sidebar
3. You should see your test error appear within **30-60 seconds**
4. Click on the issue to see:
   - Error message and stack trace
   - Breadcrumbs (user actions leading to error)
   - User context (if logged in)
   - Device and browser information
   - Environment details

### Expected Timeline

- **Immediate**: Error logged to browser console
- **Within 10 seconds**: Error sent to Sentry servers
- **Within 30-60 seconds**: Error appears in Sentry dashboard
- **Within 2 minutes**: Email notification (if configured)

### 4. Test Error Boundary

To test the React Error Boundary:

```typescript
// Temporarily add this component
const BrokenComponent = () => {
  throw new Error('Error Boundary Test');
  return <div>This won't render</div>;
};

// Add it somewhere in your app
<BrokenComponent />
```

You should see:
1. The error boundary fallback UI
2. The error logged to Sentry
3. Stack trace captured

---

## Using Sentry MCP with Claude Code

The Sentry MCP (Model Context Protocol) server allows Claude Code to query your Sentry data directly.

### 1. Installation

The package is already installed:

```bash
npm list @sentry/mcp-server
# Should show: @sentry/mcp-server@0.18.0
```

### 2. Configure Claude Desktop

You need to add the Sentry MCP server to your Claude Desktop configuration.

**Location**: `~/.config/Claude/claude_desktop_config.json` (Linux/Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

Add this to your `mcpServers` object:

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": [
        "-y",
        "@sentry/mcp-server@0.18.0"
      ],
      "env": {
        "SENTRY_AUTH_TOKEN": "YOUR_AUTH_TOKEN_HERE",
        "SENTRY_ORG_SLUG": "your-organization-slug",
        "SENTRY_PROJECT_SLUG": "armora-principal"
      }
    }
  }
}
```

### 3. Get Required Values

**SENTRY_AUTH_TOKEN**: Follow steps in "Getting an Auth Token" section above

**SENTRY_ORG_SLUG**: Found in your Sentry URL
- Example URL: `https://sentry.io/organizations/my-company/`
- Org slug: `my-company`

**SENTRY_PROJECT_SLUG**: Your project name
- Default: `armora-principal`

### 4. Complete Configuration Example

Here's a full example with Sentry MCP added to existing MCP servers:

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server@0.18.0"],
      "env": {
        "SENTRY_AUTH_TOKEN": "sntrys_YOUR_TOKEN_HERE",
        "SENTRY_ORG_SLUG": "your-org",
        "SENTRY_PROJECT_SLUG": "armora-principal"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github@latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_TOKEN"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref", "jmzvrqwjmlnvxojculee"
      ]
    }
  }
}
```

### 5. Restart Claude Desktop

1. **Completely quit** Claude Desktop (not just close window)
   - Mac: `Cmd + Q`
   - Windows: File → Exit
   - Linux: Right-click system tray → Quit
2. **Restart** Claude Desktop
3. The Sentry MCP server should now be available

### 6. Test MCP Connection

Open Claude Code and try these queries:

**List Recent Issues**:
```
Show me the latest errors in Sentry for armora-principal
```

**Get Issue Details**:
```
Get details for Sentry issue ID: 1234567890
```

**Search Issues**:
```
Search Sentry for errors containing "protection assignment"
```

**Get Project Stats**:
```
What are the error statistics for armora-principal in the last 24 hours?
```

### 7. Available MCP Commands

The Sentry MCP server provides these capabilities:

1. **List Issues**: Get recent errors and exceptions
2. **Get Issue Details**: Full stack trace and context for an issue
3. **Search Issues**: Find specific errors by message or tag
4. **Get Project Stats**: Error rates, affected users, trends
5. **List Events**: Individual error occurrences
6. **Get Release Info**: Errors by release version

### 8. Troubleshooting MCP

**MCP server not showing**:
- Verify JSON syntax in config file (use jsonlint.com)
- Check Claude Desktop logs (Help → Show Logs)
- Ensure auth token has correct scopes

**Authentication errors**:
- Regenerate auth token in Sentry
- Verify org slug and project slug are correct
- Check token hasn't expired

**No data returned**:
- Ensure project has errors (trigger test error)
- Verify project slug matches exactly
- Check time range in queries

---

## Best Practices

### What to Track

✅ **DO Track**:
- Unhandled exceptions and errors
- Failed API calls and network errors
- Failed payment transactions
- Authentication failures
- Assignment/booking creation failures
- Location service errors
- Failed database operations
- Performance bottlenecks (slow page loads)

❌ **DON'T Track**:
- Expected validation errors (e.g., form validation)
- User cancellations (use analytics instead)
- 401 Unauthorized (expected behavior)
- Intentional navigation away
- User preference changes

### Privacy Considerations

**Sensitive Data to Exclude**:

1. **Personal Information**:
   - Credit card numbers
   - Full addresses (use area/postcode only)
   - Phone numbers
   - Passwords (should never be in code anyway)

2. **Configure Data Scrubbing** in Sentry:
   - Go to **Settings → Security & Privacy → Data Scrubbing**
   - Enable **"Scrub IP Addresses"**
   - Add custom rules for:
     - Credit card patterns: `\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}`
     - Email addresses: `[\w\.-]+@[\w\.-]+\.\w+`
     - Phone numbers: `(\+44|0)\s?\d{10}`

3. **beforeSend Hook**: Already configured to filter:
   - Browser extension errors
   - Localhost errors in production

### Performance Monitoring Setup

**Adjust Sample Rates by Environment**:

```typescript
// Development: Track everything
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=1.0

// Staging: Track most transactions
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=0.5

// Production: Track 10% (adjust based on traffic)
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=0.1
```

**Monitor These Transactions**:
- Page load time
- Assignment creation flow
- Payment processing
- Map rendering
- API call duration

### Error Grouping

**Use Fingerprinting** to group similar errors:

```typescript
Sentry.init({
  beforeSend(event, hint) {
    // Group all "Failed to fetch" errors together
    if (event.exception?.values?.[0]?.value?.includes('Failed to fetch')) {
      event.fingerprint = ['failed-to-fetch'];
    }
    return event;
  },
});
```

### Alert Configuration

**Set up Alerts in Sentry**:

1. Go to **Alerts** in left sidebar
2. Click **"Create Alert"**
3. Choose trigger:
   - **Issue Alert**: When a new error occurs
   - **Metric Alert**: When error rate spikes

**Recommended Alerts**:
- New issue in production (immediate notification)
- Error rate > 10 per minute (Slack/email)
- Payment errors (immediate notification)
- Assignment creation failures (immediate notification)

### Release Tracking

**Track Releases** to see which version introduced errors:

```typescript
// In your CI/CD pipeline or package.json
REACT_APP_SENTRY_RELEASE=armora-principal@1.2.3
```

**Upload Source Maps** for better stack traces:

```bash
# Install Sentry CLI
npm install -g @sentry/cli

# In your build script
sentry-cli releases new armora-principal@1.2.3
sentry-cli releases files armora-principal@1.2.3 upload-sourcemaps ./build/static/js
sentry-cli releases finalize armora-principal@1.2.3
```

---

## Troubleshooting

### Errors Not Appearing in Sentry

**Check 1: Is Sentry Initialized?**
```javascript
// Open browser console and run:
window.__SENTRY__.hub
// Should show Sentry hub object
```

**Check 2: Is DSN Configured?**
```javascript
// In browser console:
console.log(process.env.REACT_APP_SENTRY_DSN);
// Should show your DSN URL
```

**Check 3: Network Requests**
- Open DevTools → Network tab
- Filter for "sentry"
- Trigger an error
- Look for POST request to `ingest.sentry.io`
- Check response status (should be 200)

**Check 4: Environment Variables**
```bash
# In terminal:
npm run build
# Check if REACT_APP_SENTRY_DSN is embedded in build
grep -r "REACT_APP_SENTRY_DSN" build/
```

**Common Fixes**:
- Restart dev server after adding env vars
- Clear browser cache and hard reload
- Check `.env.local` is in project root
- Verify DSN is correct (no typos)
- Check firewall/ad blocker isn't blocking Sentry

### Source Maps Not Working

**Symptom**: Stack traces show minified code

**Fix 1**: Enable source maps in build
```json
// package.json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=true react-scripts build"
  }
}
```

**Fix 2**: Upload source maps to Sentry
```bash
npm install @sentry/webpack-plugin --save-dev
```

Add to `craco.config.js`:
```javascript
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'your-org-slug',
        project: 'armora-principal',
        include: './build',
        ignore: ['node_modules'],
      }),
    ],
  },
};
```

### Performance Issues

**Symptom**: App feels slower after Sentry integration

**Fix**: Reduce sample rate
```bash
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% instead of 100%
```

**Fix**: Disable in development
```typescript
// src/lib/sentry.ts
export const initSentry = () => {
  // Don't initialize in development
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  // ... rest of init
};
```

### Too Many Errors

**Symptom**: Getting overwhelmed with error notifications

**Fix 1**: Adjust alert frequency
- Sentry Dashboard → Alerts → Edit Alert
- Change from "Every occurrence" to "First occurrence only"

**Fix 2**: Ignore specific errors
```typescript
Sentry.init({
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Network request failed',
  ],
});
```

**Fix 3**: Set error quotas
- Sentry Dashboard → Settings → Quotas
- Set maximum events per month
- Spike protection (automatically reduces sample rate)

---

## Additional Resources

### Documentation
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry MCP Server](https://github.com/getsentry/sentry-mcp-server)

### Sentry Dashboard
- **Issues**: https://sentry.io/organizations/[your-org]/issues/
- **Performance**: https://sentry.io/organizations/[your-org]/performance/
- **Releases**: https://sentry.io/organizations/[your-org]/releases/
- **Alerts**: https://sentry.io/organizations/[your-org]/alerts/

### Support
- [Sentry Discord](https://discord.gg/sentry)
- [Sentry Forum](https://forum.sentry.io/)
- [GitHub Issues](https://github.com/getsentry/sentry-javascript/issues)

---

## Quick Reference

### Environment Variables
```bash
REACT_APP_SENTRY_DSN=https://...@o123.ingest.sentry.io/456
REACT_APP_SENTRY_ENVIRONMENT=production
REACT_APP_SENTRY_RELEASE=armora-principal@1.0.0
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=0.1
```

### Common Commands
```bash
# Test error tracking
Sentry.captureException(new Error('Test'));

# Set user context
Sentry.setUser({ id: '123', email: 'user@example.com' });

# Clear user context
Sentry.setUser(null);

# Add breadcrumb
Sentry.addBreadcrumb({ message: 'User clicked button', category: 'ui' });

# Set custom context
Sentry.setContext('assignment', { id: 'abc123', status: 'active' });
```

### MCP Queries
```
Show me recent Sentry errors for armora-principal
Get details for Sentry issue 1234567890
What are the top 5 errors in the last week?
Show me all errors related to "payment"
```

---

**Last Updated**: October 8, 2025
**Armora Project**: Premium Close Protection Services Platform
**For Questions**: Contact development team or refer to Sentry documentation


---

Last updated: 2025-10-09T08:08:25.961Z
