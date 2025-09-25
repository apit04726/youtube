// admin-auth.js - Protect admin.html from direct access without login

(function() {
    // Check for login flag in sessionStorage
    if (!sessionStorage.getItem('adminLoggedIn')) {
        // Not logged in, redirect to index.html
        window.location.href = 'index.html';
    }
})();
