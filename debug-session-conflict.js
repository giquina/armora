/**
 * Claude-Codespaces Session Conflict Debugger
 *
 * Run this in browser DevTools console to monitor session changes
 * when opening terminals in GitHub Codespaces
 */

class SessionConflictDebugger {
    constructor() {
        this.initialState = this.captureState();
        this.monitoring = false;
        this.logs = [];
    }

    captureState() {
        return {
            localStorage: { ...localStorage },
            sessionStorage: { ...sessionStorage },
            cookies: document.cookie,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
    }

    startMonitoring() {
        if (this.monitoring) return;
        this.monitoring = true;

        console.log('🔍 Starting Claude session monitoring...');
        console.log('Open a terminal in Codespaces now and watch for changes');

        // Monitor localStorage changes
        this.originalSetItem = localStorage.setItem;
        this.originalRemoveItem = localStorage.removeItem;
        this.originalClear = localStorage.clear;

        localStorage.setItem = (key, value) => {
            this.logChange('localStorage.setItem', { key, value });
            return this.originalSetItem.call(localStorage, key, value);
        };

        localStorage.removeItem = (key) => {
            this.logChange('localStorage.removeItem', { key });
            return this.originalRemoveItem.call(localStorage, key);
        };

        localStorage.clear = () => {
            this.logChange('localStorage.clear', {});
            return this.originalClear.call(localStorage);
        };

        // Monitor sessionStorage changes
        this.originalSessionSetItem = sessionStorage.setItem;
        this.originalSessionRemoveItem = sessionStorage.removeItem;
        this.originalSessionClear = sessionStorage.clear;

        sessionStorage.setItem = (key, value) => {
            this.logChange('sessionStorage.setItem', { key, value });
            return this.originalSessionSetItem.call(sessionStorage, key, value);
        };

        sessionStorage.removeItem = (key) => {
            this.logChange('sessionStorage.removeItem', { key });
            return this.originalSessionRemoveItem.call(sessionStorage, key);
        };

        sessionStorage.clear = () => {
            this.logChange('sessionStorage.clear', {});
            return this.originalSessionClear.call(sessionStorage);
        };

        // Monitor cookie changes
        this.cookieWatcher = setInterval(() => {
            const currentCookies = document.cookie;
            if (currentCookies !== this.lastCookies) {
                this.logChange('cookies.changed', {
                    from: this.lastCookies,
                    to: currentCookies
                });
                this.lastCookies = currentCookies;
            }
        }, 500);

        this.lastCookies = document.cookie;

        // Monitor network requests
        this.interceptFetch();
        this.interceptXHR();

        // Monitor page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.logChange('visibility.changed', {
                hidden: document.hidden
            });
        });

        // Monitor focus changes
        window.addEventListener('blur', () => {
            this.logChange('window.blur', {});
        });

        window.addEventListener('focus', () => {
            this.logChange('window.focus', {});
        });
    }

    interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const url = args[0];
            if (url.includes('claude.ai') || url.includes('auth') || url.includes('logout')) {
                this.logChange('fetch.auth-related', { url });
            }
            return originalFetch.apply(window, args);
        };
    }

    interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (url.includes('claude.ai') || url.includes('auth') || url.includes('logout')) {
                console.log('🌐 XHR Auth Request:', method, url);
            }
            return originalOpen.apply(this, [method, url, ...args]);
        };
    }

    logChange(type, data) {
        const entry = {
            type,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        this.logs.push(entry);

        // Color-coded logging
        const colors = {
            'localStorage.setItem': 'color: blue',
            'localStorage.removeItem': 'color: red',
            'localStorage.clear': 'color: red; font-weight: bold',
            'sessionStorage.setItem': 'color: green',
            'sessionStorage.removeItem': 'color: orange',
            'sessionStorage.clear': 'color: red; font-weight: bold',
            'cookies.changed': 'color: purple',
            'fetch.auth-related': 'color: red; font-weight: bold'
        };

        console.log(
            `%c🚨 SESSION CHANGE: ${type}`,
            colors[type] || 'color: black',
            data
        );

        // Check if this looks like a logout
        if (type.includes('clear') || type.includes('removeItem')) {
            console.warn('⚠️  POTENTIAL LOGOUT TRIGGER DETECTED!');
        }
    }

    stopMonitoring() {
        if (!this.monitoring) return;
        this.monitoring = false;

        // Restore original methods
        localStorage.setItem = this.originalSetItem;
        localStorage.removeItem = this.originalRemoveItem;
        localStorage.clear = this.originalClear;

        sessionStorage.setItem = this.originalSessionSetItem;
        sessionStorage.removeItem = this.originalSessionRemoveItem;
        sessionStorage.clear = this.originalSessionClear;

        clearInterval(this.cookieWatcher);

        console.log('🛑 Stopped monitoring');
    }

    getReport() {
        const currentState = this.captureState();

        return {
            initialState: this.initialState,
            currentState,
            changes: this.logs,
            summary: this.generateSummary()
        };
    }

    generateSummary() {
        const changeTypes = this.logs.reduce((acc, log) => {
            acc[log.type] = (acc[log.type] || 0) + 1;
            return acc;
        }, {});

        return {
            totalChanges: this.logs.length,
            changeTypes,
            suspiciousActivity: this.logs.filter(log =>
                log.type.includes('clear') ||
                log.type.includes('removeItem') ||
                log.type.includes('auth')
            )
        };
    }
}

// Auto-start monitoring
const debugger = new SessionConflictDebugger();
debugger.startMonitoring();

console.log(`
🔍 CLAUDE-CODESPACES SESSION DEBUGGER ACTIVE

INSTRUCTIONS:
1. Keep this console open
2. Open a terminal in your Codespaces tab
3. Watch for logged changes
4. Run debugger.getReport() to see full analysis

COMMANDS:
- debugger.stopMonitoring() - Stop monitoring
- debugger.startMonitoring() - Restart monitoring
- debugger.getReport() - Get full report
- debugger.logs - View all logged changes

The debugger will automatically detect and highlight potential logout triggers.
`);

// Export for easy access
window.sessionDebugger = debugger;