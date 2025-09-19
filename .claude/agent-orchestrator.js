#!/usr/bin/env node

/**
 * Armora Agent Orchestrator - Proactive Agent Activation System
 * 
 * This system automatically activates specialized agents based on:
 * - File changes and patterns
 * - Error conditions
 * - Build/test events
 * - Context keywords
 * 
 * Usage: node .claude/agent-orchestrator.js [mode]
 * Modes: watch, analyze, activate, status
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');
const ClaudeTaskBridge = require('./claude-task-bridge');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gold: '\x1b[38;5;220m'
};

function colorize(text, color) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

// Agent activation triggers and contexts
const AGENT_TRIGGERS = {
  'mobile-tester': {
    name: 'Mobile Tester',
    icon: '📱',
    priority: 'high',
    autoActivate: true,
    triggers: {
      files: [
        '**/*.tsx', '**/*.css', '**/*.module.css',
        '**/Questionnaire/**/*', '**/UI/**/*',
        '**/responsive*', '**/mobile*'
      ],
      keywords: [
        'mobile', 'responsive', '320px', 'touch', 'viewport',
        'horizontal scroll', 'touch-target', 'breakpoint',
        'questionnaire', 'button', 'scroll'
      ],
      errors: [
        'horizontal scroll', 'overflow', 'touch target',
        'mobile viewport', 'responsive'
      ],
      contexts: [
        'component styling', 'layout changes', 'CSS modifications',
        'questionnaire updates', 'button changes'
      ]
    },
    actions: [
      'Test at 320px, 768px, 1920px',
      'Validate touch targets ≥44px',
      'Check horizontal scrolling',
      'Verify PWA mobile features',
      'Test gesture interactions'
    ]
  },

  'ux-validator': {
    name: 'UX Validator',
    icon: '✨',
    priority: 'high',
    autoActivate: true,
    triggers: {
      files: [
        '**/*Button*.tsx', '**/*Form*.tsx', '**/*CTA*.tsx',
        '**/Questionnaire/**/*', '**/Auth/**/*',
        '**/*Navigation*.tsx', '**/*Flow*.tsx'
      ],
      keywords: [
        'UX', 'accessibility', 'WCAG', 'button', 'form',
        'navigation', 'consistency', 'user flow',
        'color contrast', 'brand compliance'
      ],
      errors: [
        'accessibility', 'contrast', 'focus', 'tab order',
        'button inconsistency', 'navigation error'
      ],
      contexts: [
        'button modifications', 'form updates', 'navigation changes',
        'user flow updates', 'accessibility concerns'
      ]
    },
    actions: [
      'Check button consistency across steps',
      'Validate color compliance (#1a1a2e, #FFD700)',
      'Test form usability',
      'Verify accessibility standards',
      'Monitor user flow efficiency'
    ]
  },

  'booking-flow-manager': {
    name: 'Booking Flow Manager',
    icon: '📋',
    priority: 'medium',
    autoActivate: true,
    triggers: {
      files: [
        '**/Booking/**/*', '**/booking*', '**/service*',
        '**/pricing*', '**/payment*', '**/flow*'
      ],
      keywords: [
        'booking', 'service level', 'pricing', 'payment',
        'Standard', 'Executive', 'Shadow', '£45', '£75', '£65',
        'flow state', 'booking logic'
      ],
      errors: [
        'booking error', 'pricing calculation', 'service tier',
        'payment flow', 'state management'
      ],
      contexts: [
        'booking component changes', 'pricing updates',
        'service tier modifications', 'payment flow updates'
      ]
    },
    actions: [
      'Validate service pricing (£45/£75/£65)',
      'Check booking state transitions',
      'Test user preference handling',
      'Verify emergency contact system',
      'Monitor conversion rates'
    ]
  },

  'pwa-optimizer': {
    name: 'PWA Optimizer',
    icon: '🚀',
    priority: 'medium',
    autoActivate: false, // Activate on specific events
    triggers: {
      files: [
        '**/public/manifest.json', '**/sw.js', '**/service-worker*',
        '**/build/**/*', '**/bundle*', '**/icons*'
      ],
      keywords: [
        'PWA', 'manifest', 'service worker', 'app store',
        'bundle size', 'lighthouse', 'offline', 'cache'
      ],
      errors: [
        'bundle size', 'lighthouse', 'PWA score', 'manifest error',
        'service worker', 'cache error'
      ],
      contexts: [
        'PWA configuration', 'build optimization',
        'app store preparation', 'performance concerns'
      ]
    },
    actions: [
      'Check Lighthouse PWA score',
      'Validate manifest.json',
      'Monitor bundle size (<500KB)',
      'Test offline functionality',
      'Generate missing icons'
    ]
  },

  'server-keeper': {
    name: 'Server Keeper',
    icon: '🖥️',
    priority: 'critical',
    autoActivate: true,
    triggers: {
      files: [], // Server issues aren't file-based
      keywords: [
        'port', 'server', 'localhost', '3000', 'crash',
        'memory', 'process', 'EADDRINUSE'
      ],
      errors: [
        'EADDRINUSE', 'port 3000', 'server crash', 'memory leak',
        'build failed', 'compilation error', 'module not found'
      ],
      contexts: [
        'server startup', 'port conflicts', 'memory issues',
        'build failures', 'development server problems'
      ]
    },
    actions: [
      'Monitor localhost:3000 status',
      'Auto-restart crashed servers',
      'Clear port conflicts',
      'Track memory usage',
      'Fix common build errors'
    ]
  }
};

class AgentOrchestrator {
  constructor() {
    this.activeAgents = new Set();
    this.fileWatcher = null;
    this.recentActivity = [];
    this.maxActivityHistory = 50;
    this.taskBridge = new ClaudeTaskBridge();
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString().substr(11, 8);
    const colors = {
      info: 'cyan',
      warn: 'yellow',
      error: 'red',
      success: 'green',
      agent: 'gold'
    };
    console.log(`${colorize(timestamp, 'dim')} ${colorize(message, colors[level])}`);
  }

  addActivity(type, details) {
    this.recentActivity.unshift({
      timestamp: Date.now(),
      type,
      details
    });
    
    if (this.recentActivity.length > this.maxActivityHistory) {
      this.recentActivity = this.recentActivity.slice(0, this.maxActivityHistory);
    }
  }

  analyzeContext(filePath, content = '') {
    const context = {
      fileName: path.basename(filePath),
      extension: path.extname(filePath),
      directory: path.dirname(filePath),
      isComponent: filePath.includes('.tsx'),
      isStyle: filePath.includes('.css'),
      isQuestionnaire: filePath.includes('questionnaire') || filePath.includes('Questionnaire'),
      isBooking: filePath.includes('booking') || filePath.includes('Booking'),
      isUI: filePath.includes('/UI/'),
      keywords: [],
      suggestedAgents: []
    };

    // Extract keywords from content
    if (content) {
      const keywordMatches = content.toLowerCase().match(/\b(mobile|responsive|touch|button|form|booking|service|pricing|pwa|manifest)\b/g);
      context.keywords = keywordMatches ? [...new Set(keywordMatches)] : [];
    }

    // Determine which agents should activate
    for (const [agentId, agent] of Object.entries(AGENT_TRIGGERS)) {
      let score = 0;

      // File pattern matching
      for (const pattern of agent.triggers.files) {
        const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
        if (regex.test(filePath)) {
          score += 10;
        }
      }

      // Keyword matching
      for (const keyword of agent.triggers.keywords) {
        if (context.keywords.includes(keyword.toLowerCase()) || 
            filePath.toLowerCase().includes(keyword.toLowerCase())) {
          score += 5;
        }
      }

      // Directory context
      for (const ctx of agent.triggers.contexts) {
        if (filePath.toLowerCase().includes(ctx.split(' ')[0])) {
          score += 3;
        }
      }

      if (score > 0) {
        context.suggestedAgents.push({
          id: agentId,
          name: agent.name,
          score,
          priority: agent.priority,
          autoActivate: agent.autoActivate
        });
      }
    }

    // Sort by score descending
    context.suggestedAgents.sort((a, b) => b.score - a.score);

    return context;
  }

  async activateAgent(agentId, context, reason = 'auto') {
    if (this.activeAgents.has(agentId)) {
      return false; // Already active
    }

    const agent = AGENT_TRIGGERS[agentId];
    if (!agent) {
      this.log(`❌ Unknown agent: ${agentId}`, 'error');
      return false;
    }

    this.activeAgents.add(agentId);
    this.addActivity('agent_activation', { agentId, reason, context });

    this.log(`${agent.icon} ${colorize(`ACTIVATING: ${agent.name}`, 'bright')} (${reason})`, 'agent');
    
    // Log what the agent will do
    agent.actions.forEach((action, index) => {
      this.log(`  ${index + 1}. ${action}`, 'info');
    });

    // Actually activate agent via Claude Task Bridge
    try {
      const taskId = await this.taskBridge.activateAgent(agentId, context, reason);
      this.log(`🎯 Agent ${agentId} activated via Claude Code Task tool (${taskId})`, 'success');
    } catch (error) {
      this.log(`❌ Failed to activate ${agentId} via Task tool: ${error.message}`, 'error');
    }

    // Set timeout to deactivate agent
    setTimeout(() => {
      this.deactivateAgent(agentId);
    }, 300000); // 5 minutes

    return true;
  }

  deactivateAgent(agentId) {
    if (this.activeAgents.has(agentId)) {
      this.activeAgents.delete(agentId);
      const agent = AGENT_TRIGGERS[agentId];
      this.log(`${agent.icon} ${agent.name} deactivated`, 'info');
    }
  }

  generateAgentPrompt(agentId, context) {
    const agent = AGENT_TRIGGERS[agentId];
    const subagentConfig = require('./subagents.json').subagents[agentId];
    
    return `${subagentConfig.trigger}
    
${subagentConfig.context}

**AUTO-ACTIVATION CONTEXT:**
- File: ${context.fileName}
- Type: ${context.isComponent ? 'React Component' : context.isStyle ? 'Stylesheet' : 'Other'}
- Keywords detected: ${context.keywords.join(', ')}
- Reason for activation: File change detected

**IMMEDIATE ACTIONS NEEDED:**
${agent.actions.map(action => `- ${action}`).join('\n')}

Success Criteria:
${subagentConfig.success_criteria ? subagentConfig.success_criteria.map(c => `- ${c}`).join('\n') : ''}

Please execute these specialized tasks immediately and report any issues found.`;
  }

  async processFileChange(filePath) {
    try {
      const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
      const context = this.analyzeContext(filePath, content);
      
      this.log(`📄 File changed: ${colorize(path.relative(process.cwd(), filePath), 'bright')}`);
      
      if (context.suggestedAgents.length > 0) {
        this.log(`🎯 Suggested agents: ${context.suggestedAgents.map(a => `${AGENT_TRIGGERS[a.id].icon} ${a.name} (${a.score})`).join(', ')}`);
        
        // Auto-activate high-priority agents
        for (const suggestion of context.suggestedAgents) {
          if (suggestion.autoActivate && (suggestion.priority === 'high' || suggestion.priority === 'critical')) {
            await this.activateAgent(suggestion.id, context, 'file_change');
          }
        }
      } else {
        this.log('No agents suggested for this change', 'info');
      }

      this.addActivity('file_change', { filePath, context });
    } catch (error) {
      this.log(`Error processing file change: ${error.message}`, 'error');
    }
  }

  startWatching() {
    if (this.fileWatcher) {
      this.log('File watcher already running', 'warn');
      return;
    }

    this.log(`${colorize('🎯 Starting Armora Agent Orchestrator', 'gold')}`, 'agent');
    this.log('Watching for automatic agent activation...', 'info');

    // Watch key directories
    const watchPaths = [
      'src/**/*.tsx',
      'src/**/*.ts', 
      'src/**/*.css',
      'public/manifest.json',
      'package.json'
    ];

    this.fileWatcher = chokidar.watch(watchPaths, {
      ignored: [
        '**/node_modules/**',
        '**/build/**',
        '**/.git/**',
        '**/coverage/**'
      ],
      ignoreInitial: true,
      persistent: true
    });

    this.fileWatcher
      .on('change', (filePath) => this.processFileChange(filePath))
      .on('add', (filePath) => this.processFileChange(filePath))
      .on('error', (error) => this.log(`Watcher error: ${error}`, 'error'));

    // Monitor for server errors
    this.monitorServerHealth();
  }

  stopWatching() {
    if (this.fileWatcher) {
      this.fileWatcher.close();
      this.fileWatcher = null;
      this.log('File watcher stopped', 'info');
    }
  }

  monitorServerHealth() {
    // Check if port 3000 is responding
    setInterval(() => {
      exec('lsof -ti:3000', (error, stdout, stderr) => {
        if (error && !this.activeAgents.has('server-keeper')) {
          this.activateAgent('server-keeper', { 
            fileName: 'port-check',
            keywords: ['port', '3000', 'server']
          }, 'port_monitor');
        }
      });
    }, 30000); // Check every 30 seconds
  }

  showStatus() {
    console.log(colorize('\n🤖 Agent Orchestrator Status', 'gold'));
    console.log(colorize('=' .repeat(30), 'dim'));
    
    console.log(`\n${colorize('Active Agents:', 'bright')} ${this.activeAgents.size}`);
    for (const agentId of this.activeAgents) {
      const agent = AGENT_TRIGGERS[agentId];
      console.log(`  ${agent.icon} ${agent.name} (${agent.priority})`);
    }

    console.log(`\n${colorize('Available Agents:', 'bright')} ${Object.keys(AGENT_TRIGGERS).length}`);
    for (const [agentId, agent] of Object.entries(AGENT_TRIGGERS)) {
      const status = this.activeAgents.has(agentId) ? colorize('ACTIVE', 'green') : colorize('standby', 'dim');
      console.log(`  ${agent.icon} ${agent.name} - ${status} ${agent.autoActivate ? '(auto)' : '(manual)'}`);
    }

    console.log(`\n${colorize('Recent Activity:', 'bright')} (last ${Math.min(5, this.recentActivity.length)})`);
    this.recentActivity.slice(0, 5).forEach(activity => {
      const time = new Date(activity.timestamp).toLocaleTimeString();
      console.log(`  ${colorize(time, 'dim')} ${activity.type}: ${JSON.stringify(activity.details).substr(0, 60)}...`);
    });
  }
}

// CLI Interface
const orchestrator = new AgentOrchestrator();
const command = process.argv[2] || 'watch';

switch (command) {
  case 'watch':
    orchestrator.startWatching();
    
    // Keep process alive
    process.on('SIGINT', () => {
      orchestrator.log('\n👋 Shutting down agent orchestrator...', 'info');
      orchestrator.stopWatching();
      process.exit(0);
    });
    break;

  case 'status':
    orchestrator.showStatus();
    break;

  case 'test':
    // Test agent activation
    const testFile = process.argv[3] || 'src/components/Questionnaire/CTAButtons.tsx';
    orchestrator.processFileChange(testFile);
    break;

  case 'activate':
    const agentId = process.argv[3];
    if (agentId && AGENT_TRIGGERS[agentId]) {
      orchestrator.activateAgent(agentId, { fileName: 'manual', keywords: [] }, 'manual');
    } else {
      console.log('Available agents:', Object.keys(AGENT_TRIGGERS).join(', '));
    }
    break;

  default:
    console.log(colorize('\n🤖 Armora Agent Orchestrator', 'gold'));
    console.log('Usage: node .claude/agent-orchestrator.js [command]');
    console.log('\nCommands:');
    console.log('  watch    - Start file watching for auto-activation (default)');
    console.log('  status   - Show current agent status');
    console.log('  test     - Test agent activation on a file');
    console.log('  activate - Manually activate an agent');
    break;
}

module.exports = AgentOrchestrator;