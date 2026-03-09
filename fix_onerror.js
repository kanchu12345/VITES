const fs = require('fs');
const path = require('path');

const dir = 'f:/fasion';
const files = ['admin.html', 'index.html', 'products.html', 'new-arrivals.html'];

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix the onerror loop by redirecting to a known image and killing the handler so it doesn't loop
        content = content.replace(/onerror="this\.src='img\/P1\.jpg'"/g, `onerror="this.onerror=null; this.src='img/f1.jpg';"`);

        // Also fix the default product references in JS strings
        content = content.replace(/'img\/P1\.jpg'/g, `'img/f1.jpg'`);

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed image loop in ${file}`);
    }
});
