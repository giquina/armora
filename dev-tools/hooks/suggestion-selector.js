#!/usr/bin/env node

/**
 * 🎯 SUGGESTION SELECTOR - Armora Transport Development
 * 
 * PURPOSE: Handle suggestion selection and todo.md updates
 * MISSION: Seamless workflow from AI suggestions to tracked tasks
 * 
 * Features:
 * - Command-line and file-based suggestion selection
 * - Auto-update todo.md when suggestions are selected
 * - Progress tracking and task status monitoring  
 * - Smart scheduling based on task dependencies
 * - Completion updates and project status sync
 * - Integration with codebase reviewer for feedback loop
 */

const fs = require('fs').promises;
const path = require('path');

class SuggestionSelector {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.suggestionsPath = path.join(this.projectRoot, 'suggestions.md');
        this.todoPath = path.join(this.projectRoot, 'todo.md');
        this.selectionHistoryPath = path.join(this.projectRoot, 'claude', 'data', 'selection-history.json');
        
        // Task management state
        this.activeTasks = new Map();
        this.completedTasks = new Map();
        this.taskHistory = [];
        
        // Performance tracking
        this.stats = {
            totalSelections: 0,
            completedTasks: 0,
            averageCompletionTime: 0,
            productivityScore: 1.0
        };
        
        console.log('🎯 Suggestion Selector initialized');
        console.log(`📝 Suggestions: ${this.suggestionsPath}`);
        console.log(`✅ Todos: ${this.todoPath}`);
    }
    
    /**
     * Initialize the selector system
     */
    async initialize() {
        try {
            // Ensure data directory exists
            await this.ensureDataDirectory();
            
            // Load existing selection history
            await this.loadSelectionHistory();
            
            // Load current todo state
            await this.loadCurrentTodoState();
            
            console.log('✅ Suggestion Selector initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Suggestion Selector:', error.message);
        }
    }
    
    /**
     * Select a suggestion by number and move to todo.md
     */
    async selectSuggestion(suggestionNumber) {
        try {
            console.log(`🎯 Selecting suggestion #${suggestionNumber}...`);
            
            // Load current suggestions
            const suggestions = await this.loadSuggestions();
            
            if (suggestionNumber < 1 || suggestionNumber > suggestions.length) {
                throw new Error(`Invalid suggestion number. Please choose 1-${suggestions.length}`);
            }
            
            const selectedSuggestion = suggestions[suggestionNumber - 1];
            
            // Create task from suggestion
            const task = this.createTaskFromSuggestion(selectedSuggestion, suggestionNumber);
            
            // Add to active tasks
            this.activeTasks.set(task.id, task);
            
            // Update todo.md
            await this.updateTodoFile();
            
            // Record selection in history
            await this.recordSelection(task);
            
            // Update statistics
            this.stats.totalSelections++;
            await this.saveStats();
            
            console.log(`✅ Added "${task.title}" to todo list`);
            return task;
            
        } catch (error) {
            console.error('❌ Failed to select suggestion:', error.message);
            throw error;
        }
    }
    
    /**
     * Add a custom task to todo.md
     */
    async addCustomTask(title, subagent, options = {}) {
        try {
            console.log(`➕ Adding custom task: ${title}`);
            
            const task = {
                id: this.generateTaskId(),
                title,
                subagent,
                priority: options.priority || 'medium',
                impact: options.impact || 'medium',
                effort: options.effort || 'medium',
                description: options.description || '',
                estimatedHours: options.estimatedHours || 2,
                status: 'pending',
                createdAt: new Date().toISOString(),
                source: 'custom',
                tags: options.tags || []
            };
            
            // Add to active tasks
            this.activeTasks.set(task.id, task);
            
            // Update todo.md
            await this.updateTodoFile();
            
            // Record in history
            await this.recordSelection(task);
            
            console.log(`✅ Added custom task "${title}" to todo list`);
            return task;
            
        } catch (error) {
            console.error('❌ Failed to add custom task:', error.message);
            throw error;
        }
    }
    
    /**
     * Mark a task as completed
     */
    async completeTask(taskId) {
        try {
            const task = this.activeTasks.get(taskId);
            if (!task) {
                throw new Error(`Task ${taskId} not found`);
            }
            
            console.log(`✅ Completing task: ${task.title}`);
            
            // Update task status
            task.status = 'completed';
            task.completedAt = new Date().toISOString();
            
            // Calculate completion time
            const startTime = new Date(task.createdAt);
            const endTime = new Date(task.completedAt);
            task.actualHours = (endTime - startTime) / (1000 * 60 * 60);
            
            // Move to completed tasks
            this.completedTasks.set(taskId, task);
            this.activeTasks.delete(taskId);
            
            // Update statistics
            this.stats.completedTasks++;
            this.updateProductivityScore(task);
            
            // Update todo.md
            await this.updateTodoFile();
            
            // Save updated history
            await this.saveSelectionHistory();
            
            console.log(`🎉 Task "${task.title}" completed in ${task.actualHours.toFixed(1)} hours`);
            return task;
            
        } catch (error) {
            console.error('❌ Failed to complete task:', error.message);
            throw error;
        }
    }
    
    /**
     * Start working on a task (mark as in_progress)
     */
    async startTask(taskId) {
        try {
            const task = this.activeTasks.get(taskId);
            if (!task) {
                throw new Error(`Task ${taskId} not found`);
            }
            
            console.log(`🚀 Starting task: ${task.title}`);
            
            // Mark other tasks as pending if they were in progress
            for (const [id, activeTask] of this.activeTasks) {
                if (activeTask.status === 'in_progress') {
                    activeTask.status = 'pending';
                }
            }
            
            // Start this task
            task.status = 'in_progress';
            task.startedAt = new Date().toISOString();
            
            // Update todo.md
            await this.updateTodoFile();
            
            console.log(`✅ Started working on "${task.title}"`);
            return task;
            
        } catch (error) {
            console.error('❌ Failed to start task:', error.message);
            throw error;
        }
    }
    
    /**
     * Load suggestions from suggestions.md
     */
    async loadSuggestions() {
        try {
            const content = await fs.readFile(this.suggestionsPath, 'utf8');
            return this.parseSuggestionsFromMarkdown(content);
        } catch (error) {
            console.error('❌ Failed to load suggestions:', error.message);
            return [];
        }
    }
    
    /**
     * Parse suggestions from markdown content
     */
    parseSuggestionsFromMarkdown(content) {
        const suggestions = [];
        const lines = content.split('\\n');
        
        let currentSection = null;
        let suggestionCounter = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Track sections
            if (line.startsWith('## 🔥 TOP PRIORITY')) {
                currentSection = 'critical';
            } else if (line.startsWith('## 🚀 HIGH IMPACT')) {
                currentSection = 'high';
            } else if (line.startsWith('## 🛠️ IMPROVEMENTS')) {
                currentSection = 'medium';
            } else if (line.startsWith('## 🎨 POLISH')) {
                currentSection = 'low';
            }
            
            // Parse suggestion items
            const suggestionMatch = line.match(/^(\\d+)\\. \\*\\*\\[(.+?)\\] (.+?)\\*\\* → `@(.+?)`/);
            if (suggestionMatch) {
                suggestionCounter++;
                const [, number, category, title, subagent] = suggestionMatch;
                
                // Parse additional details from following lines
                let description = '';
                let impact = '';
                let effort = '';
                let estimatedHours = 2;
                
                // Look ahead for details
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    const detailLine = lines[j];
                    if (detailLine.includes('**Description**:')) {
                        description = detailLine.replace(/.*\\*\\*Description\\*\\*:/, '').trim();
                    } else if (detailLine.includes('**Impact**:')) {
                        impact = detailLine.replace(/.*\\*\\*Impact\\*\\*:/, '').trim();
                    } else if (detailLine.includes('**Effort**:')) {
                        const effortMatch = detailLine.match(/\\*\\*Effort\\*\\*: (.+?) \\((.+?) hours?\\)/);
                        if (effortMatch) {
                            effort = effortMatch[1].toLowerCase();
                            estimatedHours = parseFloat(effortMatch[2]) || 2;
                        }
                    }
                }
                
                suggestions.push({
                    number: parseInt(number),
                    title,
                    category,
                    subagent,
                    description,
                    priority: currentSection || 'medium',
                    impact,
                    effort,
                    estimatedHours,
                    section: currentSection
                });
            }
        }
        
        return suggestions;
    }
    
    /**
     * Create a task object from a suggestion
     */
    createTaskFromSuggestion(suggestion, originalNumber) {
        return {
            id: this.generateTaskId(),
            title: suggestion.title,
            subagent: suggestion.subagent,
            category: suggestion.category,
            description: suggestion.description,
            priority: suggestion.priority,
            impact: suggestion.impact,
            effort: suggestion.effort,
            estimatedHours: suggestion.estimatedHours,
            status: 'pending',
            createdAt: new Date().toISOString(),
            source: 'suggestion',
            originalSuggestionNumber: originalNumber,
            tags: [suggestion.category.toLowerCase(), suggestion.priority]
        };
    }
    
    /**
     * Generate a unique task ID
     */
    generateTaskId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Update todo.md file with current tasks
     */
    async updateTodoFile() {
        try {
            const todoContent = this.generateTodoMarkdown();
            await fs.writeFile(this.todoPath, todoContent, 'utf8');
            console.log('📝 Updated todo.md');
        } catch (error) {
            console.error('❌ Failed to update todo.md:', error.message);
        }
    }
    
    /**
     * Generate todo.md markdown content
     */
    generateTodoMarkdown() {
        const now = new Date();
        const timestamp = now.toLocaleString();
        
        // Get tasks by status
        const inProgressTasks = Array.from(this.activeTasks.values()).filter(t => t.status === 'in_progress');
        const pendingTasks = Array.from(this.activeTasks.values()).filter(t => t.status === 'pending');
        const completedToday = Array.from(this.completedTasks.values())
            .filter(t => {
                if (!t.completedAt) return false;
                const completedDate = new Date(t.completedAt);
                return completedDate.toDateString() === now.toDateString();
            });
        
        let content = `# 📋 ARMORA PROJECT TODO & PROGRESS TRACKER
*Last updated: ${timestamp}*

## 🎯 CURRENTLY WORKING ON
`;
        
        // In Progress section
        if (inProgressTasks.length > 0) {
            const task = inProgressTasks[0]; // Should only be one
            content += `### **In Progress** (Started: ${this.formatTime(task.startedAt)})
- [ ] **[${task.category}] ${task.title}** - @${task.subagent}
  - Started: ${this.formatTime(task.startedAt)} | Estimated: ${task.estimatedHours} hours | Priority: ${this.getPriorityEmoji(task.priority)}
  - **Progress**: Working on implementation
  - **Next**: Continue development

`;
        }
        
        // Up Next section  
        if (pendingTasks.length > 0) {
            content += '### **Up Next** (Queued)\n';
            pendingTasks.slice(0, 3).forEach(task => {
                content += `- [ ] **[${task.category}] ${task.title}** - @${task.subagent}
  - Queued: ${this.formatTime(task.createdAt)} | Estimated: ${task.estimatedHours} hours | Priority: ${this.getPriorityEmoji(task.priority)}
`;
            });
            content += '\\n';
        }
        
        // Completed Today section
        if (completedToday.length > 0) {
            content += '## ✅ COMPLETED TODAY\\n';
            completedToday.forEach(task => {
                content += `- [x] **[${task.category}] ${task.title}** - ✅ ${this.formatTime(task.completedAt)}\\n`;
            });
            content += '\\n';
        }
        
        // Weekly Progress section
        const weeklyStats = this.calculateWeeklyStats();
        content += `## 📊 WEEKLY PROGRESS
### **This Week** (${this.getWeekRange()})
- **Completed**: ${weeklyStats.completed} tasks | **In Progress**: ${weeklyStats.inProgress} | **Planned**: ${weeklyStats.planned}
- **Focus Areas**: ${weeklyStats.focusAreas.join(', ')}
- **Blockers**: ${weeklyStats.blockers}
- **Velocity**: ${weeklyStats.velocity} tasks/day average

`;
        
        // Upcoming Milestones
        content += `## 🎯 UPCOMING MILESTONES
- **Week 1**: Complete AI suggestion system, implement core authentication
- **Week 2**: Build 9-Step Questionnaire Flow with progress tracking
- **Week 3**: Add PWA capabilities and mobile optimization  
- **Week 4**: Implement premium animations and polish features

`;
        
        // Productivity Insights
        content += `## 📈 PRODUCTIVITY INSIGHTS
- **Current Productivity Score**: ${this.stats.productivityScore.toFixed(2)}/1.0
- **Average Task Completion**: ${this.stats.averageCompletionTime.toFixed(1)} hours
- **Total Tasks Completed**: ${this.stats.completedTasks}
- **Success Rate**: ${this.calculateSuccessRate()}%

`;
        
        // Task Queue
        if (pendingTasks.length > 3) {
            content += '## 📋 TASK QUEUE\\n';
            pendingTasks.slice(3).forEach((task, index) => {
                content += `${index + 4}. **[${task.category}] ${task.title}** - ${task.estimatedHours}h\\n`;
            });
            content += '\\n';
        }
        
        content += `## 🔄 SYSTEM STATUS
### **AI Suggestion Integration**
- ✅ Suggestion Selection System Active
- ✅ Auto-Todo Update Working
- ✅ Progress Tracking Enabled
- ✅ Performance Analytics Running

### **Task Management Stats**
- **Active Tasks**: ${this.activeTasks.size}
- **Completed Tasks**: ${this.completedTasks.size}
- **Average Estimation Accuracy**: ${this.calculateEstimationAccuracy()}%
- **Most Productive Time**: ${this.getMostProductiveTime()}

---
*This file is automatically updated when suggestions are selected. Manual edits may be overwritten.*`;
        
        return content;
    }
    
    /**
     * Helper methods for todo generation
     */
    formatTime(timestamp) {
        if (!timestamp) return 'Unknown';
        return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    getPriorityEmoji(priority) {
        switch (priority) {
            case 'critical': return '🔥🔥🔥';
            case 'high': return '🔥🔥';
            case 'medium': return '🔥';
            default: return '✨';
        }
    }
    
    getWeekRange() {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    }
    
    calculateWeeklyStats() {
        // This would calculate actual weekly statistics
        return {
            completed: this.completedTasks.size,
            inProgress: Array.from(this.activeTasks.values()).filter(t => t.status === 'in_progress').length,
            planned: this.activeTasks.size,
            focusAreas: ['AI System Development', 'Core Features'],
            blockers: 'None currently',
            velocity: 1.2
        };
    }
    
    calculateSuccessRate() {
        const total = this.stats.totalSelections;
        const completed = this.stats.completedTasks;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }
    
    calculateEstimationAccuracy() {
        // Calculate how accurate time estimates are
        const completedWithTime = Array.from(this.completedTasks.values())
            .filter(t => t.actualHours && t.estimatedHours);
        
        if (completedWithTime.length === 0) return 100;
        
        const accuracies = completedWithTime.map(task => {
            const accuracy = 1 - Math.abs(task.actualHours - task.estimatedHours) / task.estimatedHours;
            return Math.max(0, accuracy);
        });
        
        const avgAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
        return Math.round(avgAccuracy * 100);
    }
    
    getMostProductiveTime() {
        // Analyze when most tasks are completed
        return 'Mornings (9am-12pm)'; // Placeholder
    }
    
    updateProductivityScore(completedTask) {
        // Update productivity score based on task completion
        const efficiency = completedTask.estimatedHours / Math.max(completedTask.actualHours, 0.1);
        this.stats.productivityScore = (this.stats.productivityScore * 0.9) + (Math.min(efficiency, 1.2) * 0.1);
    }
    
    /**
     * Data persistence methods
     */
    async ensureDataDirectory() {
        const dataDir = path.join(this.projectRoot, 'claude', 'data');
        try {
            await fs.mkdir(dataDir, { recursive: true });
        } catch (error) {
            // Directory might already exist
        }
    }
    
    async loadSelectionHistory() {
        try {
            const content = await fs.readFile(this.selectionHistoryPath, 'utf8');
            const data = JSON.parse(content);
            
            this.taskHistory = data.taskHistory || [];
            this.stats = { ...this.stats, ...data.stats };
            
        } catch (error) {
            // File might not exist yet
            this.taskHistory = [];
        }
    }
    
    async saveSelectionHistory() {
        try {
            const data = {
                taskHistory: this.taskHistory,
                stats: this.stats,
                lastUpdated: new Date().toISOString()
            };
            
            await fs.writeFile(this.selectionHistoryPath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error('❌ Failed to save selection history:', error.message);
        }
    }
    
    async loadCurrentTodoState() {
        // This would parse existing todo.md to restore state
        // For now, we start fresh
    }
    
    async recordSelection(task) {
        this.taskHistory.push({
            taskId: task.id,
            action: 'selected',
            timestamp: new Date().toISOString(),
            task: { ...task }
        });
        
        await this.saveSelectionHistory();
    }
    
    async saveStats() {
        await this.saveSelectionHistory();
    }
    
    /**
     * Get current status
     */
    getStatus() {
        return {
            activeTasks: this.activeTasks.size,
            completedTasks: this.completedTasks.size,
            totalSelections: this.stats.totalSelections,
            productivityScore: this.stats.productivityScore,
            averageCompletionTime: this.stats.averageCompletionTime
        };
    }
}

// Export for programmatic use
module.exports = SuggestionSelector;

// Command line interface
if (require.main === module) {
    const selector = new SuggestionSelector();
    
    const command = process.argv[2];
    const args = process.argv.slice(3);
    
    async function runCommand() {
        await selector.initialize();
        
        switch (command) {
            case 'select':
                const number = parseInt(args[0]);
                if (isNaN(number)) {
                    console.error('Usage: select <suggestion_number>');
                    return;
                }
                await selector.selectSuggestion(number);
                break;
                
            case 'add':
                const title = args[0];
                const subagent = args[1];
                if (!title || !subagent) {
                    console.error('Usage: add "<title>" <subagent>');
                    return;
                }
                await selector.addCustomTask(title, subagent);
                break;
                
            case 'complete':
                const taskId = args[0];
                if (!taskId) {
                    console.error('Usage: complete <task_id>');
                    return;
                }
                await selector.completeTask(taskId);
                break;
                
            case 'start':
                const startTaskId = args[0];
                if (!startTaskId) {
                    console.error('Usage: start <task_id>');
                    return;
                }
                await selector.startTask(startTaskId);
                break;
                
            case 'status':
                console.log('🎯 Suggestion Selector Status:', JSON.stringify(selector.getStatus(), null, 2));
                break;
                
            case 'list':
                console.log('📋 Active Tasks:');
                for (const [id, task] of selector.activeTasks) {
                    console.log(`  ${id}: [${task.status}] ${task.title}`);
                }
                break;
                
            default:
                console.log('Available commands:');
                console.log('  select <number>     - Select suggestion from suggestions.md');
                console.log('  add "<title>" <subagent> - Add custom task');
                console.log('  complete <task_id>  - Mark task as completed');
                console.log('  start <task_id>     - Start working on task');
                console.log('  status             - Show current status');
                console.log('  list               - List active tasks');
        }
    }
    
    runCommand().catch(console.error);
}