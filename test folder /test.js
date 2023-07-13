// function publishToTable() {
//   const name = document.getElementById('name').value;
//   const email = document.getElementById('email').value;
//   const error = document.getElementById('error');
//   error.innerHTML = (!name || !email) ? 'Name & Email both values are required.' : '';
//   if (name && email) {
//       const tableElement = document.getElementById('table');
//       const trElement = document.createElement('tr');
//       const tbodyElement = document.createElement('tbody');
//       const nameEle = document.createElement('td');
//       const emailEle = document.createElement('td');
//       nameEle.innerHTML = name;
//       emailEle.innerHTML = email;
//       trElement.appendChild(nameEle);
//       trElement.appendChild(emailEle);
//       tbodyElement.appendChild(trElement);
//       tableElement.appendChild(tbodyElement);
//   }
// }

let DB;

let form = document.querySelector("#form");
let patient_firstname = document.querySelector("#firstName");
let patient_lastname = document.querySelector("#lastName");
let animal_type = document.querySelector("#animalType");
let age = document.querySelector("#age");
let breed = document.querySelector("#breed");
let male = document.querySelector("#radio-1");
let female = document.querySelector("#radio-2");
let date = document.querySelector("#date");
let time = document.querySelector("#time");
let vet = document.querySelector("#vet");
let notes = document.querySelector("#notes");

document.addEventListener("DOMContentLoaded",() => {

// create a database 
let ScheduledDB = window.indexedDB.open('consultations',1);

ScheduledDB.onerror = function(){
        console.log('you have an error');
    }

ScheduledDB.onsuccess = function(){
        console.log('Successful');

        DB = ScheduledDB.result;

        showConsultations();
    }

ScheduledDB.onupgradeneeded = function(e){
    let db = e.target.result;

    let objectStore = db.createObjectStore('consultations',{keyPath : 'key',autoIncrement:true});

    objectStore.createIndex('FirstName','FirstName',{unique:false});
    objectStore.createIndex('LastName','LastName',{unique:false});
    objectStore.createIndex('Type','Type',{unique:false});
    objectStore.createIndex('Age','Age',{unique:false});
    objectStore.createIndex('Breed','Breed',{unique:false});
    objectStore.createIndex('Male','Male',{unique:false});
    objectStore.createIndex('Female','Female',{unique:false});
    objectStore.createIndex('Date','Female',{unique:false});
    objectStore.createIndex('Time','Time',{unique:false});
    objectStore.createIndex('Vet','Vet',{unique:false});
    objectStore.createIndex('Notes','Notes',{unique:false});
}

form.addEventListener("submit",addConsultations);

function addConsultations(e)
{
    e.preventDefault();

    let newConsultation = {
        patient_firstname : patient_firstname.value,
        patient_lastname : patient_lastname.value,
        animal_type : animal_type.value,
        age : age.value,
        breed : breed.value,
        male : male.value,
        female : female.value,
        date : date.value,
        time : time.value,
        vet : vet.value,
        notes : notes.value
    }

    let transaction = DB.transaction(['consultations'], 'readwrite');
    let objectStore = transaction.objectStore('consultations');
    let request = objectStore.add(newConsultation);

    request.onsuccess = ()=>{
        form.reset();
    }
    transaction.oncomplete = ()=>{
      //  console.log('add new Schedule');

        showConsultations();
    }
    transaction.onerror = ()=>{
      //  console.log('please fix the error');
    }
}

function showConsultations(){

    while(consultations.firstChild){
        consultation.removeChild(consultations.firstChild);
    }
    let objectStore = DB.transaction('consultations').objectStore('consultations');

    objectStore.openCursor().onsuccess = function(e){
        let cursor = e.target.result;

        if(cursor){
            let consultationHTML = document.createElement('li')
            consultationHTML.setAttribute(data-consultation-id, cursor.value.key);
            consultationHTML.classList.add('list-group-item');
            consultationHTML.innerHTML = `<p class="font-weight-bold">  <p class="font-weight-bold">Patient First Name:  <span class="font-weight-normal">${cursor.value.patient_firstname}<span></p>
            <p class="font-weight-bold">Patient Last Name:  <span class="font-weight-normal">${cursor.value.patient_lastname}<span></p>
            <p class="font-weight-bold">Animal Type:  <span class="font-weight-normal">${cursor.value.animal_type}<span></p>
           <p class="font-weight-bold">Age:  <span class="font-weight-normal">${cursor.value.age}<span></p>
           <p class="font-weight-bold">Breed:  <span class="font-weight-normal">${cursor.value.breed}<span></p>
           <p class="font-weight-bold">Gender:  <span class="font-weight-normal">${cursor.value.male}<span></p>
           <p class="font-weight-bold">Gender:  <span class="font-weight-normal">${cursor.value.female}<span></p>
           <p class="font-weight-bold">Date:  <span class="font-weight-normal">${cursor.value.date}<span></p>
           <p class="font-weight-bold">Time:  <span class="font-weight-normal">${cursor.value.time}<span></p>
           <p class="font-weight-bold">Vet:  <span class="font-weight-normal">${cursor.value.vet}<span></p>
           <p class="font-weight-bold">Notes:  <span class="font-weight-normal">${cursor.value.notes}<span></p>
            
            
            
      `;

      
      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('btn', 'btn-danger');
      cancelBtn.innerHTML = 'Cancel';
      cancelBtn.onclick = removeConsultation;
 
   
      ConsultationHTML.appendChild(cancelBtn);
   consultations.appendChild(ConsultationHTML);

      cursor.continue();
 } else {
      if(!consultations.firstChild) {
          services.textContent = 'Change your visiting hours';
           let noSchedule = document.createElement('p');
           noSchedule.classList.add('text-center');
           noSchedule.textContent = 'No results Found';
        consultations.appendChild(noSchedule);
      } else {
          services.textContent = 'Cancel Your consultations'
      }
 }
}
}

function removeConsultation(e) {

let scheduleID = Number( e.target.parentElement.getAttribute('data-consultation-id') );

let transaction = DB.transaction(['consultations'], 'readwrite');
let objectStore = transaction.objectStore('consultations');

objectStore.delete(scheduleID);

transaction.oncomplete = () => {

 e.target.parentElement.parentElement.removeChild( e.target.parentElement );

 if(!consultations.firstChild) {
     
      services.textContent = 'Change your visiting hours';
     
     let noSchedule = document.createElement('p');
    
     noSchedule.classList.add('text-center');
     
     noSchedule.textContent = 'No results Found';
  
      consultations.appendChild(noSchedule);
 } else {
     services.textContent = 'Cancel your Consultation'
 }
}
} 
} )


// let deleteRequest = objectStore.transaction;  // <-- Start a new transaction
deleteRequest.onerror = function(event) {
  console.log("Error deleting appointment");
};
deleteRequest.oncomplete = function(event) {
  console.log("Appointment deleted");
  container.remove(); // Remove the container from the DOM
};

// Delete the appointment from the database
objectStore.transaction.objectStore("consultations").delete(appointmentId);
