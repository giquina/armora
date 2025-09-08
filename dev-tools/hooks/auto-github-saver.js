#!/usr/bin/env node

/**
 * 🚀 AUTO GITHUB SAVER HOOK - Armora Transport
 * 
 * PURPOSE: Automatically commits and pushes work to GitHub every 5-10 minutes
 * MOBILE FOCUS: Ensures mobile development work is continuously backed up
 * 
 * Features:
 * - Smart commit message generation based on changed files
 * - Ignores unnecessary files (node_modules, build, .DS_Store)
 * - Handles merge conflicts gracefully
 * - Creates .gitignore if missing
 * - Shows progress with beginner-friendly logging
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

class AutoGithubSaver {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.commitInterval = options.commitInterval || 5 * 60 * 1000; // 5 minutes
        this.isRunning = false;
        this.lastCommitHash = '';
        
        // Files to ignore (never commit these)
        this.ignorePatterns = [
            'node_modules/',
            'build/',
            'dist/',
            '.DS_Store',
            '.env',
            '*.log',
            'coverage/',
            '.nyc_output/',
            'tmp/',
            'temp/'
        ];
        
        console.log('🚀 Auto GitHub Saver initialized');
        console.log(`📁 Monitoring: ${this.projectRoot}`);
        console.log(`⏰ Commit interval: ${this.commitInterval / 1000 / 60} minutes`);
    }
    
    /**
     * Start the auto-save process
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️  Auto-saver is already running');
            return;
        }
        
        this.isRunning = true;
        console.log('✅ Starting Auto GitHub Saver...');
        
        // Initial setup
        this.ensureGitIgnore();
        this.checkGitStatus();
        
        // Start the commit cycle
        this.scheduleNextCommit();
    }
    
    /**
     * Stop the auto-save process
     */
    stop() {
        if (!this.isRunning) {
            console.log('⚠️  Auto-saver is not running');
            return;
        }
        
        this.isRunning = false;
        if (this.commitTimer) {
            clearTimeout(this.commitTimer);
        }
        console.log('🛑 Auto GitHub Saver stopped');
    }
    
    /**
     * Ensure .gitignore exists with mobile-dev friendly patterns
     */
    ensureGitIgnore() {
        const gitignorePath = path.join(this.projectRoot, '.gitignore');
        
        const defaultGitignore = `# Dependencies
node_modules/
/.pnp
.pnp.js

# Production builds
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov
.nyc_output/

# ESLint cache
.eslintcache

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Mobile development
ios/
android/
*.mobileprovision
*.p8
*.p12
*.key
*.crt

# Screenshots from mobile testing
screenshots/
device-screenshots/
`;

        if (!fs.existsSync(gitignorePath)) {
            fs.writeFileSync(gitignorePath, defaultGitignore);
            console.log('📝 Created .gitignore with mobile-dev friendly patterns');
        }
    }
    
    /**
     * Check current git status and repository health
     */
    async checkGitStatus() {
        try {
            // Check if we're in a git repository
            await this.execCommand('git rev-parse --git-dir');
            
            // Check for remote repository
            const remotes = await this.execCommand('git remote -v');
            if (!remotes.trim()) {
                console.log('⚠️  No remote repository found. Auto-push disabled.');
                return;
            }
            
            // Get current branch
            const branch = await this.execCommand('git rev-parse --abbrev-ref HEAD');
            console.log(`🌿 Current branch: ${branch.trim()}`);
            
            // Check if there are uncommitted changes
            const status = await this.execCommand('git status --porcelain');
            if (status.trim()) {
                console.log('📄 Found uncommitted changes - will commit on next cycle');
            } else {
                console.log('✨ Repository is clean');
            }
            
        } catch (error) {
            if (error.message.includes('not a git repository')) {
                console.log('❌ Not a git repository. Initializing...');
                await this.initializeGitRepo();
            } else {
                console.error('❌ Git status check failed:', error.message);
            }
        }
    }
    
    /**
     * Initialize git repository if not exists
     */
    async initializeGitRepo() {
        try {
            await this.execCommand('git init');
            console.log('🎉 Initialized new git repository');
            
            // Set default branch to main
            await this.execCommand('git branch -M main');
            console.log('🌿 Set default branch to main');
            
        } catch (error) {
            console.error('❌ Failed to initialize git repository:', error.message);
        }
    }
    
    /**
     * Schedule the next commit attempt
     */
    scheduleNextCommit() {
        if (!this.isRunning) return;
        
        this.commitTimer = setTimeout(async () => {
            await this.performCommitCycle();
            this.scheduleNextCommit(); // Schedule next cycle
        }, this.commitInterval);
    }
    
    /**
     * Perform a complete commit and push cycle
     */
    async performCommitCycle() {
        console.log('\n🔄 Starting commit cycle...');
        
        try {
            // Check for changes
            const status = await this.execCommand('git status --porcelain');
            if (!status.trim()) {
                console.log('✨ No changes to commit');
                return;
            }
            
            // Analyze changes and generate commit message
            const commitMessage = await this.generateCommitMessage(status);
            
            // Stage changes (excluding ignored patterns)
            await this.stageChanges();
            
            // Commit changes
            await this.execCommand(`git commit -m "${commitMessage}"`);
            console.log(`📝 Committed: ${commitMessage}`);
            
            // Push to remote (if exists)
            await this.pushToRemote();
            
        } catch (error) {
            console.error('❌ Commit cycle failed:', error.message);
            
            // Handle common issues
            if (error.message.includes('nothing to commit')) {
                console.log('✨ Nothing to commit (filtered out by ignore patterns)');
            } else if (error.message.includes('rejected')) {
                console.log('🔄 Pull latest changes and retry...');
                await this.handlePushRejection();
            }
        }
    }
    
    /**
     * Generate smart commit message based on changed files
     */
    async generateCommitMessage(status) {
        const changes = status.trim().split('\n');
        const fileTypes = {
            components: 0,
            styles: 0,
            hooks: 0,
            config: 0,
            mobile: 0,
            auth: 0,
            other: 0
        };
        
        const actions = {
            added: 0,
            modified: 0,
            deleted: 0
        };
        
        // Analyze each change
        changes.forEach(line => {
            const [action, , filename] = line.split(/\s+/);
            
            // Count actions
            if (action.includes('A')) actions.added++;
            if (action.includes('M')) actions.modified++;
            if (action.includes('D')) actions.deleted++;
            
            // Categorize files
            const lowerFile = filename.toLowerCase();
            if (lowerFile.includes('component') || lowerFile.endsWith('.tsx')) {
                fileTypes.components++;
            } else if (lowerFile.endsWith('.css') || lowerFile.endsWith('.scss')) {
                fileTypes.styles++;
            } else if (lowerFile.includes('hook')) {
                fileTypes.hooks++;
            } else if (lowerFile.includes('mobile') || lowerFile.includes('responsive')) {
                fileTypes.mobile++;
            } else if (lowerFile.includes('auth') || lowerFile.includes('login')) {
                fileTypes.auth++;
            } else if (lowerFile.includes('config') || lowerFile.includes('.json')) {
                fileTypes.config++;
            } else {
                fileTypes.other++;
            }
        });
        
        // Generate contextual commit message
        let message = '🚀 Auto-save: ';
        
        if (fileTypes.components > 0) {
            message += `Update ${fileTypes.components} component${fileTypes.components > 1 ? 's' : ''}`;
        } else if (fileTypes.auth > 0) {
            message += 'Improve authentication flow';
        } else if (fileTypes.mobile > 0) {
            message += 'Enhance mobile experience';
        } else if (fileTypes.styles > 0) {
            message += 'Update styling and responsive design';
        } else if (fileTypes.hooks > 0) {
            message += 'Update development hooks';
        } else if (fileTypes.config > 0) {
            message += 'Update configuration';
        } else {
            message += 'Update application code';
        }
        
        // Add change summary
        const changeSummary = [];
        if (actions.added > 0) changeSummary.push(`+${actions.added}`);
        if (actions.modified > 0) changeSummary.push(`~${actions.modified}`);
        if (actions.deleted > 0) changeSummary.push(`-${actions.deleted}`);
        
        if (changeSummary.length > 0) {
            message += ` (${changeSummary.join(', ')})`;
        }
        
        return message;
    }
    
    /**
     * Stage changes while respecting ignore patterns
     */
    async stageChanges() {
        // Add all changes
        await this.execCommand('git add .');
        
        // Remove ignored files if they were accidentally added
        for (const pattern of this.ignorePatterns) {
            try {
                await this.execCommand(`git reset HEAD ${pattern}`);
            } catch (error) {
                // Ignore errors (file might not exist)
            }
        }
    }
    
    /**
     * Push changes to remote repository
     */
    async pushToRemote() {
        try {
            // Check if we have a remote
            const remotes = await this.execCommand('git remote');
            if (!remotes.trim()) {
                console.log('ℹ️  No remote repository configured - skipping push');
                return;
            }
            
            // Get current branch
            const branch = await this.execCommand('git rev-parse --abbrev-ref HEAD');
            
            // Push to remote
            await this.execCommand(`git push origin ${branch.trim()}`);
            console.log('🚀 Pushed to remote repository');
            
        } catch (error) {
            if (error.message.includes('has no upstream branch')) {
                // Set upstream and push
                const branch = await this.execCommand('git rev-parse --abbrev-ref HEAD');
                await this.execCommand(`git push -u origin ${branch.trim()}`);
                console.log('🚀 Set upstream and pushed to remote');
            } else {
                throw error;
            }
        }
    }
    
    /**
     * Handle push rejection (usually due to remote changes)
     */
    async handlePushRejection() {
        try {
            // Pull latest changes
            await this.execCommand('git pull --rebase');
            console.log('🔄 Pulled latest changes with rebase');
            
            // Try pushing again
            await this.pushToRemote();
            
        } catch (error) {
            console.error('❌ Failed to resolve push rejection:', error.message);
            console.log('🛠️  Manual intervention may be required');
        }
    }
    
    /**
     * Execute shell command with promise
     */
    execCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { cwd: this.projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve(stdout);
                }
            });
        });
    }
    
    /**
     * Get current status for external monitoring
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            projectRoot: this.projectRoot,
            commitInterval: this.commitInterval,
            lastCommitHash: this.lastCommitHash
        };
    }
}

// Export for use in hooks manager
module.exports = AutoGithubSaver;

// If run directly, start the hook
if (require.main === module) {
    const saver = new AutoGithubSaver();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Received shutdown signal');
        saver.stop();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Received termination signal');
        saver.stop();
        process.exit(0);
    });
    
    // Start the auto-saver
    saver.start();
    
    console.log('✅ Auto GitHub Saver is running');
    console.log('📝 Press Ctrl+C to stop');
}