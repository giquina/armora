# Armora Development Agents

## Overview
Specialized AI agents that automate specific development tasks and maintain code quality standards for the Armora premium close protection and security transport services across England & Wales. Mobile-first Progressive Web App targeting app store distribution.

## Agent System Architecture

### Location
All agents are stored in `.claude/agents/` directory as JavaScript modules.

### Integration Points
- **Hooks System**: Agents integrate with the development hooks for automated execution
- **Task Management**: Connected to the AI-powered task suggestion system
- **CI/CD Pipeline**: Can be triggered during build and deployment processes

## Available Agents

### 1. Mobile Tester (`mobile-tester.js`)
**Purpose**: Ensures perfect mobile responsiveness and prevents horizontal scrolling issues across all viewport sizes (320px+).

**Key Features**:
- Tests all viewport widths from 320px to 768px (primary mobile target)
- Validates touch target sizes (minimum 44px for professional interface)
- Checks for horizontal overflow issues (CRITICAL: no horizontal scrolling)
- Verifies CSS Module calculations (`calc(100vw - 36px)`)
- Tests card border visibility and responsive breakpoints
- Validates professional close protection UI components
- Checks font scaling and readability on different devices
- Ensures Hub View and Protection Panel mobile optimization

**Trigger**: Automatically on component files (*.tsx) and style files (*.css), or manual via `npm run agents:test`

**Success Criteria**:
- Zero horizontal scroll at any viewport
- All touch targets ≥ 44px
- Text readable without zooming
- Images properly constrained

### 2. PWA Optimizer (`pwa-optimizer.js`)
**Purpose**: Optimizes Progressive Web App features for app store distribution.

**Key Features**:
- Service worker configuration and caching strategies
- Manifest.json optimization
- Offline functionality verification
- App icon and splash screen generation
- Lighthouse PWA audit automation
- Install prompt optimization
- Update notification system

**Trigger**: On build or via `npm run agents:pwa-optimize`

**Success Criteria**:
- Lighthouse PWA score: 100
- Service worker active
- Offline mode functional
- Install prompt working

### 3. UX Validator (`ux-validator.js`)
**Purpose**: Validates user experience patterns and accessibility standards.

**Key Features**:
- WCAG 2.1 AA compliance checking
- Color contrast validation (#1a1a2e navy, #FFD700 gold)
- Typography scale verification (1.4-1.5rem mobile)
- Touch gesture validation
- Loading state consistency
- Error message clarity
- Keyboard navigation testing
- Screen reader compatibility

**Trigger**: Before commits or via `npm run agents:ux-validate`

**Success Criteria**:
- WCAG 2.1 AA compliant
- Color contrast ratios pass
- All interactive elements keyboard accessible
- Error messages clear and actionable

### 4. Booking Flow Manager (`booking-flow-manager.js`)
**Purpose**: Manages and validates the complete protection assignment booking flow architecture.

**Key Features**:
- Dual booking system validation (legacy + new ProtectionAssignment system)
- Protection tier calculations (Essential £65/h, Executive £95/h, Shadow £125/h, Client Vehicle £55/h)
- WhereWhenView and PaymentIntegration flow testing
- Professional Hub View and NavigationCards validation
- Assignment state tracking with panic alert system
- Guest vs registered/Google user capability checks
- 50% reward system validation for registered users
- Booking persistence across sessions and error recovery
- Professional terminology compliance verification

**Trigger**: On booking/ProtectionAssignment component changes or via `npm run agents:file`

**Success Criteria**:
- Complete booking in < 3 minutes
- All user types can complete flow
- Payment calculations accurate
- State persists correctly

### 5. Server Keeper (`server-keeper.js`)
**Purpose**: Monitors development server health, performance, and handles critical server issues.

**Key Features**:
- Development server monitoring and auto-restart
- Memory usage monitoring (target <512MB)
- Hot reload performance tracking
- Build time optimization (target <30s)
- Error log aggregation and port conflict resolution
- Critical priority activation on server issues/port conflicts
- Bundle size tracking and dependency analysis
- React 19.1.1 and TypeScript 4.9.5 compatibility monitoring

**Trigger**: Automatically on server issues/port conflicts (critical priority), or continuous during development

**Success Criteria**:
- Build time < 30 seconds
- Memory usage < 512MB
- Hot reload < 2 seconds
- Zero critical errors

## Agent Commands

### Individual Agent Execution
```bash
npm run agents:mobile-test      # Run mobile viewport tester
npm run agents:pwa-optimize     # Run PWA optimizer
npm run agents:ux-validate      # Run UX validator
npm run agents:booking-test     # Run booking flow manager
npm run agents:server-monitor   # Run server keeper
```

### Batch Operations
```bash
npm run agents           # Interactive agent selector
npm run agents:all       # Run all agents in sequence
npm run agents:critical  # Run critical agents (mobile, ux, booking)
npm run agents:status    # Check agent health status
npm run agents:profile   # Profile agent performance
```

## Creating New Agents

### Agent Template Structure
```javascript
// .claude/agents/[agent-name].js
module.exports = {
  name: 'Agent Name',
  description: 'Agent purpose and functionality',
  priority: 1, // 1-5, lower is higher priority
  category: 'testing|optimization|validation|monitoring',
  
  async run(context) {
    const { utils, options, files } = context;
    
    // Agent logic here
    const results = [];
    const issues = [];
    const recommendations = [];
    
    // Perform checks
    try {
      // Your validation logic
      results.push({
        type: 'success',
        message: 'Check passed',
        file: 'path/to/file',
        line: 42
      });
    } catch (error) {
      issues.push({
        type: 'error',
        message: error.message,
        severity: 'high|medium|low'
      });
    }
    
    return {
      success: issues.length === 0,
      results,
      issues,
      recommendations,
      metrics: {
        testsRun: results.length,
        testsPassed: results.filter(r => r.type === 'success').length,
        duration: Date.now() - startTime
      }
    };
  },
  
  triggers: ['file-change', 'pre-commit', 'manual', 'scheduled'],
  
  config: {
    enabled: true,
    autoFix: false,
    threshold: {
      maxIssues: 10,
      severity: 'medium'
    },
    filePatterns: ['**/*.tsx', '**/*.css'],
    excludePatterns: ['node_modules/**', 'build/**']
  }
};
```

### Agent Context Object
```javascript
{
  projectRoot: '/workspaces/armora',
  files: [], // Changed files (for file-change trigger)
  event: 'file-change', // Trigger event type
  options: {}, // Runtime options passed to agent
  utils: {
    // File operations
    readFile: async (path) => {},
    writeFile: async (path, content) => {},
    fileExists: (path) => {},
    
    // Command execution
    runCommand: async (cmd) => {},
    
    // Logging
    log: (message, level) => {},
    
    // Analysis helpers
    parseCSS: (content) => {},
    parseJS: (content) => {},
    analyzeDependencies: () => {},
    
    // Reporting
    createReport: (data) => {},
    saveMetrics: (metrics) => {}
  },
  
  // Previous run data
  previousRun: {
    timestamp: Date,
    results: [],
    metrics: {}
  }
}
```

## Agent Development Guidelines

### 1. Single Responsibility
Each agent should focus on one specific aspect of the application.

### 2. Non-Blocking Execution
Agents should run asynchronously and not block the development workflow.

### 3. Clear Reporting
Provide actionable feedback with specific file locations and line numbers.

### 4. Fail Gracefully
Handle errors without crashing the development environment.

### 5. Performance Conscious
Optimize for speed, especially for agents that run frequently.

### 6. Incremental Checking
Cache results and only re-check changed files when possible.

## Integration with Development Workflow

### Pre-Commit Hooks
Critical agents (mobile-tester, ux-validator) run automatically before commits.

### CI/CD Pipeline
All agents run during the build process to ensure production readiness.

### Development Mode
Agents provide real-time feedback through the hooks system during development.

### Task Management Integration
Agents can create tasks in the `.claude/tasks/` system when issues are found.

### IDE Integration
Agents can output problems in formats compatible with VS Code and other IDEs.

## Configuration

### Global Agent Configuration (`.claude/agent-config.json`)
```json
{
  "enabled": true,
  "logLevel": "info",
  "reportPath": ".claude/reports",
  "autoRun": {
    "mobile-tester": true,
    "pwa-optimizer": false,
    "ux-validator": true,
    "booking-flow-manager": true,
    "server-keeper": true
  },
  "schedule": {
    "daily": ["pwa-optimizer"],
    "hourly": ["server-keeper"],
    "onSave": ["mobile-tester", "ux-validator"]
  },
  "thresholds": {
    "mobileViewport": {
      "minWidth": 320,
      "maxWidth": 768,
      "testIncrement": 10
    },
    "performance": {
      "maxBuildTime": 30000,
      "maxMemoryUsage": 512,
      "maxBundleSize": 500000
    },
    "accessibility": {
      "minContrastRatio": 4.5,
      "maxLoadTime": 3000
    }
  },
  "notifications": {
    "slack": false,
    "email": false,
    "desktop": true
  }
}
```

## Troubleshooting

### Agent Not Running
1. Check if agent is enabled in `agent-config.json`
2. Verify agent file exists in `.claude/agents/`
3. Check console for error messages
4. Run `npm run agents:status` to see agent health
5. Verify Node.js version compatibility

### Performance Issues
1. Disable non-critical agents during development
2. Adjust agent run frequency in configuration
3. Use `npm run agents:profile` to identify slow agents
4. Enable incremental checking
5. Reduce file pattern scope

### False Positives
1. Update agent thresholds in configuration
2. Add exceptions for specific files/patterns
3. Report issues to maintain agent accuracy
4. Check for outdated rules
5. Verify environment-specific settings

### Integration Problems
1. Check hooks system is running
2. Verify file watchers are active
3. Ensure proper permissions
4. Check for port conflicts
5. Review agent dependencies

## Best Practices

### For Development
- Run critical agents before pushing code
- Use agent recommendations to improve code quality
- Keep agents updated with project changes
- Review agent reports regularly
- Configure IDE integration for real-time feedback

### For CI/CD
- Include all agents in build pipeline
- Fail builds on critical agent errors
- Generate agent reports for review
- Track metrics over time
- Set up notifications for failures

### For Maintenance
- Review agent logs weekly
- Update agent rules based on project evolution
- Document agent customizations
- Monitor agent performance metrics
- Keep agent dependencies updated

## Performance Metrics

### Agent Execution Times (Target)
- Mobile Tester: < 5 seconds
- PWA Optimizer: < 10 seconds
- UX Validator: < 8 seconds
- Booking Flow Manager: < 15 seconds
- Server Keeper: < 2 seconds (continuous)

### Resource Usage (Maximum)
- CPU: < 25% per agent
- Memory: < 100MB per agent
- Disk I/O: < 10MB/s
- Network: Minimal (local only)

## Related Documentation
- [Development Infrastructure](../CLAUDE.md#development-infrastructure)
- [Hooks System](../dev-tools/hooks/README.md)
- [Task Management](../dev-tools/task-manager/README.md)
- [CI/CD Pipeline](../docs/ci-cd.md)
- [Testing Strategy](../docs/testing.md)

## Agent Metrics and Reporting

### Success Metrics
- **Mobile Tester**: 0 horizontal scroll issues, 100% touch target compliance
- **PWA Optimizer**: 100/100 Lighthouse PWA score
- **UX Validator**: WCAG 2.1 AA compliance
- **Booking Flow**: 0 state management errors
- **Server Keeper**: <30s build time, <512MB memory usage

### Report Format
```json
{
  "timestamp": "2025-09-12T10:00:00Z",
  "agent": "mobile-tester",
  "duration": 4523,
  "success": true,
  "summary": {
    "testsRun": 45,
    "testsPassed": 45,
    "issues": 0,
    "warnings": 2
  },
  "details": [
    {
      "test": "viewport-320px",
      "result": "pass",
      "duration": 234
    }
  ],
  "recommendations": [
    "Consider optimizing image sizes for faster mobile loading"
  ]
}
```

### Reporting Dashboard
Access agent reports at `.claude/reports/dashboard.html` for visual metrics and trends.

---

### 6. Orchestration Agent (`orchestration-agent.js`)
**Purpose**: Manages and coordinates other agents, providing intelligent agent activation based on context.

**Key Features**:
- Proactive agent orchestration without manual intervention
- Context-aware agent activation based on file types and changes
- Intelligent agent scheduling and priority management
- Agent performance monitoring and optimization
- Cross-agent communication and coordination
- Resource management and conflict resolution
- Automated workflow optimization

**Trigger**: Continuous orchestration during development, auto-activates other agents based on context

**Success Criteria**:
- Agents activate automatically based on context
- No agent conflicts or resource contention
- Optimal agent performance and coordination

## Agent Commands

### Individual Agent Execution
```bash
npm run agents:start     # Start agent orchestration system
npm run agents:status    # Check agent health status
npm run agents:test      # Test agent functionality
npm run agents:file      # Run file-specific agents
```

### Batch Operations
```bash
npm run agents           # Interactive agent selector
npm run orchestrate:status # View active agents and system status
```

Last Updated: 2025-09-23T18:47:06.793Z
Version: 1.2.0