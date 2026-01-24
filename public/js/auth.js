// Check if already logged in
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            window.location.href = '/home.html';
        }
    } catch (err) {
        // Not logged in, stay on login page
    }
}

// DOM elements
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

// Tab switching
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    hideError();
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    hideError();
});

// Error handling
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = '/home.html';
        } else {
            showError(data.error || 'Login failed');
        }
    } catch (err) {
        showError('Connection error. Please try again.');
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = document.getElementById('register-username').value;
    const gameName = document.getElementById('register-gamename').value.trim() || null;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        showError('Passwords do not match');
        return;
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, gameName })
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = '/home.html';
        } else {
            showError(data.error || 'Registration failed');
        }
    } catch (err) {
        showError('Connection error. Please try again.');
    }
});

// Check auth on page load
checkAuth();
