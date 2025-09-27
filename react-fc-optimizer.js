#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Track statistics
const stats = {
  filesProcessed: 0,
  fcFixed: 0,
  memoFixed: 0,
  reactNodeFixed: 0,
  errors: []
};

function optimizeReactFC(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let modified = false;

    // Fix React.FC pattern - add FC to imports if React.FC is used
    if (content.includes('React.FC')) {
      // Check current import line
      const importMatch = content.match(/^import.*from 'react';$/m);
      if (importMatch) {
        const importLine = importMatch[0];

        // If there's already an import from react
        if (importLine.includes('import {') && !importLine.includes('FC')) {
          // Add FC to existing named imports
          newContent = newContent.replace(
            /import \{([^}]+)\} from 'react';/,
            'import { FC, $1 } from \'react\';'
          );
          modified = true;
        } else if (importLine === "import React from 'react';") {
          // Replace default import with FC named import
          newContent = newContent.replace(
            "import React from 'react';",
            "import { FC } from 'react';"
          );
          modified = true;
        }

        // Replace React.FC with FC
        newContent = newContent.replace(/React\.FC/g, 'FC');
        stats.fcFixed++;
        modified = true;
      }
    }

    // Fix React.memo pattern
    if (content.includes('React.memo')) {
      const importMatch = newContent.match(/^import.*from 'react';$/m);
      if (importMatch) {
        const importLine = importMatch[0];

        if (importLine.includes('import {') && !importLine.includes('memo')) {
          // Add memo to existing named imports
          newContent = newContent.replace(
            /import \{([^}]+)\} from 'react';/,
            'import { memo, $1 } from \'react\';'
          );
          modified = true;
        }

        // Replace React.memo with memo
        newContent = newContent.replace(/React\.memo/g, 'memo');
        stats.memoFixed++;
        modified = true;
      }
    }

    // Fix React.ReactNode pattern
    if (content.includes('React.ReactNode')) {
      const importMatch = newContent.match(/^import.*from 'react';$/m);
      if (importMatch) {
        const importLine = importMatch[0];

        if (importLine.includes('import {') && !importLine.includes('ReactNode')) {
          // Add ReactNode to existing named imports
          newContent = newContent.replace(
            /import \{([^}]+)\} from 'react';/,
            'import { ReactNode, $1 } from \'react\';'
          );
          modified = true;
        }

        // Replace React.ReactNode with ReactNode
        newContent = newContent.replace(/React\.ReactNode/g, 'ReactNode');
        stats.reactNodeFixed++;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✓ Optimized React.FC/memo/ReactNode: ${filePath}`);
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
console.log(`🚀 Starting React.FC/memo/ReactNode optimization in ${srcDir}...`);

const tsxFiles = findTsxFiles(srcDir);
const filesToProcess = tsxFiles.filter(file => {
  const content = fs.readFileSync(file, 'utf8');
  return content.includes('React.FC') || content.includes('React.memo') || content.includes('React.ReactNode');
});

console.log(`📁 Found ${filesToProcess.length} files with React.FC/memo/ReactNode patterns`);

filesToProcess.forEach(optimizeReactFC);

console.log('\n📊 FC/memo/ReactNode Optimization Results:');
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`React.FC fixed: ${stats.fcFixed}`);
console.log(`React.memo fixed: ${stats.memoFixed}`);
console.log(`React.ReactNode fixed: ${stats.reactNodeFixed}`);
console.log(`Errors: ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log('\n❌ Errors:');
  stats.errors.forEach(error => {
    console.log(`  ${error.file}: ${error.error}`);
  });
}

console.log('\n🎉 React.FC/memo/ReactNode optimization complete!');