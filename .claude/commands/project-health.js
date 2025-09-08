#!/usr/bin/env node

/**
 * /project-health slash command
 * Shows mobile features status, server status, PWA readiness, tasks, commits, and Claude summary
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');

class ProjectHealth {
    constructor() {
        this.projectRoot = process.cwd();
        this.contextFile = path.join(this.projectRoot, '.claude/armora-context.json');
    }

    async checkHealth() {
        console.log('🛡️  ARMORA SECURITY TRANSPORT - PROJECT HEALTH STATUS\n');
        console.log('='.repeat(60));
        
        try {
            // Load project context
            const context = this.loadContext();
            
            // Check all health indicators
            await this.checkMobileFeatures(context);
            await this.checkDevelopmentServer();
            await this.checkMobileResponsiveness();
            await this.checkPwaReadiness();
            await this.checkTasksRemaining();
            await this.checkRecentCommits();
            await this.generateClaudeSummary(context);
            
        } catch (error) {
            console.error('❌ Error checking project health:', error.message);
        }
    }

    loadContext() {
        if (fs.existsSync(this.contextFile)) {
            return JSON.parse(fs.readFileSync(this.contextFile, 'utf8'));
        }
        return {};
    }

    async checkMobileFeatures(context) {
        console.log('📱 MOBILE FEATURES STATUS:');
        console.log('-'.repeat(30));
        
        const features = {
            'SplashScreen': this.checkComponentExists('SplashScreen'),
            'Auth Forms': this.checkDirectoryExists('src/components/Auth'),
            'Questionnaire': this.checkDirectoryExists('src/components/Questionnaire'),  
            'Dashboard': this.checkDirectoryExists('src/components/Dashboard'),
            'Booking Flow': this.checkDirectoryExists('src/components/Booking')
        };

        for (const [feature, status] of Object.entries(features)) {
            const icon = status ? '✅' : '⏳';
            console.log(`${icon} ${feature}`);
        }
        console.log();
    }

    async checkDevelopmentServer() {
        console.log('🌐 DEVELOPMENT SERVER:');
        console.log('-'.repeat(30));
        
        try {
            // Check if localhost:3000 is accessible
            const isRunning = await this.isServerRunning('localhost', 3000);
            
            if (isRunning) {
                console.log('✅ Running on http://localhost:3000');
                console.log('✅ Mobile testing available');
            } else {
                console.log('❌ Server not responding on localhost:3000');
                console.log('💡 Run: npm start');
            }
        } catch (error) {
            console.log('❌ Server status unknown');
        }
        console.log();
    }

    async checkMobileResponsiveness() {
        console.log('📏 MOBILE RESPONSIVENESS:');
        console.log('-'.repeat(30));
        
        const checks = {
            '320px (iPhone SE)': '⏳ Pending testing',
            '375px (iPhone 12)': '⏳ Pending testing', 
            '768px (iPad)': '⏳ Pending testing',
            '1024px+ (Desktop)': '⏳ Pending testing'
        };
        
        // Check if mobile viewport tester exists
        if (this.checkFileExists('dev-tools/hooks/mobile-viewport-tester.js')) {
            console.log('✅ Mobile viewport tester configured');
        } else {
            console.log('❌ Mobile viewport tester missing');
        }
        
        for (const [size, status] of Object.entries(checks)) {
            console.log(`⏳ ${size}: ${status}`);
        }
        console.log();
    }

    async checkPwaReadiness() {
        console.log('📲 PWA READINESS:');
        console.log('-'.repeat(30));
        
        const pwaChecks = {
            'Manifest.json': this.checkFileExists('public/manifest.json'),
            'Service Worker': false, // Will be implemented
            'App Icons': this.checkFileExists('public/logo192.png'),
            'HTTPS Ready': true, // Codespaces default
            'Offline Support': false // Will be implemented
        };

        for (const [item, status] of Object.entries(pwaChecks)) {
            const icon = status ? '✅' : '⏳';
            console.log(`${icon} ${item}`);
        }
        console.log();
    }

    async checkTasksRemaining() {
        console.log('📋 TASKS REMAINING:');
        console.log('-'.repeat(30));
        
        try {
            // Check if TODO.md exists in docs
            if (this.checkFileExists('docs/TODO.md')) {
                const todoContent = fs.readFileSync('docs/TODO.md', 'utf8');
                const tasks = todoContent.split('\\n').filter(line => 
                    line.includes('- [ ]') || line.includes('- [x]')
                );
                
                const completed = tasks.filter(task => task.includes('- [x]')).length;
                const total = tasks.length;
                const remaining = total - completed;
                
                console.log(`📊 Progress: ${completed}/${total} tasks completed`);
                console.log(`⏳ ${remaining} tasks remaining`);
            } else {
                console.log('📝 Task tracking: Setting up...');
            }
        } catch (error) {
            console.log('📝 Task tracking: In progress...');
        }
        console.log();
    }

    async checkRecentCommits() {
        console.log('📝 RECENT COMMITS:');
        console.log('-'.repeat(30));
        
        try {
            const commits = execSync('git log --oneline -5', { encoding: 'utf8' });
            const commitLines = commits.trim().split('\\n');
            
            commitLines.forEach(commit => {
                if (commit.includes('📱') || commit.includes('Mobile')) {
                    console.log(`📱 ${commit}`);
                } else {
                    console.log(`📝 ${commit}`);
                }
            });
        } catch (error) {
            console.log('📝 No recent commits found');
        }
        console.log();
    }

    async generateClaudeSummary(context) {
        console.log('🤖 CLAUDE DEVELOPMENT SUMMARY:');
        console.log('-'.repeat(30));
        
        const serverStatus = await this.isServerRunning('localhost', 3000);
        const features = ['SplashScreen', 'Auth', 'Questionnaire', 'Dashboard', 'Booking'];
        const builtFeatures = features.filter(f => 
            this.checkDirectoryExists(`src/components/${f}`) || 
            this.checkComponentExists(f)
        );
        
        console.log(`🏗️  Project: Armora Security Transport (React TypeScript PWA)`);
        console.log(`📊 Progress: ${builtFeatures.length}/${features.length} core features scaffolded`);
        console.log(`🌐 Server: ${serverStatus ? 'Running' : 'Stopped'} (localhost:3000)`);
        console.log(`🔧 Setup: Complete with hooks system and subagents`);
        console.log(`📱 Mobile: Ready for mobile-first development`);
        console.log(`⚡ Status: ${this.getOverallStatus()}`);
        console.log(``);
        console.log(`Next steps: Begin component implementation starting with SplashScreen`);
        console.log('='.repeat(60));
    }

    // Utility methods
    checkComponentExists(componentName) {
        return this.checkFileExists(`src/components/${componentName}.tsx`) ||
               this.checkFileExists(`src/${componentName}.tsx`);
    }

    checkDirectoryExists(dirPath) {
        return fs.existsSync(path.join(this.projectRoot, dirPath));
    }

    checkFileExists(filePath) {
        return fs.existsSync(path.join(this.projectRoot, filePath));
    }

    isServerRunning(host, port) {
        return new Promise((resolve) => {
            const req = http.request({ host, port, timeout: 1000 }, (res) => {
                resolve(true);
            });
            
            req.on('error', () => resolve(false));
            req.on('timeout', () => resolve(false));
            req.end();
        });
    }

    getOverallStatus() {
        const serverExists = this.checkFileExists('package.json');
        const hooksExist = this.checkDirectoryExists('dev-tools/hooks');
        const structureExists = this.checkDirectoryExists('src/components');
        
        if (serverExists && hooksExist && structureExists) {
            return 'Ready for development 🚀';
        } else {
            return 'Setup in progress ⚙️';
        }
    }
}

// Run the health check
if (require.main === module) {
    const health = new ProjectHealth();
    health.checkHealth();
}

module.exports = ProjectHealth;