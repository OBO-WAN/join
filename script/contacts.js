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
            oldLetter = firstLetter;
        }


        contactCards += getContactCardTamplate(contact.name, contact.mail, initials, index)   
    }

    document.getElementById("contact_card_section").innerHTML = contactCards;
}


function sortContacts(contacts){ //sort contacts by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    Contacts = contacts;
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


function renderViewCard(index) {

    let tempViewCard = getViewCardTemplate(index);
    document.getElementById("contactViewCard").innerHTML = tempViewCard;

    const contact = Contacts[index]; 
    document.getElementById("contact_view_avatar_initials").innerText = contact.name
        .split(' ')
        .map(word => word[0].toUpperCase())
        .join('');
    document.getElementById("contact_view_name").innerText = contact.name;
    document.getElementById("contact_view_mail").innerText = contact.mail;
    document.getElementById("contact_view_phone").innerText = contact.phone || 'No phone number available';

       
}


function getContact(id){
    console.log(Contacts[id]);
}


function createContact() {
    const name = document.getElementById("name_input").value.trim();
    const mail = document.getElementById("mail_input").value.trim();
    const phone = document.getElementById("pohne_input").value.trim();
    if (!name || !mail  || !phone) {
        alert("Bitte fülle die Felder Name, Mail und Pohne aus.")
        return;
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
    renderContacts(Contacts);
    closeContactDialog();

    document.getElementById("name_input").value = "";
    document.getElementById("mail_input").value = "";
    document.getElementById("pohne_input").value = "";
    console.log("Neuer Kontakt hinzugefügt:", newContact);
}


function editContact(id) {
    let name = document.getElementById("name_input").value;
    let mail = document.getElementById("mail_input").value;
    let phone = document.getElementById("pohne_input").value;

    if (!name || !mail  || !phone) {
        alert("EDIT: Bitte fülle die Felder Name, Mail und Pohne aus.")
        return;
    }
    if ( emailIsValid(mail) == false)  {
        alert("Pleas wiret a valid email address.");
        return;
    }
    
    let newContact = {
        name: name,
        mail: mail,
        phone: phone || "No phone number available" 
    };
    
    
    Contacts[id] = newContact;

    updateDatabase(Contacts);
    renderContacts(Contacts);
    renderViewCard(id);
    closeContactDialog();

    document.getElementById("name_input").value = "";
    document.getElementById("mail_input").value = "";
    document.getElementById("pohne_input").value = "";
    console.log("Kontakt wurde aktualisiert:", newContact);
}


function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
    document.getElementById("contactViewCard").innerHTML = "";
}


function avatarColor() {
    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#DAF7A6",
        "#581845", "#C70039", "#900C3F", "#1E90FF", "#33A1FF", "#FFD700",
        "#FF4500", "#00BFFF", "#20B2AA", "#4682B4", "#32CD32", "#228B22",
        "#2E8B57", "#006400", "#8B4513", "#A0522D", "#696969", "#FF69B4",
        "#FF1493", "#9400D3", "#4B0082", "#00CED1", "#FFFF00", "#33FFBD"
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
}


function configEditDlgBox(id){

    let kindOFEdit = "editContact";
    if(id < 0) kindOFEdit = "createContact";

    let btnText ="";
    let kindOfDlg_Text = "";
    let functionName = "";

    switch(kindOFEdit){
        case "editContact":
                document.getElementById("Kind_Of_Dlg").innerHTML = "Edit contact";
                btnText = "Save";
                functionName = "editContact(" + id + ")";

                let oldContactData = Contacts[id];

                document.getElementById("name_input").value = oldContactData.name; // Contacts[id].name;
                document.getElementById("mail_input").value = oldContactData.mail //Contacts[id].mail;
                document.getElementById("pohne_input").value = oldContactData.phone; //Contacts[id].phone;

            break;

        case "createContact":
                document.getElementById("Kind_Of_Dlg").innerHTML = "Add contact";
                btnText = "Create";
                functionName = "createContact()";
            break;

        default:
            break;
    }

    let btnHtml = `
        <button class="create_btn" id="id_Edit_Btn" onclick = "${functionName}">
            <span id="id_Edit_Btn_Text">${btnText}</span>
            <img class="create_btn_img" src="./assets/img/create_contact_btn.png" alt="create button">
        </button>`;

    document.getElementById("id_Edit_Btn").innerHTML = btnHtml;

}


function openContactDialog(id){
    //index > 0 entspricht Contacs editieren
    //index <0 entspricht neuen Kontakt erstellen

    configEditDlgBox(id);

    document.getElementById("add_new_contact_ov_section").style.display = "flex";
}


function closeContactDialog(){

    document.getElementById("add_new_contact_ov_section").style.display = "none";
    console.log("closeContactDialog aufgerufen");

    // dialog beim schliesen lleeren
}






/*
TODO:

- Colors of the Wind

*/