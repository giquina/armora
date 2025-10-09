# Sentry Quick Start Guide

**5-minute setup guide for error tracking in Armora**

---

## Step 1: Get Your Sentry DSN (2 minutes)

1. Go to [sentry.io](https://sentry.io) and sign up/login
2. Create project: **React** → Name it `armora-principal`
3. Navigate: **Settings → Client Keys (DSN)**
4. Copy the DSN (looks like: `https://abc123@o456.ingest.sentry.io/789`)

---

## Step 2: Install Packages (30 seconds)

```bash
npm install --save @sentry/react @sentry/tracing
```

---

## Step 3: Add to Environment Variables (1 minute)

**Local (.env.local)**:
```bash
REACT_APP_SENTRY_DSN=https://YOUR_DSN_HERE@o123.ingest.sentry.io/456
REACT_APP_SENTRY_ENVIRONMENT=development
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=1.0
```

**Vercel Dashboard**:
- Go to: Project → Settings → Environment Variables
- Add: `REACT_APP_SENTRY_DSN` with your DSN value
- Check: Production, Preview, Development
- Redeploy your app

---

## Step 4: Initialize Sentry (1 minute)

Create `/workspaces/armora/src/lib/sentry.ts`:

```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  if (!dsn) {
    console.warn('Sentry DSN not found');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT || 'development',
    integrations: [new BrowserTracing()],
    tracesSampleRate: parseFloat(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE || '1.0'),
    initialScope: {
      tags: { app: 'armora-principal' },
    },
  });
};

export const setSentryUser = (user: { id: string; email?: string; role?: string }) => {
  Sentry.setUser(user);
};

export const clearSentryUser = () => {
  Sentry.setUser(null);
};
```

---

## Step 5: Add to Your App (30 seconds)

**src/index.tsx**:
```typescript
import { initSentry } from './lib/sentry';

initSentry(); // Add before ReactDOM.createRoot

const root = ReactDOM.createRoot(/* ... */);
// ... rest of your code
```

**src/App.tsx**:
```typescript
import * as Sentry from '@sentry/react';

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {/* Your app content */}
    </Sentry.ErrorBoundary>
  );
}

export default Sentry.withProfiler(App);
```

**src/contexts/AuthContext.tsx** (in your auth handler):
```typescript
import { setSentryUser, clearSentryUser } from '../lib/sentry';

// After login:
setSentryUser({ id: user.id, email: user.email, role: user.role });

// On logout:
clearSentryUser();
```

---

## Step 6: Test It! (30 seconds)

```bash
npm start
```

Then in browser console:
```javascript
throw new Error('Test Sentry Error');
```

Check Sentry dashboard in 30 seconds → You should see the error!

---

## MCP Setup (Optional - for Claude Code)

1. Get auth token: Sentry → User Settings → Auth Tokens → Create Token
2. Edit `~/.config/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server@0.18.0"],
      "env": {
        "SENTRY_AUTH_TOKEN": "sntrys_YOUR_TOKEN",
        "SENTRY_ORG_SLUG": "your-org",
        "SENTRY_PROJECT_SLUG": "armora-principal"
      }
    }
  }
}
```

3. Restart Claude Desktop
4. Ask Claude: "Show me recent Sentry errors for armora-principal"

---

## Common Issues

**Error not showing in Sentry?**
- Check: `console.log(process.env.REACT_APP_SENTRY_DSN)` shows your DSN
- Check: Network tab shows request to `ingest.sentry.io` (status 200)
- Restart dev server after adding env vars

**Source maps not working?**
- Build with: `GENERATE_SOURCEMAP=true npm run build`

**Too many errors?**
- Lower sample rate: `REACT_APP_SENTRY_TRACES_SAMPLE_RATE=0.1`

---

**Full Documentation**: See `/workspaces/armora/docs/SENTRY_SETUP.md`

**Last Updated**: October 8, 2025


---

Last updated: 2025-10-09T08:08:25.960Z
