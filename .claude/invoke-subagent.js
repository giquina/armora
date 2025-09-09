#!/usr/bin/env node

/**
 * Armora Sub-agent Invocation Helper
 * Usage: node .claude/invoke-subagent.js <subagent-name> "<task-description>"
 * 
 * This script helps invoke specialized sub-agents through the general-purpose agent
 */

const fs = require('fs');
const path = require('path');

// Load sub-agent configurations
const subagentsPath = path.join(__dirname, 'subagents.json');
const subagents = JSON.parse(fs.readFileSync(subagentsPath, 'utf8'));

// Get command line arguments
const [,, subagentName, taskDescription] = process.argv;

// Available sub-agents
const availableSubagents = Object.keys(subagents.subagents);

// Show help if no arguments
if (!subagentName) {
  console.log('\n🤖 Armora Sub-agent System\n');
  console.log('Available sub-agents:');
  availableSubagents.forEach(name => {
    const agent = subagents.subagents[name];
    console.log(`  • ${name}: ${agent.name}`);
  });
  console.log('\nUsage: node .claude/invoke-subagent.js <subagent-name> "<task>"');
  console.log('Example: node .claude/invoke-subagent.js mobile-tester "Test the questionnaire on mobile"');
  process.exit(0);
}

// Validate sub-agent exists
if (!availableSubagents.includes(subagentName)) {
  console.error(`❌ Sub-agent '${subagentName}' not found.`);
  console.log(`Available sub-agents: ${availableSubagents.join(', ')}`);
  process.exit(1);
}

// Get sub-agent configuration
const subagent = subagents.subagents[subagentName];

// Generate the prompt for the general-purpose agent
const prompt = `
${subagent.prompt_prefix}

${subagent.context}

Task: ${taskDescription || 'Perform comprehensive testing and validation'}

Success Criteria:
${subagent.success_criteria ? subagent.success_criteria.map(c => `- ${c}`).join('\n') : ''}

${subagent.booking_states ? 'Booking States:\n' + subagent.booking_states.map(s => `- ${s}`).join('\n') : ''}
${subagent.monitoring_tasks ? 'Monitoring Tasks:\n' + subagent.monitoring_tasks.map(t => `- ${t}`).join('\n') : ''}

Please execute this specialized task with the focus and expertise of the ${subagent.name}.
`;

// Output the formatted prompt
console.log('\n📋 Sub-agent Invocation Prompt Generated:\n');
console.log('========================================');
console.log(prompt);
console.log('========================================\n');
console.log('💡 To use this sub-agent, copy the prompt above and use it with the general-purpose agent.');
console.log('   Or use this in your Task tool call:\n');
console.log(`Task.invoke({
  description: "${taskDescription || 'Specialized task'}",
  prompt: \`${prompt}\`,
  subagent_type: "general-purpose"
})`);