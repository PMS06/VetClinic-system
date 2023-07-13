// Retrieve the appointment ID from the query parameter
let params = new URLSearchParams(window.location.search);
let appointmentId = params.get("appointmentId");

// Open the database
let request = window.indexedDB.open("appointments", 1);

request.onsuccess = function (event) 
{
  // Access the consultations object store if the database is opened successfully
  let db = event.target.result;
  let transaction = db.transaction("consultations", "readwrite");
  let objectStore = transaction.objectStore("consultations");

  // Retrieve the record from the database using the appointment ID
  let getRequest = objectStore.get(Number(appointmentId));

  getRequest.onsuccess = function (event) {
    // Display the details on the page if the consultation record is retrieved successfully
    let consultation = getRequest.result;
    let consultationTime = new Date(`1970-01-01T${consultation.time}`);
    let hours = consultationTime.getHours();
    let minutes = consultationTime.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let timeStr = hours + ":" + minutes + " " + ampm;

    // Display the details of the record on the page
    document.getElementById("appointment-id").textContent =
      consultation.id;
    document.getElementById(
      "patient-name"
    ).textContent = `${consultation.firstName}`;
    document.getElementById("pet_name").textContent = `${consultation.lastName}`;
    document.getElementById("animal-type").textContent =
      consultation.animalType;
    document.getElementById("appointment-date").textContent = new Date(
      consultation.date
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    document.getElementById("appointment-time").textContent = `${timeStr}`
    document.getElementById("breed").textContent = consultation.breed;
    document.getElementById("gender").textContent = consultation.gender;
    document.getElementById("appointment-status").textContent =
      consultation.appointmentStatus;
    document.getElementById("consultation-fees").textContent =
      consultation.consultationFees;
    document.getElementById("Exceptional-circumstance").textContent =
      consultation.exceptionalCircumstances;
      document.getElementById("vet").textContent = consultation.vet;
    document.getElementById("vet-notes").textContent =
      consultation.vet_notes;
    // Handle the "Mark As Paid" button click event
    document
      .getElementById("payment-button")
      .addEventListener("click", function () {
        let paymentMethod =
          document.querySelector("#payment-method").value;

        // Open the database
        let request = window.indexedDB.open("appointments", 1);

        request.onsuccess = function (event) {
          let db = event.target.result;

          // Create a new transaction if the database opened successfully
          let transaction = db.transaction("consultations", "readwrite");
          let objectStore = transaction.objectStore("consultations");

          // Retrieve the record from the database using the appointment ID
          let params = new URLSearchParams(window.location.search);
          let appointmentId = params.get("appointmentId");
          let getRequest = objectStore.get(Number(appointmentId));
        
          getRequest.onsuccess = function (event) {
            // Update the payment after the consultation record retrieved successfully
            let consultation = getRequest.result;

           // Update the payment status to Paid
           consultation.isPaid = true;

            // Update the record in the database
            let updateRequest = objectStore.put(consultation);

            // Update the consultation record in the database
            updateRequest.onsuccess = function (event) {
              // Display the payment success message and redirects to the history page
              console.log("Payment updated successfully");
              alert("Payment updated successfully");
              let paymentEvent = new CustomEvent('paymentUpdated', {detail: {appointmentId: appointmentId}});
              window.dispatchEvent(paymentEvent);
              window.location.assign("consultation history.html")
            };

            // Error handling for updating the payment
            updateRequest.onerror = function (event) {
              console.log("Error updating payment");
              alert("Error updating payment");
            };
          };

          // Error handling for retrieving the record from the database
          getRequest.onerror = function (event) {
            console.log("Error getting record from database");
          };
        };

        // Error handling for opening the database
        request.onerror = function (event) {
          console.log("Error opening database");
        };
      });
  };

  // Error handling for retrieving the database
  getRequest.onerror = function (event) {
    console.log("Error getting record from database");
  };
};
