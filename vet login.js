// Select the password input and eye icon elements
const passwordInput = document.querySelector("#pw");
const eyeIcon = document.querySelector("#togglePassword");

// Hide the eye icon by default
eyeIcon.style.display = "none";

// Show the eye icon when the password input is focused
passwordInput.addEventListener("focus", function() {
eyeIcon.style.display = "block";
});

// Hide the eye icon when the password input is blurred
passwordInput.addEventListener("blur", function() {
if (passwordInput.value === "") {
eyeIcon.style.display = "none";
}
});

// Change password type after clicking the eye icon
function change_type(event) {
const passwordInput = document.querySelector("#pw");
const eyeIcon = event.target;

// Toggle the visibility of the password input
if (passwordInput.type === "password") {
passwordInput.type = "text";
eyeIcon.className = "bi bi-eye-slash";
} else {
passwordInput.type = "password";
eyeIcon.className = "bi bi-eye";
}
}

// Password validations
document.getElementById("submitButton").addEventListener("click", function() {
var username = document.getElementById("userID").value;
var password = document.getElementById("pw").value;

// Retrieve the stored credentials from local storage
var getEmail = localStorage.getItem("VetEmail");
var getPwd = localStorage.getItem("Vetpwd");

// Check if both username and password fields are filled
if (!username || !password) {
// Show an alert if either the username or password is missing
alert("Username and password are required fields.");
return;
}

// Validate the user credentials and log the user in
if (username === getEmail) {
if (password == getPwd) {
// If the username and password are correct, redirect the user to the main dashboard page
window.location.assign("vet dashboard.html");
alert("Login Successful");
} else {
// Show an alert if the password is incorrect
alert("wrong password");
}
} else {
// Show an alert if the username is incorrect
alert("Wrong username or password. Please try again.");
}
});