// Check authentication on load
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfileContainer = document.getElementById('userProfileContainer');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (isLoggedIn) {
        loginLink.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userProfileContainer.classList.remove('hidden');
        
        // Get user data
        const email = localStorage.getItem('userEmail');
        const name = localStorage.getItem('userName') || email.split('@')[0];
        const avatar = localStorage.getItem('userAvatar');
        
        // Set user name
        userName.textContent = name;
        
        // Set avatar - use Gravatar or custom uploaded image
        if (avatar) {
            userAvatar.src = avatar;
        } else {
            // Generate Gravatar URL from email
            userAvatar.src = getGravatarUrl(email);
        }
    } else {
        loginLink.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userProfileContainer.classList.add('hidden');
    }
}

// Generate Gravatar URL from email
function getGravatarUrl(email) {
    // Create MD5 hash of email (simplified for demo - using a default avatar)
    // In production, use a proper MD5 library
    const defaultAvatars = [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5',
        'https://i.pravatar.cc/150?img=6',
        'https://i.pravatar.cc/150?img=7',
        'https://i.pravatar.cc/150?img=8'
    ];
    
    // Use email hash to select consistent avatar
    const hash = email.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    return defaultAvatars[Math.abs(hash) % defaultAvatars.length];
}

// Show specific page
function showPage(pageName) {
    // Check if user is trying to access add page without login
    if (pageName === 'add' && localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please login to add snippets!');
        showPage('login');
        return;
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // Show selected page
    document.getElementById(pageName + 'Page').classList.remove('hidden');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');

    // Load snippets if library page
    if (pageName === 'library') {
        loadSnippets();
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    checkAuth();
    alert('Logged out successfully!');
    window.location.href = 'home.html';
}

// Initialize app
checkAuth();
showPage('home');