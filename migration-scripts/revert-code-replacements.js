const fs = require('fs');

// Files that need their code-level references reverted (keep UI text changed)
const filesToRevert = [
  'src/components/Booking/PaymentIntegration.tsx',
  'src/components/Map/BookingMap.tsx',
  'src/components/ServiceSelection/ServiceSelection.tsx',
  'src/utils/assignmentHistory.ts',
  'src/contexts/ProtectionAssignmentContext.tsx',
  'src/components/ProtectionAssignment/ProtectionAssignmentErrorBoundary.tsx',
  'src/components/ProtectionAssignment/WhereWhenView.tsx',
  'src/App.tsx'
];

// Code-level reversions (keep UI text as Protection Officer etc)
const codeReversions = {
  'Protection Officer': 'driver',    // Code variable names
  'Commencement Point': 'pickup',    // Property names
  'Secure Destination': 'dropoff',   // Property names
  'Assignment': 'ride',              // Some code contexts
  'Protection Detail': 'trip'        // Some code contexts
};

console.log('🔧 Reverting Code-Level Terminology (keeping UI text)');
console.log('=====================================================');

let totalReverted = 0;

filesToRevert.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileReverted = 0;

  // Only revert in code contexts, not in user-facing strings
  Object.entries(codeReversions).forEach(([newTerm, oldTerm]) => {
    // Revert property names and variable names, but keep string literals
    const patterns = [
      new RegExp(`\\b${newTerm}\\s*:`, 'g'),           // Object properties: "Commencement Point:"
      new RegExp(`\\.${newTerm}\\b`, 'g'),             // Property access: ".Commencement Point"
      new RegExp(`\\{\\s*${newTerm}\\s*\\}`, 'g'),     // Destructuring: "{ Commencement Point }"
      new RegExp(`const\\s+${newTerm}\\b`, 'g'),       // Variable names: "const Protection Officer"
      new RegExp(`let\\s+${newTerm}\\b`, 'g'),         // Variable names: "let Protection Officer"
      new RegExp(`\\b${newTerm}Location\\b`, 'g'),     // Combined: "Commencement PointLocation"
      new RegExp(`\\b${newTerm}Address\\b`, 'g'),      // Combined: "Commencement PointAddress"
    ];

    patterns.forEach(pattern => {
      const before = content;
      content = content.replace(pattern, (match) => {
        return match.replace(newTerm, oldTerm);
      });
      if (content !== before) {
        fileReverted++;
        totalReverted++;
      }
    });
  });

  if (fileReverted > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Reverted: ${filePath} (${fileReverted} code fixes)`);
  } else {
    console.log(`ℹ️ No reversions needed: ${filePath}`);
  }
});

console.log(`\n📊 Total code reversions: ${totalReverted}`);
console.log('✅ UI text kept as Protection Officer/Principal/Assignment');
console.log('✅ Code variables restored to pickup/driver/ride for functionality');