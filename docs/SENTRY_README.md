# Sentry Documentation Index

Complete documentation for setting up and using Sentry error tracking in the Armora project.

---

## Documentation Files

### 1. [SENTRY_QUICK_START.md](SENTRY_QUICK_START.md)
**Start here if you want to get up and running in 5 minutes**

- Condensed setup guide
- Minimal configuration
- Quick testing instructions
- Perfect for: Getting Sentry working ASAP

**Time required**: 5 minutes

---

### 2. [SENTRY_SETUP.md](SENTRY_SETUP.md)
**Complete reference guide with all details**

- Comprehensive step-by-step instructions
- Detailed explanations and screenshots references
- Vercel deployment configuration
- MCP setup for Claude Code integration
- Best practices and privacy considerations
- Troubleshooting guide
- Performance optimization

**Time required**: 15-20 minutes (for full setup)

**Sections**:
1. Prerequisites
2. Getting Your Sentry DSN
3. Installing Sentry Packages
4. Vercel Environment Variables
5. Local Development Setup
6. Testing Error Tracking
7. Using Sentry MCP with Claude Code
8. Best Practices
9. Troubleshooting

**Size**: 1,099 lines, 27KB

---

### 3. [SENTRY_IMPLEMENTATION_CHECKLIST.md](SENTRY_IMPLEMENTATION_CHECKLIST.md)
**Interactive checklist for complete implementation**

- Step-by-step checklist format
- Checkbox items for tracking progress
- Organized into 9 phases
- Weekly/monthly maintenance tasks
- Verification commands
- Completion criteria

**Phases**:
1. Account & Project Setup
2. Package Installation
3. Environment Configuration
4. Code Implementation
5. Testing
6. MCP Integration
7. Configuration & Optimization
8. Documentation & Team Onboarding
9. Monitoring & Maintenance

**Size**: 383 lines, 11KB

---

## Which Guide Should I Use?

### Scenario 1: First-Time Setup (Beginner)
**Recommended path**:
1. Start with **SENTRY_QUICK_START.md** (5 min)
2. Get it working quickly
3. Later, read **SENTRY_SETUP.md** for best practices
4. Use **SENTRY_IMPLEMENTATION_CHECKLIST.md** to ensure nothing missed

### Scenario 2: Production Deployment (Experienced)
**Recommended path**:
1. Open **SENTRY_IMPLEMENTATION_CHECKLIST.md**
2. Work through all checklist items
3. Reference **SENTRY_SETUP.md** for detailed instructions
4. Skip **SENTRY_QUICK_START.md** (too basic for production)

### Scenario 3: Troubleshooting Issues
**Recommended path**:
1. Go to **SENTRY_SETUP.md** → Troubleshooting section
2. Check "Errors Not Appearing in Sentry"
3. Run verification commands
4. Check **SENTRY_IMPLEMENTATION_CHECKLIST.md** → Troubleshooting Checklist

### Scenario 4: Setting Up MCP for Claude Code
**Recommended path**:
1. **SENTRY_SETUP.md** → Section 7: "Using Sentry MCP with Claude Code"
2. Follow detailed MCP configuration steps
3. Test MCP queries

### Scenario 5: Team Onboarding
**Recommended path**:
1. Share **SENTRY_QUICK_START.md** for immediate setup
2. Share **SENTRY_SETUP.md** as reference documentation
3. Use **SENTRY_IMPLEMENTATION_CHECKLIST.md** for team training

---

## Quick Links

### Sentry Dashboard
- **Issues**: https://sentry.io/organizations/[your-org]/issues/
- **Performance**: https://sentry.io/organizations/[your-org]/performance/
- **Settings**: https://sentry.io/settings/[your-org]/projects/armora-principal/

### External Resources
- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry MCP Server GitHub](https://github.com/getsentry/sentry-mcp-server)
- [Model Context Protocol Docs](https://modelcontextprotocol.io)

### Related Armora Documentation
- **MCP Setup**: `/workspaces/armora/MCP_SETUP.md`
- **Environment Variables**: `/workspaces/armora/.env.example`
- **Implementation Summary**: `/workspaces/armora/IMPLEMENTATION_SUMMARY.md`

---

## File Locations

All Sentry-related files in the Armora project:

```
/workspaces/armora/
├── docs/
│   ├── SENTRY_README.md              ← You are here
│   ├── SENTRY_QUICK_START.md         ← 5-minute setup
│   ├── SENTRY_SETUP.md               ← Complete guide
│   └── SENTRY_IMPLEMENTATION_CHECKLIST.md  ← Checklist
│
├── src/
│   ├── lib/
│   │   └── sentry.ts                 ← Sentry initialization (to be created)
│   ├── index.tsx                     ← Initialize Sentry here
│   ├── App.tsx                       ← Add ErrorBoundary here
│   └── contexts/
│       └── AuthContext.tsx           ← Track user context here
│
├── .env.local                        ← Local Sentry DSN (gitignored)
├── .env.example                      ← Template with Sentry vars
└── package.json                      ← Contains @sentry/mcp-server@0.18.0
```

---

## Key Concepts

### What is Sentry?
- Error tracking and monitoring platform
- Captures exceptions, errors, and performance issues
- Provides detailed stack traces and context
- Helps debug production issues

### What is the DSN?
- DSN = Data Source Name
- Unique identifier connecting your app to Sentry
- Format: `https://[key]@o[org-id].ingest.sentry.io/[project-id]`
- Safe to expose in frontend (public key)

### What is MCP?
- MCP = Model Context Protocol
- Allows Claude Code to query Sentry data
- Enables AI-assisted error analysis
- Requires auth token (keep private)

### What are Sample Rates?
- Controls % of events sent to Sentry
- `1.0` = 100% (development)
- `0.1` = 10% (production, for high traffic)
- Helps manage quota and costs

---

## Environment Variables Reference

### Required
```bash
REACT_APP_SENTRY_DSN=https://...@o123.ingest.sentry.io/456
```

### Recommended
```bash
REACT_APP_SENTRY_ENVIRONMENT=development
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=1.0
```

### Optional
```bash
REACT_APP_SENTRY_RELEASE=armora-principal@1.0.0
REACT_APP_SENTRY_DEBUG=true
```

### MCP Only (not in frontend)
```bash
SENTRY_AUTH_TOKEN=sntrys_YOUR_TOKEN
SENTRY_ORG_SLUG=your-organization
SENTRY_PROJECT_SLUG=armora-principal
```

---

## Common Commands

### Installation
```bash
npm install --save @sentry/react @sentry/tracing
```

### Testing
```bash
# In browser console
throw new Error('Test Sentry Error');

# Check Sentry is loaded
console.log(window.__SENTRY__);
```

### Programmatic Usage
```typescript
import * as Sentry from '@sentry/react';

// Capture exception
Sentry.captureException(error);

// Set user
Sentry.setUser({ id: '123', email: 'user@example.com' });

// Add breadcrumb
Sentry.addBreadcrumb({ message: 'Button clicked', category: 'ui' });

// Set context
Sentry.setContext('assignment', { id: 'abc123' });
```

---

## Support

### Internal
- **Documentation**: This folder (`/workspaces/armora/docs/`)
- **Team Lead**: Check team documentation for contact

### External
- **Sentry Support**: https://sentry.io/support/
- **Discord**: https://discord.gg/sentry
- **GitHub Issues**: https://github.com/getsentry/sentry-javascript/issues
- **Forum**: https://forum.sentry.io/

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-08 | 1.0.0 | Initial documentation created |

---

## Next Steps

1. **If starting fresh**: Go to [SENTRY_QUICK_START.md](SENTRY_QUICK_START.md)
2. **If setting up production**: Go to [SENTRY_IMPLEMENTATION_CHECKLIST.md](SENTRY_IMPLEMENTATION_CHECKLIST.md)
3. **If troubleshooting**: Go to [SENTRY_SETUP.md](SENTRY_SETUP.md#troubleshooting)
4. **If setting up MCP**: Go to [SENTRY_SETUP.md](SENTRY_SETUP.md#using-sentry-mcp-with-claude-code)

---

**Last Updated**: October 8, 2025
**Maintained by**: Armora Development Team
**Armora Project**: Premium Close Protection Services Platform


---

Last updated: 2025-10-09T08:08:25.961Z
