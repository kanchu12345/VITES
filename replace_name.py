import os
import glob

def replace_in_files():
    html_files = glob.glob('f:/fasion/*.html')
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace occurrences
        content = content.replace('VITES Designs', 'VITES Clothing')
        content = content.replace('VITES DESIGNS', 'VITES CLOTHING')
        content = content.replace('VITES\\n                    Designs', 'VITES\\n                    Clothing')
        content = content.replace('VITES\n                    Designs', 'VITES\n                    Clothing')
        content = content.replace('Designs Management System', 'Clothing Management System')
        content = content.replace('class="text-gold">Designs</span>', 'class="text-gold">Clothing</span>')
        
        # Ensure titles are correct just in case
        # We don't want to replace vitesdesigns@gmail.com or vitesdesigns.com
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            
    print("Done replacing.")

if __name__ == '__main__':
    replace_in_files()
