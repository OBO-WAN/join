let Contacts = [];

function getContacts(data,){
    
    fetch('https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/contacts.json')
        .then(response => response.json())
        .then(data => {
            Contacts = data;
            renderContacts(data);
        
        });
      
    
    return data;
}

function updateDatabase(data){ //update contact by id
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

/*function renderContacts(contacts) { 
    let contactCards = '';
    sortContacts(contacts); // Kontakte sortieren
    let oldLetter = ''; // Speichert den vorherigen Buchstaben

    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        const initials = contact.name
            .trim()
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0].toUpperCase()); 

        const firstLetter = contact.name.charAt(0).toUpperCase(); // Erster Buchstabe des Namens

        // Wenn der Buchstabe wechselt, füge eine neue Überschrift hinzu
        if (oldLetter !== firstLetter) {
            contactCards += `<div class="contacts_section_header">${firstLetter}</div>`;
            oldLetter = firstLetter; // Aktualisiere den alten Buchstaben
        }

        // Füge die Kontaktkarte hinzu
        contactCards += getContactCardTamplate(contact.name, contact.mail, initials, index);
    }

    // Setze den HTML-Inhalt der Kontaktliste
    document.getElementById("contact_card_section").innerHTML = contactCards;
}*/

function renderContacts(contacts) { 
    let contactCards = '';
    sortContacts(contacts); // Kontakte sortieren
    let oldLetter = ''; // Speichert den vorherigen Buchstaben

    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        const initials = contact.name
            .trim()
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0].toUpperCase()); 

        const firstLetter = contact.name.charAt(0).toUpperCase(); // Erster Buchstabe des Namens

        // Wenn der Buchstabe wechselt, füge eine neue Überschrift hinzu
        if (oldLetter !== firstLetter) {
            contactCards += `
                <div class="contacts_section_header">
                    <p class="contacts_section_letter">${firstLetter}</p>
                </div>`;
            oldLetter = firstLetter; // Aktualisiere den alten Buchstaben
        }

        // Füge die Kontaktkarte hinzu
        contactCards += getContactCardTamplate(contact.name, contact.mail, initials, index);
    }

    // Setze den HTML-Inhalt der Kontaktliste
    document.getElementById("contact_card_section").innerHTML = contactCards;
}

function sortContacts(contacts){ //sort contacts by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function getFirstLetter(name, oldLetter, change){ //get first letter of name

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

function getContact(id){ //get contact by id
    console.log(Contacts[id]);
}

function addContact(id){

}

function deleteContact(id){

}

function editContact(id, newContactdata){ //add contact aufrufen + daten vom angeklicktem contakt übergeben und rendern

}

function renderViewCard(contacts){
     
}
