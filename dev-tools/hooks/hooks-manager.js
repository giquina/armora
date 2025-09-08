#!/usr/bin/env node

/**
 * 🎛️ HOOKS MANAGER - Armora Transport Development
 * 
 * PURPOSE: Central controller for all development hooks
 * MISSION: Streamline Armora Transport development with automated mobile-first tools
 * 
 * Features:
 * - Start/stop all hooks with single commands
 * - Monitor hook health and status
 * - Coordinate hook interactions
 * - Emergency stop functionality
 * - Beginner-friendly status dashboard
 * - Configuration management
 */

const path = require('path');
const { spawn } = require('child_process');

// Import hook classes
const AutoGithubSaver = require('./auto-github-saver');
const DevServerMonitor = require('./dev-server-monitor');
const MobileViewportTester = require('./mobile-viewport-tester');
const ArmoraBrandCompliance = require('./armora-brand-compliance');
const FileStructureOrganizer = require('./file-structure-organizer');
const CodebaseReviewerSuggester = require('./codebase-reviewer-suggester');
const SubagentManager = require('./subagent-manager');

class HooksManager {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.isRunning = false;
        this.hooks = new Map();
        this.processes = new Map();
        
        // Hook configurations
        this.hookConfigs = {
            'github-saver': {
                class: AutoGithubSaver,
                name: '🚀 Auto GitHub Saver',
                description: 'Automatically commits and pushes your work',
                critical: false,
                options: {
                    commitInterval: 5 * 60 * 1000 // 5 minutes
                }
            },
            'dev-server': {
                class: DevServerMonitor,
                name: '🖥️ Dev Server Monitor',
                description: 'Keeps development server running with mobile QR codes',
                critical: true,
                options: {}
            },
            'viewport-tester': {
                class: MobileViewportTester,
                name: '📱 Mobile Viewport Tester',
                description: 'CRITICAL: Tests all screen sizes and prevents horizontal scrolling',
                critical: true,
                options: {
                    serverPort: 3001
                }
            },
            'brand-compliance': {
                class: ArmoraBrandCompliance,
                name: '🎨 Brand Compliance Monitor',
                description: 'Enforces Armora colors and mobile standards',
                critical: true,
                options: {}
            },
            'file-organizer': {
                class: FileStructureOrganizer,
                name: '📁 File Structure Organizer',
                description: 'Keeps project files organized and properly named',
                critical: false,
                options: {}
            },
            'codebase-reviewer': {
                class: CodebaseReviewerSuggester,
                name: '🔍 AI Codebase Reviewer & Suggester',
                description: 'REVOLUTIONARY: AI brain that analyzes code and suggests next tasks',
                critical: true,
                options: {}
            },
            'subagent-manager': {
                class: SubagentManager,
                name: '🤖 Subagent Manager',
                description: 'Manages all subagents and coordinates suggestion generation',
                critical: true,
                options: {}
            }
        };
        
        console.log('🎛️ Hooks Manager initialized');
        console.log(`📁 Project: ${this.projectRoot}`);
        console.log(`🎣 Available hooks: ${Object.keys(this.hookConfigs).length}`);
    }
    
    /**
     * Show help information
     */
    showHelp() {
        console.log('\n🎛️ ARMORA HOOKS MANAGER HELP');
        console.log('═'.repeat(50));
        console.log('\n📚 Available Commands:');
        console.log('  npm run hooks:start     - Start all development hooks');
        console.log('  npm run hooks:stop      - Stop all hooks gracefully');
        console.log('  npm run hooks:status    - Show current status');
        console.log('  npm run hooks:restart   - Restart all hooks');
        console.log('  npm run hooks:emergency - Emergency stop (force kill)');
        
        console.log('\n🎣 Available Hooks:');
        for (const [name, config] of Object.entries(this.hookConfigs)) {
            console.log(`  ${config.name}`);
            console.log(`    ${config.description}`);
            if (config.critical) {
                console.log('    🚨 CRITICAL for mobile development');
            }
        }
        
        console.log('\n📱 Mobile Development Focus:');
        console.log('  • NO HORIZONTAL SCROLLING allowed');
        console.log('  • Touch-friendly design (44px+ buttons)');
        console.log('  • Armora brand compliance');
        console.log('  • Real-time mobile viewport testing');
        console.log('  • Automatic code organization');
        console.log('  • Continuous GitHub backup');
        
        console.log('\n🚨 Critical Hooks for Mobile:');
        console.log('  📱 Viewport Tester - Prevents horizontal scrolling');
        console.log('  🎨 Brand Compliance - Enforces mobile standards');
        console.log('  🖥️ Dev Server Monitor - Keeps development running');
        
        console.log('\n🧠 AI-Powered Development:');
        console.log('  🔍 AI Codebase Reviewer - Analyzes code and suggests improvements');
        console.log('  🤖 Subagent Manager - Coordinates AI suggestions from all specialists');
        console.log('  📝 Smart Todo Tracking - Never wonder what to work on next!');
        
        console.log('\n🎯 New AI Commands:');
        console.log('  npm run suggest - Generate AI suggestions for next tasks');
        console.log('  npm run select-suggestion <number> - Select and add to todo');
        console.log('  npm run task-status - View current task progress');
        console.log('\n═'.repeat(50));
    }
}

// Export for programmatic use
module.exports = HooksManager;

// Command line interface
if (require.main === module) {
    const manager = new HooksManager();
    
    const command = process.argv[2] || 'help';
    
    // Process command
    switch (command) {
        case 'help':
        default:
            manager.showHelp();
            break;
    }
}