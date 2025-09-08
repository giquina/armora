#!/usr/bin/env node

/**
 * 🤖 SUBAGENT MANAGER - Armora Transport Development
 * 
 * PURPOSE: Automatically discover and integrate new subagents for suggestion system
 * MISSION: Scalable architecture that works with unlimited future subagents
 * 
 * Features:
 * - Auto-discover subagents in /claude/subagents/ folder
 * - Register new subagents automatically
 * - Query all subagents for suggestions when codebase review runs
 * - Track which subagents contribute most valuable suggestions
 * - Scale seamlessly with new subagents (no manual registration)
 * - Smart load balancing for suggestion queries
 */

const fs = require('fs').promises;
const path = require('path');

class SubagentManager {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.subagentsPath = path.join(this.projectRoot, 'dev-tools', 'subagents');
        this.isRunning = false;
        
        // Registered subagents registry
        this.subagents = new Map();
        
        // Performance tracking
        this.suggestionStats = {
            totalQueries: 0,
            successfulQueries: 0,
            failedQueries: 0,
            averageResponseTime: 0,
            subagentPerformance: new Map()
        };
        
        console.log('🤖 Subagent Manager initialized');
        console.log(`📁 Subagents path: ${this.subagentsPath}`);
    }
    
    /**
     * Start the subagent management system
     */
    async start() {
        if (this.isRunning) {
            console.log('🤖 Subagent Manager already running');
            return;
        }
        
        this.isRunning = true;
        console.log('🤖 Starting Subagent Manager...');
        
        try {
            // Discover and register all subagents
            await this.discoverSubagents();
            
            // Set up file watcher for new subagents
            await this.setupSubagentWatcher();
            
            console.log(`✅ Subagent Manager started with ${this.subagents.size} subagents`);
            
        } catch (error) {
            console.error('❌ Failed to start Subagent Manager:', error.message);
            this.isRunning = false;
        }
    }
    
    /**
     * Stop the subagent management system
     */
    async stop() {
        if (!this.isRunning) {
            console.log('🤖 Subagent Manager not running');
            return;
        }
        
        this.isRunning = false;
        
        // Stop file watcher
        if (this.subagentWatcher) {
            await this.subagentWatcher.close();
        }
        
        console.log('⏹️ Subagent Manager stopped');
    }
    
    /**
     * Discover all subagents in the subagents directory
     */
    async discoverSubagents() {
        console.log('🔍 Discovering subagents...');
        
        try {
            // Check if subagents directory exists
            try {
                await fs.access(this.subagentsPath);
            } catch (error) {
                console.warn(`⚠️ Subagents directory not found: ${this.subagentsPath}`);
                return;
            }
            
            const files = await fs.readdir(this.subagentsPath);
            const subagentFiles = files.filter(file => file.endsWith('.md'));
            
            console.log(`📂 Found ${subagentFiles.length} potential subagents`);
            
            for (const file of subagentFiles) {
                await this.registerSubagent(file);
            }
            
        } catch (error) {
            console.error('❌ Error discovering subagents:', error.message);
        }
    }
    
    /**
     * Register a single subagent
     */
    async registerSubagent(filename) {
        try {
            const filePath = path.join(this.subagentsPath, filename);
            const content = await fs.readFile(filePath, 'utf8');
            
            // Parse subagent metadata
            const subagent = this.parseSubagentMetadata(filename, content);
            
            if (subagent) {
                this.subagents.set(subagent.id, subagent);
                console.log(`🔌 Registered subagent: ${subagent.name} (${subagent.id})`);
            }
            
        } catch (error) {
            console.warn(`⚠️ Failed to register subagent ${filename}:`, error.message);
        }
    }
    
    /**
     * Parse subagent metadata from markdown file
     */
    parseSubagentMetadata(filename, content) {
        const id = filename.replace('.md', '');
        
        // Extract title (first # heading)
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const name = titleMatch ? titleMatch[1] : id;
        
        // Check if subagent has suggestion mode
        const hasSuggestionMode = content.includes('## 🔍 SUGGESTION MODE');
        
        // Extract role definition
        const roleMatch = content.match(/##\s+🎯?\s*Role Definition\s*\n(.*?)(?=\n##|\n$)/s);
        const description = roleMatch ? roleMatch[1].trim() : 'No description available';
        
        // Extract expertise areas
        const expertiseMatch = content.match(/##\s+🎯\s*My Expertise\s*\n(.*?)(?=\n##|\n$)/s);
        const expertise = expertiseMatch ? this.extractListItems(expertiseMatch[1]) : [];
        
        return {
            id,
            name,
            filename,
            description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
            expertise,
            hasSuggestionMode,
            lastQueried: null,
            performanceScore: 1.0,
            totalQueries: 0,
            successfulQueries: 0,
            averageResponseTime: 0
        };
    }
    
    /**
     * Extract list items from markdown text
     */
    extractListItems(text) {
        const lines = text.split('\n');
        const items = [];
        
        for (const line of lines) {
            const match = line.match(/^[-*+]\s+\*\*(.+?)\*\*/);
            if (match) {
                items.push(match[1]);
            }
        }
        
        return items;
    }
    
    /**
     * Set up file watcher for automatic subagent discovery
     */
    async setupSubagentWatcher() {
        // Note: This would use chokidar in a real implementation
        // For now, we'll implement a simple polling mechanism
        
        setInterval(async () => {
            if (!this.isRunning) return;
            
            try {
                const files = await fs.readdir(this.subagentsPath);
                const subagentFiles = files.filter(file => file.endsWith('.md'));
                
                // Check for new subagents
                for (const file of subagentFiles) {
                    const id = file.replace('.md', '');
                    if (!this.subagents.has(id)) {
                        console.log(`🆕 New subagent detected: ${file}`);
                        await this.registerSubagent(file);
                    }
                }
                
                // Check for removed subagents
                for (const [id, subagent] of this.subagents) {
                    if (!subagentFiles.includes(subagent.filename)) {
                        console.log(`🗑️ Subagent removed: ${subagent.filename}`);
                        this.subagents.delete(id);
                    }
                }
                
            } catch (error) {
                // Silently ignore errors during polling
            }
        }, 30000); // Check every 30 seconds
    }
    
    /**
     * Query all subagents for suggestions
     */
    async queryAllSubagentsForSuggestions(codebaseContext) {
        console.log('🤖 Querying all subagents for suggestions...');
        
        const suggestions = [];
        const startTime = Date.now();
        
        const subagentsWithSuggestions = Array.from(this.subagents.values())
            .filter(subagent => subagent.hasSuggestionMode);
        
        console.log(`📞 Querying ${subagentsWithSuggestions.length} subagents with suggestion capability`);
        
        // Query subagents in parallel for better performance
        const queryPromises = subagentsWithSuggestions.map(subagent => 
            this.querySubagentForSuggestions(subagent, codebaseContext)
        );
        
        const results = await Promise.allSettled(queryPromises);
        
        // Process results
        results.forEach((result, index) => {
            const subagent = subagentsWithSuggestions[index];
            
            if (result.status === 'fulfilled') {
                suggestions.push(...result.value);
                this.updateSubagentPerformance(subagent.id, true, Date.now() - startTime);
                subagent.successfulQueries++;
            } else {
                console.warn(`⚠️ Failed to query ${subagent.id}:`, result.reason);
                this.updateSubagentPerformance(subagent.id, false, Date.now() - startTime);
            }
            
            subagent.totalQueries++;
            subagent.lastQueried = new Date().toISOString();
        });
        
        this.suggestionStats.totalQueries += subagentsWithSuggestions.length;
        this.suggestionStats.successfulQueries += results.filter(r => r.status === 'fulfilled').length;
        this.suggestionStats.failedQueries += results.filter(r => r.status === 'rejected').length;
        
        const totalTime = Date.now() - startTime;
        this.suggestionStats.averageResponseTime = 
            (this.suggestionStats.averageResponseTime + totalTime) / 2;
        
        console.log(`✅ Collected ${suggestions.length} suggestions from subagents`);
        return suggestions;
    }
    
    /**
     * Query a specific subagent for suggestions
     */
    async querySubagentForSuggestions(subagent, codebaseContext) {
        const startTime = Date.now();
        
        try {
            // This would integrate with Claude Code to actually query the subagent
            // For now, we'll return mock suggestions based on the subagent's expertise
            const suggestions = await this.generateMockSuggestions(subagent, codebaseContext);
            
            const responseTime = Date.now() - startTime;
            console.log(`📝 ${subagent.id} provided ${suggestions.length} suggestions (${responseTime}ms)`);
            
            return suggestions;
            
        } catch (error) {
            console.error(`❌ Error querying ${subagent.id}:`, error.message);
            throw error;
        }
    }
    
    /**
     * Generate mock suggestions based on subagent expertise
     */
    async generateMockSuggestions(subagent, codebaseContext) {
        const suggestions = [];
        
        // Generate contextual suggestions based on subagent type
        switch (subagent.id) {
            case 'ui-component-builder':
                suggestions.push({
                    title: 'Create Reusable Button Component',
                    priority: 'high',
                    impact: 'high',
                    effort: 'quick',
                    description: 'Build consistent button component with Armora branding',
                    category: 'UI',
                    subagent: subagent.id,
                    estimatedHours: 2,
                    blockingIssue: false,
                    tags: ['component', 'branding', 'consistency']
                });
                break;
                
            case 'auth-forms-specialist':
                suggestions.push({
                    title: 'Add Form Input Validation',
                    priority: 'critical',
                    impact: 'high',
                    effort: 'medium',
                    description: 'Implement proper validation for all form inputs',
                    category: 'Auth',
                    subagent: subagent.id,
                    estimatedHours: 3,
                    blockingIssue: true,
                    tags: ['validation', 'security', 'forms']
                });
                break;
                
            case 'navigation-flow-manager':
                suggestions.push({
                    title: 'Implement Bottom Navigation',
                    priority: 'medium',
                    impact: 'high',
                    effort: 'medium',
                    description: 'Add mobile-friendly bottom navigation bar',
                    category: 'Navigation',
                    subagent: subagent.id,
                    estimatedHours: 4,
                    blockingIssue: false,
                    tags: ['navigation', 'mobile', 'ux']
                });
                break;
                
            case 'responsive-animation-expert':
                suggestions.push({
                    title: 'Add Loading Animations',
                    priority: 'medium',
                    impact: 'medium',
                    effort: 'quick',
                    description: 'Create smooth loading animations for better UX',
                    category: 'Animation',
                    subagent: subagent.id,
                    estimatedHours: 2,
                    blockingIssue: false,
                    tags: ['animation', 'loading', 'ux']
                });
                break;
                
            case 'pwa-appstore-specialist':
                suggestions.push({
                    title: 'Setup PWA Manifest',
                    priority: 'medium',
                    impact: 'high',
                    effort: 'quick',
                    description: 'Configure web app manifest for PWA installation',
                    category: 'PWA',
                    subagent: subagent.id,
                    estimatedHours: 1.5,
                    blockingIssue: false,
                    tags: ['pwa', 'installation', 'mobile']
                });
                break;
        }
        
        // Add timestamp and source tracking
        suggestions.forEach(suggestion => {
            suggestion.generatedAt = new Date().toISOString();
            suggestion.source = 'subagent-manager';
            suggestion.confidence = this.calculateSuggestionConfidence(subagent, suggestion);
        });
        
        return suggestions;
    }
    
    /**
     * Calculate confidence score for a suggestion
     */
    calculateSuggestionConfidence(subagent, suggestion) {
        let confidence = 0.8; // Base confidence
        
        // Adjust based on subagent performance history
        confidence *= subagent.performanceScore;
        
        // Adjust based on expertise match
        const expertiseMatch = subagent.expertise.some(expertise => 
            suggestion.tags.some(tag => 
                expertise.toLowerCase().includes(tag.toLowerCase())
            )
        );
        
        if (expertiseMatch) {
            confidence += 0.1;
        }
        
        // Adjust based on suggestion priority
        if (suggestion.priority === 'critical') {
            confidence += 0.05;
        }
        
        return Math.min(1.0, confidence);
    }
    
    /**
     * Update subagent performance metrics
     */
    updateSubagentPerformance(subagentId, success, responseTime) {
        const subagent = this.subagents.get(subagentId);
        if (!subagent) return;
        
        // Update performance score (weighted average)
        const successWeight = success ? 1.0 : 0.5;
        subagent.performanceScore = 
            (subagent.performanceScore * 0.9) + (successWeight * 0.1);
        
        // Update average response time
        subagent.averageResponseTime = 
            (subagent.averageResponseTime + responseTime) / 2;
        
        // Update global stats
        if (!this.suggestionStats.subagentPerformance.has(subagentId)) {
            this.suggestionStats.subagentPerformance.set(subagentId, {
                totalQueries: 0,
                successfulQueries: 0,
                averageResponseTime: 0,
                performanceScore: 1.0
            });
        }
        
        const stats = this.suggestionStats.subagentPerformance.get(subagentId);
        stats.totalQueries++;
        if (success) stats.successfulQueries++;
        stats.averageResponseTime = (stats.averageResponseTime + responseTime) / 2;
        stats.performanceScore = subagent.performanceScore;
    }
    
    /**
     * Get all registered subagents
     */
    getAllSubagents() {
        return Array.from(this.subagents.values());
    }
    
    /**
     * Get subagents with suggestion capability
     */
    getSuggestionCapableSubagents() {
        return Array.from(this.subagents.values())
            .filter(subagent => subagent.hasSuggestionMode);
    }
    
    /**
     * Get subagent by ID
     */
    getSubagent(id) {
        return this.subagents.get(id);
    }
    
    /**
     * Get performance statistics
     */
    getPerformanceStats() {
        return {
            ...this.suggestionStats,
            registeredSubagents: this.subagents.size,
            suggestionCapableSubagents: this.getSuggestionCapableSubagents().length,
            subagentDetails: Array.from(this.subagents.values()).map(subagent => ({
                id: subagent.id,
                name: subagent.name,
                hasSuggestionMode: subagent.hasSuggestionMode,
                performanceScore: subagent.performanceScore,
                totalQueries: subagent.totalQueries,
                successfulQueries: subagent.successfulQueries,
                averageResponseTime: subagent.averageResponseTime,
                lastQueried: subagent.lastQueried
            }))
        };
    }
    
    /**
     * Get current status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            subagentsPath: this.subagentsPath,
            registeredSubagents: this.subagents.size,
            suggestionCapableSubagents: this.getSuggestionCapableSubagents().length,
            performanceStats: this.getPerformanceStats()
        };
    }
}

// Export for programmatic use
module.exports = SubagentManager;

// Command line interface
if (require.main === module) {
    const manager = new SubagentManager();
    
    const command = process.argv[2] || 'start';
    
    switch (command) {
        case 'start':
            manager.start();
            break;
        case 'stop':
            manager.stop();
            break;
        case 'status':
            console.log('🤖 Subagent Manager Status:', JSON.stringify(manager.getStatus(), null, 2));
            break;
        case 'list':
            const subagents = manager.getAllSubagents();
            console.log('📋 Registered Subagents:');
            subagents.forEach(subagent => {
                console.log(`  ${subagent.id} - ${subagent.name}`);
                console.log(`    Suggestion Mode: ${subagent.hasSuggestionMode ? '✅' : '❌'}`);
                console.log(`    Performance Score: ${subagent.performanceScore.toFixed(2)}`);
            });
            break;
        case 'stats':
            console.log('📊 Performance Statistics:', JSON.stringify(manager.getPerformanceStats(), null, 2));
            break;
        default:
            console.log('Available commands: start, stop, status, list, stats');
    }
}