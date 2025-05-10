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

function openContactDialog(){
    //index > 0 entspricht Contacs editieren
    //index <0 entspricht neuen Kontakt erstellen

    document.getElementById("add_new_contact_ov_section").style.display = "flex";
}


function editContact(id, newContactData) {
    /*addNewContactOn();
    const contactEdit = Contacts[id];
     document.getElementById("name_input").value.innerHTML = contactEdit.name;
     document.getElementById("mail_input").value = contactEdit.mail;
     document.getElementById("pohne_input").value = contactEdit.phone;
*/
    let newData = {
        name: "test",
        mail: "szdglsdgfligdlf",
        phone: "01354/654678"
    }
    Contacts[id] = newContactData;
    // nicht vergessen data put data to Database
    updateDatabase(Contacts);
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

function addNewContactOff() {
    console.log("addNewContactOff aufgerufen");
    document.getElementById("add_new_contact_ov_section").style.display = "none";
}

function addNewContactOn(){
    document.getElementById("add_new_contact_ov_section").style.display = "flex";
}

function createContact() {
    const name = document.getElementById("name_input").value.trim();
    const mail = document.getElementById("mail_input").value.trim();
    const phone = document.getElementById("pohne_input").value.trim();
    if (!name || !mail  || !phone) {
        alert("Bitte fülle die Felder Name, Mail und Pohne aus.")
    }
    if ( emailIsValid(mail) == false)  {
        alert("Pleas wiret a valid email address.");
       return;
    }
    const newContact = {
        name: name,
        mail: mail,
        phone: phone || "No phone number available" 
    };
    Contacts.push(newContact);
    updateDatabase(Contacts);
    renderContacts(Contacts);x
    addNewContactOff();
    document.getElementById("name_input").value = "";
    document.getElementById("mail_input").value = "";
    document.getElementById("pohne_input").value = "";
    console.log("Neuer Kontakt hinzugefügt:", newContact);
}

function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function editContact(id) {
 addNewContactOn(id);
    const contactEdit = Contacts[id];
    
}

function deleteContact(id) {
    if (id < 0 || id >= Contacts.length) {
        console.error("Ungültige ID:", id);
        return;
    }

    Contacts.splice(id, 1);
    updateDatabase(Contacts);
    renderContacts(Contacts);

    if (Contacts.length > 0) {
        renderViewCard(0); 
    } else {
        document.getElementById("contact_view_avatar_initials").innerText = "";
        document.getElementById("contact_view_name").innerText = "";
        document.getElementById("contact_view_mail").innerText = "";
        document.getElementById("contact_view_phone").innerText = "";
    }
    alert("Contact deleted");
}

function contactRandomCollor() {
    let contactViewAvatar = document.getElementById("contact_view_avatar");
    let contactAvatar = document.getElementById("contact_avatar");
    let collors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFA133', '#FF33FF', '#33FF33', '#FF3333'];
    let currentColorIndex = 0;
    const color = collors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % collors.length;
    

    contactViewAvatar.innerHTML = `<div class="contact_view_avatar" style="background-color: ${color};">${initials}</div>`;
    contactAvatar.innerHTML = `<div class="contact_avatar" style="background-color: ${color};">${initials}</div>`;
return color;
}

