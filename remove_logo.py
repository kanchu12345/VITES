import os
import glob

def remove_logo_image():
    html_files = glob.glob('f:/fasion/*.html')
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Remove the image tag
        content = content.replace('<img src="img/logovts.png" alt="VITES">', '')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            
    print("Done removing logo image.")

if __name__ == '__main__':
    remove_logo_image()
