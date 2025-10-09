# Sentry Implementation Checklist

Use this checklist to ensure complete Sentry setup for Armora.

---

## Phase 1: Account & Project Setup

- [ ] Create Sentry account at [sentry.io](https://sentry.io)
- [ ] Create new project named `armora-principal`
- [ ] Select React platform
- [ ] Copy DSN from Settings → Client Keys
- [ ] Create auth token (Settings → Auth Tokens)
  - [ ] Name: `Claude Code MCP Token`
  - [ ] Scopes: `project:read`, `event:read`, `org:read`
- [ ] Note your organization slug
- [ ] Save credentials securely

---

## Phase 2: Package Installation

- [ ] Install Sentry packages:
  ```bash
  npm install --save @sentry/react @sentry/tracing
  ```
- [ ] Verify installation:
  ```bash
  npm list | grep @sentry
  ```
- [ ] Should see: `@sentry/react`, `@sentry/tracing`, `@sentry/mcp-server`

---

## Phase 3: Environment Configuration

### Local Development

- [ ] Open/create `.env.local` in project root
- [ ] Add these variables:
  ```bash
  REACT_APP_SENTRY_DSN=https://YOUR_DSN@o123.ingest.sentry.io/456
  REACT_APP_SENTRY_ENVIRONMENT=development
  REACT_APP_SENTRY_TRACES_SAMPLE_RATE=1.0
  REACT_APP_SENTRY_DEBUG=true
  ```
- [ ] Replace `YOUR_DSN` with actual DSN from Sentry
- [ ] Save file

### Vercel Production

- [ ] Go to Vercel dashboard → Your project
- [ ] Navigate to Settings → Environment Variables
- [ ] Add `REACT_APP_SENTRY_DSN`:
  - [ ] Key: `REACT_APP_SENTRY_DSN`
  - [ ] Value: Your DSN
  - [ ] Environments: ✅ Production, ✅ Preview, ✅ Development
- [ ] Add `REACT_APP_SENTRY_ENVIRONMENT`:
  - [ ] Key: `REACT_APP_SENTRY_ENVIRONMENT`
  - [ ] Value: `production`
  - [ ] Environments: ✅ Production only
- [ ] Add `REACT_APP_SENTRY_TRACES_SAMPLE_RATE`:
  - [ ] Key: `REACT_APP_SENTRY_TRACES_SAMPLE_RATE`
  - [ ] Value: `0.1` (10% for production)
  - [ ] Environments: ✅ Production only
- [ ] Trigger redeploy

### Update .env.example

- [ ] Add Sentry variables to `.env.example` file
- [ ] Add comments explaining where to get DSN
- [ ] Commit to Git for other developers

---

## Phase 4: Code Implementation

### Create Sentry Library

- [ ] Create file: `src/lib/sentry.ts`
- [ ] Copy implementation from SENTRY_SETUP.md
- [ ] Includes:
  - [ ] `initSentry()` function
  - [ ] `setSentryUser()` function
  - [ ] `clearSentryUser()` function
  - [ ] `captureException()` function
  - [ ] `addBreadcrumb()` function
  - [ ] `setSentryContext()` function

### Initialize Sentry

- [ ] Open `src/index.tsx`
- [ ] Import: `import { initSentry } from './lib/sentry';`
- [ ] Add `initSentry();` before `ReactDOM.createRoot()`
- [ ] Save file

### Add Error Boundary

- [ ] Open `src/App.tsx`
- [ ] Import: `import * as Sentry from '@sentry/react';`
- [ ] Wrap app with `<Sentry.ErrorBoundary>`
- [ ] Add fallback UI for errors
- [ ] Export app with: `export default Sentry.withProfiler(App);`
- [ ] Save file

### Track User Context

- [ ] Open `src/contexts/AuthContext.tsx`
- [ ] Import: `import { setSentryUser, clearSentryUser } from '../lib/sentry';`
- [ ] In login/auth success handler:
  - [ ] Add `setSentryUser({ id, email, role })`
- [ ] In logout handler:
  - [ ] Add `clearSentryUser()`
- [ ] Save file

### Update Assignment Error Boundary (Optional)

- [ ] Open `src/components/ProtectionAssignment/AssignmentErrorBoundary.tsx`
- [ ] Import: `import * as Sentry from '@sentry/react';`
- [ ] In `componentDidCatch` method:
  - [ ] Add `Sentry.captureException(error, { contexts: { assignment: {...} } })`
- [ ] Save file

---

## Phase 5: Testing

### Local Testing

- [ ] Restart dev server: `npm start`
- [ ] Check browser console for Sentry initialization message
- [ ] Test DSN is configured:
  - [ ] Open browser console
  - [ ] Run: `console.log(process.env.REACT_APP_SENTRY_DSN)`
  - [ ] Should show your DSN
- [ ] Test error tracking:
  - [ ] Open browser console
  - [ ] Run: `throw new Error('Test Sentry Error');`
  - [ ] Check Network tab for request to `ingest.sentry.io`
- [ ] Check Sentry dashboard:
  - [ ] Go to sentry.io → Issues
  - [ ] Should see test error within 30-60 seconds
  - [ ] Click on issue to view details

### Error Boundary Testing

- [ ] Create test component that throws error
- [ ] Add to your app temporarily
- [ ] Verify error boundary fallback appears
- [ ] Verify error sent to Sentry
- [ ] Remove test component

### User Context Testing

- [ ] Log in to app
- [ ] Trigger an error
- [ ] Check Sentry dashboard
- [ ] Verify user information appears in error details
- [ ] Log out
- [ ] Trigger another error
- [ ] Verify user information is cleared

### Production Testing

- [ ] Deploy to Vercel
- [ ] Wait for deployment to complete
- [ ] Visit production URL
- [ ] Trigger a test error
- [ ] Check Sentry dashboard
- [ ] Verify environment shows as "production"
- [ ] Verify error appears in dashboard

---

## Phase 6: MCP Integration (Optional)

### Configure Claude Desktop

- [ ] Locate config file:
  - Mac/Linux: `~/.config/Claude/claude_desktop_config.json`
  - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- [ ] Open in text editor
- [ ] Add Sentry MCP server configuration
- [ ] Replace placeholders:
  - [ ] `SENTRY_AUTH_TOKEN`: Your auth token
  - [ ] `SENTRY_ORG_SLUG`: Your organization slug
  - [ ] `SENTRY_PROJECT_SLUG`: `armora-principal`
- [ ] Save file
- [ ] Validate JSON syntax (use jsonlint.com)

### Test MCP Connection

- [ ] Completely quit Claude Desktop
- [ ] Restart Claude Desktop
- [ ] Open Claude Code
- [ ] Test query: "Show me recent Sentry errors for armora-principal"
- [ ] Verify response includes error data
- [ ] Test other queries:
  - [ ] "Get Sentry error statistics for last 24 hours"
  - [ ] "Show me details for Sentry issue [ID]"
  - [ ] "Search Sentry for errors containing 'payment'"

---

## Phase 7: Configuration & Optimization

### Data Privacy

- [ ] Enable IP scrubbing in Sentry dashboard
- [ ] Configure data scrubbing rules:
  - [ ] Credit card patterns
  - [ ] Email addresses
  - [ ] Phone numbers
- [ ] Review `beforeSend` hook in `sentry.ts`
- [ ] Test that sensitive data is filtered

### Performance Optimization

- [ ] Set appropriate sample rates per environment:
  - [ ] Development: 1.0 (100%)
  - [ ] Staging: 0.5 (50%)
  - [ ] Production: 0.1 (10%)
- [ ] Monitor Sentry quota usage
- [ ] Adjust rates if needed

### Error Filtering

- [ ] Configure `ignoreErrors` for:
  - [ ] Browser extension errors
  - [ ] Expected validation errors
  - [ ] Network timeouts (if too noisy)
- [ ] Test filtering works correctly

### Alerts

- [ ] Set up alert rules in Sentry:
  - [ ] New issue in production → Email/Slack immediately
  - [ ] Error rate spike → Alert when > 10/min
  - [ ] Payment errors → Immediate notification
  - [ ] Assignment failures → Immediate notification
- [ ] Test alerts by triggering errors
- [ ] Verify notifications received

### Release Tracking

- [ ] Configure release tracking in build pipeline
- [ ] Upload source maps (optional but recommended)
- [ ] Test that releases appear in Sentry dashboard
- [ ] Verify source maps work (readable stack traces)

---

## Phase 8: Documentation & Team Onboarding

- [x] Read SENTRY_SETUP.md (comprehensive guide)
- [x] Read SENTRY_QUICK_START.md (5-minute setup)
- [ ] Share documentation with team
- [ ] Add Sentry credentials to team password manager
- [ ] Document alert channels (Slack, email, etc.)
- [ ] Create runbook for handling Sentry alerts
- [ ] Train team on:
  - [ ] Viewing errors in dashboard
  - [ ] Understanding stack traces
  - [ ] Filtering and searching issues
  - [ ] Using MCP with Claude Code

---

## Phase 9: Monitoring & Maintenance

### Weekly Tasks

- [ ] Review new issues in Sentry
- [ ] Triage and assign critical errors
- [ ] Check error trends (increasing/decreasing)
- [ ] Review performance metrics
- [ ] Check quota usage

### Monthly Tasks

- [ ] Review and update ignored errors list
- [ ] Optimize sample rates if needed
- [ ] Review and update alert rules
- [ ] Rotate auth tokens (security best practice)
- [ ] Archive resolved issues

### Quarterly Tasks

- [ ] Review Sentry plan and usage
- [ ] Upgrade if hitting quota limits
- [ ] Review data retention policies
- [ ] Audit team access permissions
- [ ] Update documentation

---

## Completion Checklist

### Minimum Viable Setup (Required)

- [ ] Sentry project created
- [ ] Packages installed
- [ ] DSN configured in .env.local and Vercel
- [ ] Sentry initialized in index.tsx
- [ ] Error boundary added to App.tsx
- [ ] User context tracked in AuthContext
- [ ] Tested locally and in production
- [ ] At least one error visible in Sentry dashboard

### Recommended Setup

- [ ] All minimum viable setup items ✓
- [ ] MCP configured for Claude Code
- [ ] Data privacy rules configured
- [ ] Performance monitoring enabled
- [ ] Alerts configured
- [ ] Team members have access
- [ ] Documentation shared with team

### Advanced Setup

- [ ] All recommended setup items ✓
- [ ] Release tracking configured
- [ ] Source maps uploaded
- [ ] Custom error grouping (fingerprinting)
- [ ] Integration with Slack/PagerDuty
- [ ] Custom dashboards created
- [ ] Performance budgets set
- [ ] Automated testing of error tracking

---

## Verification Commands

Run these to verify your setup:

```bash
# Check packages installed
npm list @sentry/react @sentry/tracing

# Check environment variables
grep SENTRY .env.local

# Check Sentry is initialized
npm start
# Then in browser console: window.__SENTRY__.hub

# Test error tracking
# Browser console: throw new Error('Test');

# Check MCP server
# Claude Code: "Show me recent Sentry errors"
```

---

## Troubleshooting Checklist

If errors aren't appearing in Sentry:

- [ ] DSN is correct (no typos)
- [ ] Environment variable starts with `REACT_APP_`
- [ ] Dev server restarted after adding .env.local
- [ ] Browser cache cleared
- [ ] Network request to sentry.io visible in DevTools
- [ ] No ad blocker blocking Sentry
- [ ] Sentry initialized before app renders
- [ ] Error actually thrown (check browser console)

---

## Resources

- **Full Guide**: `/workspaces/armora/docs/SENTRY_SETUP.md`
- **Quick Start**: `/workspaces/armora/docs/SENTRY_QUICK_START.md`
- **Sentry Docs**: https://docs.sentry.io/platforms/javascript/guides/react/
- **MCP Server**: https://github.com/getsentry/sentry-mcp-server
- **Support**: https://discord.gg/sentry

---

**Last Updated**: October 8, 2025
**Next Review**: When implementing Sentry or quarterly review


---

Last updated: 2025-10-09T08:08:25.960Z
