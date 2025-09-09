#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gold: '\x1b[38;5;220m'
};

function colorize(text, color) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function parseAgentFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Extract title (first # line)
    const titleLine = lines.find(line => line.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '').trim() : path.basename(filePath, '.md');
    
    // Extract purpose (line after "## Purpose")
    const purposeIndex = lines.findIndex(line => line.trim() === '## Purpose');
    const purpose = purposeIndex !== -1 && lines[purposeIndex + 1] 
      ? lines[purposeIndex + 1].trim() 
      : 'No description available';
    
    // Extract key responsibilities
    const responsibilitiesIndex = lines.findIndex(line => line.trim() === '## Key Responsibilities');
    const responsibilities = [];
    if (responsibilitiesIndex !== -1) {
      for (let i = responsibilitiesIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('- ')) {
          responsibilities.push(line.substring(2));
        } else if (line.startsWith('##')) {
          break;
        }
      }
    }
    
    return {
      name: path.basename(filePath, '.md'),
      title,
      purpose,
      responsibilities: responsibilities.slice(0, 3), // First 3 responsibilities
      file: filePath
    };
  } catch (error) {
    return {
      name: path.basename(filePath, '.md'),
      title: 'Error loading agent',
      purpose: `Error: ${error.message}`,
      responsibilities: [],
      file: filePath
    };
  }
}

function listAgents() {
  console.log(colorize('\n🤖 Armora Security Transport - Specialized Agents', 'gold'));
  console.log(colorize('=' .repeat(55), 'dim'));
  console.log(colorize('Mobile-first PWA development agents for premium security transport app', 'cyan'));
  console.log();

  try {
    if (!fs.existsSync(AGENTS_DIR)) {
      console.log(colorize('❌ Agents directory not found:', 'red'), AGENTS_DIR);
      return;
    }

    const agentFiles = fs.readdirSync(AGENTS_DIR)
      .filter(file => file.endsWith('.md'))
      .sort();

    if (agentFiles.length === 0) {
      console.log(colorize('📭 No agents found in directory:', 'yellow'), AGENTS_DIR);
      return;
    }

    console.log(colorize(`📱 Found ${agentFiles.length} specialized agents:`, 'bright'));
    console.log();

    agentFiles.forEach((file, index) => {
      const agent = parseAgentFile(path.join(AGENTS_DIR, file));
      
      console.log(colorize(`${index + 1}. ${agent.title}`, 'bright'));
      console.log(colorize(`   Agent: ${agent.name}`, 'dim'));
      console.log(colorize(`   Purpose: ${agent.purpose}`, 'cyan'));
      
      if (agent.responsibilities.length > 0) {
        console.log(colorize('   Key Functions:', 'yellow'));
        agent.responsibilities.forEach(resp => {
          console.log(colorize(`   • ${resp}`, 'white'));
        });
      }
      console.log();
    });

    console.log(colorize('🎯 Armora Project Context:', 'gold'));
    console.log(colorize('• Premium security transport mobile app (like Uber for security)', 'white'));
    console.log(colorize('• Dark theme (#1a1a2e) with gold accents (#FFD700)', 'white'));
    console.log(colorize('• Mobile-first PWA targeting app store distribution', 'white'));
    console.log(colorize('• CRITICAL: Zero horizontal scrolling requirement', 'white'));
    console.log();
    
    console.log(colorize('💡 Usage:', 'green'));
    console.log(colorize('• Use agents for specialized development tasks', 'white'));
    console.log(colorize('• Each agent understands Armora project context', 'white'));
    console.log(colorize('• Agents work together for mobile-first development', 'white'));

  } catch (error) {
    console.log(colorize('❌ Error reading agents:', 'red'), error.message);
  }
}

function showAgent(agentName) {
  const agentFile = path.join(AGENTS_DIR, `${agentName}.md`);
  
  if (!fs.existsSync(agentFile)) {
    console.log(colorize(`❌ Agent '${agentName}' not found`, 'red'));
    console.log(colorize('Available agents:', 'yellow'));
    listAgents();
    return;
  }

  const agent = parseAgentFile(agentFile);
  
  console.log(colorize(`\n🤖 ${agent.title}`, 'gold'));
  console.log(colorize('='.repeat(agent.title.length + 3), 'dim'));
  console.log();
  
  try {
    const content = fs.readFileSync(agentFile, 'utf8');
    console.log(content);
  } catch (error) {
    console.log(colorize('❌ Error reading agent file:', 'red'), error.message);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'list':
  case undefined:
    listAgents();
    break;
  case 'show':
  case 'view':
    const agentName = process.argv[3];
    if (!agentName) {
      console.log(colorize('❌ Please specify an agent name', 'red'));
      console.log(colorize('Usage: agents show <agent-name>', 'yellow'));
    } else {
      showAgent(agentName);
    }
    break;
  case 'help':
    console.log(colorize('\n🤖 Agents Command Help', 'gold'));
    console.log(colorize('='.repeat(22), 'dim'));
    console.log();
    console.log(colorize('Available commands:', 'bright'));
    console.log(colorize('  agents         ', 'green') + colorize('List all agents', 'white'));
    console.log(colorize('  agents list    ', 'green') + colorize('List all agents', 'white'));
    console.log(colorize('  agents show <name>', 'green') + colorize('Show specific agent details', 'white'));
    console.log(colorize('  agents help    ', 'green') + colorize('Show this help message', 'white'));
    console.log();
    break;
  default:
    // Try to show the agent by name
    showAgent(command);
    break;
}