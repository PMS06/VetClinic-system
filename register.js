// Select form and input elements 
let form = document.querySelector("#form");
let first_name = document.querySelector("#first_name");
let last_name = document.querySelector("#last_name");
let animal_type = document.querySelector("#animal_type");
let breed = document.querySelector("#breed");
let gender = document.querySelector("#Gender");
let email = document.querySelector("#email");
let ph_num = document.querySelector("#phone-number");

let DB;
// Add an event listener to handle form submission
form.addEventListener('submit', register);

// Function to handle registration process
function register(event){
    // Prevent the form from submitting by default
    event.preventDefault();
    // Create a new registration object
    let newRegister = {
        
        first_name: first_name.value,
        last_name: last_name.value,
        gender: gender.value,
        animal_type: animal_type.value,
        breed: breed.value,
        email: email.value,
        ph_num: ph_num.value

    };
    // Create a transaction and access the 'consultations' object store 
    let transaction = DB.transaction(['consultations'],'readwrite');
    let objectStore = transaction.objectStore('consultations');

    // Add the new registration object to the object store
    let request = objectStore.add(newRegister);
    request.onsuccess = function(){
        // Reset the form and display a success message
        form.reset();
        alert("Successfully Registered");
    }
    transaction.onerror = function(){
        console.log("Transaction failed");
    }
}
// Initialize IndexedDB variables 
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// Open the register database
let request = window.indexedDB.open('Register',1);

request.onsuccess = function(event){
    console.log('Database successfully opened');
    DB = event.target.result;
}
request.onerror = function(event){
    console.log("Could not open the database");
}

// Create the 'consultations' object store if it doesn't exist
request.onupgradeneeded = function(event){
    let db = event.target.result;

    if (!db.objectStoreNames.contains('consultations')) {
        let objectStore = db.createObjectStore('consultations', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('first_name', 'first_name', { unique: false });
        objectStore.createIndex('last_name', 'last_name', { unique: false });
        objectStore.createIndex('animal_type', 'animal_type', { unique: false });
        objectStore.createIndex('breed', 'breed', { unique: false });
        objectStore.createIndex('gender','gender',{unique:false});
        objectStore.createIndex('email','email',{unique:false});
        objectStore.createIndex('ph_num','ph_num',{unique:false});
      }
}

