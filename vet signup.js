// Select the submit button element
const submit = document.querySelector(".form-submit");

// Add event listener for when the sign up button is clicked
submit.addEventListener("click", e => {
e.preventDefault();
const Vetusername = document.querySelector("#Username").value;
const Vetpassword = document.querySelector("#password").value;
const confirm_password = document.querySelector("#cpw").value;

// Check if all fields have been filled out
if (!Vetusername || !Vetpassword || !confirm_password) {
// Show an alert if either the username or password is missing
alert("Please input all fields");
return;
}

// Check if the entered passwords match
if (Vetpassword !== confirm_password) {
// Show an alert if the passwords do not match
alert("Passwords do not match");
return;
}

// Store the username and password in the local storage
localStorage.setItem("VetEmail", Vetusername);
localStorage.setItem("Vetpwd", Vetpassword);

// Show an alert and redirect to the login page upon successful sign up
alert("Sign up successful");
window.location.assign("vet Login.html");
});
