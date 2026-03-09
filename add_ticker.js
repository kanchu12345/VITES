const fs = require('fs');
const path = require('path');

const dir = 'f:/fasion';
const files = [
    { file: 'index.html', text: '✨ Welcome to VITES Designs! &nbsp;|&nbsp; New Arrivals Every Week! &nbsp;|&nbsp; Men | Women | Kids | Accessories &nbsp;|&nbsp; Visit Us: Bosewana, Bandarawela &nbsp;|&nbsp; WhatsApp: 0703430343 &nbsp;|&nbsp; ✨ Fashion for Everyone!' },
    { file: 'about.html', text: '✨ Discover Our Story &nbsp;|&nbsp; Premium Materials &nbsp;|&nbsp; Best Customer Service &nbsp;|&nbsp; Passion for Fashion! ✨' },
    { file: 'contact.html', text: '✨ Need help? Contact us anytime! &nbsp;|&nbsp; WhatsApp: 0703430343 &nbsp;|&nbsp; Visit our store: Bosewana, Bandarawela &nbsp;|&nbsp; We love hearing from you! ✨' },
    { file: 'products.html', text: '✨ Explore our Collections! &nbsp;|&nbsp; Men | Women | Kids &nbsp;|&nbsp; Unbeatable Prices &nbsp;|&nbsp; Find your perfect outfit today! ✨' },
    { file: 'new-arrivals.html', text: '✨ JUST DROPPED! Fresh styles for the new season! &nbsp;|&nbsp; Limited Stock Available &nbsp;|&nbsp; Upgrade your wardrobe! ✨' },
    { file: 'admin.html', text: '✨ Admin Dashboard &nbsp;|&nbsp; Manage Products, Orders, and Customers &nbsp;|&nbsp; VITES Designs Management System ✨' },
    { file: 'vites-secure-auth-2026.html', text: '✨ Secure Admin Portal &nbsp;|&nbsp; Authorized Personnel Only &nbsp;|&nbsp; VITES Designs Management System ✨' },
    { file: 'admin-register.html', text: '✨ Admin Registration &nbsp;|&nbsp; Secure Admin Portal &nbsp;|&nbsp; VITES Designs Management System ✨' }
];

files.forEach(({ file, text }) => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        const tickerHtml = `\n    <!-- TICKER -->\n    <div class="ticker-wrap">\n        <span class="ticker-text">${text}</span>\n    </div>\n`;

        // Remove existing ticker if it exists
        content = content.replace(/\s*<!-- TICKER -->\s*<div class="ticker-wrap">\s*<span class="ticker-text">.*?<\/span>\s*<\/div>/is, '');

        content = content.replace(/<body>/i, `<body>${tickerHtml}`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ticker in ${file}`);
    }
});
