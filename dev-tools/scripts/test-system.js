#!/usr/bin/env node

/**
 * 🧪 SYSTEM INTEGRATION TEST - Armora AI-Powered Suggestion System
 * 
 * PURPOSE: Test the complete AI suggestion and todo tracking system
 * MISSION: Verify all components work together seamlessly
 * 
 * Test Coverage:
 * - Subagent Manager: Discovery and registration
 * - Codebase Reviewer: Analysis and suggestion generation  
 * - Suggestion Selector: Selection and todo integration
 * - File System: Markdown generation and updates
 * - Integration: End-to-end workflow testing
 */

const SubagentManager = require('./hooks/subagent-manager');
const SuggestionSelector = require('./hooks/suggestion-selector');
const fs = require('fs').promises;
const path = require('path');

class SystemIntegrationTest {
    constructor() {
        this.projectRoot = process.cwd();
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
    }
    
    /**
     * Run all integration tests
     */
    async runAllTests() {
        console.log('🧪 Starting System Integration Tests...');
        console.log('═'.repeat(60));
        
        try {
            // Test 1: Subagent Discovery and Registration
            await this.testSubagentDiscovery();
            
            // Test 2: Suggestion Generation
            await this.testSuggestionGeneration();
            
            // Test 3: File System Operations
            await this.testFileSystemOperations();
            
            // Test 4: Selection and Todo Integration
            await this.testSelectionAndTodoIntegration();
            
            // Test 5: End-to-End Workflow
            await this.testEndToEndWorkflow();
            
            // Test 6: Performance and Scalability
            await this.testPerformanceAndScalability();
            
            // Summary
            this.printTestSummary();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
        }
    }
    
    /**
     * Test 1: Subagent Discovery and Registration
     */
    async testSubagentDiscovery() {
        console.log('\\n🔍 Test 1: Subagent Discovery and Registration');
        console.log('-'.repeat(50));
        
        try {
            const manager = new SubagentManager();
            await manager.start();
            
            // Check if subagents were discovered
            const subagents = manager.getAllSubagents();
            this.assert(subagents.length > 0, 'Should discover subagents', subagents.length);
            
            // Check for specific expected subagents
            const expectedSubagents = [
                'ui-component-builder',
                'auth-forms-specialist', 
                'navigation-flow-manager',
                'responsive-animation-expert',
                'pwa-appstore-specialist'
            ];
            
            for (const expected of expectedSubagents) {
                const found = subagents.find(s => s.id === expected);
                this.assert(found, `Should find ${expected} subagent`, found?.name);
            }
            
            // Check suggestion capability
            const suggestionCapable = manager.getSuggestionCapableSubagents();
            this.assert(suggestionCapable.length > 0, 'Should have suggestion-capable subagents', suggestionCapable.length);
            
            await manager.stop();
            console.log('✅ Subagent discovery tests passed');
            
        } catch (error) {
            this.fail('Subagent discovery failed', error.message);
        }
    }
    
    /**
     * Test 2: Suggestion Generation
     */
    async testSuggestionGeneration() {
        console.log('\\n🤖 Test 2: Suggestion Generation');
        console.log('-'.repeat(50));
        
        try {
            const manager = new SubagentManager();
            await manager.start();
            
            // Test suggestion generation
            const mockContext = {
                recentChanges: ['src/App.tsx', 'src/components/Auth/LoginForm.tsx'],
                currentFeatures: ['authentication', 'user-onboarding'],
                missingFeatures: ['validation', 'error-handling']
            };
            
            const suggestions = await manager.queryAllSubagentsForSuggestions(mockContext);
            this.assert(suggestions.length > 0, 'Should generate suggestions', suggestions.length);
            
            // Test suggestion structure
            const firstSuggestion = suggestions[0];
            this.assert(firstSuggestion.title, 'Suggestion should have title', firstSuggestion.title);
            this.assert(firstSuggestion.priority, 'Suggestion should have priority', firstSuggestion.priority);
            this.assert(firstSuggestion.subagent, 'Suggestion should have subagent', firstSuggestion.subagent);
            this.assert(firstSuggestion.estimatedHours, 'Suggestion should have time estimate', firstSuggestion.estimatedHours);
            
            await manager.stop();
            console.log('✅ Suggestion generation tests passed');
            
        } catch (error) {
            this.fail('Suggestion generation failed', error.message);
        }
    }
    
    /**
     * Test 3: File System Operations
     */
    async testFileSystemOperations() {
        console.log('\\n📁 Test 3: File System Operations');
        console.log('-'.repeat(50));
        
        try {
            // Test suggestions.md exists and is readable
            const suggestionsPath = path.join(this.projectRoot, 'suggestions.md');
            const suggestionsContent = await fs.readFile(suggestionsPath, 'utf8');
            this.assert(suggestionsContent.includes('ARMORA PROJECT SUGGESTIONS'), 'suggestions.md should have correct header');
            
            // Test todo.md exists and is readable
            const todoPath = path.join(this.projectRoot, 'todo.md');
            const todoContent = await fs.readFile(todoPath, 'utf8');
            this.assert(todoContent.includes('ARMORA PROJECT TODO'), 'todo.md should have correct header');
            
            // Test data directory creation
            const dataDir = path.join(this.projectRoot, 'claude', 'data');
            try {
                await fs.access(dataDir);
                this.pass('Data directory exists');
            } catch {
                this.fail('Data directory missing');
            }
            
            console.log('✅ File system operation tests passed');
            
        } catch (error) {
            this.fail('File system operations failed', error.message);
        }
    }
    
    /**
     * Test 4: Selection and Todo Integration
     */
    async testSelectionAndTodoIntegration() {
        console.log('\\n🎯 Test 4: Selection and Todo Integration');
        console.log('-'.repeat(50));
        
        try {
            const selector = new SuggestionSelector();
            await selector.initialize();
            
            // Test custom task addition
            const testTask = await selector.addCustomTask(
                'Test Task Integration',
                'auth-forms-specialist',
                {
                    priority: 'high',
                    estimatedHours: 2,
                    description: 'Testing the task creation system'
                }
            );
            
            this.assert(testTask.id, 'Task should have ID', testTask.id);
            this.assert(testTask.status === 'pending', 'Task should start as pending', testTask.status);
            
            // Test task status changes
            await selector.startTask(testTask.id);
            const startedTask = selector.activeTasks.get(testTask.id);
            this.assert(startedTask.status === 'in_progress', 'Task should be in progress', startedTask.status);
            
            // Test task completion
            await selector.completeTask(testTask.id);
            const completedTask = selector.completedTasks.get(testTask.id);
            this.assert(completedTask.status === 'completed', 'Task should be completed', completedTask.status);
            this.assert(completedTask.actualHours > 0, 'Completed task should have actual hours');
            
            console.log('✅ Selection and todo integration tests passed');
            
        } catch (error) {
            this.fail('Selection and todo integration failed', error.message);
        }
    }
    
    /**
     * Test 5: End-to-End Workflow
     */
    async testEndToEndWorkflow() {
        console.log('\\n🔄 Test 5: End-to-End Workflow');
        console.log('-'.repeat(50));
        
        try {
            // Simulate complete workflow:
            // 1. Subagent discovery
            const manager = new SubagentManager();
            await manager.start();
            
            // 2. Generate suggestions
            const mockContext = { recentChanges: ['test-file.tsx'] };
            const suggestions = await manager.queryAllSubagentsForSuggestions(mockContext);
            this.assert(suggestions.length > 0, 'Should generate suggestions in workflow');
            
            // 3. Select and track suggestion
            const selector = new SuggestionSelector();
            await selector.initialize();
            
            const testSuggestion = suggestions[0];
            const task = selector.createTaskFromSuggestion(testSuggestion, 1);
            selector.activeTasks.set(task.id, task);
            
            // 4. Update todo.md
            await selector.updateTodoFile();
            
            // 5. Verify todo.md was updated
            const todoContent = await fs.readFile(selector.todoPath, 'utf8');
            this.assert(todoContent.includes(task.title), 'Todo should include selected task', task.title);
            
            await manager.stop();
            console.log('✅ End-to-end workflow tests passed');
            
        } catch (error) {
            this.fail('End-to-end workflow failed', error.message);
        }
    }
    
    /**
     * Test 6: Performance and Scalability
     */
    async testPerformanceAndScalability() {
        console.log('\\n⚡ Test 6: Performance and Scalability');
        console.log('-'.repeat(50));
        
        try {
            const manager = new SubagentManager();
            await manager.start();
            
            // Test multiple suggestion generations
            const startTime = Date.now();
            const mockContext = { recentChanges: ['multiple-files.tsx'] };
            
            const suggestions1 = await manager.queryAllSubagentsForSuggestions(mockContext);
            const suggestions2 = await manager.queryAllSubagentsForSuggestions(mockContext);
            const suggestions3 = await manager.queryAllSubagentsForSuggestions(mockContext);
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            
            this.assert(totalTime < 5000, 'Multiple queries should complete in under 5 seconds', `${totalTime}ms`);
            this.assert(suggestions1.length > 0, 'First query should return suggestions');
            this.assert(suggestions2.length > 0, 'Second query should return suggestions');
            this.assert(suggestions3.length > 0, 'Third query should return suggestions');
            
            // Test memory usage (basic check)
            const memUsage = process.memoryUsage();
            this.assert(memUsage.heapUsed < 100 * 1024 * 1024, 'Memory usage should be reasonable', `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
            
            await manager.stop();
            console.log('✅ Performance and scalability tests passed');
            
        } catch (error) {
            this.fail('Performance and scalability failed', error.message);
        }
    }
    
    /**
     * Test assertion helpers
     */
    assert(condition, message, value = '') {
        if (condition) {
            this.pass(message, value);
        } else {
            this.fail(message, value);
        }
    }
    
    pass(message, value = '') {
        const result = `✅ ${message}${value ? ` (${value})` : ''}`;
        console.log(result);
        this.testResults.push({ status: 'PASS', message, value });
        this.passedTests++;
    }
    
    fail(message, value = '') {
        const result = `❌ ${message}${value ? ` (${value})` : ''}`;
        console.log(result);
        this.testResults.push({ status: 'FAIL', message, value });
        this.failedTests++;
    }
    
    /**
     * Print test summary
     */
    printTestSummary() {
        console.log('\\n🧪 TEST SUMMARY');
        console.log('═'.repeat(60));
        console.log(`Total Tests: ${this.testResults.length}`);
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`Success Rate: ${Math.round((this.passedTests / this.testResults.length) * 100)}%`);
        
        if (this.failedTests > 0) {
            console.log('\\n❌ Failed Tests:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`   - ${r.message}`));
        }
        
        console.log('\\n🎉 System Integration Test Complete!');
        
        if (this.failedTests === 0) {
            console.log('\\n✨ ALL SYSTEMS OPERATIONAL ✨');
            console.log('Your AI-powered suggestion and todo tracking system is ready!');
        } else {
            console.log('\\n⚠️ Some tests failed. Please review the issues above.');
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new SystemIntegrationTest();
    tester.runAllTests().catch(console.error);
}

module.exports = SystemIntegrationTest;