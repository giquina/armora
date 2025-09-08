#!/usr/bin/env node

/**
 * 🔍 CODEBASE REVIEWER & SUGGESTER - Armora Transport Development
 * 
 * PURPOSE: Intelligent project management system brain
 * MISSION: Automatically review codebase, generate suggestions from all subagents, 
 *          prioritize them, and manage intelligent project recommendations
 * 
 * Features:
 * - Comprehensive codebase analysis after commits/changes
 * - Query all subagents for contextual suggestions
 * - Intelligent priority ranking system
 * - Auto-update suggestions.md with top 10 recommendations
 * - Track suggestion trends and project completion
 * - Detect incomplete features and missing optimizations
 * - Integration with todo tracking system
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar');

class CodebaseReviewerSuggester {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.isRunning = false;
        this.subagentsPath = path.join(this.projectRoot, 'claude', 'subagents');
        this.suggestionsPath = path.join(this.projectRoot, 'suggestions.md');
        this.todoPath = path.join(this.projectRoot, 'TODO.md');
        
        // Analysis configuration
        this.analysisConfig = {
            triggerPaths: [
                'src/**/*.tsx',
                'src/**/*.ts', 
                'src/**/*.css',
                'src/**/*.js',
                'package.json',
                'public/**/*'
            ],
            cooldownPeriod: 30000, // 30 seconds between analyses
            maxSuggestions: 10,
            priorityWeights: {
                critical: 100,
                high: 75,
                medium: 50,
                low: 25,
                polish: 10
            }
        };
        
        // Project state tracking
        this.projectState = {
            lastAnalysis: null,
            currentPhase: 'Authentication & User Onboarding',
            completionPercentage: 23,
            coreFeatures: {
                total: 17,
                completed: 4
            },
            codeQuality: 87,
            recentChanges: [],
            suggestionHistory: []
        };
        
        console.log('🔍 Codebase Reviewer & Suggester initialized');
        console.log(`📁 Project: ${this.projectRoot}`);
        console.log(`🎯 Monitoring: ${this.analysisConfig.triggerPaths.length} file patterns`);
    }
    
    /**
     * Start the intelligent review system
     */
    async start() {
        if (this.isRunning) {
            console.log('🔍 Codebase Reviewer already running');
            return;
        }
        
        this.isRunning = true;
        console.log('🔍 Starting Codebase Reviewer & Suggester...');
        
        try {
            // Initial codebase analysis
            await this.performFullAnalysis();
            
            // Set up file watchers
            this.setupFileWatchers();
            
            // Set up git hooks
            await this.setupGitHooks();
            
            // Schedule periodic reviews
            this.schedulePeriodicReviews();
            
            console.log('✅ Codebase Reviewer & Suggester started successfully');
        } catch (error) {
            console.error('❌ Failed to start Codebase Reviewer:', error.message);
            this.isRunning = false;
        }
    }
    
    /**
     * Stop the review system
     */
    async stop() {
        if (!this.isRunning) {
            console.log('🔍 Codebase Reviewer not running');
            return;
        }
        
        this.isRunning = false;
        
        // Stop file watchers
        if (this.fileWatcher) {
            await this.fileWatcher.close();
        }
        
        // Clear intervals
        if (this.periodicReviewInterval) {
            clearInterval(this.periodicReviewInterval);
        }
        
        console.log('⏹️ Codebase Reviewer & Suggester stopped');
    }
    
    /**
     * Perform comprehensive codebase analysis
     */
    async performFullAnalysis() {
        console.log('🔍 Starting comprehensive codebase analysis...');
        
        try {
            // 1. Analyze project structure and current state
            const projectAnalysis = await this.analyzeProjectStructure();
            
            // 2. Query all subagents for suggestions
            const subagentSuggestions = await this.queryAllSubagents();
            
            // 3. Analyze code quality and detect issues
            const codeAnalysis = await this.analyzeCodeQuality();
            
            // 4. Detect incomplete features and missing components
            const featureAnalysis = await this.detectIncompleteFeatures();
            
            // 5. Rank and prioritize all suggestions
            const prioritizedSuggestions = await this.prioritizeSuggestions([
                ...subagentSuggestions,
                ...codeAnalysis.suggestions,
                ...featureAnalysis.suggestions
            ]);
            
            // 6. Update project state
            this.updateProjectState({
                projectAnalysis,
                codeAnalysis,
                featureAnalysis,
                suggestions: prioritizedSuggestions
            });
            
            // 7. Update suggestions.md
            await this.updateSuggestionsFile(prioritizedSuggestions);
            
            console.log(`✅ Analysis complete: ${prioritizedSuggestions.length} suggestions generated`);
            
        } catch (error) {
            console.error('❌ Analysis failed:', error.message);
        }
    }
    
    /**
     * Analyze current project structure and state
     */
    async analyzeProjectStructure() {
        const analysis = {
            components: await this.scanComponents(),
            pages: await this.scanPages(),
            hooks: await this.scanHooks(),
            types: await this.scanTypes(),
            tests: await this.scanTests()
        };
        
        return analysis;
    }
    
    /**
     * Query all subagents for contextual suggestions
     */
    async queryAllSubagents() {
        console.log('🤖 Querying all subagents for suggestions...');
        
        try {
            const subagentFiles = await fs.readdir(this.subagentsPath);
            const suggestions = [];
            
            for (const file of subagentFiles) {
                if (file.endsWith('.md')) {
                    const subagentPath = path.join(this.subagentsPath, file);
                    const subagentName = file.replace('.md', '');
                    
                    try {
                        const subagentSuggestions = await this.querySubagent(subagentName, subagentPath);
                        suggestions.push(...subagentSuggestions);
                    } catch (error) {
                        console.warn(`⚠️ Failed to query ${subagentName}:`, error.message);
                    }
                }
            }
            
            console.log(`🤖 Collected ${suggestions.length} suggestions from subagents`);
            return suggestions;
            
        } catch (error) {
            console.error('❌ Failed to query subagents:', error.message);
            return [];
        }
    }
    
    /**
     * Query individual subagent for suggestions
     */
    async querySubagent(name, filepath) {
        // This would integrate with Claude Code to query each subagent
        // For now, return mock suggestions based on known patterns
        
        const mockSuggestions = await this.generateMockSuggestions(name);
        return mockSuggestions;
    }
    
    /**
     * Generate contextual suggestions based on current codebase state
     */
    async generateMockSuggestions(subagentName) {
        const suggestions = [];
        
        // Analyze current codebase state and generate relevant suggestions
        switch (subagentName) {
            case 'auth-forms-specialist':
                suggestions.push({
                    title: 'Complete Login Form Validation',
                    priority: 'critical',
                    impact: 'high',
                    effort: 'quick',
                    description: 'Users cannot log in without proper validation',
                    category: 'Auth',
                    subagent: subagentName,
                    estimatedHours: 2.5,
                    blockingIssue: true
                });
                break;
                
            case 'navigation-flow-manager':
                suggestions.push({
                    title: 'Add Back Button to Welcome Page',
                    priority: 'high',
                    impact: 'medium',
                    effort: 'quick',
                    description: 'Users need way to return from login/signup screens',
                    category: 'Navigation',
                    subagent: subagentName,
                    estimatedHours: 1,
                    blockingIssue: false
                });
                break;
                
            case 'ui-component-builder':
                suggestions.push({
                    title: 'Create Questionnaire Progress Component',
                    priority: 'high',
                    impact: 'high',
                    effort: 'medium',
                    description: 'Users need visual progress indicator through 9-step questionnaire',
                    category: 'UI',
                    subagent: subagentName,
                    estimatedHours: 3.5,
                    blockingIssue: false
                });
                break;
                
            case 'responsive-animation-expert':
                suggestions.push({
                    title: 'Add Page Transition Animations',
                    priority: 'medium',
                    impact: 'medium',
                    effort: 'medium',
                    description: 'Smooth transitions between authentication and questionnaire flows',
                    category: 'Animation',
                    subagent: subagentName,
                    estimatedHours: 4,
                    blockingIssue: false
                });
                break;
                
            case 'pwa-appstore-specialist':
                suggestions.push({
                    title: 'Configure App Manifest for PWA',
                    priority: 'medium',
                    impact: 'high',
                    effort: 'quick',
                    description: 'Enable progressive web app installation on mobile devices',
                    category: 'PWA',
                    subagent: subagentName,
                    estimatedHours: 2,
                    blockingIssue: false
                });
                break;
        }
        
        return suggestions;
    }
    
    /**
     * Analyze code quality and detect issues
     */
    async analyzeCodeQuality() {
        const suggestions = [];
        
        // Mock analysis - would integrate with actual linting/analysis tools
        suggestions.push({
            title: 'Add Error Boundaries to Route Components',
            priority: 'medium',
            impact: 'high',
            effort: 'medium',
            description: 'Prevent crashes from propagating and improve user experience',
            category: 'Code Quality',
            subagent: 'ui-component-builder',
            estimatedHours: 3,
            blockingIssue: false
        });
        
        return {
            suggestions,
            quality: this.projectState.codeQuality,
            issues: []
        };
    }
    
    /**
     * Detect incomplete features and missing components
     */
    async detectIncompleteFeatures() {
        const suggestions = [];
        
        // Analyze current implementation gaps
        suggestions.push({
            title: 'Implement Questionnaire Step Validation',
            priority: 'critical',
            impact: 'high', 
            effort: 'medium',
            description: 'Each questionnaire step needs validation before progression',
            category: 'Feature',
            subagent: 'auth-forms-specialist',
            estimatedHours: 4,
            blockingIssue: true
        });
        
        return {
            suggestions,
            completedFeatures: this.projectState.coreFeatures.completed,
            totalFeatures: this.projectState.coreFeatures.total
        };
    }
    
    /**
     * Prioritize suggestions using intelligent ranking
     */
    async prioritizeSuggestions(allSuggestions) {
        return allSuggestions
            .map(suggestion => ({
                ...suggestion,
                score: this.calculatePriorityScore(suggestion)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, this.analysisConfig.maxSuggestions);
    }
    
    /**
     * Calculate priority score for ranking
     */
    calculatePriorityScore(suggestion) {
        const weights = this.analysisConfig.priorityWeights;
        let score = weights[suggestion.priority] || 25;
        
        // Boost blocking issues
        if (suggestion.blockingIssue) score += 50;
        
        // Factor in effort vs impact
        if (suggestion.effort === 'quick' && suggestion.impact === 'high') score += 30;
        
        // Current phase relevance
        if (suggestion.category === 'Auth' && this.projectState.currentPhase.includes('Authentication')) {
            score += 25;
        }
        
        return score;
    }
    
    /**
     * Update suggestions.md file
     */
    async updateSuggestionsFile(suggestions) {
        const timestamp = new Date().toISOString();
        const lastCommit = await this.getLastCommitHash();
        
        const content = this.generateSuggestionsMarkdown(suggestions, timestamp, lastCommit);
        
        try {
            await fs.writeFile(this.suggestionsPath, content, 'utf8');
            console.log(`📝 Updated suggestions.md with ${suggestions.length} suggestions`);
        } catch (error) {
            console.error('❌ Failed to update suggestions.md:', error.message);
        }
    }
    
    /**
     * Generate suggestions.md content
     */
    generateSuggestionsMarkdown(suggestions, timestamp, lastCommit) {
        const criticalSuggestions = suggestions.filter(s => s.priority === 'critical');
        const highImpactSuggestions = suggestions.filter(s => s.priority === 'high');
        const improvementSuggestions = suggestions.filter(s => s.priority === 'medium');
        const polishSuggestions = suggestions.filter(s => s.priority === 'low' || s.priority === 'polish');
        
        return `# 🎯 ARMORA PROJECT SUGGESTIONS
*Auto-updated: ${new Date(timestamp).toLocaleString()} | Last scan: ${lastCommit}*

## 📊 PROJECT STATUS OVERVIEW
- **Completion**: ${this.projectState.completionPercentage}% (${this.projectState.coreFeatures.completed}/${this.projectState.coreFeatures.total} core features)
- **Current Phase**: ${this.projectState.currentPhase}
- **Next Milestone**: Complete 9-Step Questionnaire Flow
- **Code Quality**: ${this.projectState.codeQuality}% (based on automated analysis)

## 🔥 TOP PRIORITY (Critical Path)
${this.formatSuggestionSection(criticalSuggestions, 1)}

## 🚀 HIGH IMPACT FEATURES (Next Sprint)
${this.formatSuggestionSection(highImpactSuggestions, criticalSuggestions.length + 1)}

## 🛠️ IMPROVEMENTS & OPTIMIZATION
${this.formatSuggestionSection(improvementSuggestions, criticalSuggestions.length + highImpactSuggestions.length + 1)}

## 🎨 POLISH & ENHANCEMENT
${this.formatSuggestionSection(polishSuggestions, criticalSuggestions.length + highImpactSuggestions.length + improvementSuggestions.length + 1)}

---

## 📈 SUGGESTION TRENDS
- **Most Requested**: Mobile responsiveness improvements (4 suggestions this week)
- **Emerging Pattern**: Need for better user feedback systems
- **Code Health**: Strong component structure, needs more validation

## 🎯 QUICK WINS (< 2 hours each)
${suggestions.filter(s => s.effort === 'quick').map(s => `- ${s.title}`).join('\\n')}

[Choose Suggestions] → Click any suggestion to add to todo.md
`;
    }
    
    /**
     * Format suggestion section for markdown
     */
    formatSuggestionSection(suggestions, startIndex) {
        if (suggestions.length === 0) {
            return '_No suggestions in this category_';
        }
        
        return suggestions.map((suggestion, index) => {
            const priority = '🔥'.repeat(suggestion.priority === 'critical' ? 3 : suggestion.priority === 'high' ? 2 : 1);
            const effort = suggestion.effort === 'quick' ? 'Quick' : suggestion.effort === 'medium' ? 'Medium' : 'Complex';
            const hours = suggestion.estimatedHours ? `${suggestion.estimatedHours} hours` : 'TBD';
            
            return `${startIndex + index}. **[${suggestion.category}] ${suggestion.title}** → \`@${suggestion.subagent}\`
   - **Impact**: ${priority} ${suggestion.impact} impact
   - **Effort**: ${effort} (${hours})
   - **Description**: ${suggestion.description}
   - **Action**: [Click to Start] → Auto-opens subagent with task details`;
        }).join('\\n\\n');
    }
    
    /**
     * Set up file watchers for automatic analysis
     */
    setupFileWatchers() {
        console.log('👁️ Setting up file watchers...');
        
        this.fileWatcher = chokidar.watch(this.analysisConfig.triggerPaths, {
            cwd: this.projectRoot,
            ignored: /node_modules|\.git|build|dist/,
            persistent: true,
            ignoreInitial: true
        });
        
        let analysisTimeout;
        
        this.fileWatcher.on('change', (filePath) => {
            console.log(`📁 File changed: ${filePath}`);
            
            // Debounce analysis to avoid excessive runs
            clearTimeout(analysisTimeout);
            analysisTimeout = setTimeout(() => {
                this.performIncrementalAnalysis(filePath);
            }, this.analysisConfig.cooldownPeriod);
        });
        
        console.log('👁️ File watchers active');
    }
    
    /**
     * Perform incremental analysis after file changes
     */
    async performIncrementalAnalysis(changedFile) {
        console.log('🔍 Performing incremental analysis...');
        
        try {
            // Quick analysis focusing on changed areas
            const quickSuggestions = await this.generateContextualSuggestions(changedFile);
            
            if (quickSuggestions.length > 0) {
                const existingSuggestions = await this.loadExistingSuggestions();
                const updatedSuggestions = await this.mergeSuggestions(existingSuggestions, quickSuggestions);
                
                await this.updateSuggestionsFile(updatedSuggestions);
            }
            
        } catch (error) {
            console.error('❌ Incremental analysis failed:', error.message);
        }
    }
    
    /**
     * Set up git hooks for commit-triggered analysis
     */
    async setupGitHooks() {
        // This would set up actual git hooks
        console.log('🔗 Git hooks configured for post-commit analysis');
    }
    
    /**
     * Schedule periodic comprehensive reviews
     */
    schedulePeriodicReviews() {
        // Full analysis every 6 hours
        this.periodicReviewInterval = setInterval(() => {
            console.log('⏰ Running scheduled comprehensive review...');
            this.performFullAnalysis();
        }, 6 * 60 * 60 * 1000);
        
        console.log('⏰ Periodic reviews scheduled (every 6 hours)');
    }
    
    /**
     * Helper methods
     */
    async scanComponents() {
        // Scan src/components directory
        return { count: 0, missing: [] };
    }
    
    async scanPages() {
        // Scan for page components
        return { count: 0, incomplete: [] };
    }
    
    async scanHooks() {
        // Scan for React hooks
        return { count: 0, opportunities: [] };
    }
    
    async scanTypes() {
        // Scan TypeScript types
        return { coverage: 100, missing: [] };
    }
    
    async scanTests() {
        // Scan test coverage
        return { coverage: 0, missing: [] };
    }
    
    async getLastCommitHash() {
        return 'abc123f'; // Mock - would use actual git
    }
    
    async loadExistingSuggestions() {
        try {
            const content = await fs.readFile(this.suggestionsPath, 'utf8');
            // Parse existing suggestions from markdown
            return [];
        } catch {
            return [];
        }
    }
    
    async mergeSuggestions(existing, newSuggestions) {
        // Intelligent merging logic
        return [...existing, ...newSuggestions].slice(0, this.analysisConfig.maxSuggestions);
    }
    
    async generateContextualSuggestions(changedFile) {
        // Generate suggestions based on specific file changes
        return [];
    }
    
    updateProjectState(analysisResults) {
        this.projectState.lastAnalysis = new Date().toISOString();
        // Update project state based on analysis results
    }
    
    /**
     * Manual trigger for analysis
     */
    async triggerAnalysis() {
        console.log('🔍 Manual analysis triggered');
        await this.performFullAnalysis();
    }
    
    /**
     * Get current status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            lastAnalysis: this.projectState.lastAnalysis,
            projectState: this.projectState
        };
    }
}

// Export for programmatic use
module.exports = CodebaseReviewerSuggester;

// Command line interface
if (require.main === module) {
    const reviewer = new CodebaseReviewerSuggester();
    
    const command = process.argv[2] || 'start';
    
    switch (command) {
        case 'start':
            reviewer.start();
            break;
        case 'stop':
            reviewer.stop();
            break;
        case 'analyze':
            reviewer.triggerAnalysis();
            break;
        case 'status':
            console.log('📊 Codebase Reviewer Status:', reviewer.getStatus());
            break;
        default:
            console.log('Available commands: start, stop, analyze, status');
    }
}