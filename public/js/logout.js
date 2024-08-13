$(document).ready(function() {
    $('#logout-button').click(function() {
        localStorage.removeItem('auth-token'); // Remove the token from localStorage
        window.location.href = '/login'; // Redirect to the login page
    });
});
