# MCP Quick Reference - Armora Project

## ✅ Setup Complete

All MCP servers have been installed and configured for the Armora project.

## 📋 Installation Summary

| Component | Status | Version |
|-----------|--------|---------|
| GitHub CLI | ✅ Installed & Authenticated | 2.75.0 |
| Supabase CLI | ✅ Installed & Authenticated | 2.47.2 |
| Vercel CLI | ✅ Installed | 48.1.6 |
| Firebase CLI | ✅ Installed | 14.17.0 |
| Claude MCP Config | ✅ Created | - |

## 🚀 Quick Commands

### Check Setup Status
```bash
./setup-mcp.sh
```

### Authenticate CLIs
```bash
# Vercel (required)
vercel login
vercel link

# Firebase (required)
firebase login
firebase use armora-protection
```

### Test Individual CLIs
```bash
gh auth status              # GitHub
supabase projects list      # Supabase
vercel whoami              # Vercel
firebase projects:list     # Firebase
```

## 🔧 MCP Servers Configured

1. **Supabase** - Database operations
2. **GitHub** - Repository management
3. **Firebase** - Cloud services
4. **Git** - Local repository
5. **Filesystem** - File operations
6. **Fetch** - HTTP requests

## 📍 Configuration Location

```
~/.config/Claude/claude_desktop_config.json
```

## ⚠️ Remaining Tasks

1. Authenticate Vercel CLI: `vercel login && vercel link`
2. Authenticate Firebase CLI: `firebase login && firebase use armora-protection`
3. Restart Claude Desktop to activate MCP servers

## 📚 Documentation

- Full setup guide: `MCP_SETUP.md`
- Setup script: `setup-mcp.sh`

## 🔐 Security Notes

- All credentials stored in `.env.local` (not in Git)
- GitHub token masked in config
- Supabase using anon key (public)
- Never commit `claude_desktop_config.json` to Git

## 🎯 Testing MCP After Restart

Ask Claude Desktop:
- "List my Supabase database tables"
- "Show recent Git commits"
- "Check Firebase project configuration"
- "List files in src/components"

---
**Setup Date:** 2025-10-02
**Project:** Armora Protection Services
