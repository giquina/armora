# Armora Sub-agents System

## Overview
Since Claude Code only supports built-in agent types (`general-purpose`, `statusline-setup`, `output-style-setup`), we've implemented a **sub-agent system** that provides specialized functionality through the general-purpose agent.

## What are Sub-agents?
Sub-agents are specialized prompt contexts that transform the general-purpose agent into a focused specialist for specific tasks. They work by:
1. Providing specialized prompts and context
2. Setting clear success criteria
3. Focusing the agent on specific domains
4. Maintaining consistent behavior patterns

## Available Sub-agents

### 🱞 Mobile Tester
**Purpose:** Mobile responsiveness testing specialist
**Trigger:** "Use mobile-tester sub-agent"
**Focus Areas:**
- Test from 320px width minimum
- Zero horizontal scrolling validation
- 44px touch target compliance
- PWA functionality testing
- Mobile gesture validation

### 🚀 PWA Optimizer  
**Purpose:** Progressive Web App optimization
**Trigger:** "Use pwa-optimizer sub-agent"
**Focus Areas:**
- Manifest.json configuration
- Service worker implementation
- App icon generation
- Bundle size optimization
- Lighthouse PWA score 100%

### ✨ UX Validator
**Purpose:** Mobile UX validation specialist  
**Trigger:** "Use ux-validator sub-agent"
**Focus Areas:**
- User flow efficiency (<3 min booking)
- Form usability testing
- Accessibility compliance (WCAG 2.1 AA)
- Error handling validation
- Brand compliance checking

### 📋 Booking Flow Manager
**Purpose:** Security transport booking logic
**Trigger:** "Use booking-flow-manager sub-agent"  
**Focus Areas:**
- Service tier management (Standard/Executive/Shadow)
- Booking state transitions
- User preference handling
- Emergency contact management
- Payment processing logic

### 🖥️ Server Keeper
**Purpose:** Development server maintenance
**Trigger:** "Use server-keeper sub-agent"
**Focus Areas:**
- localhost:3000 monitoring
- Auto-restart on crashes
- Uptime metrics tracking
- Memory management
- Health check monitoring

## How to Use Sub-agents

### Method 1: Direct Task Invocation
```javascript
Task.invoke({
  description: "Test mobile responsiveness",
  prompt: "Use mobile-tester sub-agent. Test the questionnaire flow on all mobile screen sizes starting at 320px.",
  subagent_type: "general-purpose"
})
```

### Method 2: Using the Helper Script
```bash
# Show available sub-agents
node .claude/invoke-subagent.js

# Generate prompt for mobile testing
node .claude/invoke-subagent.js mobile-tester "Test the questionnaire on iPhone SE"

# Generate prompt for PWA optimization
node .claude/invoke-subagent.js pwa-optimizer "Optimize bundle size and service worker"
```

### Method 3: Manual Prompt Construction
Include the sub-agent trigger in your prompt to the general-purpose agent:
```
"Use mobile-tester sub-agent to test the Armora questionnaire for mobile responsiveness"
```

## Example Usage

### Testing Mobile Responsiveness
```javascript
// Using mobile-tester sub-agent
Task.invoke({
  description: "Mobile responsiveness test",
  prompt: `
    Use mobile-tester sub-agent.
    
    Test the complete Armora questionnaire flow for mobile responsiveness.
    Start at 320px width and validate:
    - No horizontal scrolling
    - Touch targets 44px minimum
    - Smooth animations
    - Proper form interactions
  `,
  subagent_type: "general-purpose"
})
```

### Optimizing PWA Features
```javascript
// Using pwa-optimizer sub-agent
Task.invoke({
  description: "PWA optimization",
  prompt: `
    Use pwa-optimizer sub-agent.
    
    Optimize the Armora app for PWA distribution:
    - Configure manifest.json
    - Implement service worker caching
    - Generate all required app icons
    - Achieve Lighthouse PWA score 100%
  `,
  subagent_type: "general-purpose"
})
```

## Benefits of Sub-agents

1. **Specialized Context:** Each sub-agent has focused expertise
2. **Consistent Behavior:** Standardized success criteria
3. **Easy Invocation:** Simple trigger phrases activate specialization
4. **Flexible System:** Can add new sub-agents without system changes
5. **Works Today:** Uses existing general-purpose agent capabilities

## Adding New Sub-agents

To add a new sub-agent, edit `.claude/subagents.json`:

```json
"new-agent": {
  "name": "New Agent Sub-agent",
  "trigger": "Use new-agent sub-agent",
  "prompt_prefix": "You are acting as the New Agent sub-agent...",
  "context": "Focus on: specific areas...",
  "success_criteria": [
    "Criteria 1",
    "Criteria 2"
  ]
}
```

## Sub-agent vs Direct General-Purpose

| Aspect | Sub-agent | Direct General-Purpose |
|--------|-----------|----------------------|
| Focus | Specialized domain | General tasks |
| Context | Pre-configured | Must provide each time |
| Success Criteria | Built-in | Must specify |
| Consistency | High | Variable |
| Ease of Use | Simple trigger | Full prompt needed |

## Conclusion

The sub-agent system provides the specialized functionality you need while working within Claude Code's current limitations. Each sub-agent maintains focused expertise and can be invoked easily through the general-purpose agent.

**Remember:** Sub-agents are essentially specialized prompts that transform the general-purpose agent into a domain expert!