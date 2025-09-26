const fs = require('fs');
const path = require('path');

// Replacement mappings - case-sensitive replacements
const replacements = {
  // Exact word replacements (case-sensitive)
  'driver': 'Protection Officer',
  'Driver': 'Protection Officer',
  'drivers': 'Protection Officers',
  'Drivers': 'Protection Officers',
  "driver's": "Protection Officer's",
  "Driver's": "Protection Officer's",

  'passenger': 'Principal',
  'Passenger': 'Principal',
  'passengers': 'Principals',
  'Passengers': 'Principals',

  'ride': 'Assignment',
  'Ride': 'Assignment',
  'rides': 'Assignments',
  'Rides': 'Assignments',

  'taxi': 'Protection Service',
  'Taxi': 'Protection Service',
  'taxis': 'Protection Services',
  'Taxis': 'Protection Services',

  'fare': 'Service Fee',
  'Fare': 'Service Fee',
  'fares': 'Service Fees',
  'Fares': 'Service Fees',

  'pickup': 'Commencement Point',
  'Pickup': 'Commencement Point',
  'pickups': 'Commencement Points',
  'Pickups': 'Commencement Points',

  'dropoff': 'Secure Destination',
  'Dropoff': 'Secure Destination',
  'dropoffs': 'Secure Destinations',
  'Dropoffs': 'Secure Destinations',

  'trip': 'Protection Detail',
  'Trip': 'Protection Detail',
  'trips': 'Protection Details',
  'Trips': 'Protection Details'
};

let totalReplacements = 0;
let filesModified = 0;
const modifiedFiles = [];

function replaceInFile(filePath) {
  // Skip non-code files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
    return;
  }

  // Skip our own script and test files
  if (filePath.includes('fix-terminology.js') ||
      filePath.includes('terminology-scan.js') ||
      filePath.includes('node_modules') ||
      filePath.includes('.git')) {
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileReplacements = 0;

    // Perform replacements with word boundaries to avoid partial matches
    Object.entries(replacements).forEach(([oldTerm, newTerm]) => {
      // Create regex with word boundaries
      const regex = new RegExp(`\\b${oldTerm}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newTerm);
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
      console.log(`✅ Modified: ${filePath.replace('/workspaces/armora/', '')} (${fileReplacements} replacements)`);
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

console.log('🔧 Armora Terminology Fix Script');
console.log('================================');
console.log('Replacing forbidden taxi terminology with protection service terms...\n');

// Backup package.json first (it contains script names we don't want to change)
const packageJson = fs.readFileSync('package.json', 'utf8');

// Start the replacement process
scanDirectory('./src');

// Restore package.json if it was modified
fs.writeFileSync('package.json', packageJson, 'utf8');

console.log('\n📊 Summary');
console.log('==========');
console.log(`Total replacements: ${totalReplacements}`);
console.log(`Files modified: ${filesModified}`);

if (modifiedFiles.length > 0) {
  console.log('\n📝 Modified Files:');
  modifiedFiles.sort((a, b) => b.replacements - a.replacements);
  modifiedFiles.slice(0, 10).forEach(file => {
    console.log(`  ${file.path} (${file.replacements} changes)`);
  });

  if (modifiedFiles.length > 10) {
    console.log(`  ... and ${modifiedFiles.length - 10} more files`);
  }
}

console.log('\n✅ Terminology fix complete!');
console.log('Next steps:');
console.log('1. Run "npm run build" to verify TypeScript compilation');
console.log('2. Run "node src/terminology-scan.js" to verify all terms replaced');
console.log('3. Test the app at http://localhost:3000');