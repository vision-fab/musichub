// MusicHub - Authentication Logic

// DOM Elements
const loginForm = document.getElementById('loginForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerLink = document.getElementById('registerLink');

// Demo credentials
const DEMO_CREDENTIALS = {
    'user': 'password123',
    'admin': 'admin123',
    'demo': 'demo123'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkExistingLogin();
    
    // Setup event listeners
    setupAuthEventListeners();
});

// Check if user is already logged in
function checkExistingLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    // If already logged in and on login page, redirect to home
    if (isLoggedIn && currentPage.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

// Setup authentication event listeners
function setupAuthEventListeners() {
    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register link
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate inputs
    if (!username || !password) {
        showAuthNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    loginBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Check credentials
        if (validateCredentials(username, password)) {
            // Login successful
            loginUser(username, rememberMe);
        } else {
            // Login failed
            showAuthNotification('Invalid username or password', 'error');
            loginBtn.innerHTML = '<span>Sign In</span> <i class="fas fa-arrow-right"></i>';
            loginBtn.disabled = false;
        }
    }, 1500);
}

// Validate user credentials
function validateCredentials(username, password) {
    // Check demo credentials
    if (DEMO_CREDENTIALS[username] === password) {
        return true;
    }
    
    // Check if user exists in localStorage (for user-created accounts)
    const users = JSON.parse(localStorage.getItem('users')) || {};
    return users[username] && users[username].password === password;
}

// Login user and save session
function loginUser(username, rememberMe) {
    // Save login status
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    
    // If remember me is checked, save for longer (simulated)
    if (rememberMe) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30); // 30 days
        localStorage.setItem('sessionExpiry', expiry.toISOString());
    }
    
    // Show success message
    showAuthNotification('Login successful! Redirecting...', 'success');
    
    // Redirect to home page after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Show registration form
function showRegisterForm() {
    const authContent = document.querySelector('.auth-content');
    
    authContent.innerHTML = `
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join MusicHub today</p>
        
        <form id="registerForm" class="auth-form">
            <div class="form-group">
                <label for="regUsername">Username</label>
                <div class="input-with-icon">
                    <i class="fas fa-user"></i>
                    <input type="text" id="regUsername" placeholder="Choose a username" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="regEmail">Email</label>
                <div class="input-with-icon">
                    <i class="fas fa-envelope"></i>
                    <input type="email" id="regEmail" placeholder="Enter your email" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="regPassword">Password</label>
                <div class="input-with-icon">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="regPassword" placeholder="Create a password" required>
                    <button type="button" class="toggle-password" data-target="regPassword">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <small class="password-hint">Must be at least 8 characters</small>
            </div>
            
            <div class="form-group">
                <label for="regConfirmPassword">Confirm Password</label>
                <div class="input-with-icon">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="regConfirmPassword" placeholder="Confirm your password" required>
                </div>
            </div>
            
            <div class="form-options">
                <label class="checkbox-container">
                    <input type="checkbox" id="regTerms" required>
                    <span class="checkmark"></span>
                    I agree to the <a href="#">Terms & Conditions</a>
                </label>
            </div>
            
            <button type="submit" class="auth-btn" id="registerBtn">
                <span>Create Account</span>
                <i class="fas fa-user-plus"></i>
            </button>
            
            <div class="auth-divider">
                <span>Already have an account?</span>
            </div>
            
            <button type="button" class="auth-btn secondary" id="backToLogin">
                <i class="fas fa-arrow-left"></i> Back to Login
            </button>
        </form>
    `;
    
    // Setup registration form events
    setupRegistrationForm();
}

// Setup registration form events
function setupRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    const backToLogin = document.getElementById('backToLogin');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    // Toggle password visibility for registration form
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });
    
    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration();
        });
    }
    
    // Back to login button
    if (backToLogin) {
        backToLogin.addEventListener('click', function() {
            window.location.reload();
        });
    }
}

// Handle user registration
function handleRegistration() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const termsAccepted = document.getElementById('regTerms').checked;
    
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
        showAuthNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 8) {
        showAuthNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showAuthNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username]) {
        showAuthNotification('Username already exists', 'error');
        return;
    }
    
    // Show loading state
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    registerBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Save user to localStorage
        users[username] = {
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showAuthNotification('Account created successfully! You can now login.', 'success');
        
        // Auto login after registration
        setTimeout(() => {
            loginUser(username, false);
        }, 1500);
    }, 2000);
}

// Show authentication notification
function showAuthNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.auth-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="auth-notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    const authContent = document.querySelector('.auth-content');
    authContent.insertBefore(notification, authContent.firstChild);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideAuthNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.auth-notification-close').addEventListener('click', () => {
        hideAuthNotification(notification);
    });
}

// Hide authentication notification
function hideAuthNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}