const fs = require('fs');
const path = require('path');

// SIA-compliant code property replacements
const codePropertyReplacements = {
  // Property names and object keys
  'pickup:': 'commencementPoint:',
  'pickup,': 'commencementPoint,',
  'pickup ': 'commencementPoint ',
  'pickup}': 'commencementPoint}',
  '.pickup': '.commencementPoint',
  '{pickup}': '{commencementPoint}',
  '(pickup': '(commencementPoint',
  'pickup)': 'commencementPoint)',

  'destination:': 'secureDestination:',
  'destination,': 'secureDestination,',
  'destination ': 'secureDestination ',
  'destination}': 'secureDestination}',
  '.destination': '.secureDestination',
  '{destination}': '{secureDestination}',
  '(destination': '(secureDestination',
  'destination)': 'secureDestination)',

  // Variable and parameter names
  'pickup?:': 'commencementPoint?:',
  'destination?:': 'secureDestination?:',
  'pickupLocation': 'commencementLocation',
  'dropoffLocation': 'secureDestinationLocation',
  'pickupAddress': 'commencementAddress',
  'dropoffAddress': 'secureDestinationAddress',

  // Function parameters and destructuring
  'const pickup': 'const commencementPoint',
  'let pickup': 'let commencementPoint',
  'var pickup': 'var commencementPoint',
  'pickup =': 'commencementPoint =',
  'pickup:': 'commencementPoint:',

  // Error and state properties
  'errors.pickup': 'errors.commencementPoint',
  'errors.dropoff': 'errors.secureDestination',

  // HTML attributes and IDs (keep some for DOM compatibility)
  'pickup-location': 'commencement-point-location',
  'dropoff-location': 'secure-destination-location',

  // Comment and label text
  'pickup Location': 'Commencement Point',
  'dropoff Location': 'Secure Destination',
  'Pickup Location': 'Commencement Point',
  'Dropoff Location': 'Secure Destination',

  // Form field names and types
  "'pickup'": "'commencementPoint'",
  '"pickup"': '"commencementPoint"',
  "'dropoff'": "'secureDestination'",
  '"dropoff"': '"secureDestination"',

  // Route and address properties
  'from: protectionAssignmentData.pickup': 'from: protectionAssignmentData.commencementPoint',
  'to: protectionAssignmentData.destination': 'to: protectionAssignmentData.secureDestination'
};

let totalReplacements = 0;
let filesModified = 0;
const modifiedFiles = [];

function replaceInFile(filePath) {
  // Skip non-code files and our own scripts
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
    return;
  }

  if (filePath.includes('sia-compliant-fix.js') ||
      filePath.includes('terminology-scan.js') ||
      filePath.includes('fix-terminology.js') ||
      filePath.includes('node_modules') ||
      filePath.includes('.git')) {
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileReplacements = 0;

    // Apply SIA-compliant property replacements
    Object.entries(codePropertyReplacements).forEach(([oldPattern, newPattern]) => {
      const regex = new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newPattern);
        fileReplacements += matches.length;
        totalReplacements += matches.length;
      }
    });

    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      modifiedFiles.push({
        path: filePath.replace('/workspaces/armora/', ''),
        replacements: fileReplacements
      });
      console.log(`✅ Fixed: ${filePath.replace('/workspaces/armora/', '')} (${fileReplacements} SIA-compliant fixes)`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      scanDirectory(fullPath);
    } else if (stat.isFile()) {
      replaceInFile(fullPath);
    }
  });
}

console.log('🛡️ SIA COMPLIANCE FIX - Protection Service Code Properties');
console.log('========================================================');
console.log('Converting all code properties to professional protection terminology...\n');

// Start the replacement process
scanDirectory('./src');

console.log('\n📊 SIA Compliance Summary');
console.log('========================');
console.log(`Total SIA-compliant fixes: ${totalReplacements}`);
console.log(`Files updated: ${filesModified}`);

if (modifiedFiles.length > 0) {
  console.log('\n📝 Files Updated for SIA Compliance:');
  modifiedFiles.sort((a, b) => b.replacements - a.replacements);
  modifiedFiles.slice(0, 10).forEach(file => {
    console.log(`  ${file.path} (${file.replacements} protection service updates)`);
  });

  if (modifiedFiles.length > 10) {
    console.log(`  ... and ${modifiedFiles.length - 10} more files`);
  }
}

console.log('\n✅ SIA COMPLIANCE COMPLETE!');
console.log('🛡️ All code now uses professional close protection terminology');
console.log('📋 Next: npm run build to verify TypeScript compilation');
console.log('🚀 Then: Test app at http://localhost:3000');