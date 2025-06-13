/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 * jsdoc tag
 */


let Contacts = []

async function getContacts(){
    let response = await fetch('https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/contacts.json')
    let responseToJson = await response.json()
    responseToJson = Contacts
    console.log(Contacts)
}

function updateContacts(){

}

//ContactList
function rederCotacts(){
    
}

function sortContacts(){
    
}

function getFirstLetter(){
    
}

//Change Contacts
function addContact(){

}

function editContact(){

}

function deleteContact(){

}

//Viewcard
function renderViewCard(){
    
}

//Dialog
function openContactDialog(){
    document.getElementById("add_new_contact_ov_section").style.display = "flex";
}

function closeContactDialog(){
    document.getElementById("add_new_contact_ov_section").style.display = "none";

}

//contat avatar collor
function avatarColor(){

}