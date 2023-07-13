// Select form and input elements
let form = document.querySelector('#form');
let firstName = document.querySelector('#firstName');
let lastName = document.querySelector('#lastName');
let animalType = document.querySelector('#animalType');
let age = document.querySelector('#age');
let breed = document.querySelector('#breed');
let gender = document.querySelector("#Gender");
let date = document.querySelector('#date');
let time = document.querySelector('#time');
let vet = document.querySelector('#vet');
let notes = document.querySelector('#notes');

let ScheduleDB;

// Add an event listener to handle form submission
form.addEventListener('submit', addConsultation);

// Function to handle consultation addition
function addConsultation(event) {
// Prevent the form from submitting by default
event.preventDefault();

// Create a new consultation object
let newConsultation = {
id: Date.now(),
firstName: firstName.value,
lastName: lastName.value,
gender: gender.value,
animalType: animalType.value,
age: age.value,
breed: breed.value,
date: date.value,
time: time.value,
vet: vet.value,
notes: notes.value
};

// Create a transaction and access the 'consultations' object store
let transaction = ScheduleDB.transaction(['consultations'], 'readwrite');
let objectStore = transaction.objectStore('consultations');

// Add the new consultation object to the object store
let request = objectStore.add(newConsultation);
request.onsuccess = function() {
// Reset the form and display a success message
form.reset();
alert("Appointment successfully booked");
};

// Error handling for transaction failure
transaction.onerror = function() {
console.log('Transaction failed');
};
}

// Initialize IndexedDB variables
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// Open the 'appointments' database
let request = window.indexedDB.open('appointments', 1);

request.onsuccess = function(event) {
console.log('Success: Database opened');
ScheduleDB = event.target.result;
};

// Error handling for opening the database
request.onerror = function(event) {
console.log('Error: Could not open the database. ' + event.target.errorCode);
};

// Create the 'consultations' object store if it doesn't exist
request.onupgradeneeded = function(event) {
let db = event.target.result;

if (!db.objectStoreNames.contains('consultations')) {
let objectStore = db.createObjectStore('consultations', { keyPath: 'id', autoIncrement: true });
objectStore.createIndex('firstName', 'firstName', { unique: false });
objectStore.createIndex('lastName', 'lastName', { unique: false });
objectStore.createIndex('animalType', 'animalType', { unique: false });
objectStore.createIndex('age', 'age', { unique: false });
objectStore.createIndex('breed', 'breed', { unique: false });
objectStore.createIndex('gender', 'gender', { unique: false });
objectStore.createIndex('date', 'date', { unique: false });
objectStore.createIndex('time', 'time', { unique: false });
objectStore.createIndex('vet', 'vet', { unique: false });
objectStore.createIndex('notes', 'notes', { unique: false });
}
};

