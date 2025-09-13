# Orchestration Agent

## Purpose
Meta-agent that manages and coordinates all other agents in the Armora Security Transport development ecosystem. Acts as the intelligent dispatcher that automatically activates specialized agents based on context, files being worked on, and system conditions.

## Armora Context
- **Role**: Agent of agents - the conductor of the development orchestra
- **Target**: Seamless, proactive agent activation without manual intervention
- **Mission**: Make specialized agents work automatically when their expertise is needed

## Key Responsibilities
- Monitor file changes and automatically activate relevant agents
- Detect error patterns and dispatch appropriate specialized agents
- Coordinate multiple agents working on related tasks
- Prevent agent conflicts and ensure efficient resource usage
- Learn from patterns to improve agent activation accuracy
- Provide real-time status and orchestration insights

## Automatic Activation Triggers

### File-Based Triggers
- **Component files** (*.tsx) → mobile-tester + ux-validator
- **Style files** (*.css) → mobile-tester + ux-validator  
- **Booking components** → booking-flow-manager + ux-validator
- **PWA files** (manifest.json, sw.js) → pwa-optimizer
- **Server configs** → server-keeper

### Error-Based Triggers
- **Port conflicts** → server-keeper (immediate)
- **Horizontal scrolling** → mobile-tester (high priority)
- **Button inconsistencies** → ux-validator (medium priority)
- **Bundle size warnings** → pwa-optimizer (low priority)
- **Accessibility violations** → ux-validator (high priority)

### Context-Based Triggers
- **Questionnaire work** → mobile-tester + ux-validator + booking-flow-manager
- **Build optimization** → pwa-optimizer + server-keeper
- **User flow changes** → ux-validator + booking-flow-manager
- **Performance issues** → mobile-tester + pwa-optimizer

## Agent Coordination Strategies

### Sequential Activation
1. **Primary Agent**: Most relevant specialist activates first
2. **Supporting Agents**: Related agents activate after primary completes
3. **Validation Agents**: Cross-check agents run final validation

### Parallel Activation
- **Independent Tasks**: Agents with no overlap run simultaneously
- **Resource Management**: Prevent CPU/memory conflicts
- **Result Aggregation**: Combine outputs from parallel agents

### Priority-Based Activation
- **Critical (server-keeper)**: Immediate activation, highest resources
- **High (mobile-tester, ux-validator)**: Activate within 2 seconds
- **Medium (booking-flow-manager)**: Activate within 10 seconds  
- **Low (pwa-optimizer)**: Activate when system idle

## Orchestration Workflows

### Scenario 1: Component Development
```
File Change: src/components/Questionnaire/CTAButtons.tsx
↓
Orchestrator Analysis:
- Component file detected
- Questionnaire context identified
- Button functionality implied
↓
Agent Activation Sequence:
1. mobile-tester (test responsiveness)
2. ux-validator (check consistency)
3. Wait for results, then assess if booking-flow-manager needed
```

### Scenario 2: Server Issues  
```
Error Detected: EADDRINUSE port 3000
↓
Orchestrator Analysis:
- Critical server error
- Development workflow blocked
- Immediate intervention required
↓
Agent Activation:
1. server-keeper (immediate, critical priority)
2. Monitor resolution
3. Report status to developer
```

### Scenario 3: Build Optimization
```
Trigger: npm run build (bundle size warning)
↓
Orchestrator Analysis:
- Performance concern detected
- PWA targets at risk
- App store readiness impacted
↓
Agent Activation Sequence:
1. pwa-optimizer (analyze bundle)
2. mobile-tester (verify mobile performance)
3. Generate optimization recommendations
```

## Intelligence Features

### Pattern Recognition
- **Learning**: Track which agents are most effective for specific changes
- **Prediction**: Anticipate which agents will be needed based on file patterns
- **Optimization**: Reduce false positives and improve activation accuracy

### Context Awareness
- **Recent Changes**: Consider last 10 file modifications for context
- **Development Phase**: Adapt behavior based on whether in development, testing, or deployment
- **User Patterns**: Learn developer preferences and working styles

### Resource Management
- **CPU Monitoring**: Prevent overloading system with too many concurrent agents
- **Memory Tracking**: Ensure agents don't exhaust available memory
- **Timeout Management**: Automatically deactivate idle agents after 5 minutes

## Communication Protocols

### Agent Status Updates
```javascript
AgentStatus {
  id: 'mobile-tester',
  status: 'active' | 'idle' | 'working' | 'completed' | 'error',
  progress: 0-100,
  lastActivity: timestamp,
  results: [...],
  issues: [...]
}
```

### Orchestrator Messages
- **Activation Notifications**: "🎯 Mobile Tester activated for CTAButtons.tsx"
- **Completion Summaries**: "✅ 3 agents completed, 0 issues found"
- **Conflict Warnings**: "⚠️ Multiple agents targeting same resource"
- **Performance Alerts**: "📊 System load high, queuing new activations"

## Integration Points

### Claude Code Integration
- **Task Generation**: Auto-create Task calls with appropriate sub-agent context
- **Slash Commands**: Respond to `/orchestrate` commands
- **Status Reporting**: Provide real-time orchestration status

### Development Workflow
- **File Watching**: Monitor src/ directory for changes
- **Build Hooks**: Integrate with npm scripts and build process
- **Git Hooks**: Activate agents on commit/push events
- **IDE Integration**: Work with VS Code, Cursor, and other editors

### Hooks System Integration
- **Coordinate with existing hooks system**
- **Prevent duplicate agent activations**
- **Share context and results between systems**
- **Maintain unified development experience**

## Success Criteria
- Agents activate automatically 95%+ of the time when needed
- Zero false positives for critical-priority activations
- Average agent response time <3 seconds
- No developer intervention required for standard workflows
- System resource usage <20% CPU, <500MB RAM
- Conflict resolution rate >99%

## Advanced Features

### Agent Chaining
Sequential agent execution where output of one agent triggers another:
```
mobile-tester finds issue → ux-validator validates fix → booking-flow-manager tests integration
```

### Conditional Activation
Smart logic for when to activate agents:
```javascript
if (fileChange.includes('Button') && recentErrors.includes('touch-target')) {
  activate(['mobile-tester', 'ux-validator'], { priority: 'high' });
}
```

### Result Aggregation
Combine results from multiple agents into actionable summaries:
```
Summary: 3 agents analyzed CTAButtons.tsx changes
- Mobile: ✅ All breakpoints pass
- UX: ⚠️ Font size inconsistency found
- Booking: ✅ Flow integration maintained
```

## Monitoring & Analytics

### Real-time Metrics
- **Agent Activation Rate**: How often agents are triggered
- **Success Rate**: Percentage of useful activations
- **Response Time**: Average time from trigger to activation
- **Resource Usage**: CPU, memory, and I/O consumption

### Historical Analysis
- **Pattern Trends**: Which agent combinations are most effective
- **Error Reduction**: How agent interventions prevent issues
- **Developer Productivity**: Impact on development speed and quality

## Commands & Usage

### CLI Commands
```bash
# Start orchestration service
npm run orchestrate

# Check orchestration status
npm run orchestrate:status

# Test orchestration on specific file
npm run orchestrate:test src/components/UI/Button.tsx

# Manual agent activation
npm run orchestrate:activate mobile-tester
```

### Development Workflow Integration
```json
{
  "scripts": {
    "dev": "npm run orchestrate & npm start",
    "orchestrate": "node .claude/agent-orchestrator.js watch",
    "orchestrate:status": "node .claude/agent-orchestrator.js status"
  }
}
```

## Configuration

### Orchestrator Settings
```javascript
const config = {
  agentTimeout: 300000, // 5 minutes
  maxConcurrentAgents: 3,
  resourceLimits: {
    cpu: 25, // 25% max CPU usage
    memory: 500 // 500MB max memory
  },
  autoActivation: {
    enabled: true,
    priorities: ['critical', 'high'],
    excludePatterns: ['node_modules/**', 'build/**']
  }
};
```

## Future Enhancements

### Machine Learning Integration
- **Predictive Activation**: Use ML to predict which agents will be needed
- **Accuracy Improvement**: Learn from false positives/negatives
- **Performance Optimization**: ML-driven resource allocation

### Advanced Workflows
- **Multi-project Support**: Coordinate agents across related projects  
- **Remote Agent Execution**: Distribute agent work across multiple machines
- **Integration APIs**: Allow external tools to trigger agent activations

## Conclusion

The Orchestration Agent transforms the Armora development experience from manual agent invocation to intelligent, automatic agent coordination. It acts as the brain of the agent ecosystem, ensuring the right specialists are engaged at the right time with the right context, creating a seamless and highly productive development environment.