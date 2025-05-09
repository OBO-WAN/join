let Contacts = [];

function getContacts(data,){
    
    fetch('https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/contacts.json')
        .then(response => response.json())
        .then(data => {
            Contacts = data;
            renderContacts(data);

            if (Contacts.length > 0) {
                renderViewCard(0); 
            }
        });
      
    return data;
}

function updateDatabase(data){ 
    fetch('https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/contacts.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/*function renderContacts(contacts){ 
        let contactCards = '';
        sortContacts(contacts);
        let oldLetter = '';
        for (let index = 0; index < contacts.length; index++) {
            const contact = contacts[index];
            const initials = contact.name
                .trim()
                .split(' ')
                .filter(word => word.length > 0)
                .map(word => word[0].toUpperCase()); 
            let change = false;
            let firstLetter = getFirstLetter(contact.name, oldLetter, change);

            if(change) {
                //contactCards += `<div class="contact_letter">${firstLetter}</div>`;
                document.getElementById("contacts_section_letter").innerHTML = firstLetter; // Hole dir den ersten Buchstaben des Namens und stelle ihn in der Sektion dar
                // Hole dir Id von Separator und stelle den ersten Buchstaben des Namens

            }

            contactCards += getContactCardTamplate(contact.name, contact.mail, initials, index);
        }
        
        document.getElementById("contact_card_section").innerHTML = contactCards;

}*/


function renderContacts(contacts) { 
    let contactCards = '';
    sortContacts(contacts); 
    let oldLetter = ''; 

    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        const initials = contact.name
            .trim()
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0].toUpperCase()); 

        const firstLetter = contact.name.charAt(0).toUpperCase(); 
        if (oldLetter !== firstLetter) {
            contactCards += `
                <div class="contacts_section_header">
                    <p class="contacts_section_letter">${firstLetter}</p>
                </div>`;
            oldLetter = firstLetter; 
        }
        contactCards += getContactCardTamplate(contact.name, contact.mail, initials, index);
    }
    document.getElementById("contact_card_section").innerHTML = contactCards;
}

function sortContacts(contacts){ 
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function getFirstLetter(name, oldLetter, change){ 

    const firstLetter = name.charAt(0);

    if (oldLetter !== firstLetter) {
        change = true;
    }
    else {
        change = false;
    }
    oldLetter = firstLetter;

    return firstLetter;
}

function getContact(id){
    console.log(Contacts[id]);
}

function addContact(id){

}

function deleteContact(id){

}

function editContact(id, newContactdata){ //add contact aufrufen + daten vom angeklicktem contakt übergeben und rendern

}

function renderViewCard(index) {
    const contact = Contacts[index]; 
    document.getElementById("contact_view_avatar_initials").innerText = contact.name
        .split(' ')
        .map(word => word[0].toUpperCase())
        .join('');
    document.getElementById("contact_view_name").innerText = contact.name;
    document.getElementById("contact_view_mail").innerText = contact.mail;
    document.getElementById("contact_view_phone").innerText = contact.phone || 'No phone number available';
}

function addNewContactOn(){
    document.getElementById("add_New_contact_ov_section").style.display = "block";
}

function addNewContactOff(){
    document.getElementById("add_New_contact_ov_section").style.display = "none";
}