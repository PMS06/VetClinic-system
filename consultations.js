// Retrieve the appointment ID from the query parameter
let params = new URLSearchParams(window.location.search);
let appointmentId = params.get('appointmentId');

// Open the database
let request = window.indexedDB.open("appointments", 1);

// Access the database if the request is successful
request.onsuccess = function (event) {
  // Get the database instance from tthe event target
  let db = event.target.result;
  // Create a transaction with the "consultations" object store in read-only mode 
  let transaction = db.transaction("consultations", "readonly");
  // Get a reference to the "consultations" object store
  let objectStore = transaction.objectStore("consultations");

  // Retrieve the record from the database using the appointment ID
  let getRequest = objectStore.get(Number(appointmentId));

  getRequest.onsuccess = function (event) {
    let consultation = getRequest.result;

    // Display the details of the record on the page
    document.getElementById("appointment-id").textContent = consultation.id;
    document.getElementById("patient-name").textContent = `${consultation.firstName}`;
    document.getElementById("pet_name").textContent = `${consultation.lastName}`;
    document.getElementById("animal-type").textContent = consultation.animalType;
    document.getElementById("appointment-date").textContent = new Date(consultation.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    document.getElementById("appointment-time").textContent = new Date(`1970-01-01T${consultation.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    document.getElementById("breed").textContent = consultation.breed;
    document.getElementById("gender").textContent = consultation.gender;

  };
  // Error handling for retrieving the database 
  getRequest.onerror = function (event) {
    console.log("Error getting record from database");
  };
};

// Add the event listener to save the form after it is submitted 
document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Target the values from the form
    let consultationFees = document.querySelector(".fees").value;
    let exceptionalCircumstances = document.getElementById("check").checked;
    let appointmentStatus = document.querySelector("#status").value;
    let vet_notes = document.getElementById("notes").value;
    
    // Show a confirmation dialog box
    let confirmed = window.confirm("Are you sure you want to update the appointment data?");

    if (confirmed) {
        // Open the database
        let request = window.indexedDB.open("appointments", 1);

        request.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction("consultations", "readwrite");
            let objectStore = transaction.objectStore("consultations");

            // Retrieve the record from the database using the appointment ID
            let getRequest = objectStore.get(Number(appointmentId));

            // 
            getRequest.onsuccess = function(event) {
                let consultation = getRequest.result;

                // Update the record with the new values
                consultation.consultationFees = consultationFees;
                consultation.exceptionalCircumstances = exceptionalCircumstances;
                consultation.appointmentStatus = appointmentStatus;
                consultation.vet_notes = vet_notes;

                // Put the updated record back into the database
                let putRequest = objectStore.put(consultation);

                putRequest.onsuccess = function(event) {
                  // Show confirmation message when the user clicks the button
                    alert("Appointment data updated successfully");
                    console.log("Appointment data updated successfully")
                    // Redirect to the dashboard
                    window.location.assign("vet dashboard.html")
                  };
                  
                // If error, print the error message in the console
                putRequest.onerror = function(event) {
                    console.log("Error updating record in database");
                };
            };
            // Error for getting record from the database
            getRequest.onerror = function(event) {
                console.log("Error getting record from database");
            };
        };
        // Error handling for opening the database
        request.onerror = function(event) {
            console.log("Error opening database");
        };
    }
});


