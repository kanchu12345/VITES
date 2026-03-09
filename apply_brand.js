const fs = require('fs');
const path = require('path');

const dir = 'f:/fasion';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// Update HTML
files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Navbar brand
    content = content.replace(/style="font-family:\s*'Outfit',\s*sans-serif;\s*font-size:\s*1.4rem;\s*font-weight:\s*700;\s*color:\s*var\(--primary\);\s*letter-spacing:\s*1px;"/g, 'class="txt-brand-gradient" style="font-family: \'Outfit\', sans-serif; font-size: 1.5rem; font-weight: 900; letter-spacing: 1px;"');

    // 2. Index Hero
    content = content.replace(/<h1><span class="txt-teal">VITES<\/span> <span class="txt-gold">Designs<\/span><\/h1>/g, '<h1><span class="txt-brand-gradient">VITES Designs</span></h1>');

    // 3. About Hero
    content = content.replace(/<h1>About <span class="txt-gold">VITES Designs<\/span><\/h1>/g, '<h1>About <span class="txt-brand-gradient">VITES Designs</span></h1>');

    // 4. Contact Hero
    content = content.replace(/<h1><span class="txt-teal">Contact<\/span> <span class="txt-gold">VITES Designs<\/span><\/h1>/g, '<h1><span class="txt-teal">Contact</span> <span class="txt-brand-gradient">VITES Designs</span></h1>');

    fs.writeFileSync(filePath, content, 'utf8');
});
console.log('HTML updated.');

// Update CSS
const cssPath = path.join(dir, 'css', 'premium.css');
let css = fs.readFileSync(cssPath, 'utf8');

const extraCSS = `
.txt-brand-gradient {
    background: linear-gradient(to right, #F5A623, #E91E63, #9C27B0) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    display: inline-block;
}
`;

if (!css.includes('.txt-brand-gradient')) {
    css += extraCSS;
}

// Update existing footer gradient
css = css.replace(/background: linear-gradient\(135deg, #D4AF37, #E91E8C, #7C3AED\);/g, 'background: linear-gradient(to right, #F5A623, #E91E63, #9C27B0);');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS updated.');
