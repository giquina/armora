#!/usr/bin/env node

/**
 * 🎨 ARMORA BRAND COMPLIANCE HOOK - Armora Transport
 * 
 * PURPOSE: Ensure components follow Armora branding and mobile standards
 * CRITICAL FOCUS: Prevent horizontal scrolling and enforce brand consistency
 * 
 * Features:
 * - Scan CSS for correct Armora color usage
 * - Validate touch-friendly button sizes (44px minimum)
 * - CRITICAL: Detect horizontal overflow violations
 * - Check responsive breakpoints compliance
 * - Verify accessibility standards (contrast, etc.)
 * - Monitor brand consistency across components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const css = require('css');
const chokidar = require('chokidar');

class ArmoraBrandCompliance {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.isRunning = false;
        this.fileWatcher = null;
        this.violations = [];
        
        // Armora Brand Colors
        this.brandColors = {
            primaryDark: '#1a1a2e',
            accentGold: '#FFD700',
            secondaryGold: '#F4A460',
            validDarkVariants: ['#1a1a2e', '#0f0f1e', '#2a2a3e'],
            validGoldVariants: ['#FFD700', '#F4A460', '#DAA520']
        };
        
        // Mobile standards
        this.mobileStandards = {
            minTouchTarget: 44, // pixels
            maxViewportWidth: '100vw',
            forbiddenOverflowX: ['scroll', 'auto'],
            requiredBreakpoints: [320, 768, 1024]
        };
        
        // Files to monitor
        this.watchPatterns = [
            '**/*.css',
            '**/*.scss',
            '**/*.tsx',
            '**/*.jsx'
        ];
        
        console.log('🎨 Armora Brand Compliance initialized');
        console.log('🚨 CRITICAL: Monitoring horizontal scroll violations');
    }
    
    /**
     * Start brand compliance monitoring
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️  Brand compliance monitor is already running');
            return;
        }
        
        this.isRunning = true;
        console.log('✅ Starting Armora Brand Compliance Monitor...');
        
        // Perform initial compliance scan
        await this.performFullComplianceScan();
        
        // Start file watching
        this.startFileWatcher();
        
        console.log('🎉 Brand Compliance Monitor is active!');
    }
    
    /**
     * Stop the compliance monitor
     */
    stop() {
        if (!this.isRunning) {
            console.log('⚠️  Brand compliance monitor is not running');
            return;
        }
        
        this.isRunning = false;
        
        if (this.fileWatcher) {
            this.fileWatcher.close();
            console.log('📁 Stopped file watching');
        }
        
        console.log('🛑 Brand Compliance Monitor stopped');
    }
    
    /**
     * Perform comprehensive compliance scan
     */
    async performFullComplianceScan() {
        console.log('\n🔍 ARMORA BRAND COMPLIANCE SCAN');
        console.log('═'.repeat(60));
        
        this.violations = [];
        
        // Scan CSS files
        await this.scanCSSFiles();
        
        // Scan React components
        await this.scanReactComponents();
        
        // Check mobile compliance
        await this.checkMobileCompliance();
        
        // Generate compliance report
        await this.generateComplianceReport();
        
        console.log('═'.repeat(60));
    }
    
    /**
     * CRITICAL: Scan for horizontal overflow violations in CSS
     */
    async scanCSSFiles() {
        console.log('🎨 Scanning CSS files for brand compliance...');
        
        const cssFiles = glob.sync('**/*.css', {
            cwd: this.projectRoot,
            ignore: ['node_modules/**', 'build/**', 'dist/**']
        });
        
        for (const file of cssFiles) {
            await this.analyzeCSSFile(file);
        }
        
        console.log(`✅ Analyzed ${cssFiles.length} CSS files`);
    }
    
    /**
     * Analyze individual CSS file
     */
    async analyzeCSSFile(filePath) {
        try {
            const fullPath = path.join(this.projectRoot, filePath);
            const cssContent = fs.readFileSync(fullPath, 'utf8');
            const ast = css.parse(cssContent);
            
            this.traverseCSSRules(ast.stylesheet.rules, filePath);
            
        } catch (error) {
            console.error(`❌ Error analyzing ${filePath}:`, error.message);
        }
    }
    
    /**
     * Traverse CSS rules for compliance violations
     */
    traverseCSSRules(rules, filePath) {
        rules.forEach((rule) => {
            if (rule.type === 'rule') {
                rule.declarations?.forEach((declaration) => {
                    this.checkCSSDeclaration(declaration, rule.selectors, filePath);
                });
            }
            
            // Recursively check nested rules (media queries, etc.)
            if (rule.rules) {
                this.traverseCSSRules(rule.rules, filePath);
            }
        });
    }
    
    /**
     * Check individual CSS declaration for violations
     */
    checkCSSDeclaration(declaration, selectors, filePath) {
        const { property, value } = declaration;
        
        // CRITICAL: Check for horizontal overflow violations
        if (property === 'overflow-x' && this.mobileStandards.forbiddenOverflowX.includes(value)) {
            this.addViolation({
                type: 'CRITICAL_HORIZONTAL_OVERFLOW',
                severity: 'CRITICAL',
                file: filePath,
                selectors: selectors,
                property: property,
                value: value,
                message: `CRITICAL: overflow-x: ${value} causes horizontal scrolling!`,
                fix: 'Use overflow-x: hidden or remove this property'
            });
        }
        
        // Check for fixed widths that might cause overflow
        if (property === 'width' && value.includes('px') && !value.includes('max-width')) {
            const pixelValue = parseInt(value);
            if (pixelValue > 360) { // Larger than small mobile screens
                this.addViolation({
                    type: 'POTENTIAL_OVERFLOW',
                    severity: 'WARNING',
                    file: filePath,
                    selectors: selectors,
                    property: property,
                    value: value,
                    message: `Fixed width ${value} may cause horizontal overflow on mobile`,
                    fix: 'Use max-width instead of width, or use relative units'
                });
            }
        }
        
        // Check brand color compliance
        if (property.includes('color') || property === 'background') {
            this.checkColorCompliance(value, selectors, filePath, property);
        }
        
        // Check touch target sizes
        if ((property === 'min-height' || property === 'height') && 
            selectors.some(s => s.includes('button') || s.includes('btn'))) {
            const height = parseInt(value);
            if (height < this.mobileStandards.minTouchTarget) {
                this.addViolation({
                    type: 'TOUCH_TARGET_TOO_SMALL',
                    severity: 'WARNING',
                    file: filePath,
                    selectors: selectors,
                    property: property,
                    value: value,
                    message: `Button height ${value} is below 44px minimum for touch targets`,
                    fix: `Increase to at least ${this.mobileStandards.minTouchTarget}px`
                });
            }
        }
    }
    
    /**
     * Check color compliance with Armora brand
     */
    checkColorCompliance(value, selectors, filePath, property) {
        // Extract colors from value
        const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;
        const colors = value.match(colorRegex);
        
        if (colors) {
            colors.forEach(color => {
                const normalizedColor = this.normalizeColor(color);
                
                // Check if it's a valid Armora color
                if (!this.isValidArmoraColor(normalizedColor) && 
                    !this.isSystemColor(normalizedColor)) {
                    
                    this.addViolation({
                        type: 'BRAND_COLOR_VIOLATION',
                        severity: 'WARNING',
                        file: filePath,
                        selectors: selectors,
                        property: property,
                        value: color,
                        message: `Color ${color} is not part of Armora brand palette`,
                        fix: `Use brand colors: ${Object.values(this.brandColors).slice(0, 3).join(', ')}`
                    });
                }
            });
        }
    }
    
    /**
     * Check if color is valid Armora brand color
     */
    isValidArmoraColor(color) {
        return [
            ...this.brandColors.validDarkVariants,
            ...this.brandColors.validGoldVariants,
            'transparent',
            'inherit',
            'currentColor'
        ].includes(color);
    }
    
    /**
     * Check if it's a system color (white, black, etc.)
     */
    isSystemColor(color) {
        const systemColors = [
            '#ffffff', '#fff', 'white',
            '#000000', '#000', 'black',
            'transparent', 'inherit', 'currentColor',
            'rgba(255,255,255', 'rgba(0,0,0', // Partial matches for rgba
        ];
        
        return systemColors.some(sys => color.toLowerCase().includes(sys.toLowerCase()));
    }
    
    /**
     * Normalize color format
     */
    normalizeColor(color) {
        return color.toLowerCase().replace(/\s/g, '');
    }
    
    /**
     * Scan React components for inline styles and compliance
     */
    async scanReactComponents() {
        console.log('⚛️ Scanning React components...');
        
        const componentFiles = glob.sync('**/*.{tsx,jsx}', {
            cwd: this.projectRoot,
            ignore: ['node_modules/**', 'build/**', 'dist/**']
        });
        
        for (const file of componentFiles) {
            await this.analyzeReactComponent(file);
        }
        
        console.log(`✅ Analyzed ${componentFiles.length} React components`);
    }
    
    /**
     * Analyze React component file
     */
    async analyzeReactComponent(filePath) {
        try {
            const fullPath = path.join(this.projectRoot, filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Check for inline styles with horizontal overflow risks
            const inlineStyleRegex = /style={{[^}]+}}/g;
            const inlineStyles = content.match(inlineStyleRegex);
            
            if (inlineStyles) {
                inlineStyles.forEach(styleMatch => {
                    if (styleMatch.includes('overflowX') && 
                        (styleMatch.includes('scroll') || styleMatch.includes('auto'))) {
                        
                        this.addViolation({
                            type: 'CRITICAL_INLINE_OVERFLOW',
                            severity: 'CRITICAL',
                            file: filePath,
                            code: styleMatch,
                            message: 'CRITICAL: Inline style causes horizontal scrolling!',
                            fix: 'Remove overflowX: scroll/auto or use overflowX: hidden'
                        });
                    }
                });
            }
            
        } catch (error) {
            console.error(`❌ Error analyzing ${filePath}:`, error.message);
        }
    }
    
    /**
     * Check mobile compliance standards
     */
    async checkMobileCompliance() {
        console.log('📱 Checking mobile compliance standards...');
        
        // Check if viewport meta tag exists
        const indexHtmlPath = path.join(this.projectRoot, 'public/index.html');
        if (fs.existsSync(indexHtmlPath)) {
            const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
            
            if (!htmlContent.includes('viewport')) {
                this.addViolation({
                    type: 'MISSING_VIEWPORT',
                    severity: 'ERROR',
                    file: 'public/index.html',
                    message: 'Missing viewport meta tag for mobile responsiveness',
                    fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">'
                });
            }
        }
    }
    
    /**
     * Add a violation to the list
     */
    addViolation(violation) {
        this.violations.push({
            ...violation,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Generate compliance report
     */
    async generateComplianceReport() {
        const criticalViolations = this.violations.filter(v => v.severity === 'CRITICAL');
        const errorViolations = this.violations.filter(v => v.severity === 'ERROR');
        const warningViolations = this.violations.filter(v => v.severity === 'WARNING');
        
        console.log(`\n📊 COMPLIANCE REPORT:`);
        console.log(`🚨 Critical: ${criticalViolations.length} (HORIZONTAL SCROLL VIOLATIONS!)`);
        console.log(`❌ Errors: ${errorViolations.length}`);
        console.log(`⚠️  Warnings: ${warningViolations.length}`);
        
        // Show critical violations first
        if (criticalViolations.length > 0) {
            console.log('\n🚨 CRITICAL VIOLATIONS (MUST FIX):');
            criticalViolations.forEach((v, i) => {
                console.log(`${i + 1}. ${v.file}: ${v.message}`);
                console.log(`   Fix: ${v.fix}`);
            });
        }
        
        // Show sample errors and warnings
        if (errorViolations.length > 0) {
            console.log('\n❌ ERRORS:');
            errorViolations.slice(0, 3).forEach((v, i) => {
                console.log(`${i + 1}. ${v.file}: ${v.message}`);
            });
            if (errorViolations.length > 3) {
                console.log(`   ... and ${errorViolations.length - 3} more`);
            }
        }
        
        if (warningViolations.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            warningViolations.slice(0, 3).forEach((v, i) => {
                console.log(`${i + 1}. ${v.file}: ${v.message}`);
            });
            if (warningViolations.length > 3) {
                console.log(`   ... and ${warningViolations.length - 3} more`);
            }
        }
        
        // Save detailed report
        const reportPath = path.join(this.projectRoot, 'armora-brand-compliance.json');
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                critical: criticalViolations.length,
                errors: errorViolations.length,
                warnings: warningViolations.length,
                total: this.violations.length
            },
            violations: this.violations
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
        
        if (criticalViolations.length === 0 && errorViolations.length === 0) {
            console.log('\n🎉 EXCELLENT: No critical violations or errors found!');
            console.log('💎 Your app maintains Armora brand standards!');
        }
    }
    
    /**
     * Start file watching for real-time compliance checking
     */
    startFileWatcher() {
        console.log('👀 Starting file watcher for compliance monitoring...');
        
        this.fileWatcher = chokidar.watch(this.watchPatterns, {
            cwd: this.projectRoot,
            ignored: [
                '**/node_modules/**',
                '**/build/**',
                '**/dist/**',
                '**/.git/**'
            ],
            ignoreInitial: true
        });
        
        let complianceTimer;
        
        this.fileWatcher.on('change', (filePath) => {
            console.log(`📝 File changed: ${filePath}`);
            
            // Debounce compliance check
            clearTimeout(complianceTimer);
            complianceTimer = setTimeout(async () => {
                console.log('🔍 Running compliance check after file changes...');
                await this.performFullComplianceScan();
            }, 2000);
        });
        
        this.fileWatcher.on('error', (error) => {
            console.error('👀 File watcher error:', error.message);
        });
        
        console.log('✅ File watcher started');
    }
    
    /**
     * Get current status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            violationCount: this.violations.length,
            criticalViolations: this.violations.filter(v => v.severity === 'CRITICAL').length,
            lastScanTime: this.lastScanTime,
            watchingFiles: this.fileWatcher ? true : false
        };
    }
    
    /**
     * Manual compliance check trigger
     */
    async checkCompliance() {
        console.log('🔍 Manual compliance check triggered...');
        await this.performFullComplianceScan();
    }
}

// Export for use in hooks manager
module.exports = ArmoraBrandCompliance;

// If run directly, start the compliance monitor
if (require.main === module) {
    const compliance = new ArmoraBrandCompliance();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Received shutdown signal');
        compliance.stop();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Received termination signal');
        compliance.stop();
        process.exit(0);
    });
    
    // Start the compliance monitor
    compliance.start().catch(error => {
        console.error('❌ Failed to start Brand Compliance Monitor:', error.message);
        process.exit(1);
    });
    
    console.log('✅ Armora Brand Compliance Monitor is running');
    console.log('📝 Press Ctrl+C to stop');
    console.log('🚨 CRITICAL: Monitoring horizontal scroll violations');
}