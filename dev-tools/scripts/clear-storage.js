// Simple script to clear localStorage for testing
console.log('Clearing localStorage...');
if (typeof localStorage !== 'undefined') {
  localStorage.clear();
  console.log('LocalStorage cleared');
} else {
  console.log('localStorage not available');
}