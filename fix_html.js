const fs = require('fs');

// ----- FIX ADMIN.HTML -----
let adminHtml = fs.readFileSync('G:/fasion/admin.html', 'utf8');

// Replace upload area using regex
adminHtml = adminHtml.replace(
    /<label class="form-label">Product Image <span class="badge bg-success"[\s\S]*?id="productImagePath"[\s\S]*?placeholder="Or paste direct image URL">/,
    `<label class="form-label">Product Images (Max 5) <span class="badge bg-success"
                                                    style="font-size: 0.6rem;">FREE AUTO-HOST</span></label>
                                            <div class="upload-area"
                                                onclick="document.getElementById('imageUpload').click()">
                                                <i class="fas fa-images d-block mb-1"></i>
                                                <p class="mb-1" style="color:var(--muted); font-size:0.88rem;">Click to
                                                    upload multiple (Free)</p>
                                                <small
                                                    style="color:var(--gold); font-size:0.75rem; font-weight: 700;">Max Size: 2MB per image</small>
                                            </div>
                                            <input type="file" id="imageUpload" accept="image/*" multiple class="d-none"
                                                onchange="handleMultiImageUpload(this)">
                                            <div id="multiPreviewContainer" class="d-flex flex-wrap gap-2 mt-2"></div>
                                            <img id="uploadPreview" class="upload-preview mt-2" alt="Preview" style="display:none;">
                                            <input type="text" class="form-control mt-2" id="productImagePath"
                                                placeholder="Or paste direct image URL">`
);

// Fix hidden inputs if not already there
if (!adminHtml.includes('id="productImagesFinal"')) {
    adminHtml = adminHtml.replace(
        /<input type="hidden" id="productImageFinal">/,
        `<input type="hidden" id="productImageFinal">\n                                    <input type="hidden" id="productImagesFinal" value="[]">`
    );
}

fs.writeFileSync('G:/fasion/admin.html', adminHtml, 'utf8');
console.log('admin.html fixed');

// ----- FIX INDEX.HTML -----
let indexHtml = fs.readFileSync('G:/fasion/index.html', 'utf8');

indexHtml = indexHtml.replace(
    /<div class="card-img-wrap">[\s\S]*?<img src="\${p\.image}" alt="\${p\.name}" loading="lazy" onerror="this\.onerror=null; this\.src='img\/f1\.jpg';">[\s\S]*?<\/div>/g,
    `<div class="card-img-wrap">
                        \${isNA ? '<span class="prod-badge new">NEW</span>' : badgeHtml}
                        \${
                            p.images && p.images.length > 1 
                            ? \`<div id="c\${p.id || Math.random().toString(36).substr(2,9)}\${isNA?'-na':''}" class="carousel slide carousel-fade h-100 w-100" data-bs-ride="carousel" data-bs-interval="2500" data-bs-pause="false">
                                 <div class="carousel-inner h-100 w-100">
                                     \${p.images.map((imgUrl, idx) => 
                                        \`<div class="carousel-item h-100 w-100 \${idx===0?'active':''}"><img src="\${imgUrl}" loading="lazy" alt="\${p.name}" onclick="openLightbox('\${imgUrl}')" style="cursor:zoom-in; object-fit:cover; width:100%; height:100%;" onerror="this.onerror=null; this.src='img/f1.jpg';"></div>\`
                                     ).join('')}
                                 </div>
                               </div>\`
                            : \`<img src="\${p.images && p.images.length ? p.images[0] : (p.image || 'img/f1.jpg')}" alt="\${p.name}" loading="lazy" onclick="openLightbox('\${p.images && p.images.length ? p.images[0] : (p.image || 'img/f1.jpg')}')" style="cursor:zoom-in;" onerror="this.onerror=null; this.src='img/f1.jpg';">\`
                        }
                    </div>`
);

fs.writeFileSync('G:/fasion/index.html', indexHtml, 'utf8');
console.log('index.html fixed');
