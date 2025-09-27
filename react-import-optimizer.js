#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Track statistics
const stats = {
  filesProcessed: 0,
  importsRemoved: 0,
  importsConverted: 0,
  importsKept: 0,
  errors: []
};

function optimizeReactImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Pattern 1: import React from 'react'; (complete removal candidate)
      if (line.match(/^import React from 'react';$/)) {
        // Check if React is used in the file (beyond JSX)
        const hasReactUsage = content.match(/React\.(FC|ReactNode|memo|useState|useEffect|Component|createElement)/);

        if (!hasReactUsage) {
          // Remove the import completely
          lines.splice(i, 1);
          stats.importsRemoved++;
          modified = true;
          i--; // Adjust index after removal
        }
      }

      // Pattern 2: import React, { ... } from 'react'; (convert to named imports)
      else if (line.match(/^import React, \{(.+)\} from 'react';$/)) {
        const match = line.match(/^import React, \{(.+)\} from 'react';$/);
        if (match) {
          const namedImports = match[1];
          // Check if React is used beyond JSX
          const hasReactUsage = content.match(/React\.(FC|ReactNode|memo|Component|createElement)/);

          if (!hasReactUsage) {
            lines[i] = `import {${namedImports}} from 'react';`;
            stats.importsConverted++;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`✓ Optimized: ${filePath}`);
    }

    stats.filesProcessed++;

  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
  }
}

function findTsxFiles(dir) {
  const files = [];

  function walk(directory) {
    const items = fs.readdirSync(directory);

    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(fullPath);
      } else if (item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// Main execution
const srcDir = process.argv[2] || './src';
console.log(`🚀 Starting React import optimization in ${srcDir}...`);

const tsxFiles = findTsxFiles(srcDir);
console.log(`📁 Found ${tsxFiles.length} .tsx files`);

tsxFiles.forEach(optimizeReactImports);

console.log('\n📊 Optimization Results:');
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Imports removed completely: ${stats.importsRemoved}`);
console.log(`Imports converted to named: ${stats.importsConverted}`);
console.log(`Errors: ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log('\n❌ Errors:');
  stats.errors.forEach(error => {
    console.log(`  ${error.file}: ${error.error}`);
  });
}

console.log('\n🎉 React import optimization complete!');