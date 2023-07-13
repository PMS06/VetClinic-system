// Target the icons and password input
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

// change password type after clicking the eye icon
function change_type(event) {
  const passwordInput = document.querySelector("#pw");
  const eyeIcon = event.target;

  // Chnage the type of the password to text if the eye icon is clicked
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.className = "bi bi-eye-slash";
  } else {
    // Change the type to default and style of the icon
    passwordInput.type = "password";
    eyeIcon.className = "bi bi-eye";
  }
}

//password validations //
// When the button is clicked, target the values from the user inputs
    document.getElementById("submitButton").addEventListener("click", function() {
    var username = document.getElementById("userID").value;
    var password = document.getElementById("pw").value;

// retrive the data from the local storage // 
    var getEmail = localStorage.getItem("userEmail");
    var getPwd = localStorage.getItem("userpwd");

    if (!username || !password) {
      // Show an alert if either the username or password is missing
      alert("Username and password are required fields.");
      return;
    }
    // Check  whether the inputs are correct or not with the values from the localstorage 
    if (username === getEmail) {
      if (password == getPwd)
      {
          
      // If the username and password are correct, redirect the user to the main dashboard page
      window.location.assign("receptionist_dashboard.html");
        alert("Login Successful")

      } 
      // If the password is not correct, prompt the user the alert message
      else {
        alert("wrong password");
      }
    }
    // If one of them is wrong, prompt another error message 
     else {
      // Show an alert if the details are not correct
       alert("Wrong username or password. Please try again.")
    }
  });
  
