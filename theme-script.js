const fs = require('fs');
const path = require('path');

const directory = 'g:/fasion';
const files = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // CSS variables replacements
    content = content.replace(/--rainbow-grad: linear-gradient\([^)]+\);/g, '--gold-grad: linear-gradient(135deg, #D4AF37, #C5A059, #B98E40);');
    content = content.replace(/--rainbow-soft: linear-gradient\([^)]+\);/g, '--gold-soft: rgba(212, 175, 55, 0.1);');
    content = content.replace(/--rainbow-grad/g, '--gold-grad');
    content = content.replace(/--rainbow-soft/g, '--gold-soft');
    
    // Class replacements
    content = content.replace(/rainbow-nav/g, 'gold-nav');
    content = content.replace(/btn-rainbow/g, 'btn-gold');
    content = content.replace(/btn-outline-rainbow/g, 'btn-outline-gold');
    content = content.replace(/rainbow-ticker/g, 'gold-ticker');
    content = content.replace(/rainbow-underline/g, 'gold-underline');
    content = content.replace(/price-rainbow/g, 'price-gold');
    content = content.replace(/rainbow-word/g, 'gold-word');
    content = content.replace(/rainbow-hr/g, 'gold-hr');

    // Color/Emoji replacements
    content = content.replace(/🌈/g, '✨');
    content = content.replace(/var\(--rb1\)/g, '#1a1a24');
    content = content.replace(/var\(--rb3\)/g, '#D4AF37');
    content = content.replace(/var\(--rb5\)/g, '#C5A059');
    
    // For admin pages specifically: background: linear-gradient(135deg, #00CC44, #0044FF);
    content = content.replace(/linear-gradient\(135deg, #00CC44, #0044FF\)/g, 'var(--gold-grad)');

    // For index.root
    content = content.replace(/--rb1: #FF0000;\s*--rb2: #FF7700;\s*--rb3: #FFD700;\s*--rb4: #00CC44;\s*--rb5: #0044FF;\s*--rb6: #8800CC;/g, 
        '--gold-1: #1a1a24;\n            --gold-2: #252533;\n            --gold-3: #D4AF37;\n            --gold-4: #C5A059;');

    // Admin theme overrides (to make it Midnight Velvet)
    if (file.includes('admin')) {
        content = content.replace(/background: linear-gradient\(135deg, #0a0a0a 0%, #1a0a2e 40%, #0a1a0a 100%\);/g, 
            'background: linear-gradient(135deg, #0f0f15 0%, #16161e 40%, #0f0f15 100%);');
        content = content.replace(/--sidebar-bg: #0d0d17;/g, '--sidebar-bg: #0f0f15;');
        content = content.replace(/--body-bg: #0f0f1a;/g, '--body-bg: #111118;');
        content = content.replace(/--card-bg: #1a1a2e;/g, '--card-bg: #1e1e28;');
        // Change bg circles colors
        content = content.replace(/background: radial-gradient\(circle, #FF0000, transparent\);/g, 'background: radial-gradient(circle, #D4AF37, transparent);');
        content = content.replace(/background: radial-gradient\(circle, #0044FF, transparent\);/g, 'background: radial-gradient(circle, #C5A059, transparent);');
        content = content.replace(/background: radial-gradient\(circle, #FFD700, transparent\);/g, 'background: radial-gradient(circle, #E6C875, transparent);');
        content = content.replace(/box-shadow: 0 10px 30px rgba\(255, 0, 100, 0.4\);/g, 'box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);');
        content = content.replace(/background: linear-gradient\(135deg, rgba\(255, 0, 0, 0.2\), rgba\(0, 68, 255, 0.2\)\);/g, 'background: rgba(212, 175, 55, 0.1);');
    } else {
        // Main pages buttons shadow
        content = content.replace(/box-shadow: 0 8px 30px rgba\(255, 0, 100, 0.4\);/g, 'box-shadow: 0 8px 30px rgba(212, 175, 55, 0.3);');
        content = content.replace(/box-shadow: 0 15px 40px rgba\(255, 0, 100, 0.6\);/g, 'box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5);');
    }

    fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Update complete');
