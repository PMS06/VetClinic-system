// Open the database
let request = window.indexedDB.open("appointments", 1);

request.onsuccess = function (event) {
  let db = event.target.result;
  let objectStore = db
    .transaction("consultations")
    .objectStore("consultations");

 // Get the list of removed appointment IDs from local storage 
 let removedAppointments = localStorage.getItem("removedAppointments");
 if (removedAppointments) {
   removedAppointments = JSON.parse(removedAppointments);
 } else {
   removedAppointments = [];
 }

  // Add the event listener here
  window.addEventListener('appointmentUpdated', function(event) {
    let appointmentId = event.detail.appointmentId;
      // Add the removed appointment ID to the list in local storage 
      removedAppointments.push(appointmentId);
      localStorage.setItem("removedAppointments", JSON.stringify(removedAppointments));
  });

  // Open a cursor to retrieve the data
  objectStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      let consultation = cursor.value;

       // Check if the appointment has been removed
       if (removedAppointments.includes(consultation.id)) {
        cursor.continue();
        return;
      }

      // Create a new table row element for each patient
      let row = document.createElement("tr");
      let consultationTime = new Date(`1970-01-01T${consultation.time}`);
      let hours = consultationTime.getHours();
      let minutes = consultationTime.getMinutes();
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let timeStr = hours + ":" + minutes + " " + ampm;

    
      // Add the data-attribute to the row
      row.setAttribute("data-appointment-id", consultation.id);
      // Create an HTML element to display the data
      row.innerHTML = `
      <td>${consultation.id}</td>
      <td>${consultation.firstName}</td>
      <td>${consultation.lastName}
      <td>${consultation.animalType}</td>
      <td>${new Date(consultation.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
      <td>${timeStr}</td>
      <td><button class="check-in-button">${consultation.isCheckedIn ? "YES" : "NO"}</button></td>
    `;
      // Append the row to the parent element
      document.getElementById("upcoming-appointments-table-body").appendChild(row);
      let checkInButton = row.querySelector('.check-in-button');
      if (checkInButton.textContent === "NO") {
        checkInButton.disabled = true;
        checkInButton.style.backgroundColor = "#fff";
        checkInButton.style.color = "#000000";
        checkInButton.style.border = "none";
      }
      // Add an event listener to the "View Details" button
checkInButton.addEventListener('click', function(event) {
  event.preventDefault();

  let appointmentId = consultation.id;
  
  // Display a confirmation message before changing the page URL and removing the row
  if (confirm("Are you sure you want to proceed this appointment?")) {
    // Change the page URL when the button is clicked
    window.location.href = `consultations.html?appointmentId=${appointmentId}`;
    row.remove();

    // Trigger the custom event
    let appointmentUpdatedEvent = new CustomEvent('appointmentUpdated', {detail: {appointmentId}});
    window.dispatchEvent(appointmentUpdatedEvent);
  }
});


      // Move to the next item in the cursor
      cursor.continue();
    } else {
      console.log("No more entries");
    }
  };
};
