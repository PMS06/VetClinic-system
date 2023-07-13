// Open the database
let request = window.indexedDB.open("appointments", 1);

request.onsuccess = function (event) {
  // Retrieve the database object
  let db = event.target.result;
  // Retrieve the consultation object store 
  let objectStore = db
    .transaction("consultations")
    .objectStore("consultations");


   // Add the event listener to update the status of the payment 
  window.addEventListener('paymentUpdated', function(event) {
    // retrieve the appointment id from the event detail
    let appointmentId = event.detail.appointmentId;
    // Find the appointment row in the table and update the payment button text and disabled state
    let appointmentRow = document.querySelector(`tr[data-appointment-id="${appointmentId}"]`);
  let paymentButton = appointmentRow.querySelector('.trackPayment');
  paymentButton.textContent = 'Paid';
  paymentButton.disabled = true;
  });

  // Open a cursor to retrieve the consultation data
  objectStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    // If there is data in the cursor
    if (cursor) {
      // Retrieve the consultation data
      let consultation = cursor.value;

      // Create a new table row element for each patient
      let row = document.createElement("tr");
      row.classList.add("patient-row");

      // Format the time to display in 12-hour time with AM/PM
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
      <td>${consultation.lastName}</td>
      <td>${consultation.animalType}</td>
      <td>${new Date(consultation.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
      <td>${timeStr}</td>
      <td>${consultation.appointmentStatus}</td>
      <td>${consultation.consultationFees}</td>
      <td><button class="trackPayment">${consultation.isPaid ? "Paid" : "Not Paid" }</button></td>
    `;

      // Append the row to the parent element
      document.getElementById("consultation-history-table").appendChild(row);
      let trackPayment = row.querySelector('.trackPayment');
      // If the payment is already paid, change the style of the text and disable the button
      if (trackPayment.textContent === "Paid") {
        trackPayment.disabled = true;
        trackPayment.style.backgroundColor = "#fff";
        trackPayment.style.color = "#000000";
        trackPayment.style.border = "none";
      }
     // Add an event listener to the "View Details" button
trackPayment.addEventListener('click', function() {
  let appointmentId = consultation.id;

  // Retrieve the appointment details from the database based on the ID
  let request = window.indexedDB.open("appointments", 1);
  request.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction("consultations", "readonly");
    let objectStore = transaction.objectStore("consultations");

    let getRequest = objectStore.get(appointmentId);
    // Error handling for getting the record from the database
    getRequest.onsuccess = function (event) {
      let consultation = getRequest.result;
      console.log(consultation); 
    };
    getRequest.onerror = function (event) {
      console.log("Error getting record from database");
    };
  };

  // Change the page URL when the button is clicked
  window.location.href = `payment.html?appointmentId=${appointmentId}`;
});

      // Move to the next item in the cursor
      cursor.continue();
    } else {
      console.log("No more entries");
    }
  };
};

    