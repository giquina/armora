const fs = require('fs');
const path = require('path');

// Final consistency fixes for SIA compliance
const consistencyFixes = [
  // BookingMap.tsx - Fix mixed references
  {
    file: 'src/components/Map/BookingMap.tsx',
    fixes: [
      { from: '[pickup.lat, pickup.lng]', to: '[commencementPoint.lat, commencementPoint.lng]' },
      { from: '[destination.lat, destination.lng]', to: '[secureDestination.lat, secureDestination.lng]' },
      { from: 'L.marker([pickup.lat, pickup.lng])', to: 'L.marker([commencementPoint.lat, commencementPoint.lng])' },
      { from: 'L.marker([destination.lat, destination.lng])', to: 'L.marker([secureDestination.lat, secureDestination.lng])' },
      { from: 'pickup.address || \'commencementPoint Point\'', to: 'commencementPoint.address || \'Commencement Point\'' },
      { from: 'position={[pickup.lat, pickup.lng]}', to: 'position={[commencementPoint.lat, commencementPoint.lng]}' },
      { from: 'position={[destination.lat, destination.lng]}', to: 'position={[secureDestination.lat, secureDestination.lng]}' },
      { from: 'commencementPoint ? [pickup.lat, pickup.lng]', to: 'commencementPoint ? [commencementPoint.lat, commencementPoint.lng]' },
      { from: 'icon={pickupIcon}', to: 'icon={commencementPointIcon}' }
    ]
  },

  // PaymentIntegration.tsx - Fix dependency array
  {
    file: 'src/components/Booking/PaymentIntegration.tsx',
    fixes: [
      { from: '}, [protectionAssignmentData, finalCost, isCorporateBooking, service, commencementPoint, destination]);', to: '}, [protectionAssignmentData, finalCost, isCorporateBooking, service, commencementPoint, secureDestination]);' }
    ]
  },

  // LocationPlanningSection.tsx - Fix variable name inconsistencies
  {
    file: 'src/components/Dashboard/LocationPlanningSection.tsx',
    fixes: [
      { from: 'const [commencementAddress, setPickupAddress]', to: 'const [commencementAddress, setCommencementAddress]' },
      { from: 'setPickupAddress(mockAddress);', to: 'setCommencementAddress(mockAddress);' },
      { from: 'setPickupAddress(value);', to: 'setCommencementAddress(value);' },
      { from: 'ref={pickupInputRef}', to: 'ref={commencementPointInputRef}' },
      { from: 'const handlePickupChange', to: 'const handleCommencementChange' },
      { from: 'onChange={handlePickupChange}', to: 'onChange={handleCommencementChange}' },
      { from: 'errors.commencementPoint', to: 'errors.commencementPoint' },
      { from: 'commencementPointAddress.trim()', to: 'commencementAddress.trim()' },
      { from: 'id="Secure Destination-location"', to: 'id="secure-destination-location"' },
      { from: 'onKeyPress={(e) => handleKeyPress(e, \'Secure Destination\')}', to: 'onKeyPress={(e) => handleKeyPress(e, \'secureDestination\')}' },
      { from: 'errors.Secure Destination', to: 'errors.secureDestination' },
      { from: 'className={`${styles.input} ${errors.Secure Destination', to: 'className={`${styles.input} ${errors.secureDestination' }
    ]
  },

  // UserPreferences.ts - Fix mixed variable names
  {
    file: 'src/utils/userPreferences.ts',
    fixes: [
      { from: 'const routeKey = `${pickup.lat.toFixed(4)},${pickup.lng.toFixed(4)}-${destination.lat.toFixed(4)},${destination.lng.toFixed(4)}`;', to: 'const routeKey = `${commencementPoint.lat.toFixed(4)},${commencementPoint.lng.toFixed(4)}-${secureDestination.lat.toFixed(4)},${secureDestination.lng.toFixed(4)}`;' },
      { from: 'Math.abs(route.commencementPoint.lat - pickup.lat)', to: 'Math.abs(route.commencementPoint.lat - commencementPoint.lat)' },
      { from: 'Math.abs(route.commencementPoint.lng - pickup.lng)', to: 'Math.abs(route.commencementPoint.lng - commencementPoint.lng)' },
      { from: 'Math.abs(route.secureDestination.lat - destination.lat)', to: 'Math.abs(route.secureDestination.lat - secureDestination.lat)' },
      { from: 'Math.abs(route.secureDestination.lng - destination.lng)', to: 'Math.abs(route.secureDestination.lng - secureDestination.lng)' },
      { from: 'commencementPointLocation', to: 'commencementLocation' },
      { from: 'secureDestinationLocation', to: 'destinationLocation' }
    ]
  },

  // ProtectionAssignmentContext.tsx - Fix mixed references
  {
    file: 'src/contexts/ProtectionAssignmentContext.tsx',
    fixes: [
      { from: 'secureDestinationCoords', to: 'destinationCoords' }
    ]
  }
];

console.log('🔧 FINAL SIA CONSISTENCY FIXES');
console.log('==============================');

let totalFixes = 0;

consistencyFixes.forEach(({ file, fixes }) => {
  const filePath = file;

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixes = 0;

  fixes.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      fileFixes++;
      totalFixes++;
    }
  });

  if (fileFixes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file} (${fileFixes} consistency fixes)`);
  } else {
    console.log(`ℹ️  No fixes needed: ${file}`);
  }
});

console.log(`\n📊 Total consistency fixes: ${totalFixes}`);
console.log('✅ SIA compliance consistency complete!');
console.log('🏗️  Ready for build test...');