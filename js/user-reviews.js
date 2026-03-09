console.log("user-reviews.js initialized");
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEmMwAgeAsu6X0M94CWJ9hZEKJMXhMNDM",
    authDomain: "web-design-bfa0e.firebaseapp.com",
    projectId: "web-design-bfa0e",
    storageBucket: "web-design-bfa0e.firebasestorage.app",
    messagingSenderId: "975321654653",
    appId: "1:975321654653:web:647139d738d865ff2f9814",
    measurementId: "G-FWKYQQJTPH"
};

// Use compat version for consistency
if (typeof firebase === 'undefined') {
    alert("Firebase SDK failed to load. Please check your internet connection or script order.");
} else {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}

const auth = firebase.auth();
const db = firebase.firestore();

// UI Elements
const btnGoogleLogin = document.getElementById('btnGoogleLogin');
const btnSignOut = document.getElementById('btnSignOut');
const authPrompt = document.getElementById('authPrompt');
const reviewForm = document.getElementById('reviewForm');
const userNameDisplay = document.getElementById('userNameDisplay');
const userProfilePic = document.getElementById('userProfilePic');
const reviewsGrid = document.getElementById('reviewsGrid');
const ratingInput = document.getElementById('ratingInput');
const btnSubmitReview = document.getElementById('btnSubmitReview');
const reviewComment = document.getElementById('reviewComment');

let currentRating = 0;

// Authentic Sri Lankan fake reviews data (12 entries)
const fakeReviews = [
    { name: "Nilmini Perera", text: "VITES Designs has the most elegant sarees in Bandarawela. Quality is superb!", rating: 5, photo: "https://i.pravatar.cc/150?u=nilmini", timestamp: Date.now() - 1000000 },
    { name: "sadun Karunaratne", text: "Great collection of linen shirts. Perfect for the tropical weather. 10/10!", rating: 5, photo: "https://i.pravatar.cc/150?u=dimuth", timestamp: Date.now() - 2000000 },
    { name: "Dasuni Akarsha", text: "Love the new arrivals! The fabric quality is much better than other local stores.", rating: 4, photo: "https://i.pravatar.cc/150?u=anarkali", timestamp: Date.now() - 3000000 },
    { name: "Pathum gamhewa", text: "Found the perfect formal wear for my office. Very professional service.", rating: 5, photo: "https://i.pravatar.cc/150?u=pathum", timestamp: Date.now() - 4000000 },
    { name: "Kaveesha Dilhari", text: "The kids' section is so cute! My daughter loves her new floral dress.", rating: 5, photo: "https://i.pravatar.cc/150?u=kaveesha", timestamp: Date.now() - 5000000 },
    { name: "Roshan gamage", text: "Excellent customer service and very quick response on WhatsApp.", rating: 5, photo: "https://i.pravatar.cc/150?u=roshan", timestamp: Date.now() - 6000000 },
    { name: "Oshadi Himasha", text: "The shop layout is beautiful and the staff is very helpful. I'll be back!", rating: 4, photo: "https://i.pravatar.cc/150?u=oshadi", timestamp: Date.now() - 7000000 },
    { name: "Angelo perea", text: "Highly durable materials. Even after several washes, the colors are bright.", rating: 5, photo: "https://i.pravatar.cc/150?u=angelo", timestamp: Date.now() - 8000000 },
    { name: "Yashoda Wijesekara", text: "Elegant designs that suit any occasion. Truly premium fashion.", rating: 5, photo: "https://i.pravatar.cc/150?u=yashoda", timestamp: Date.now() - 9000000 },
    { name: "Wanindu kalum", text: "Cool designs for youth. The fit is perfect for athletes too.", rating: 5, photo: "https://i.pravatar.cc/150?u=wanindu", timestamp: Date.now() - 10000000 },
    { name: "Dilhani Perera", text: "The best clothing store in the Uva province. Affordable and trendy.", rating: 5, photo: "https://i.pravatar.cc/150?u=dilhani", timestamp: Date.now() - 11000000 },
    { name: "Mahela jayakodi", text: "Always satisfied with my purchases here. Classy and comfortable.", rating: 4, photo: "https://i.pravatar.cc/150?u=mahela", timestamp: Date.now() - 12000000 }
];

// Initialize Auth
auth.onAuthStateChanged(user => {
    if (user) {
        if (authPrompt) authPrompt.style.display = 'none';
        if (reviewForm) reviewForm.style.display = 'block';
        if (userNameDisplay) userNameDisplay.innerText = `Welcome, ${user.displayName}!`;
        if (userProfilePic) userProfilePic.src = user.photoURL || 'https://i.pravatar.cc/150';
    } else {
        if (authPrompt) authPrompt.style.display = 'block';
        if (reviewForm) reviewForm.style.display = 'none';
    }
});

// Google Login Handler
if (btnGoogleLogin) {
    btnGoogleLogin.onclick = () => {
        // Detect if running on file:// protocol (Firebase Auth doesn't support this)
        if (window.location.protocol === 'file:') {
            const useDemo = confirm("ENVIRONMENT ALERT: Google Sign-In requires a web server (http/https). It will NOT work if you open the file directly.\n\nWould you like to enter 'DEMO MODE' to test the review system without a real login?");
            if (useDemo) {
                // Simulate a successful login for UI testing
                const dummyUser = {
                    displayName: "New Customer (Demo)",
                    photoURL: "https://i.pravatar.cc/150?u=demo",
                    uid: "demo-user-123"
                };
                // Manually trigger the UI state (doesn't actually sign into Firebase)
                if (authPrompt) authPrompt.style.display = 'none';
                if (reviewForm) reviewForm.style.display = 'block';
                if (userNameDisplay) userNameDisplay.innerText = `Demo Mode: ${dummyUser.displayName}`;
                if (userProfilePic) userProfilePic.src = dummyUser.photoURL;

                // Store in session for this session
                window.demoUser = dummyUser;
                return;
            }
            return;
        }

        console.log("Google Login Clicked");
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log("Login Success", result.user);
            })
            .catch((error) => {
                console.error("Login Error:", error);

                if (error.code === 'auth/operation-not-supported-in-this-environment') {
                    alert("ERROR: Google Sign-In requires a web server. Please run this folder using a 'Live Server' extension or upload it to a host.");
                } else if (error.code === 'auth/operation-not-allowed') {
                    alert("CONFIGURATION ERROR: Google Auth is not enabled in your Firebase Console. Go to Authentication > Sign-in method and enable Google.");
                } else if (error.code === 'auth/unauthorized-domain') {
                    alert("DOMAIN ERROR: " + window.location.hostname + " is not authorized in Firebase. Add it to the 'Authorized Domains' list in Firebase Console.");
                } else {
                    alert("Login Failed: " + error.message);
                }
            });
    };
}

// Sign Out
if (btnSignOut) {
    btnSignOut.onclick = () => {
        if (window.demoUser) {
            window.demoUser = null;
            location.reload(); // Refresh to clear demo state
        } else {
            auth.signOut();
        }
    };
}

// Rating Input Logic
if (ratingInput) {
    ratingInput.addEventListener('click', (e) => {
        if (e.target.tagName === 'I') {
            currentRating = parseInt(e.target.getAttribute('data-rating'));
            updateStars(currentRating);
        }
    });
}

function updateStars(rating) {
    if (!ratingInput) return;
    const stars = ratingInput.querySelectorAll('i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.replace('far', 'fas');
        } else {
            star.classList.replace('fas', 'far');
        }
    });
}

// Display Reviews with Animation
function displayReviews(comments) {
    if (!reviewsGrid) return;
    reviewsGrid.style.transition = 'opacity 0.4s ease';
    reviewsGrid.style.opacity = '0';
    setTimeout(() => {
        reviewsGrid.innerHTML = comments.map(c => `
            <div class="col-md-4">
                <div class="review-card">
                    <div class="reviewer-info">
                        <img src="${c.photo || 'https://i.pravatar.cc/150'}" class="reviewer-img" alt="${c.name || 'Anonymous'}">
                        <div class="reviewer-name">${c.name || 'Anonymous'}</div>
                    </div>
                    <div class="review-stars">
                        ${Array(5).fill(0).map((_, i) => `<i class="${i < c.rating ? 'fas' : 'far'} fa-star"></i>`).join('')}
                    </div>
                    <div class="review-text">"${c.text}"</div>
                </div>
            </div>
        `).join('');
        reviewsGrid.style.opacity = '1';
    }, 400);
}

// Global variable for rotation
let reviewIndex = 0;
let reviewInterval;

// Load Reviews and Start Rotation
async function loadReviews() {
    try {
        const snapshot = await db.collection('reviews').orderBy('timestamp', 'desc').limit(20).get();
        let reviewsList = [];
        snapshot.forEach(doc => reviewsList.push(doc.data()));

        const allReviews = reviewsList.length > 0 ? reviewsList : fakeReviews;

        // Initial Display
        startReviewRotation(allReviews);

    } catch (e) {
        console.error("Error loading reviews:", e);
        startReviewRotation(fakeReviews);
    }
}

function startReviewRotation(list) {
    if (reviewInterval) clearInterval(reviewInterval);

    const rotate = () => {
        const chunk = [];
        for (let i = 0; i < 3; i++) {
            chunk.push(list[(reviewIndex + i) % list.length]);
        }
        displayReviews(chunk);
        reviewIndex = (reviewIndex + 3) % list.length;
    };

    rotate(); // First call
    reviewInterval = setInterval(rotate, 6000); // Swap every 6 seconds
}

// Submit Review
if (btnSubmitReview) {
    btnSubmitReview.onclick = async () => {
        const user = window.demoUser || auth.currentUser;
        const text = reviewComment.value.trim();

        if (!user) return alert("Please sign in first");
        if (currentRating === 0) return alert("Please select a rating");
        if (!text) return alert("Please enter a comment");

        const newReview = {
            name: user.displayName,
            text: text,
            rating: currentRating,
            photo: user.photoURL,
            uid: user.uid,
            timestamp: Date.now()
        };

        // If in Demo Mode, just add to UI
        if (window.demoUser) {
            fakeReviews.unshift(newReview);
            displayReviews(fakeReviews.slice(0, 3));
            alert("DEMO MODE: Review added to temporary list!");
            reviewComment.value = '';
            currentRating = 0;
            updateStars(0);
            return;
        }

        try {
            await db.collection('reviews').add(newReview);
            reviewComment.value = '';
            currentRating = 0;
            updateStars(0);
            alert("Thank you for your review!");
            loadReviews();
        } catch (e) {
            console.error("Error saving review:", e);
            alert("Failed to save review. Please check if Firestore is enabled and rules are public.");
        }
    };
}

if (reviewsGrid) loadReviews();
