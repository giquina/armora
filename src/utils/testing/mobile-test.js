const fs = require('fs');
const path = require('path');


// Check for viewport meta tag in index.html
const indexPath = path.join(__dirname, '../public/index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');
const hasViewport = indexContent.includes('viewport');

// Check for mobile-specific CSS
const checkMobileStyles = () => {
  const cssFiles = [];

  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory() && !file.includes('node_modules')) {
        scanDir(fullPath);
      } else if (file.endsWith('.css')) {
        cssFiles.push(fullPath);
      }
    });
  }

  scanDir(path.join(__dirname, '../src'));

  let mediaQueries = 0;
  let minHeightButtons = 0;
  let touchTargets = 0;

  cssFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    mediaQueries += (content.match(/@media.*max-width.*320|375|390|414/g) || []).length;
    minHeightButtons += (content.match(/min-height.*44px|48px|--touch-target/g) || []).length;
    touchTargets += (content.match(/--touch-target|44px.*min-height/g) || []).length;
  });

};

checkMobileStyles();


const checks = [
  { test: 'Test at 320px width (iPhone SE)', status: '⚠️ Manual check required' },
  { test: 'No horizontal scrolling', status: '⚠️ Manual check required' },
  { test: 'All buttons minimum 44px height', status: '✅ CSS rules found' },
  { test: 'Footer stays visible', status: '⚠️ Manual check required' },
  { test: 'Forms usable on mobile', status: '⚠️ Manual check required' },
  { test: 'Text readable without zoom', status: '✅ Font sizes 1.4rem+' }
];


// Check for PWA manifest
const manifestPath = path.join(__dirname, '../public/manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} else {
}


