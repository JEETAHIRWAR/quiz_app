
function setupLoginSignUpPage() {
    // Get references to the page content containers
    const currentPageContent = document.querySelector('.container');
    const nextPageContent = document.querySelector('.next-page-content');

    // Get references to the login button and the sign-up button in the next page content
    const loginButton = document.getElementById('loginButton');
    const signUpButton = document.querySelector('#signupbtn');

    // Add click event listener to the login button
    loginButton.addEventListener('click', () => {
        // Hide the current page content
        currentPageContent.style.display = 'none';
        // Show the next page content
        nextPageContent.style.display = 'block';
    });

    // Add click event listener to the sign-up button in the next page content (to go back to the initial page)
    signUpButton.addEventListener('click', () => {
        // Show the current page content
        currentPageContent.style.display = 'flex';
        // Hide the next page content
        nextPageContent.style.display = 'none';
    });
}

// Call the setup function to initialize the login and sign-up page behavior
setupLoginSignUpPage();

// JavaScript for toggling password visibility
function togglePasswordVisibility(passwordInputId, toggleButtonClass) {
    const passwordInput = document.getElementById(passwordInputId);
    const toggleButton = document.querySelector(`.${toggleButtonClass} ion-icon`);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.setAttribute('name', 'eye-off');
    } else {
        passwordInput.type = 'password';
        toggleButton.setAttribute('name', 'eye');
    }
}


// Function to register user and redirect to category page
function registerUserAndRedirect() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password-signup").value;

    // Check if all required fields are filled
    if (!name || !email || !password) {
        alert("Please fill all required fields.");
        return;
    }

    const userData = {
        name: name,
        email: email,
        password: password
    };

    // Store user data in localStorage
    localStorage.setItem(email, JSON.stringify(userData));

    // Redirect to the category page
    window.location.href = `components/category.html?name=${name}`;
}

// Function to login user
function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Check if all required fields are filled
    if (!email || !password) {
        alert("Please fill all required fields.");
        return;
    }

    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem(email));

    if (userData) {
        if (userData.password === password) {
            // User data available and password matches
            // Redirect to the category page
            window.location.href = 'components/category.html';
        } else {
            alert("Incorrect username or password. Please try again.");
        }
    } else {
        alert("Account not found. Please create an account.");
    }
}


