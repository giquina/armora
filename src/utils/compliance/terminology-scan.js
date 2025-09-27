const fs = require('fs');
const path = require('path');

const forbiddenTerms = ['taxi', 'protection officer', 'principal', 'protection service', 'fare', 'protection detail', 'pickup', 'dropoff'];
const violations = [];

function scanFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js')) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Skip comments and imports
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.includes('import ')) return;

    forbiddenTerms.forEach(term => {
      // Look for the term as a standalone word (not part of another word)
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(line)) {
        violations.push({
          file: filePath.replace('/workspaces/armora/', ''),
          line: index + 1,
          term: term,
          content: line.trim().substring(0, 100) // Truncate long lines
        });
      }
    });
  });
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      scanDirectory(fullPath);
    } else {
      try {
        scanFile(fullPath);
      } catch (e) {
        // Ignore files we can't read
      }
    }
  });
}


scanDirectory('./src');

if (violations.length > 0) {
  console.error('❌ Found', violations.length, 'terminology violations:');

  // Group by file
  const byFile = {};
  violations.forEach(v => {
    if (!byFile[v.file]) byFile[v.file] = [];
    byFile[v.file].push(v);
  });

  Object.keys(byFile).forEach(file => {
    byFile[file].forEach(v => {
    });
  });
} else {
}