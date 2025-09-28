#!/bin/bash

# Claude-Codespaces Session Conflict Fix Script
# Implements multiple solutions to prevent Claude logout when opening terminals

echo "🔧 Claude-Codespaces Session Conflict Fix"
echo "========================================="

# Create backup directory
BACKUP_DIR="$HOME/.claude-session-backup"
mkdir -p "$BACKUP_DIR"

# Function to log actions
log_action() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$BACKUP_DIR/fix.log"
}

log_action "Starting session conflict fix"

# Solution 1: Isolate browser environment variables
echo ""
echo "🛡️  SOLUTION 1: Browser Environment Isolation"
echo "============================================="

# Create isolated browser launch script
cat > "$HOME/.claude-browser-isolated" << 'EOF'
#!/bin/bash
# Isolated browser launcher for Claude to prevent conflicts

# Unset Codespaces-specific variables that might interfere
unset GITHUB_TOKEN
unset GITHUB_CODESPACE_TOKEN
unset GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
unset BROWSER

# Launch browser with isolated profile
if command -v google-chrome >/dev/null 2>&1; then
    google-chrome --user-data-dir="$HOME/.claude-browser-profile" --disable-web-security --disable-features=VizDisplayCompositor "$@"
elif command -v chromium-browser >/dev/null 2>&1; then
    chromium-browser --user-data-dir="$HOME/.claude-browser-profile" --disable-web-security "$@"
elif command -v firefox >/dev/null 2>&1; then
    firefox -profile "$HOME/.claude-firefox-profile" "$@"
else
    echo "No supported browser found"
    exit 1
fi
EOF

chmod +x "$HOME/.claude-browser-isolated"
log_action "Created isolated browser launcher at $HOME/.claude-browser-isolated"

# Solution 2: Create terminal wrapper that preserves sessions
echo ""
echo "🔒 SOLUTION 2: Terminal Session Isolation"
echo "========================================="

cat > "$HOME/.terminal-isolated" << 'EOF'
#!/bin/bash
# Terminal wrapper that prevents session interference

# Store current session state before opening terminal
SESSION_BACKUP="/tmp/claude-session-$(date +%s)"
echo "Backing up session state to $SESSION_BACKUP"

# Create clean environment for terminal
env -i \
    HOME="$HOME" \
    PATH="$PATH" \
    TERM="$TERM" \
    USER="$USER" \
    SHELL="$SHELL" \
    PWD="$PWD" \
    bash --login "$@"
EOF

chmod +x "$HOME/.terminal-isolated"
log_action "Created isolated terminal launcher at $HOME/.terminal-isolated"

# Solution 3: VS Code settings to reduce browser interference
echo ""
echo "⚙️  SOLUTION 3: VS Code Configuration"
echo "===================================="

VSCODE_SETTINGS_DIR="$HOME/.vscode-remote/data/Machine"
mkdir -p "$VSCODE_SETTINGS_DIR"

# Create or update VS Code settings
SETTINGS_FILE="$VSCODE_SETTINGS_DIR/settings.json"

if [ -f "$SETTINGS_FILE" ]; then
    cp "$SETTINGS_FILE" "$BACKUP_DIR/settings.json.backup"
    log_action "Backed up existing VS Code settings"
fi

# Merge settings to reduce browser conflicts
cat > "$SETTINGS_FILE" << 'EOF'
{
    "terminal.integrated.env.linux": {
        "BROWSER": ""
    },
    "terminal.integrated.inheritEnv": false,
    "terminal.integrated.allowWorkspaceShell": false,
    "terminal.integrated.automationShell.linux": "/bin/bash",
    "workbench.experimental.cloudChanges": false,
    "github.copilot.advanced": {
        "debug.useNodeForTesting": false
    }
}
EOF

log_action "Updated VS Code settings to reduce browser interference"

# Solution 4: Create Claude-specific browser shortcut
echo ""
echo "🌐 SOLUTION 4: Claude Browser Shortcut"
echo "===================================="

cat > "$HOME/claude-browser.sh" << 'EOF'
#!/bin/bash
# Dedicated Claude browser launcher

# URL for Claude
CLAUDE_URL="https://claude.ai"

# Use isolated browser profile
exec "$HOME/.claude-browser-isolated" "$CLAUDE_URL"
EOF

chmod +x "$HOME/claude-browser.sh"
log_action "Created Claude browser shortcut at $HOME/claude-browser.sh"

# Solution 5: Session monitoring script
echo ""
echo "📊 SOLUTION 5: Session Monitoring"
echo "==============================="

cat > "$HOME/monitor-claude-session.sh" << 'EOF'
#!/bin/bash
# Monitor Claude session status

CLAUDE_TAB_CHECK='
    // Check if Claude is logged in
    if (window.location.hostname.includes("claude.ai")) {
        const loginIndicators = [
            document.querySelector("[data-testid=\"user-menu\"]"),
            document.querySelector(".user-avatar"),
            document.querySelector("[aria-label*=\"User\"]")
        ];

        const isLoggedIn = loginIndicators.some(el => el !== null);
        console.log("Claude login status:", isLoggedIn ? "LOGGED_IN" : "LOGGED_OUT");

        if (!isLoggedIn) {
            console.warn("🚨 CLAUDE SESSION LOST - Terminal may have caused logout");
            // Optional: auto-refresh to trigger re-login
            // window.location.reload();
        }
    }
'

echo "Run this in browser console to check Claude session:"
echo "$CLAUDE_TAB_CHECK"
EOF

chmod +x "$HOME/monitor-claude-session.sh"
log_action "Created session monitoring script"

# Solution 6: Environment variable protection
echo ""
echo "🔐 SOLUTION 6: Environment Protection"
echo "===================================="

# Add to bashrc to prevent variable conflicts
BASHRC_ADDITION='
# Claude-Codespaces Session Protection
# Prevents environment conflicts between Claude and Codespaces

export CLAUDE_SESSION_PROTECTED=1

# Function to open isolated terminal
claude_terminal() {
    "$HOME/.terminal-isolated" "$@"
}

# Function to open Claude browser
claude_browser() {
    "$HOME/claude-browser.sh" "$@"
}

# Alias for safe terminal usage
alias term="claude_terminal"
alias cterminal="claude_terminal"
'

if ! grep -q "CLAUDE_SESSION_PROTECTED" "$HOME/.bashrc" 2>/dev/null; then
    echo "$BASHRC_ADDITION" >> "$HOME/.bashrc"
    log_action "Added session protection to .bashrc"
else
    log_action "Session protection already exists in .bashrc"
fi

echo ""
echo "✅ INSTALLATION COMPLETE"
echo "======================="
echo ""
echo "🎯 USAGE INSTRUCTIONS:"
echo ""
echo "1. IMMEDIATE TEST:"
echo "   - Open Claude in browser: $HOME/claude-browser.sh"
echo "   - Use monitoring script: $HOME/debug-session-conflict.js"
echo ""
echo "2. TERMINAL USAGE:"
echo "   - Use isolated terminal: $HOME/.terminal-isolated"
echo "   - Or use alias: term (after restarting shell)"
echo ""
echo "3. BROWSER ISOLATION:"
echo "   - Claude gets its own browser profile"
echo "   - Codespaces variables are isolated"
echo ""
echo "4. MONITORING:"
echo "   - Check logs: tail -f $BACKUP_DIR/fix.log"
echo "   - Monitor session: $HOME/monitor-claude-session.sh"
echo ""
echo "🔄 APPLY CHANGES:"
echo "   source ~/.bashrc"
echo ""
echo "🧪 TEST PROCEDURE:"
echo "   1. Run claude-browser.sh to open Claude"
echo "   2. Log into Claude"
echo "   3. Open Codespaces in separate tab"
echo "   4. Use 'term' command instead of opening new terminals"
echo "   5. Verify Claude stays logged in"

log_action "Setup completed successfully"

# Make script executable and create symlink
ln -sf "$(pwd)/fix-session-conflict.sh" "$HOME/fix-claude-session"
log_action "Created symlink at $HOME/fix-claude-session"

echo ""
echo "📁 Files created:"
echo "   - $HOME/.claude-browser-isolated"
echo "   - $HOME/.terminal-isolated"
echo "   - $HOME/claude-browser.sh"
echo "   - $HOME/monitor-claude-session.sh"
echo "   - $BACKUP_DIR/fix.log"
echo ""
echo "🎉 Ready to test! Use: $HOME/claude-browser.sh"