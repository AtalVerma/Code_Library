// Login function
function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', user.name);
        
        // Store avatar if user has one
        if (user.avatar) {
            localStorage.setItem('userAvatar', user.avatar);
        } else {
            localStorage.removeItem('userAvatar');
        }
        
        checkAuth();
        alert('Login successful! Welcome back, ' + user.name + '!');
        showPage('home');
    } else {
        alert('Invalid email or password. Please try again or sign up!');
    }
}

// Sign up function
function signup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const avatarInput = document.getElementById('avatarUpload');

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('An account with this email already exists!');
        return;
    }

    // Handle avatar upload
    let avatarData = null;
    if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarData = e.target.result;
            
            // Create new user with avatar
            users.push({ name, email, password, avatar: avatarData });
            localStorage.setItem('users', JSON.stringify(users));

            alert('Account created successfully! You can now login.');
            showLoginForm();
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        // Create new user without custom avatar
        users.push({ name, email, password, avatar: null });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Account created successfully! You can now login.');
        showLoginForm();
    }
}

// Preview avatar before upload
function previewAvatar(event) {
    const preview = document.getElementById('avatarPreview');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Forgot password function
function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value;

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (user) {
        alert('Password reset link sent to ' + email + '!\n\n(Demo: Your password is "' + user.password + '")');
        showLoginForm();
    } else {
        alert('No account found with this email address.');
    }
}

// Show signup form
function showSignupForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('forgotForm').classList.add('hidden');
    document.getElementById('authTitle').textContent = 'Sign Up for CodeLib';
    document.getElementById('signupLink').classList.add('hidden');
    document.getElementById('forgotLink').classList.add('hidden');
    document.getElementById('backToLoginLink').classList.remove('hidden');
}

// Show forgot password form
function showForgotForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('forgotForm').classList.remove('hidden');
    document.getElementById('authTitle').textContent = 'Reset Password';
    document.getElementById('signupLink').classList.add('hidden');
    document.getElementById('forgotLink').classList.add('hidden');
    document.getElementById('backToLoginLink').classList.remove('hidden');
}

// Show login form
function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('forgotForm').classList.add('hidden');
    document.getElementById('authTitle').textContent = 'Login to CodeLib';
    document.getElementById('signupLink').classList.remove('hidden');
    document.getElementById('forgotLink').classList.remove('hidden');
    document.getElementById('backToLoginLink').classList.add('hidden');
    
    // Clear forms
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
    document.getElementById('forgotForm').reset();
}