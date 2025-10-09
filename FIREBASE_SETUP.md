# Firebase Cloud Messaging Setup Guide

## Service Worker Created
✅ **File**: `/workspaces/armora/public/firebase-messaging-sw.js`
✅ **Size**: 9.4KB (289 lines)
✅ **Status**: Production-ready with one missing credential

## Missing Credential: Firebase App ID

The service worker is complete except for one value that must be retrieved from the Firebase Console:

### To Get Your Firebase App ID:

1. Go to [Firebase Console](https://console.firebase.google.com/project/armora-protection)
2. Click the gear icon (⚙️) → **Project Settings**
3. Scroll to **Your apps** section
4. Find your web app configuration
5. Copy the `appId` value (format: `1:1010601153585:web:xxxxxxxxxxxxxx`)

### Update the Service Worker:

Open `/workspaces/armora/public/firebase-messaging-sw.js` and replace line 34:

```javascript
// BEFORE (line 34):
appId: "1:1010601153585:web:YOUR_APP_ID_HERE"

// AFTER:
appId: "1:1010601153585:web:YOUR_ACTUAL_APP_ID"
```

### Also Update Environment Variables:

Add to `/workspaces/armora/.env.local`:
```bash
REACT_APP_FIREBASE_APP_ID=1:1010601153585:web:YOUR_ACTUAL_APP_ID
```

And to Vercel environment variables in production.

## Service Worker Features

### Background Message Handling
- ✅ Rich notifications with title, body, icon, and badge
- ✅ Professional vibration pattern: [200, 100, 200]
- ✅ Security-focused notification types
- ✅ Data payload handling for assignment updates
- ✅ Urgent/high-priority notification support

### Notification Types Supported
1. **assignment** - New protection booking confirmations
2. **cpo_update** - CPO approaching, en route, or status changes
3. **emergency** - Panic button alerts and emergency responses
4. **route_change** - ETA updates and route modifications
5. **general** - Other notifications

### Notification Click Handling
- ✅ Opens app at correct URL based on notification type
- ✅ Focuses existing window if app already open
- ✅ Routes to specific views (assignments, home, emergency)
- ✅ Passes data to app via postMessage API

### Action Buttons
Each notification type has contextual action buttons:
- **Assignment**: "View Assignment" / "Dismiss"
- **CPO Update**: "View Status" / "Contact CPO"
- **Emergency**: "Open App" (immediate action)
- **Route Change**: "View Route" / "Dismiss"

### Error Handling
- ✅ Try-catch blocks around all critical operations
- ✅ Fallback notifications if primary fails
- ✅ Console logging for debugging
- ✅ Unhandled error and rejection handlers

## Testing the Service Worker

### 1. Local Testing (after adding App ID)
```bash
# Start development server
npm start

# In browser DevTools:
# 1. Application → Service Workers
# 2. Check "firebase-messaging-sw.js" is registered
# 3. Console should show: "[FCM-SW] Firebase initialized successfully"
```

### 2. Test Push Notifications
Use Firebase Console → Cloud Messaging → Send test message:
- **Device token**: Get from app (check console logs)
- **Title**: "CPO Approaching"
- **Body**: "Your Close Protection Officer will arrive in 5 minutes"
- **Custom data**: 
  ```json
  {
    "type": "cpo_update",
    "assignmentId": "test-123",
    "urgent": "false"
  }
  ```

### 3. Verify Notification Click
- Click notification → Should open app at correct view
- Check DevTools console for routing messages
- Verify assignment data is passed correctly

## Integration with Existing Code

### The service worker will work with:
- ✅ Existing `/workspaces/armora/src/lib/firebase.ts`
- ✅ Existing `/workspaces/armora/public/sw.js` (general PWA worker)
- ✅ Firebase Messaging initialized in main app

### Both service workers can coexist:
- `sw.js` - Handles caching, offline mode, PWA features
- `firebase-messaging-sw.js` - Handles ONLY push notifications

Firebase automatically registers `firebase-messaging-sw.js` when you call `getToken()` in your app.

## Production Checklist

Before deploying to production:

- [ ] Add Firebase App ID to service worker (line 34)
- [ ] Add `REACT_APP_FIREBASE_APP_ID` to `.env.local`
- [ ] Add `REACT_APP_FIREBASE_APP_ID` to Vercel environment variables
- [ ] Test notifications in development
- [ ] Test notification clicks route correctly
- [ ] Verify both service workers register without conflicts
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Configure Firebase Cloud Messaging API V1 (already done)
- [ ] Set up server-side token management
- [ ] Implement notification permission request UI

## Security Notes

### Safe to Commit
The service worker file is safe to commit to Git. All values in it are **public client credentials**, not secrets:
- `apiKey` - Public client API key (safe to expose)
- `projectId` - Public project identifier
- `messagingSenderId` - Public sender ID
- `appId` - Public app identifier

### Private Server Credentials
Never commit these (already in `.gitignore`):
- Firebase Admin SDK private key
- Service account JSON files
- `.env.local` with sensitive values

## Next Steps

1. **Get App ID from Firebase Console** (see instructions above)
2. **Update service worker** with actual App ID
3. **Update environment variables** in local and Vercel
4. **Test locally** with development server
5. **Deploy to Vercel** and test in production
6. **Set up notification permission UI** in app (if not already done)
7. **Implement server-side push** using Firebase Admin SDK

## Support

- Firebase Documentation: https://firebase.google.com/docs/cloud-messaging
- Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Notifications API: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API

Last updated: 2025-10-09
