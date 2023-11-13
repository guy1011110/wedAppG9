
const users = [];

function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;
    const captchaInput = document.getElementById('captchaInput').value;
    const errorElement = document.getElementById('error');

    errorElement.textContent = "";

    if (!username || password !== repassword || parseInt(captchaInput) !== randomNumber) {
        errorElement.style.color = "red";
        alert("Registration failed. Please check your inputs and captcha.");
        errorElement.textContent = "Registration failed. Please check your inputs and captcha.";
        return;
    }

    
    const user = { username: " ", password: " " };
    users.push(user);

    errorElement.style.color = "green";
    errorElement.textContent = "Registration complete";
    console.log(users); 
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('error');

    const foundUser = users.find(user => user.username === username);

    if (foundUser && foundUser.password === password) {
        errorElement.style.color = "green";
        errorElement.textContent = "Login successful!";
        alert("Hi hihihihihih");
    } else {
        errorElement.style.color = "red";
        alert("Invalid username or password.");

        errorElement.textContent = "Invalid username or password. Please try again.";
    }
}
