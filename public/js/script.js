$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            url: '/auth/login', // Adjust URL if needed
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function(response) {
                localStorage.setItem('auth-token', response.token);
                $('#loginMessage').text('Login successful!');
                window.location.href = 'index.html';
            },
            error: function(jqXHR) {
                $('#loginMessage').text(jqXHR.responseJSON.message);
            }
        });
    });

    $('#registerForm').submit(function(event) {
        event.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        const reppass = $('#reppass').val();

        if (password !== reppass) {
            $('#registerMessage').text('Passwords do not match.');
            return;
        }

        $.ajax({
            url: '/auth/register', // Adjust URL if needed
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password, reppass }),
            success: function(response) {
                $('#registerMessage').text('Registration successful!');
                window.location.href = 'login.html';
            },
            error: function(jqXHR) {
                $('#registerMessage').text(jqXHR.responseJSON.message);
            }
        });
    });
});
