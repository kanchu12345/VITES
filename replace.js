const fs = require('fs');
const files = ['g:/fasion/index.html', 'g:/fasion/products.html', 'g:/fasion/new-arrivals.html'];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="css/premium.css">');
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } catch (e) {
        console.error(`Failed to process ${file}: ${e.message}`);
    }
});
