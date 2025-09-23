const fs = require('fs');
const path = require('path');

// Files and their specific fixes needed
const syntaxFixes = [
  {
    file: 'src/components/Booking/PaymentIntegration.tsx',
    fixes: [
      { search: /const \{ service, Commencement Point, destination/g, replace: 'const { service, pickup, destination' }
    ]
  },
  {
    file: 'src/components/Map/BookingMap.tsx',
    fixes: [
      { search: /Commencement Point\?: Location;/g, replace: 'pickup?: Location;' },
      { search: /Commencement Point,/g, replace: 'pickup,' }
    ]
  },
  {
    file: 'src/components/ProtectionAssignment/ProtectionAssignmentErrorBoundary.tsx',
    fixes: [
      { search: /\{preservedState\.protectionAssignmentData\.Commencement Point\}/g, replace: '{preservedState.protectionAssignmentData.pickup}' }
    ]
  },
  {
    file: 'src/components/ProtectionAssignment/WhereWhenView.tsx',
    fixes: [
      { search: /Commencement Point: fromLocation,/g, replace: 'pickup: fromLocation,' }
    ]
  },
  {
    file: 'src/components/ServiceSelection/ServiceSelection.tsx',
    fixes: [
      { search: /!protectionAssignmentData\.Commencement PointLocation && !protectionAssignmentData\.Commencement Point/g, replace: '!protectionAssignmentData.pickupLocation && !protectionAssignmentData.pickup' }
    ]
  },
  {
    file: 'src/contexts/ProtectionAssignmentContext.tsx',
    fixes: [
      { search: /Commencement Point\?: Location; \/\/ Alias for compatibility/g, replace: 'pickup?: Location; // Alias for compatibility' }
    ]
  },
  {
    file: 'src/utils/assignmentHistory.ts',
    fixes: [
      { search: /Commencement Point: assignment\.Commencement Point,/g, replace: 'pickup: assignment.pickup,' }
    ]
  }
];

console.log('🔧 Fixing Syntax Errors from Terminology Replacement');
console.log('===================================================');

let totalFixed = 0;

syntaxFixes.forEach(fileConfig => {
  const filePath = fileConfig.file;

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;

  fileConfig.fixes.forEach(fix => {
    const before = content;
    content = content.replace(fix.search, fix.replace);
    if (content !== before) {
      fileFixed++;
      totalFixed++;
    }
  });

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath} (${fileFixed} fixes)`);
  } else {
    console.log(`ℹ️ No fixes needed: ${filePath}`);
  }
});

console.log(`\n📊 Total syntax fixes applied: ${totalFixed}`);
console.log('✅ Ready to try build again!');