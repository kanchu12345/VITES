const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Lightbox HTML
const lightboxHtml = `
    <!-- LIGHTBOX MODAL -->
    <div class="modal fade" id="lightboxModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content bg-transparent border-0">
                <div class="modal-header border-0 p-0 text-end d-block">
                    <button type="button" class="btn-close btn-close-white ms-auto m-2" data-bs-dismiss="modal" aria-label="Close" style="filter: invert(1); z-index: 1055; position: relative;"></button>
                </div>
                <div class="modal-body p-0 text-center">
                    <img id="lightboxImage" src="" class="img-fluid rounded" style="max-height: 90vh;">
                </div>
            </div>
        </div>
    </div>
`;
html = html.replace('<!-- MODALS -->', lightboxHtml + '\n    <!-- MODALS -->');

// 2. JS: openLightbox
const lightboxJs = `
        function openLightbox(url) {
            document.getElementById('lightboxImage').src = url;
            new bootstrap.Modal(document.getElementById('lightboxModal')).show();
        }
`;
html = html.replace('function openOrderModal(p) {', lightboxJs + '\n        function openOrderModal(p) {');

// 3. createCard: Add carousel and onclick
const oldCreateCardImg = `                      <div class="card-img-wrap">
                          \${isNA ? '<span class="prod-badge new">NEW</span>' : badgeHtml}
                          <img src="\${p.image}" alt="\${p.name}" loading="lazy" onerror="this.onerror=null; this.src='img/f1.jpg';">
                      </div>`;

const newCreateCardImg = `                      <div class="card-img-wrap">
                          \${isNA ? '<span class="prod-badge new">NEW</span>' : badgeHtml}
                          \${
                              p.images && p.images.length > 1 
                              ? \`<div id="c_\${p.id}_\${isNA ? 'na' : 'reg'}" class="carousel slide carousel-fade h-100 w-100" data-bs-ride="carousel" data-bs-interval="2500" data-bs-pause="false">
                                   <div class="carousel-inner h-100 w-100">
                                       \${p.images.map((imgUrl, idx) => 
                                          \`<div class="carousel-item h-100 w-100 \${idx===0?'active':''}"><img src="\${imgUrl}" loading="lazy" alt="\${p.name}" onclick="openLightbox('\${imgUrl}')" style="cursor:zoom-in;" onerror="this.onerror=null; this.src='img/f1.jpg';"></div>\`
                                       ).join('')}
                                   </div>
                                 </div>\`
                              : \`<img src="\${p.images && p.images.length ? p.images[0] : (p.image || 'img/f1.jpg')}" alt="\${p.name}" loading="lazy" onclick="openLightbox('\${p.images && p.images.length ? p.images[0] : (p.image || 'img/f1.jpg')}')" style="cursor:zoom-in;" onerror="this.onerror=null; this.src='img/f1.jpg';">\`
                          }
                      </div>`;

html = html.replace(oldCreateCardImg, newCreateCardImg);

// 4. Replace Reviews Section with Google Reviews Placeholder
const oldReviewsRegex = /<section class="reviews-section" id="reviews">[\s\S]*?<\/section>/;
const googleReviewsHtml = `
    <section class="reviews-section" id="reviews">
        <div class="container">
            <div class="text-center mb-5">
                <span class="eyebrow gold">Testimonials</span>
                <h2 class="section-heading">Google Reviews</h2>
                <div class="color-bar gold"></div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-8 text-center text-white-50">
                    <!-- Google Reviews Embed Code Goes Here -->
                    <div class="p-5" style="border: 1px dashed rgba(255,255,255,0.2); border-radius: 15px;">
                        <i class="fab fa-google fa-3x mb-3 text-white"></i>
                        <h4>Google Reviews Widget</h4>
                        <p>Paste your Google Business Profile review embed code (or Elfsight widget) here.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;
html = html.replace(oldReviewsRegex, googleReviewsHtml);

// 5. Remove review logic from JS
const jsReviewsRegex = /\/\/ --- REVIEWS SYSTEM ---[\s\S]*?\/\/ --- AUTH STATE ---/;
html = html.replace(jsReviewsRegex, '// --- REVIEWS SYSTEM REMOVED ---\n        // --- AUTH STATE ---');

// 6. Fix any residual review JS in DOMContentLoaded
html = html.replace('loadReviews();', '');

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully.');
