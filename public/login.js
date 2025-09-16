// login.js
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Simple, hardcoded user credentials for the prototype
const users = {
    'classA': 'passA',
    'classB': 'passB',
    'classC': 'passC'
};

loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (users[username] && users[username] === password) {
        // Login successful
        // Save the logged-in class to browser memory
        localStorage.setItem('loggedInClass', username);
        // Redirect to the dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Login failed
        errorMessage.textContent = 'Invalid username or password!';
    }
});