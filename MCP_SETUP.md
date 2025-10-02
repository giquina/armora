# MCP Server Setup Documentation for Armora

This document describes the complete Model Context Protocol (MCP) server setup for the Armora project, including all CLIs and MCP configurations.

## Overview

The Armora project uses multiple MCP servers to integrate Claude Desktop with:
- **Supabase** - Database and authentication
- **GitHub** - Version control and repository management
- **Firebase** - Cloud messaging and real-time features
- **Vercel** - Deployment and hosting
- **Git** - Local repository operations
- **Filesystem** - Project file access
- **Fetch** - HTTP requests and API calls

## Installation Status

### ✅ Installed CLIs

All required CLIs are installed:

| CLI | Version | Status | Authentication |
|-----|---------|--------|----------------|
| GitHub CLI | 2.75.0 | ✅ Installed | ✅ Authenticated |
| Supabase CLI | 2.47.2 | ✅ Installed | ✅ Authenticated |
| Vercel CLI | 48.1.6 | ✅ Installed | ⚠️ Not authenticated |
| Firebase CLI | 14.17.0 | ✅ Installed | ⚠️ Not authenticated |

### 📦 MCP Configuration

MCP configuration file created at: `~/.config/Claude/claude_desktop_config.json`

**Configured MCP Servers:**
1. Supabase MCP
2. GitHub MCP
3. Firebase MCP
4. Git MCP (local repository)
5. Filesystem MCP
6. Fetch MCP

## CLI Authentication

### GitHub CLI ✅
Already authenticated with account: giquina

```bash
gh auth status
```

### Supabase CLI ✅
Already authenticated and linked to project: `jmzvrqwjmlnvxojculee`

```bash
supabase projects list
```

### Vercel CLI ⚠️
**Needs authentication:**

```bash
vercel login
```

This will open a browser window for authentication. Once authenticated, link the project:

```bash
vercel link
# Select:
# - Scope: Your account
# - Link to existing project: Yes
# - Project name: armora (or your Vercel project name)
```

### Firebase CLI ⚠️
**Needs authentication:**

```bash
firebase login
```

After authentication, set the active project:

```bash
firebase use armora-protection
```

Optionally, initialize Firebase features in the project:

```bash
firebase init
# Select features as needed:
# - Hosting (for TWA/PWA deployment)
# - Cloud Messaging
# - Cloud Functions (if needed)
```

## MCP Server Configuration Details

### 1. Supabase MCP Server

**Package:** `@supabase/mcp-server-supabase@latest`

**Capabilities:**
- Query database tables
- Execute SQL queries
- Manage storage buckets
- View project configuration
- Real-time subscriptions

**Configuration:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--project-ref", "jmzvrqwjmlnvxojculee",
    "--access-token", "[ANON_KEY]"
  ],
  "env": {
    "SUPABASE_URL": "https://jmzvrqwjmlnvxojculee.supabase.co",
    "SUPABASE_ANON_KEY": "[ANON_KEY]"
  }
}
```

### 2. GitHub MCP Server

**Package:** `@modelcontextprotocol/server-github@latest`

**Capabilities:**
- Repository operations (read, search, create files)
- Issue and PR management
- Code search across repositories
- Workflow and Actions management
- Branch and commit operations

**Configuration:**
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github@latest"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "[YOUR_TOKEN]"
  }
}
```

**Note:** Replace `[YOUR_TOKEN]` with your GitHub personal access token from: https://github.com/settings/tokens

### 3. Firebase MCP Server

**Package:** `firebase-tools@latest` (experimental MCP support)

**Capabilities:**
- Firestore database operations
- Authentication management
- Cloud Storage operations
- Cloud Messaging (FCM) for push notifications
- Real-time database operations

**Configuration:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "firebase-tools@latest",
    "experimental:mcp"
  ],
  "env": {
    "FIREBASE_PROJECT_ID": "armora-protection",
    "FIREBASE_API_KEY": "AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU"
  }
}
```

### 4. Git MCP Server

**Package:** `@modelcontextprotocol/server-git@latest`

**Capabilities:**
- Local repository operations
- View commit history
- Branch management
- Diff and status operations
- Git log and blame

**Configuration:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-git@latest",
    "/workspaces/armora"
  ]
}
```

### 5. Filesystem MCP Server

**Package:** `@modelcontextprotocol/server-filesystem@latest`

**Capabilities:**
- Read and write project files
- Directory navigation
- File search
- File metadata operations

**Configuration:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem@latest",
    "/workspaces/armora"
  ]
}
```

### 6. Fetch MCP Server

**Package:** `@modelcontextprotocol/server-fetch@latest`

**Capabilities:**
- HTTP GET/POST requests
- API integration
- Web content fetching
- REST API operations

**Configuration:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-fetch@latest"
  ]
}
```

## Quick Setup Script

A setup script has been created at `/workspaces/armora/setup-mcp.sh` that:
- Checks installation status of all CLIs
- Verifies authentication status
- Lists configured MCP servers
- Provides next steps

Run it with:
```bash
./setup-mcp.sh
```

## Environment Variables

All sensitive credentials are stored in `.env.local` (not committed to Git):

```bash
# Supabase
REACT_APP_SUPABASE_URL=https://jmzvrqwjmlnvxojculee.supabase.co
REACT_APP_SUPABASE_ANON_KEY=[ANON_KEY]

# Firebase
REACT_APP_FIREBASE_API_KEY=AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU
REACT_APP_FIREBASE_PROJECT_ID=armora-protection
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1010601153585

# GitHub (for MCP)
GITHUB_PERSONAL_ACCESS_TOKEN=[YOUR_TOKEN]
```

## Testing MCP Servers

After setting up and restarting Claude Desktop, you can test MCP servers by:

1. **Supabase**: Ask Claude to "list all tables in my Supabase database"
2. **GitHub**: Ask Claude to "show recent commits in the main branch"
3. **Firebase**: Ask Claude to "check Firebase Cloud Messaging configuration"
4. **Git**: Ask Claude to "show git status of the project"
5. **Filesystem**: Ask Claude to "list files in the src/components directory"
6. **Fetch**: Ask Claude to "fetch data from [URL]"

## Troubleshooting

### MCP Servers Not Appearing in Claude Desktop

1. Ensure Claude Desktop is fully closed (not just minimized)
2. Verify config file exists: `~/.config/Claude/claude_desktop_config.json`
3. Check JSON syntax is valid
4. Restart Claude Desktop
5. Check Claude Desktop logs (Help → Show Logs)

### Authentication Issues

**Vercel:**
```bash
vercel logout
vercel login
vercel link
```

**Firebase:**
```bash
firebase logout
firebase login
firebase use armora-protection
```

**Supabase:**
```bash
supabase logout
supabase login
supabase link --project-ref jmzvrqwjmlnvxojculee
```

### NPX Permission Issues

If npx commands fail, try:
```bash
npm cache clean --force
npm install -g npx
```

## Security Considerations

1. **Never commit** the Claude Desktop config file to Git
2. **Use read-only mode** for Supabase MCP in production: add `--read-only` flag
3. **Rotate tokens regularly** for GitHub and other services
4. **Use environment variables** for sensitive data
5. **Limit GitHub token scopes** to only required permissions

## Additional Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp)
- [Firebase MCP Server Blog](https://firebase.blog/posts/2025/05/firebase-mcp-server/)
- [GitHub MCP Server npm](https://www.npmjs.com/package/@modelcontextprotocol/server-github)
- [Vercel MCP Documentation](https://vercel.com/docs/mcp)

## Next Steps

1. ✅ Install all CLIs
2. ✅ Create MCP configuration file
3. ⚠️ Authenticate Vercel CLI: `vercel login`
4. ⚠️ Authenticate Firebase CLI: `firebase login`
5. ⚠️ Link Vercel project: `vercel link`
6. ⚠️ Set Firebase project: `firebase use armora-protection`
7. 🔄 Restart Claude Desktop to activate MCP servers
8. ✅ Test MCP server connections

---

**Last Updated:** 2025-10-02
**Armora Project:** Premium Close Protection Services Platform
