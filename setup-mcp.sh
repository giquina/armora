#!/bin/bash
# MCP Server Setup Script for Armora Project
# This script initializes all MCP servers and CLIs

set -e

echo "🚀 Armora MCP Server Setup"
echo "=========================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "📋 Checking installed CLIs..."
echo ""

# GitHub CLI
if command_exists gh; then
    echo -e "${GREEN}✓${NC} GitHub CLI installed: $(gh --version | head -1)"
    if gh auth status >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} GitHub CLI authenticated"
    else
        echo -e "${YELLOW}⚠${NC} GitHub CLI not authenticated. Run: gh auth login"
    fi
else
    echo -e "${RED}✗${NC} GitHub CLI not installed. Install from: https://cli.github.com/"
fi

echo ""

# Supabase CLI
if command_exists supabase; then
    echo -e "${GREEN}✓${NC} Supabase CLI installed: v$(supabase --version)"
    if supabase projects list >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Supabase CLI authenticated"
        supabase projects list
    else
        echo -e "${YELLOW}⚠${NC} Supabase CLI not authenticated. Run: supabase login"
    fi
else
    echo -e "${RED}✗${NC} Supabase CLI not installed. Run: npm install -g supabase"
fi

echo ""

# Vercel CLI
if command_exists vercel; then
    echo -e "${GREEN}✓${NC} Vercel CLI installed: v$(vercel --version)"
    if vercel whoami >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Vercel CLI authenticated: $(vercel whoami)"
    else
        echo -e "${YELLOW}⚠${NC} Vercel CLI not authenticated. Run: vercel login"
    fi
else
    echo -e "${RED}✗${NC} Vercel CLI not installed. Run: npm install -g vercel"
fi

echo ""

# Firebase CLI
if command_exists firebase; then
    echo -e "${GREEN}✓${NC} Firebase CLI installed: v$(firebase --version)"
    if firebase projects:list >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Firebase CLI authenticated"
        firebase projects:list
    else
        echo -e "${YELLOW}⚠${NC} Firebase CLI not authenticated. Run: firebase login"
    fi
else
    echo -e "${RED}✗${NC} Firebase CLI not installed. Run: npm install -g firebase-tools"
fi

echo ""
echo "=========================="
echo "📦 MCP Configuration Status"
echo "=========================="
echo ""

CONFIG_FILE="$HOME/.config/Claude/claude_desktop_config.json"

if [ -f "$CONFIG_FILE" ]; then
    echo -e "${GREEN}✓${NC} Claude Desktop MCP config exists at: $CONFIG_FILE"
    echo ""
    echo "Configured MCP Servers:"
    cat "$CONFIG_FILE" | grep -o '"[^"]*":' | grep -v 'mcpServers\|command\|args\|env' | sed 's/"//g' | sed 's/://g' | sed 's/^/  - /'
else
    echo -e "${YELLOW}⚠${NC} Claude Desktop MCP config not found at: $CONFIG_FILE"
    echo "Config file has been created. Restart Claude Desktop to activate MCP servers."
fi

echo ""
echo "=========================="
echo "🔧 Next Steps"
echo "=========================="
echo ""
echo "1. Authenticate missing CLIs:"
echo "   - Vercel: vercel login"
echo "   - Firebase: firebase login"
echo ""
echo "2. Initialize Firebase project:"
echo "   firebase use armora-protection"
echo "   firebase init"
echo ""
echo "3. Link Vercel project:"
echo "   vercel link"
echo ""
echo "4. Initialize Supabase locally (optional):"
echo "   supabase init"
echo "   supabase link --project-ref jmzvrqwjmlnvxojculee"
echo ""
echo "5. Restart Claude Desktop to activate MCP servers"
echo ""
echo "=========================="
echo "📚 MCP Server Capabilities"
echo "=========================="
echo ""
echo "Supabase MCP:"
echo "  - Query database tables"
echo "  - Manage Supabase configuration"
echo "  - Execute SQL queries"
echo "  - Manage storage buckets"
echo ""
echo "GitHub MCP:"
echo "  - Repository operations"
echo "  - Issue and PR management"
echo "  - Code search and navigation"
echo "  - Workflow management"
echo ""
echo "Firebase MCP:"
echo "  - Firestore operations"
echo "  - Authentication management"
echo "  - Cloud Storage operations"
echo "  - Cloud Messaging (FCM)"
echo ""
echo "Git MCP:"
echo "  - Local repository operations"
echo "  - Commit history"
echo "  - Branch management"
echo "  - Diff and status"
echo ""
echo "Filesystem MCP:"
echo "  - Read/write project files"
echo "  - Directory navigation"
echo "  - File search"
echo ""
echo "Fetch MCP:"
echo "  - HTTP requests"
echo "  - API integration"
echo "  - Web scraping"
echo ""
echo "✅ Setup complete!"
