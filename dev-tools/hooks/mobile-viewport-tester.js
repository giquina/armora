#!/usr/bin/env node

/**
 * 📱 MOBILE VIEWPORT TESTER HOOK - Armora Transport
 * 
 * PURPOSE: Automatically test app on different mobile screen sizes
 * CRITICAL MISSION: PREVENT HORIZONTAL SCROLLING AT ALL COSTS
 * 
 * Features:
 * - Test multiple device viewports simultaneously
 * - CRITICAL: Detect and alert on horizontal scrolling issues
 * - Auto-refresh all viewports when code changes
 * - Screenshot comparison across devices
 * - Portrait/landscape testing
 * - Real device simulation with proper user agents
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const chokidar = require('chokidar');

class MobileViewportTester {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.serverPort = options.serverPort || 3001;
        this.baseUrl = `http://localhost:${this.serverPort}`;
        this.isRunning = false;
        this.browsers = new Map();
        this.fileWatcher = null;
        
        // Mobile device configurations
        this.devices = {
            'iPhone SE': {
                width: 375,
                height: 667,
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
                deviceScaleFactor: 2,
                isMobile: true
            },
            'iPhone 12': {
                width: 390,
                height: 844,
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
                deviceScaleFactor: 3,
                isMobile: true
            },
            'iPhone 12 Pro Max': {
                width: 428,
                height: 926,
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
                deviceScaleFactor: 3,
                isMobile: true
            },
            'Galaxy S21': {
                width: 360,
                height: 800,
                userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
                deviceScaleFactor: 3,
                isMobile: true
            },
            'iPad': {
                width: 768,
                height: 1024,
                userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
                deviceScaleFactor: 2,
                isMobile: true
            },
            'Desktop': {
                width: 1200,
                height: 800,
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                deviceScaleFactor: 1,
                isMobile: false
            }
        };
        
        // Files that trigger viewport refresh
        this.watchFiles = [
            '**/*.tsx',
            '**/*.ts',
            '**/*.jsx',
            '**/*.js',
            '**/*.css',
            '**/*.scss'
        ];
        
        console.log('📱 Mobile Viewport Tester initialized');
        console.log(`🌐 Target URL: ${this.baseUrl}`);
        console.log(`📏 Testing ${Object.keys(this.devices).length} viewport sizes`);
    }
    
    /**
     * Start the mobile viewport testing
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️  Mobile viewport tester is already running');
            return;
        }
        
        this.isRunning = true;
        console.log('✅ Starting Mobile Viewport Tester...');
        
        // Wait for dev server to be ready
        await this.waitForServer();
        
        // Launch browsers for each device
        await this.launchBrowsers();
        
        // Start file watching
        this.startFileWatcher();
        
        // Perform initial horizontal scroll check
        await this.performHorizontalScrollCheck();
        
        console.log('🎉 Mobile Viewport Tester is ready!');
        console.log('🚨 CRITICAL: Monitoring for horizontal scroll violations');
    }
    
    /**
     * Stop the viewport tester
     */
    async stop() {
        if (!this.isRunning) {
            console.log('⚠️  Mobile viewport tester is not running');
            return;
        }
        
        this.isRunning = false;
        
        // Stop file watcher
        if (this.fileWatcher) {
            await this.fileWatcher.close();
            console.log('📁 Stopped file watching');
        }
        
        // Close all browsers
        for (const [device, browser] of this.browsers) {
            await browser.close();
            console.log(`🔒 Closed ${device} browser`);
        }
        this.browsers.clear();
        
        console.log('🛑 Mobile Viewport Tester stopped');
    }
    
    /**
     * Wait for development server to be ready
     */
    async waitForServer(maxAttempts = 30) {
        console.log('⏳ Waiting for development server...');
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await fetch(this.baseUrl);
                if (response.ok) {
                    console.log('✅ Development server is ready');
                    return;
                }
            } catch (error) {
                // Server not ready yet
            }
            
            console.log(`⏳ Waiting for server... (${attempt}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        throw new Error('❌ Development server did not become ready in time');
    }
    
    /**
     * Launch browsers for each device viewport
     */
    async launchBrowsers() {
        console.log('🚀 Launching browsers for viewport testing...');
        
        const browserOptions = {
            headless: false,  // Keep visible for monitoring
            devtools: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        };
        
        for (const [deviceName, device] of Object.entries(this.devices)) {
            try {
                console.log(`📱 Launching ${deviceName} (${device.width}x${device.height})...`);
                
                const browser = await puppeteer.launch(browserOptions);
                const page = await browser.newPage();
                
                // Set viewport and user agent
                await page.setViewport({
                    width: device.width,
                    height: device.height,
                    deviceScaleFactor: device.deviceScaleFactor,
                    isMobile: device.isMobile,
                    hasTouch: device.isMobile
                });
                
                await page.setUserAgent(device.userAgent);
                
                // Navigate to the app
                await page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
                
                // Set window title for easy identification
                await page.evaluate((title) => {
                    document.title = title;
                }, `Armora - ${deviceName}`);
                
                // Store browser reference
                this.browsers.set(deviceName, browser);
                
                console.log(`✅ ${deviceName} browser ready`);
                
            } catch (error) {
                console.error(`❌ Failed to launch ${deviceName} browser:`, error.message);
            }
        }
        
        console.log(`🎉 Launched ${this.browsers.size} viewport browsers`);
    }
    
    /**
     * CRITICAL: Perform horizontal scroll detection
     */
    async performHorizontalScrollCheck() {
        console.log('\n🚨 CRITICAL HORIZONTAL SCROLL CHECK');
        console.log('═'.repeat(60));
        
        let foundViolations = false;
        const violations = [];
        
        for (const [deviceName, browser] of this.browsers) {
            try {
                const pages = await browser.pages();
                const page = pages[0];
                
                // Check for horizontal scrolling
                const scrollInfo = await page.evaluate(() => {
                    const body = document.body;
                    const html = document.documentElement;
                    
                    return {
                        documentWidth: Math.max(
                            body.scrollWidth,
                            body.offsetWidth,
                            html.clientWidth,
                            html.scrollWidth,
                            html.offsetWidth
                        ),
                        viewportWidth: window.innerWidth,
                        hasHorizontalScroll: body.scrollWidth > window.innerWidth ||
                                           html.scrollWidth > window.innerWidth,
                        overflowXElements: Array.from(document.querySelectorAll('*'))
                            .filter(el => {
                                const style = window.getComputedStyle(el);
                                return style.overflowX === 'scroll' || 
                                       style.overflowX === 'auto' ||
                                       el.scrollWidth > el.clientWidth;
                            })
                            .map(el => ({
                                tagName: el.tagName,
                                className: el.className,
                                id: el.id,
                                scrollWidth: el.scrollWidth,
                                clientWidth: el.clientWidth
                            }))
                    };
                });
                
                if (scrollInfo.hasHorizontalScroll) {
                    foundViolations = true;
                    violations.push({
                        device: deviceName,
                        documentWidth: scrollInfo.documentWidth,
                        viewportWidth: scrollInfo.viewportWidth,
                        overflowElements: scrollInfo.overflowXElements
                    });
                    
                    console.log(`❌ ${deviceName}: HORIZONTAL SCROLL VIOLATION!`);
                    console.log(`   Document width: ${scrollInfo.documentWidth}px`);
                    console.log(`   Viewport width: ${scrollInfo.viewportWidth}px`);
                    console.log(`   Overflow: +${scrollInfo.documentWidth - scrollInfo.viewportWidth}px`);
                    
                    if (scrollInfo.overflowXElements.length > 0) {
                        console.log('   Problem elements:');
                        scrollInfo.overflowXElements.slice(0, 3).forEach(el => {
                            console.log(`     • ${el.tagName}${el.className ? '.' + el.className : ''}${el.id ? '#' + el.id : ''}`);
                        });
                    }
                } else {
                    console.log(`✅ ${deviceName}: No horizontal scroll (${scrollInfo.documentWidth}px <= ${scrollInfo.viewportWidth}px)`);
                }
                
            } catch (error) {
                console.error(`❌ Failed to check ${deviceName}:`, error.message);
            }
        }
        
        console.log('═'.repeat(60));
        
        if (foundViolations) {
            console.log('🚨 CRITICAL: HORIZONTAL SCROLL VIOLATIONS DETECTED!');
            console.log('🛠️  REQUIRED FIXES:');
            console.log('   1. Add "overflow-x: hidden" to body and html');
            console.log('   2. Set "max-width: 100vw" on main containers');
            console.log('   3. Check for fixed-width elements wider than viewport');
            console.log('   4. Ensure all content is responsive');
            
            // Save violation report
            await this.saveViolationReport(violations);
        } else {
            console.log('✅ EXCELLENT: No horizontal scroll violations found!');
        }
        
        console.log('═'.repeat(60));
    }
    
    /**
     * Save horizontal scroll violation report
     */
    async saveViolationReport(violations) {
        const reportPath = path.join(this.projectRoot, 'horizontal-scroll-violations.json');
        const report = {
            timestamp: new Date().toISOString(),
            violations: violations,
            fixSuggestions: [
                'Add "overflow-x: hidden" to body and html elements',
                'Use "max-width: 100vw" on main containers',
                'Replace fixed widths with relative units (%, vw)',
                'Check for elements with large padding/margins',
                'Ensure images are responsive with "max-width: 100%"',
                'Use CSS Grid/Flexbox with proper overflow handling'
            ]
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 Violation report saved: ${reportPath}`);
    }
    
    /**
     * Start file watching for auto-refresh
     */
    startFileWatcher() {
        console.log('👀 Starting file watcher for viewport refresh...');
        
        this.fileWatcher = chokidar.watch(this.watchFiles, {
            cwd: this.projectRoot,
            ignored: [
                '**/node_modules/**',
                '**/build/**',
                '**/dist/**',
                '**/.git/**'
            ],
            ignoreInitial: true
        });
        
        let refreshTimer;
        
        this.fileWatcher.on('change', (filePath) => {
            console.log(`📝 File changed: ${filePath}`);
            
            // Debounce refresh
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(async () => {
                await this.refreshAllViewports();
                
                // Re-check for horizontal scroll after changes
                setTimeout(async () => {
                    await this.performHorizontalScrollCheck();
                }, 3000);
            }, 1000);
        });
        
        this.fileWatcher.on('error', (error) => {
            console.error('👀 File watcher error:', error.message);
        });
        
        console.log('✅ File watcher started');
    }
    
    /**
     * Refresh all viewport browsers
     */
    async refreshAllViewports() {
        console.log('🔄 Refreshing all viewports...');
        
        const refreshPromises = Array.from(this.browsers.entries()).map(async ([deviceName, browser]) => {
            try {
                const pages = await browser.pages();
                const page = pages[0];
                await page.reload({ waitUntil: 'networkidle2' });
                console.log(`✅ Refreshed ${deviceName}`);
            } catch (error) {
                console.error(`❌ Failed to refresh ${deviceName}:`, error.message);
            }
        });
        
        await Promise.all(refreshPromises);
        console.log('🎉 All viewports refreshed');
    }
    
    /**
     * Take screenshots of all viewports
     */
    async takeScreenshots() {
        const screenshotsDir = path.join(this.projectRoot, 'screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
        
        console.log('📸 Taking screenshots of all viewports...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        for (const [deviceName, browser] of this.browsers) {
            try {
                const pages = await browser.pages();
                const page = pages[0];
                
                const filename = `${deviceName.replace(/\s+/g, '-')}-${timestamp}.png`;
                const filePath = path.join(screenshotsDir, filename);
                
                await page.screenshot({
                    path: filePath,
                    fullPage: true
                });
                
                console.log(`📸 Screenshot saved: ${filename}`);
            } catch (error) {
                console.error(`❌ Failed to screenshot ${deviceName}:`, error.message);
            }
        }
        
        console.log(`🎉 Screenshots saved to: ${screenshotsDir}`);
    }
    
    /**
     * Test landscape orientation
     */
    async testLandscapeOrientation() {
        console.log('🔄 Testing landscape orientation...');
        
        for (const [deviceName, browser] of this.browsers) {
            if (deviceName === 'Desktop') continue; // Skip desktop
            
            try {
                const pages = await browser.pages();
                const page = pages[0];
                
                const device = this.devices[deviceName];
                
                // Switch to landscape
                await page.setViewport({
                    width: device.height,  // Swap dimensions
                    height: device.width,
                    deviceScaleFactor: device.deviceScaleFactor,
                    isMobile: device.isMobile,
                    hasTouch: device.isMobile
                });
                
                console.log(`🔄 ${deviceName} switched to landscape (${device.height}x${device.width})`);
                
                // Wait for layout to settle
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ Failed to test landscape for ${deviceName}:`, error.message);
            }
        }
        
        // Check horizontal scroll in landscape
        await this.performHorizontalScrollCheck();
        
        // Switch back to portrait
        console.log('🔄 Switching back to portrait...');
        for (const [deviceName, browser] of this.browsers) {
            if (deviceName === 'Desktop') continue;
            
            try {
                const pages = await browser.pages();
                const page = pages[0];
                const device = this.devices[deviceName];
                
                await page.setViewport({
                    width: device.width,
                    height: device.height,
                    deviceScaleFactor: device.deviceScaleFactor,
                    isMobile: device.isMobile,
                    hasTouch: device.isMobile
                });
                
            } catch (error) {
                console.error(`❌ Failed to switch back to portrait for ${deviceName}:`, error.message);
            }
        }
    }
    
    /**
     * Get current status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            baseUrl: this.baseUrl,
            browserCount: this.browsers.size,
            devices: Object.keys(this.devices),
            watchingFiles: this.fileWatcher ? true : false
        };
    }
    
    /**
     * Manual horizontal scroll check trigger
     */
    async checkHorizontalScroll() {
        console.log('🚨 Manual horizontal scroll check triggered...');
        await this.performHorizontalScrollCheck();
    }
}

// Export for use in hooks manager
module.exports = MobileViewportTester;

// If run directly, start the tester
if (require.main === module) {
    const tester = new MobileViewportTester();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Received shutdown signal');
        await tester.stop();
        process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
        console.log('\n🛑 Received termination signal');
        await tester.stop();
        process.exit(0);
    });
    
    // Start the tester
    tester.start().catch(error => {
        console.error('❌ Failed to start Mobile Viewport Tester:', error.message);
        process.exit(1);
    });
    
    console.log('✅ Mobile Viewport Tester is running');
    console.log('📝 Press Ctrl+C to stop');
    console.log('🚨 CRITICAL: Monitoring for horizontal scroll violations');
}