# 🎯 PORT 3000 ONLY - Armora Development Focus Guide

## ⚡ QUICK REFERENCE
**YOUR DEVELOPMENT URL:** `https://organic-rotary-phone-[...]-3000.app.github.dev`

## 🚀 STARTUP CHECKLIST ✅

### 1. Verify Server is Running:
```bash
lsof -i :3000    # Should show node process
```

### 2. Start Server (if needed):
```bash
npm start        # Always starts on port 3000
```

### 3. Check for "Compiled successfully!" in terminal

## 🔄 ENSURE LATEST UPDATES

### ✅ AUTO-REFRESH (Built-in):
- Save any file = instant browser update
- CSS changes = live reload
- React components = hot reload

### 🔄 MANUAL REFRESH:
- **Soft**: `Ctrl+R` (Cmd+R Mac)
- **Hard**: `Ctrl+Shift+R` (Cmd+Shift+R Mac)
- **Cache Clear**: F12 → Network → Disable cache

## 🚫 IGNORE THESE COMPLETELY
- **Port 3001** - Phantom (not running)
- **Port 5173** - Phantom (not running)
- **Port 8080** - Phantom (not running)

## 🎯 SINGLE PORT RULE
**If URL doesn't contain "-3000" → CLOSE THE TAB**

## ⚡ QUICK COMMANDS

```bash
# Check if running
ps aux | grep react-scripts

# Force restart if stuck
pkill -f "react-scripts" && npm start

# View server status
npm run hooks:status
```

## 🔴 TROUBLESHOOTING

### Changes Not Appearing?
1. Check terminal for errors
2. Ensure file is saved (Ctrl+S)
3. Hard refresh browser (Ctrl+Shift+R)
4. Verify you're on port 3000

### Server Not Responding?
```bash
# Check if process is running
lsof -i :3000

# If empty, start server
npm start
```

## ✅ SUCCESS INDICATORS
- URL ends with `-3000.app.github.dev`
- Terminal shows "Compiled successfully!"
- Changes appear instantly when saving
- No red errors in browser console

## 📌 BOOKMARK THIS
Save your port 3000 URL permanently in browser bookmarks.

---

**REMEMBER: ONE PORT (3000), ONE SERVER, ONE URL! 🎯**

Last Updated: 2025-09-24