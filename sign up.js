// Select the submit button from the form
const submit = document.querySelector(".form-submit");

// Add a click event listener to the submit button
submit.addEventListener("click", e => {
// Prevent the default behavior of the click event
e.preventDefault();

// Retrieve the input values from the form
const username = document.querySelector("#Username").value;
const password = document.querySelector("#password").value;
const confirm_password = document.querySelector("#cpw").value;

// Check if all fields are filled out
if (!username || !password || !confirm_password) {
// Show an alert if either the username or password is missing
alert("Please input all fields");
return;
}

// Check if the entered passwords match
if (password !== confirm_password) {
alert("Passwords do not match");
return;
}

// Store the username and password in the local storage
localStorage.setItem("userEmail", username);
localStorage.setItem("userpwd", password);

// Show a success message and redirect to the login page
alert("Sign up successful");
window.location.assign("login.html");
});