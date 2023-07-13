// Add an event listener to wait until the window loads before executing the code
window.addEventListener('load', function() {
  // Open the appointments database and specify the version number
  let request = window.indexedDB.open("appointments", 1);

  // When the database is successfully opened, get all appointments that have been added
  request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction(['consultations'], 'readonly');
    let objectStore = transaction.objectStore('consultations');
    let getRequest = objectStore.getAll();
// When all appointments are successfully retrieved
    getRequest.onsuccess = function(event) {
      let appointments = getRequest.result;
      // Loop through each appointment and hide the corresponding appointment container if the patient has already checked in
      appointments.forEach(appointment => {
        if (appointment.isCheckedIn) {
          //
          let container = document.querySelector(`[data-appointment-id="${appointment.id}"]`);
          if (container) {
            container.classList.add("hidden");
          }
        }
      });
    };
    // Log an error if there is an issue getitng appointments
    getRequest.onerror = function(event) {
      console.log("Error getting appointments");
    };
  };


// Open the database
request = window.indexedDB.open("appointments", 1);

request.onsuccess = function (event) {
  let db = event.target.result;
  let objectStore = db
    .transaction("consultations")
    .objectStore("consultations");
    

  // Open a cursor to retrieve the data
  objectStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      let consultation = cursor.value;

      // Create a new div element for each patient
      let container = document.createElement("div");
      container.classList.add("patient-container");

       // Check if the patient is already checked in and hide the container if they are checked in already
       let isCheckedIn = consultation.isCheckedIn || false;
       if (isCheckedIn) {
        container.classList.add("hidden");
      }
      
   // Format consultation time
    let consultationTime = new Date(`1970-01-01T${consultation.time}`);
    let hours = consultationTime.getHours();
    let minutes = consultationTime.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let timeStr = hours + ":" + minutes + " " + ampm;
     
    
      // Create an HTML element to display the data
      container.innerHTML = `
      <p>Pet Owner's Name: ${consultation.firstName}</p>
      <p>Pet's Name: ${consultation.lastName}</p>
      <p>Animal Type: ${consultation.animalType}</p>
      <p>Date: ${new Date(consultation.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
      <p>Time: ${timeStr}</p>
      <div class="patient-buttons">
        <button class="check-in-button">Patient check-in</button>
        <button onclick="" class="delete-button" data-appointment-id="${consultation.id}">Cancel</button>
      </div>
    `;

      // Append the container to the parent element
      document.getElementById("consultations").appendChild(container);

      // Get the check-in button to the container and add a event listener to it
      let checkInButton = container.querySelector(".check-in-button");
checkInButton.addEventListener("click", function(event) {
  event.preventDefault();

  // Get the appointment id from the delete button's data attribute
  let appointmentId = Number(checkInButton.closest(".patient-container").querySelector(".delete-button").dataset.appointmentId);
  let request = window.indexedDB.open("appointments", 1);

  request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction(['consultations'], 'readwrite');
    let objectStore = transaction.objectStore('consultations');

    // Get the appointment object from the database using the appointment ID
    let getRequest = objectStore.get(appointmentId);

    getRequest.onsuccess = function(event) {
      let appointment = getRequest.result;
      // Check if the patient is already checked-in
      if (appointment.isCheckedIn) {
        alert("This patient has already been checked in.");
        return;
      }
      // Ask for the confirmation before the patient is check-in
      if (confirm(`Are you sure you want to check in ${consultation.lastName}?`)) {
        appointment.isCheckedIn = true; // Update isCheckedIn value
        let updateRequest = objectStore.put(appointment); // Update appointment in the database

        // Update the appointment in the database
        updateRequest.onsuccess = function(event) {
          
          console.log("Appointment updated");

          // Disable the check in button and change its text
          checkInButton.disabled = true; // Disable the check-in button
          checkInButton.textContent = "Checked In"; // Change the text of the check-in button

          // Dispatch a custom event to notify that the appointment has been updated
          let appointmentUpdatedEvent = new CustomEvent('appointmentUpdated', {
            detail: { appointmentId: appointment.id }
          });
          window.dispatchEvent(appointmentUpdatedEvent);

          // Hide the container
          container.classList.add("hidden");
        };

        updateRequest.onerror = function(event) {
          console.log("Error updating appointment");
        };
      }
    };

    getRequest.onerror = function(event) {
      console.log("Error getting appointment");
    };
  };
});
      // Get the delete button from the container and add the event listener to it 
      let deleteButton = container.querySelector(".delete-button");
      // Add an event listener to the delete button
      deleteButton.addEventListener("click", function() {
        // Ask for the confirmation before deleting the appointment 
        if(confirm("Are you sure you want to delete this appointment?")) { 
          // Get the appointment ID from the delete button's data attribute
          let appointmentId = Number(deleteButton.dataset.appointmentId);
      
          let request = window.indexedDB.open("appointments", 1);
      
          request.onsuccess = function (event) {
            let db = event.target.result;
            let deleteTransaction = db.transaction(['consultations'], 'readwrite');
            let deleteObjectStore = deleteTransaction.objectStore('consultations');
            // Delete the appointment object from the database using the appointment ID
            let deleteRequest = deleteObjectStore.delete(appointmentId);
      
            deleteRequest.onsuccess = function(event) {
              console.log("Appointment deleted");
              container.remove(); 
              // Remove the container from the DOM
            };
      
            deleteRequest.onerror = function(event) {
              console.log("Error deleting appointment");
            };
          };
        }
      });
      

      // Move to the next item in the cursor
      cursor.continue();
    } else {
      console.log("No more entries");
    }
  };
};
});
