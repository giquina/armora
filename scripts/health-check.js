#!/usr/bin/env node

/**
 * Armora Project Health Check Script
 * Detects stale webpack cache, chunk loading errors, and server issues
 *
 * Usage: node scripts/health-check.js
 * Or via npm: npm run health
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync, exec } = require('child_process');

class ArmoraHealthChecker {
    constructor() {
        this.checks = [];
        this.warnings = [];
        this.recommendations = [];
        this.criticalIssues = [];
        this.healthScore = 100;
    }

    log(message, type = 'info') {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            debug: '🔍'
        };
        console.log(`${icons[type]} ${message}`);
    }

    addCheck(name, status, details = '') {
        this.checks.push({ name, status, details });
        if (!status) {
            this.healthScore -= 15;
        }
    }

    addWarning(message) {
        this.warnings.push(message);
        this.healthScore -= 5;
    }

    addRecommendation(message) {
        this.recommendations.push(message);
    }

    addCriticalIssue(message) {
        this.criticalIssues.push(message);
        this.healthScore -= 25;
    }

    async checkPort(port) {
        return new Promise((resolve) => {
            const req = http.request({
                hostname: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                timeout: 5000
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        accessible: true,
                        statusCode: res.statusCode,
                        html: data,
                        headers: res.headers
                    });
                });
            });

            req.on('error', () => resolve({ accessible: false }));
            req.on('timeout', () => {
                req.destroy();
                resolve({ accessible: false, timeout: true });
            });

            req.end();
        });
    }

    checkCacheDirectories() {
        this.log('🔍 Checking cache directories...', 'debug');

        const cacheLocations = [
            'node_modules/.cache',
            'build',
            'dist',
            '.parcel-cache',
            '/tmp/webpack-*',
            process.env.TMPDIR ? `${process.env.TMPDIR}/react-*` : '/tmp/react-*'
        ];

        let staleCacheFound = false;
        let cacheSize = 0;

        cacheLocations.forEach(location => {
            const fullPath = path.resolve(location);

            if (location.includes('*')) {
                // Handle glob patterns
                try {
                    const matches = execSync(`ls -d ${location} 2>/dev/null || true`, { encoding: 'utf8' }).trim();
                    if (matches) {
                        staleCacheFound = true;
                        this.addWarning(`Stale cache found: ${matches}`);
                    }
                } catch (e) {
                    // Ignore glob errors
                }
            } else if (fs.existsSync(fullPath)) {
                const stats = fs.statSync(fullPath);
                const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);

                if (ageInHours > 24) {
                    staleCacheFound = true;
                    this.addWarning(`Stale cache directory: ${location} (${Math.round(ageInHours)}h old)`);
                }

                try {
                    const size = execSync(`du -sh "${fullPath}" 2>/dev/null | cut -f1`, { encoding: 'utf8' }).trim();
                    cacheSize += this.parseSizeString(size);
                } catch (e) {
                    // Ignore size calculation errors
                }
            }
        });

        this.addCheck('Cache directories clean', !staleCacheFound, staleCacheFound ? 'Stale cache detected' : 'No stale cache found');

        if (cacheSize > 500) { // MB
            this.addWarning(`Large cache size detected: ~${Math.round(cacheSize)}MB`);
        }

        return !staleCacheFound;
    }

    parseSizeString(sizeStr) {
        const match = sizeStr.match(/^(\d+(?:\.\d+)?)(K|M|G)?$/);
        if (!match) return 0;

        const size = parseFloat(match[1]);
        const unit = match[2] || '';

        switch (unit) {
            case 'K': return size / 1024;
            case 'M': return size;
            case 'G': return size * 1024;
            default: return size / (1024 * 1024);
        }
    }

    async checkPortAccessibility() {
        this.log('🔍 Checking port accessibility...', 'debug');

        // Check port 3000 (known problematic)
        const port3000 = await this.checkPort(3000);
        if (port3000.accessible) {
            if (port3000.html.includes('ChunkLoadError') ||
                port3000.html.includes('Loading chunk') ||
                port3000.html.includes('webpack')) {
                this.addCriticalIssue('Port 3000 has ChunkLoadError - webpack cache is stale');
                this.addCheck('Port 3000 health', false, 'ChunkLoadError detected');
            } else if (port3000.statusCode === 200 && port3000.html.includes('<div id="root">')) {
                this.addCheck('Port 3000 accessible', true, 'Running but may have cached issues');
                this.addWarning('Port 3000 accessible but known to have cache issues');
            } else {
                this.addCheck('Port 3000 accessible', false, `Status: ${port3000.statusCode}`);
            }
        } else {
            this.addCheck('Port 3000 accessible', true, 'Not running (good - avoids cache issues)');
        }

        // Check port 3001 (recommended)
        const port3001 = await this.checkPort(3001);
        if (port3001.accessible) {
            if (port3001.statusCode === 200 && port3001.html.includes('<div id="root">')) {
                this.addCheck('Port 3001 (recommended)', true, 'Running and healthy');
            } else {
                this.addCheck('Port 3001 (recommended)', false, `Status: ${port3001.statusCode}`);
            }
        } else {
            this.addCheck('Port 3001 (recommended)', false, 'Not running');
            this.addRecommendation('Start server on port 3001: PORT=3001 npm start');
        }
    }

    checkProcesses() {
        this.log('🔍 Checking running processes...', 'debug');

        try {
            const processes = execSync('ps aux | grep -E "(react-scripts|webpack|node.*start)" | grep -v grep', { encoding: 'utf8' });
            const processLines = processes.trim().split('\n').filter(line => line.trim());

            if (processLines.length > 2) {
                this.addWarning(`Multiple Node processes running (${processLines.length})`);
                this.addRecommendation('Kill all processes: npm run hooks:emergency');
            }

            // Check for port conflicts
            try {
                const port3000Process = execSync('lsof -ti:3000 2>/dev/null || true', { encoding: 'utf8' }).trim();
                const port3001Process = execSync('lsof -ti:3001 2>/dev/null || true', { encoding: 'utf8' }).trim();

                if (port3000Process && port3001Process) {
                    this.addWarning('Both port 3000 and 3001 are in use');
                    this.addRecommendation('Kill port 3000 process: lsof -ti:3000 | xargs kill -9');
                }
            } catch (e) {
                // lsof not available or no processes
            }

            this.addCheck('Process conflicts', processLines.length <= 2, `${processLines.length} processes running`);
        } catch (e) {
            this.addCheck('Process conflicts', true, 'No conflicts detected');
        }
    }

    checkDependencies() {
        this.log('🔍 Checking project dependencies...', 'debug');

        const packageJsonPath = path.resolve('package.json');
        if (!fs.existsSync(packageJsonPath)) {
            this.addCriticalIssue('package.json not found');
            return;
        }

        const nodeModulesPath = path.resolve('node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            this.addCriticalIssue('node_modules not found - run npm install');
            this.addCheck('Dependencies installed', false, 'node_modules missing');
            return;
        }

        // Check for react-scripts
        const reactScriptsPath = path.resolve('node_modules/react-scripts');
        if (!fs.existsSync(reactScriptsPath)) {
            this.addCriticalIssue('react-scripts not installed');
            this.addCheck('React Scripts available', false, 'react-scripts missing');
        } else {
            this.addCheck('React Scripts available', true, 'Installed');
        }

        // Check package-lock integrity
        const packageLockPath = path.resolve('package-lock.json');
        if (!fs.existsSync(packageLockPath)) {
            this.addWarning('package-lock.json missing - may cause version conflicts');
        }

        this.addCheck('Dependencies installed', true, 'node_modules present');
    }

    checkEnvironment() {
        this.log('🔍 Checking environment...', 'debug');

        // Check Node version
        try {
            const nodeVersion = process.version;
            const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

            if (majorVersion < 16) {
                this.addCriticalIssue(`Node.js ${nodeVersion} is too old. Requires Node 16+`);
                this.addCheck('Node.js version', false, `${nodeVersion} (requires 16+)`);
            } else {
                this.addCheck('Node.js version', true, nodeVersion);
            }
        } catch (e) {
            this.addCheck('Node.js version', false, 'Could not determine version');
        }

        // Check npm version
        try {
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            this.addCheck('npm available', true, `v${npmVersion}`);
        } catch (e) {
            this.addCheck('npm available', false, 'npm not found');
        }

        // Check if in Codespaces
        if (process.env.CODESPACES) {
            this.addCheck('GitHub Codespaces', true, 'Running in Codespaces');
            this.addRecommendation('Use port 3001 for best Codespaces compatibility');
        }
    }

    checkBuildHealth() {
        this.log('🔍 Checking build health...', 'debug');

        const buildPath = path.resolve('build');
        if (fs.existsSync(buildPath)) {
            const stats = fs.statSync(buildPath);
            const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);

            if (ageInHours > 48) {
                this.addWarning(`Build directory is ${Math.round(ageInHours)}h old`);
                this.addRecommendation('Run fresh build: npm run build');
            }

            this.addCheck('Build directory', true, `Last built ${Math.round(ageInHours)}h ago`);
        } else {
            this.addCheck('Build directory', true, 'No stale build directory');
        }

        // Check TypeScript compilation
        try {
            execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
            this.addCheck('TypeScript compilation', true, 'No type errors');
        } catch (e) {
            this.addCheck('TypeScript compilation', false, 'Type errors found');
            this.addRecommendation('Fix TypeScript errors: npm run build');
        }
    }

    generateHealthScore() {
        // Ensure score is between 0 and 100
        this.healthScore = Math.max(0, Math.min(100, this.healthScore));

        let status = 'EXCELLENT';
        let emoji = '🟢';

        if (this.healthScore < 50) {
            status = 'CRITICAL';
            emoji = '🔴';
        } else if (this.healthScore < 70) {
            status = 'POOR';
            emoji = '🟠';
        } else if (this.healthScore < 85) {
            status = 'FAIR';
            emoji = '🟡';
        } else if (this.healthScore < 95) {
            status = 'GOOD';
            emoji = '🟢';
        }

        return { score: this.healthScore, status, emoji };
    }

    printResults() {
        console.log('\n' + '='.repeat(60));
        console.log('🏥 ARMORA PROJECT HEALTH CHECK RESULTS');
        console.log('='.repeat(60));

        // Individual checks
        console.log('\n📋 CHECKS:');
        this.checks.forEach(check => {
            const icon = check.status ? '✅' : '❌';
            const details = check.details ? ` (${check.details})` : '';
            console.log(`  ${icon} ${check.name}${details}`);
        });

        // Critical issues
        if (this.criticalIssues.length > 0) {
            console.log('\n🚨 CRITICAL ISSUES:');
            this.criticalIssues.forEach(issue => {
                console.log(`  🔴 ${issue}`);
            });
        }

        // Warnings
        if (this.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            this.warnings.forEach(warning => {
                console.log(`  🟡 ${warning}`);
            });
        }

        // Health score
        const health = this.generateHealthScore();
        console.log('\n' + '='.repeat(60));
        console.log(`${health.emoji} OVERALL HEALTH: ${health.score}/100 (${health.status})`);
        console.log('='.repeat(60));

        // Recommendations
        if (this.recommendations.length > 0) {
            console.log('\n💡 RECOMMENDATIONS:');
            this.recommendations.forEach((rec, index) => {
                console.log(`  ${index + 1}. ${rec}`);
            });
        }

        // Auto-suggestions for common issues
        if (this.criticalIssues.some(issue => issue.includes('ChunkLoadError')) ||
            this.warnings.some(warning => warning.includes('Stale cache'))) {
            console.log('\n🔧 AUTOMATIC FIX SUGGESTIONS:');
            console.log('  🚀 Run: npm run fresh    (cleans cache and starts fresh)');
            console.log('  🧹 Run: npm run clean    (deep clean all caches)');
            console.log('  ⚡ Run: PORT=3001 npm start    (use recommended port)');
        }

        if (health.score < 70) {
            console.log('\n❗ Consider running the project health fix: npm run fresh');
        }

        console.log('\n');
    }

    async run() {
        console.log('🏥 Starting Armora Project Health Check...\n');

        // Run all health checks
        this.checkEnvironment();
        this.checkDependencies();
        this.checkCacheDirectories();
        await this.checkPortAccessibility();
        this.checkProcesses();
        this.checkBuildHealth();

        // Print comprehensive results
        this.printResults();

        // Exit with appropriate code
        const health = this.generateHealthScore();
        process.exit(health.score < 50 ? 1 : 0);
    }
}

// Run health check if called directly
if (require.main === module) {
    const checker = new ArmoraHealthChecker();
    checker.run().catch(error => {
        console.error('❌ Health check failed:', error.message);
        process.exit(1);
    });
}

module.exports = ArmoraHealthChecker;