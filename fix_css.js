// Fix CSS background-clip compatibility lints
const fs = require('fs');

const cssPath = 'f:/fasion/css/premium.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace standard occurrences of the webkit background clip with both
cssContent = cssContent.replace(/-webkit-background-clip: text;/g, '-webkit-background-clip: text; background-clip: text;');

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Fixed CSS background-clip definitions.');
