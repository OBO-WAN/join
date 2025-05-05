let Contacts = [];

function getContacts(data){
    
    fetch('https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/contacts.json')
        .then(response => response.json())
        .then(data => {
         
            renderContacts(data);
        });
      
       
    return data;
}

function renderContacts(contacts){ 

        let contactCards = '';
        for (let index = 0; index < contacts.length; index++) {
            const contact = contacts[index];
            const initials = contact.name
                .trim()
                .split(' ')
                .filter(word => word.length > 0)
                .map(word => word[0].toUpperCase()); // Initialen aus dem Namen
            contactCards += getContactCardTamplate(contact.name, contact.mail, initials);
        }
        document.getElementById("contact_card_section").innerHTML = contactCards;


}


function getContact(id){ //get contact by id

}

function addContact(id){

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

function deleteContact(id){

}

function editContact(id, newContactdata){ //add contact aufrufen + daten vom angeklicktem contakt übergeben und rendern

}

function sortContacts(){ //sort contacts by name


}

    /*console.log(contacts);
    let contactCardName = document.getElementById("contact_name");
    for (let index = 0; index < contacts.length; index++) {
      let contactCardName = contacts[index].name;
      contactCardName.innerHTML = contactCardName; 
    }

    console.log(contacts);
    let contactCardMail = document.getElementById("contact_email");
    for (let index = 0; index < contacts.length; index++) {
      let contactsMail = contacts[index].mail;
      contactCardMail.innerHTML = contactsMail; 
    }

    let contactsCard = contactCardMail+contactCardName;
  
    document.getElementById("contact_card_section").innerHTML = getContactCardTamplate() + contactsCard;*/
    /*let contactCards = '';
    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        const initials = contact.name.split(' ').map(word => word[0]); // Initialen aus dem Namen
        contactCards += getContactCardTamplate(contact.name, contact.mail, initials);
    }
    document.getElementById("contact_card_section").innerHTML = contactCards;*/
