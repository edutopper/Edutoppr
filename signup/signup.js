document.addEventListener("DOMContentLoaded", function() {
    const signInButton = document.getElementById("signin-btn");
    const signUpButton = document.getElementById("signup-btn");
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
    
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // Prevent default form submission behavior
    signInButton.addEventListener("click", function(event) {
        event.preventDefault();
        // Add your sign-in functionality here
    });

    signUpButton.addEventListener("click", function(event) {
        event.preventDefault();
        // Add your sign-up functionality here
    });
});