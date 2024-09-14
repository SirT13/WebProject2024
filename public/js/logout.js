$(document).ready(function() {
    $('#logout-button').click(function() {
        localStorage.removeItem('auth-token');
        window.location.href = '/login.html';
    });
});
