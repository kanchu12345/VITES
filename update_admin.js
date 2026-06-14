const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// Replace upload area HTML
html = html.replace(
    `<label class="form-label">Product Image <span class="badge bg-success"
                                                    style="font-size: 0.6rem;">FREE AUTO-HOST</span></label>
                                            <div class="upload-area"
                                                onclick="document.getElementById('imageUpload').click()">
                                                <i class="fas fa-magic d-block mb-1"></i>
                                                <p class="mb-1" style="color:var(--muted); font-size:0.88rem;">Click to
                                                    upload (Free)</p>
                                                <small
                                                    style="color:var(--gold); font-size:0.75rem; font-weight: 700;">Max
                                                    Size: 32MB</small>
                                            </div>
                                            <input type="file" id="imageUpload" accept="image/*" class="d-none"
                                                onchange="handleImageUpload(this, 'productImageFinal', 'uploadPreview')">
                                            <img id="uploadPreview" class="upload-preview mt-2" alt="Preview">
                                            <input type="text" class="form-control mt-2" id="productImagePath"
                                                placeholder="Or paste direct image URL">`,
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

// Replace hidden inputs
html = html.replace(
    `<input type="hidden" id="productImageFinal">`,
    `<input type="hidden" id="productImageFinal">
                                    <input type="hidden" id="productImagesFinal" value="[]">`
);

// Rules & Regs
html = html.replace(
    `<li><strong>Max File Size:</strong> 32MB per image (High Resolution is OK). <br><span style="color:#D4AF37;">උපරිම ගොනු ප්‍රමාණය: එක් පින්තූරයක් සඳහා 32MB.</span></li>`,
    `<li><strong>Max File Size:</strong> 2MB per image (Max 5 images). <br><span style="color:#D4AF37;">උපරිම ගොනු ප්‍රමාණය: එක් පින්තූරයක් සඳහා 2MB (උපරිම පින්තූර 5).</span></li>`
);

// Add the handleMultiImageUpload JS function before handleImageUpload
const multiJs = `
        let uploadedImagesList = [];
        async function handleMultiImageUpload(input) {
            const files = Array.from(input.files);
            if (!files.length) return;
            
            if (uploadedImagesList.length + files.length > 5) {
                showToast("Maximum 5 images allowed!");
                return;
            }

            isUploading = true;
            const container = document.getElementById('multiPreviewContainer');

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > 2 * 1024 * 1024) {
                    showToast(file.name + " exceeds 2MB limit!");
                    continue;
                }

                showToast("Uploading " + file.name + "...");
                const formData = new FormData();
                formData.append('image', file);
                const apiKey = '580db6f671331120289dba6d8ec108c2';

                try {
                    const response = await fetch(\`https://api.imgbb.com/1/upload?key=\${apiKey}\`, { method: 'POST', body: formData });
                    const data = await response.json();
                    if (data.success) {
                        uploadedImagesList.push({ url: data.data.url, deleteUrl: data.data.delete_url });
                        
                        const imgEl = document.createElement('img');
                        imgEl.src = data.data.url;
                        imgEl.style.width = '60px';
                        imgEl.style.height = '60px';
                        imgEl.style.objectFit = 'cover';
                        imgEl.style.borderRadius = '8px';
                        container.appendChild(imgEl);
                        
                        document.getElementById('productImagesFinal').value = JSON.stringify(uploadedImagesList.map(img => img.url));
                        if(uploadedImagesList.length === 1) {
                            document.getElementById('productImageFinal').value = data.data.url;
                        }
                    } else {
                        throw new Error(data.error.message);
                    }
                } catch (error) {
                    console.error("Upload error:", error);
                    showToast("Failed to upload " + file.name);
                }
            }
            isUploading = false;
            showToast("Uploads complete!");
        }

`;

html = html.replace(`let isUploading = false;`, multiJs + `let isUploading = false;`);

// In saveProduct:
// From: image: document.getElementById('productImageFinal').value || document.getElementById('productImagePath').value || 'img/f1.jpg',
// To: images: JSON.parse(document.getElementById('productImagesFinal').value || '[]'), ...
html = html.replace(
    `image: document.getElementById('productImageFinal').value || document.getElementById('productImagePath').value || 'img/f1.jpg',`,
    `image: document.getElementById('productImageFinal').value || document.getElementById('productImagePath').value || 'img/f1.jpg',
                images: document.getElementById('productImagesFinal').value ? JSON.parse(document.getElementById('productImagesFinal').value) : [],`
);

// In resetForm:
html = html.replace(
    `document.getElementById('productImageFinal').value = '';`,
    `document.getElementById('productImageFinal').value = '';
            document.getElementById('productImagesFinal').value = '[]';
            document.getElementById('multiPreviewContainer').innerHTML = '';
            uploadedImagesList = [];`
);

// In openEdit:
html = html.replace(
    `document.getElementById('uploadPreview').src = p.image;
            document.getElementById('uploadPreview').style.display = 'block';`,
    `// Setup multi previews
            document.getElementById('multiPreviewContainer').innerHTML = '';
            uploadedImagesList = (p.images || [p.image]).map(url => ({ url, deleteUrl: null }));
            document.getElementById('productImagesFinal').value = JSON.stringify(p.images || [p.image]);
            (p.images || [p.image]).forEach(url => {
                if(!url) return;
                const imgEl = document.createElement('img');
                imgEl.src = url;
                imgEl.style.width = '60px';
                imgEl.style.height = '60px';
                imgEl.style.objectFit = 'cover';
                imgEl.style.borderRadius = '8px';
                document.getElementById('multiPreviewContainer').appendChild(imgEl);
            });`
);

fs.writeFileSync('admin.html', html, 'utf8');
console.log('admin.html updated successfully.');
