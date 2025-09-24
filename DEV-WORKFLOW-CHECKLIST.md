# ✅ ARMORA DEVELOPMENT WORKFLOW CHECKLIST

## 🚀 DAILY STARTUP (Every Codespace Session)

### [ ] 1. Open Terminal
```bash
# Check if server is running
lsof -i :3000
```

### [ ] 2. Start Development Server (if not running)
```bash
npm start
```

### [ ] 3. Wait for "Compiled successfully!" message

### [ ] 4. Open Browser Tab
- Click the port 3000 URL when it appears in terminal
- URL should contain `-3000.app.github.dev`
- **Bookmark this URL immediately**

### [ ] 5. Verify Hot Reload is Working
- Make small change to any file
- Save with Ctrl+S
- Browser should update automatically

## 🎯 FOCUSED DEVELOPMENT SESSION

### [ ] 1. Close All Wrong Tabs
- Only keep tabs with `-3000` in URL
- Close any 3001, 5173, 8080 tabs

### [ ] 2. Pin Your Main Tab
- Right-click port 3000 tab
- Select "Pin Tab"

### [ ] 3. Split Screen Setup
- Code editor on left 60%
- Browser on right 40%

### [ ] 4. Terminal Organization
- Terminal 1: `npm start` (keep running)
- Terminal 2: Git commands
- Terminal 3: Testing commands

## 🔄 DURING DEVELOPMENT

### [ ] For Every Change:
1. Make your code changes
2. Save file (Ctrl+S)
3. Watch terminal for "Compiled successfully!"
4. Browser auto-refreshes with changes

### [ ] If Changes Don't Appear:
1. [ ] Check terminal for red errors
2. [ ] Ensure file was saved
3. [ ] Hard refresh: Ctrl+Shift+R
4. [ ] Verify you're on port 3000 tab

## ✅ BEFORE TESTING FEATURES

### [ ] 1. Check Server Status
```bash
ps aux | grep react-scripts
```

### [ ] 2. Verify Port 3000 URL
- Must contain `-3000.app.github.dev`
- Must show "Armora" in title

### [ ] 3. Open Browser DevTools
- F12 to open
- Check Console for any red errors
- Network tab to verify requests

### [ ] 4. Test Booking Flow
- Navigate through the app
- Check all interactive elements
- Verify dark theme is applied

## 🚫 NEVER DO THIS

### [ ] ❌ Don't use ports 3001, 5173, or 8080
### [ ] ❌ Don't close the `npm start` terminal
### [ ] ❌ Don't work without auto-save enabled
### [ ] ❌ Don't ignore "Compilation failed" errors

## 📝 END OF SESSION

### [ ] 1. Commit Your Changes
```bash
git add .
git status
git commit -m "Your commit message"
```

### [ ] 2. Optional: Stop Server
```bash
# Ctrl+C in the npm start terminal
# (Server will auto-restart next session)
```

### [ ] 3. Save Important URLs
- Bookmark port 3000 URL
- Note any specific test URLs

---

## 🎯 QUICK REFERENCE

**Good URL Pattern:** `https://[name]-3000.app.github.dev`
**Start Command:** `npm start`
**Test Command:** `npm test`
**Build Command:** `npm run build`

**One Rule: If it doesn't say "3000" in the URL, close it!**