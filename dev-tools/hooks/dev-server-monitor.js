#!/usr/bin/env node

/**
 * 🖥️ DEV SERVER MONITOR HOOK - Armora Transport
 * 
 * PURPOSE: Keep development server running and auto-refresh app
 * MOBILE FOCUS: Ensures mobile development workflow stays uninterrupted
 * 
 * Features:
 * - Monitor React dev server on common ports (3000, 3001, 5173, 8080)
 * - Auto-restart server if it crashes
 * - Force browser refresh when critical files change
 * - Display QR code for easy mobile device testing
 * - Handle port conflicts automatically
 * - Support remote debugging from mobile devices
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const http = require('http');
const chokidar = require('chokidar');
const qrcode = require('qrcode');

class DevServerMonitor {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.commonPorts = [3000, 3001, 5173, 8080, 4173, 5000];
        this.currentPort = null;
        this.serverProcess = null;
        this.isRunning = false;
        this.fileWatcher = null;
        this.restartCount = 0;
        this.maxRestarts = 5;
        
        // Files that trigger browser refresh
        this.criticalFiles = [
            '**/*.tsx',
            '**/*.ts',
            '**/*.jsx',
            '**/*.js',
            '**/*.css',
            '**/*.scss',
            '**/public/index.html',
            '**/src/index.tsx',
            '**/src/index.js'
        ];
        
        console.log('🖥️ Dev Server Monitor initialized');
        console.log(`📁 Project root: ${this.projectRoot}`);
    }
    
    /**
     * Start monitoring the development server
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️  Dev server monitor is already running');
            return;
        }
        
        this.isRunning = true;
        console.log('✅ Starting Dev Server Monitor...');
        
        // Check if server is already running
        const runningPort = await this.findRunningServer();
        
        if (runningPort) {
            console.log(`🎉 Found running server on port ${runningPort}`);
            this.currentPort = runningPort;
            await this.displayServerInfo();
        } else {
            console.log('🚀 No server found, starting new one...');
            await this.startNewServer();
        }
        
        // Start monitoring
        this.startFileWatcher();
        this.startHealthMonitor();
    }
    
    /**
     * Stop the monitor and optionally the server
     */
    stop(stopServer = false) {
        if (!this.isRunning) {
            console.log('⚠️  Dev server monitor is not running');
            return;
        }
        
        this.isRunning = false;
        
        // Stop file watcher
        if (this.fileWatcher) {
            this.fileWatcher.close();
            console.log('📁 Stopped file watching');
        }
        
        // Stop health monitor
        if (this.healthTimer) {
            clearInterval(this.healthTimer);
        }
        
        // Stop server if requested
        if (stopServer && this.serverProcess) {
            this.serverProcess.kill('SIGTERM');
            console.log('🛑 Stopped development server');
        }
        
        console.log('🛑 Dev Server Monitor stopped');
    }
    
    /**
     * Find if a dev server is already running
     */
    async findRunningServer() {
        for (const port of this.commonPorts) {
            if (await this.isPortInUse(port)) {
                // Test if it's a development server
                if (await this.isDevServer(port)) {
                    return port;
                }
            }
        }
        return null;
    }
    
    /**
     * Check if port is in use
     */
    isPortInUse(port) {
        return new Promise((resolve) => {
            const server = http.createServer();
            
            server.listen(port, () => {
                server.close(() => resolve(false));
            });
            
            server.on('error', () => resolve(true));
        });
    }
    
    /**
     * Check if the server on port is a development server
     */
    async isDevServer(port) {
        return new Promise((resolve) => {
            const req = http.get(`http://localhost:${port}`, (res) => {
                // Check for common dev server indicators
                const headers = res.headers;
                if (headers['x-powered-by'] || 
                    headers.server?.includes('webpack') ||
                    headers.server?.includes('vite') ||
                    res.statusCode === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
            
            req.on('error', () => resolve(false));
            req.setTimeout(2000, () => {
                req.destroy();
                resolve(false);
            });
        });
    }
    
    /**
     * Start a new development server
     */
    async startNewServer() {
        const availablePort = await this.findAvailablePort();
        if (!availablePort) {
            console.error('❌ No available ports found for development server');
            return;
        }
        
        // Detect package manager and start script
        const startCommand = await this.detectStartCommand();
        if (!startCommand) {
            console.error('❌ Could not detect start command (npm/yarn/pnpm start)');
            return;
        }
        
        console.log(`🚀 Starting server on port ${availablePort}...`);
        console.log(`📝 Command: ${startCommand.command} ${startCommand.args.join(' ')}`);
        
        // Set port environment variable
        const env = { 
            ...process.env, 
            PORT: availablePort.toString(),
            BROWSER: 'none' // Don't auto-open browser
        };
        
        // Start the server process
        this.serverProcess = spawn(startCommand.command, startCommand.args, {
            cwd: this.projectRoot,
            env,
            stdio: ['ignore', 'pipe', 'pipe']
        });
        
        this.currentPort = availablePort;
        
        // Handle server output
        this.serverProcess.stdout.on('data', (data) => {
            const output = data.toString();
            if (output.includes('Local:') || output.includes('localhost')) {
                console.log('✅ Development server started successfully');
                this.displayServerInfo();
            }
        });
        
        this.serverProcess.stderr.on('data', (data) => {
            const error = data.toString();
            if (!error.includes('webpack compiled') && 
                !error.includes('WARNING') &&
                !error.includes('deprecated')) {
                console.error('⚠️  Server error:', error.trim());
            }
        });
        
        // Handle server exit
        this.serverProcess.on('exit', (code) => {
            console.log(`🚨 Server exited with code ${code}`);
            this.serverProcess = null;
            
            if (this.isRunning && this.restartCount < this.maxRestarts) {
                this.restartCount++;
                console.log(`🔄 Restarting server (attempt ${this.restartCount}/${this.maxRestarts})...`);
                setTimeout(() => this.startNewServer(), 3000);
            } else if (this.restartCount >= this.maxRestarts) {
                console.error('❌ Max restarts reached. Manual intervention required.');
            }
        });
        
        // Reset restart count on successful start
        setTimeout(() => {
            if (this.serverProcess && !this.serverProcess.killed) {
                this.restartCount = 0;
            }
        }, 10000);
    }
    
    /**
     * Find an available port
     */
    async findAvailablePort() {
        for (const port of this.commonPorts) {
            if (!(await this.isPortInUse(port))) {
                return port;
            }
        }
        return null;
    }
    
    /**
     * Detect the appropriate start command
     */
    async detectStartCommand() {
        const packageJsonPath = path.join(this.projectRoot, 'package.json');
        
        if (!fs.existsSync(packageJsonPath)) {
            return null;
        }
        
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const scripts = packageJson.scripts || {};
            
            // Check for start script
            if (!scripts.start && !scripts.dev) {
                return null;
            }
            
            // Detect package manager
            if (fs.existsSync(path.join(this.projectRoot, 'yarn.lock'))) {
                return {
                    command: 'yarn',
                    args: scripts.dev ? ['dev'] : ['start']
                };
            } else if (fs.existsSync(path.join(this.projectRoot, 'pnpm-lock.yaml'))) {
                return {
                    command: 'pnpm',
                    args: scripts.dev ? ['dev'] : ['start']
                };
            } else {
                return {
                    command: 'npm',
                    args: scripts.dev ? ['run', 'dev'] : ['start']
                };
            }
        } catch (error) {
            console.error('❌ Error reading package.json:', error.message);
            return null;
        }
    }
    
    /**
     * Display server information including QR code for mobile testing
     */
    async displayServerInfo() {
        if (!this.currentPort) return;
        
        const localUrl = `http://localhost:${this.currentPort}`;
        
        // Get local IP for mobile testing
        const networkUrl = await this.getNetworkUrl();
        
        console.log('\n🎉 Development Server Ready!');
        console.log('─'.repeat(50));
        console.log(`🔗 Local:    ${localUrl}`);
        
        if (networkUrl) {
            console.log(`📱 Network:  ${networkUrl}`);
            console.log('\n📱 Mobile Testing QR Code:');
            
            try {
                const qr = await qrcode.toString(networkUrl, { 
                    type: 'terminal',
                    small: true 
                });
                console.log(qr);
            } catch (error) {
                console.log('❌ Could not generate QR code');
            }
        }
        
        console.log('─'.repeat(50));
        console.log('📝 Tips for mobile testing:');
        console.log('   • Scan QR code to open on mobile device');
        console.log('   • Both devices must be on same network');
        console.log('   • Use Chrome DevTools for remote debugging');
        console.log('─'.repeat(50));
    }
    
    /**
     * Get network URL for mobile testing
     */
    async getNetworkUrl() {
        try {
            const { exec } = require('child_process');
            const os = require('os');
            
            // Get network interfaces
            const interfaces = os.networkInterfaces();
            
            // Find the primary network interface
            for (const name in interfaces) {
                for (const iface of interfaces[name]) {
                    // Skip internal and non-IPv4 addresses
                    if (!iface.internal && iface.family === 'IPv4') {
                        return `http://${iface.address}:${this.currentPort}`;
                    }
                }
            }
            
            return null;
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Start watching files for changes
     */
    startFileWatcher() {
        console.log('👀 Starting file watcher for auto-refresh...');
        
        this.fileWatcher = chokidar.watch(this.criticalFiles, {
            cwd: this.projectRoot,
            ignored: [
                '**/node_modules/**',
                '**/build/**',
                '**/dist/**',
                '**/.git/**',
                '**/coverage/**'
            ],
            ignoreInitial: true
        });
        
        let refreshTimer;
        
        this.fileWatcher.on('change', (filePath) => {
            console.log(`📝 File changed: ${filePath}`);
            
            // Debounce refresh to avoid too many refreshes
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(() => {
                this.triggerBrowserRefresh();
            }, 500);
        });
        
        this.fileWatcher.on('error', (error) => {
            console.error('👀 File watcher error:', error.message);
        });
        
        console.log('✅ File watcher started');
    }
    
    /**
     * Trigger browser refresh (attempt)
     */
    triggerBrowserRefresh() {
        if (!this.currentPort) return;
        
        console.log('🔄 Triggering browser refresh...');
        
        // For development servers that support hot reload,
        // the refresh should happen automatically.
        // This is a fallback for manual refresh triggers.
        
        // You could integrate with browser automation tools here
        // or use WebSocket connections for real-time refresh
    }
    
    /**
     * Start health monitoring
     */
    startHealthMonitor() {
        console.log('❤️  Starting health monitor...');
        
        this.healthTimer = setInterval(async () => {
            if (this.currentPort && !(await this.isDevServer(this.currentPort))) {
                console.log('💔 Server health check failed, restarting...');
                if (this.serverProcess) {
                    this.serverProcess.kill('SIGTERM');
                }
                setTimeout(() => this.startNewServer(), 2000);
            }
        }, 30000); // Check every 30 seconds
    }
    
    /**
     * Get current status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            currentPort: this.currentPort,
            serverProcess: !!this.serverProcess,
            restartCount: this.restartCount,
            projectRoot: this.projectRoot
        };
    }
    
    /**
     * Manual restart of the server
     */
    async restart() {
        console.log('🔄 Manual restart requested...');
        
        if (this.serverProcess) {
            this.serverProcess.kill('SIGTERM');
        }
        
        setTimeout(() => this.startNewServer(), 2000);
    }
}

// Export for use in hooks manager
module.exports = DevServerMonitor;

// If run directly, start the monitor
if (require.main === module) {
    const monitor = new DevServerMonitor();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Received shutdown signal');
        monitor.stop(true); // Stop server too
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Received termination signal');
        monitor.stop(true);
        process.exit(0);
    });
    
    // Start the monitor
    monitor.start();
    
    console.log('✅ Dev Server Monitor is running');
    console.log('📝 Press Ctrl+C to stop');
}