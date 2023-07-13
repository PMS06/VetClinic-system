  // Open the database
  let request = window.indexedDB.open("Register", 1);
  request.onsuccess = function (event) {
    let db = event.target.result;
    let objectStore = db
      .transaction("consultations")
      .objectStore("consultations");

    // Open the cursor to retrieve the data
    objectStore.openCursor().onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        let consultation = cursor.value;

        // Create a new table element for each registered patients
        let row = document.createElement("tr");

        // Add data attribute to the row
        row.setAttribute("data-appointment-id", consultation.id);

        // Create an HTML element to display the data
        row.innerHTML = `
  <td>${consultation.id}</td>
  <td>${consultation.first_name} </td>
  <td>${consultation.last_name}</td>
  <td>${consultation.animal_type}</td>
  <td>${consultation.email}</td>
  <td>${consultation.ph_num}</td>
  `;

        //Append the row to the parent element
        document
          .getElementById("Registered_patients-table")
          .appendChild(row);
        cursor.continue();
      }
    };
  };