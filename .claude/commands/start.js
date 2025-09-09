#!/usr/bin/env node

const { spawn, exec } = require('child_process');

console.log('🚀 Starting Armora app...');

// Kill any existing processes on port 3000
exec('pkill -f "node.*3000" || true', (error) => {
  if (error && !error.message.includes('No matching processes')) {
    console.log('⚠️  Note: No existing processes found on port 3000');
  }
  
  // Start the React development server
  console.log('📱 Launching React development server...');
  const startProcess = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true
  });

  startProcess.on('error', (error) => {
    console.error('❌ Failed to start the app:', error.message);
    process.exit(1);
  });

  // Don't exit the process - let npm start continue running
  console.log('✅ App starting at http://localhost:3000');
});