let Contacts = [];
let actualContactIndex = 0;

window.addEventListener('resize', () => {
    handleWindowResize();
});

let colorsArray = [
    "#FF6B6B", "#FF8C42", "#FFA500", "#FFD700", "#FFE600",
    "#B4FF00", "#4CAF50", "#00C853", "#00E5FF", "#00B8D4",
    "#1DE9B6", "#00CFAE", "#00BCD4", "#40C4FF", "#2196F3",
    "#3D5AFE", "#536DFE", "#7C4DFF", "#AB47BC", "#E040FB",
    "#FF4081", "#F50057", "#EC407A", "#FF1744", "#FF5252",
    "#D500F9", "#9C27B0", "#BA68C8", "#E91E63", "#FFB300",
    "#FFC400", "#FF9100", "#FF7043", "#F06292", "#FF6E40",
    "#C51162", "#8E24AA", "#651FFF", "#00BFA5", "#76FF03"
]


function getContacts(data){
    
    fetch('https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/contacts.json')
        .then(response => response.json())
        .then(data => {
            Contacts = data;
            renderContacts(data);

            if (Contacts.length > 0) {
                //renderViewCard(0); 
            }
                
        });

    if( getViewMode() === 1)    clearViewCard();
    setActualContactIndex(-1);
    /*versionHandling();*/
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

/* Kontaktliste */
function renderContacts(contacts) { 
    let contactCards = '';
    sortContacts(contacts); // Kontakte sortieren
    let oldLetter = ''; // Speichert den vorherigen Buchstaben

    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        //console.log("Kontakt:", contact);
        let initials = getInitials(contact.name);
        //console.log("Initials:", initials);
        let firstLetter = contact.name.charAt(0).toUpperCase(); // Erster Buchstabe des Namens

        // Wenn der Buchstabe wechselt, füge eine neue Überschrift hinzu
        if (oldLetter !== firstLetter) {
            contactCards += `
                <div class="contacts_section_header">
                    <p class="contacts_section_letter">${firstLetter}</p>
                </div>`;
            oldLetter = firstLetter;
        }

        let color = getColor(initials[0]);
        //console.log("Color:", color);
        contactCards += getContactCardTamplate(contact.name, contact.mail, initials, index, color);
        //console.log(Array.isArray(contacts), contacts);
    }
    document.getElementById("contact_card_section").innerHTML = contactCards;
   
}

/* Mobile Version */
function MobileVievCard(index){
    
    let contact = Contacts[index];
    
    let initials = getInitials(contact.name);
    let color = getColor(initials[0]);

    let contactsListElem = document.getElementById("contacts_list");
    if (contactsListElem) {
        contactsListElem.style.display = "none";
    }

    let addNewContactSectionElem = document.getElementById("add_new_contact_section");
    if (addNewContactSectionElem) {
        addNewContactSectionElem.style.display = "none";
    }

    let viewCardTemp  = getMobileViewCardTemplate(index, color);
    let contactsContainer = document.getElementById("contactslist_container");
    contactsContainer.innerHTML = viewCardTemp ;
    renderViewCard(index); 
}

function getTabletViewCardHeader(){
    let tabletViewCardHeader = getTeblateViewCardHeaderTemplate();
    let tabletViewCardHeaderId = document.getElementById("Tablet_view_card_header");
    tabletViewCardHeaderId.innerHTML = tabletViewCardHeader;
}

/*Tablat version*/
function renderTabletVievCard(index){
 
   let addNewcontactMobileBtn = document.getElementById("add_new_contact_Mobile_btn")
    if (addNewcontactMobileBtn) {
        addNewcontactMobileBtn.style.display = "none";
    }


    let contact = Contacts[index];
    
    let initials = getInitials(contact.name);
    let color = getColor(initials[0]);

    let contactsListElem = document.getElementById("contacts_list");
    if (contactsListElem) {
        contactsListElem.style.display = "none";
    }

    addNewContactSectionState(false);

    let TabletViewContainer = document.getElementById("tablate_view_card_container");
    TabletViewContainer.style.display = "flex";
    TabletViewContainer.innerHTML = getTabletViewCardTemplate(index, color);

    // Jetzt existiert das Element im DOM!
    let tabletViewCardHeaderId = document.getElementById("Tablet_view_card_header");
    tabletViewCardHeaderId.innerHTML = getTabletViewCardHeaderTemplate();

   
    renderViewCard(index); 

   
    console.log("renderTabletVievCard aufgerufen");
}

/* Desktop Version*/
function renderViewCard(index) {
    setActualContactIndex(index);
    let contact = Contacts[index];
    
    let initials = getInitials(contact.name);
    let color = getColor(initials[0]);
    let tempViewCard = getViewCardTemplate(index, color);
    //tempViewCard.innerHTML = "";
    document.getElementById("contactViewCard").innerHTML = tempViewCard;

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

    let KindOfDlg_pc = "";
    let viewMode = getViewMode();
    if (viewMode === 1 || viewMode === 2) { KindOfDlg_pc = "_pc"; }

    let name = document.getElementById("name_input" + KindOfDlg_pc).value.trim();
    let mail = document.getElementById("mail_input" + KindOfDlg_pc).value.trim();
    let phone = document.getElementById("pohne_input" + KindOfDlg_pc).value.trim();
    if (!name || !mail  || !phone) {
        alert("Bitte fülle die Felder Name, Mail und Pohne aus.")
        return;
    }
    if ( emailIsValid(mail) == false)  {
        alert("Pleas wiret a valid email address.");
        return;
    }

    name = capitalizeWords(name);

    let newContact = {
        mail: mail,
        name: name,
        phone: phone || "No phone number available" 
    };

    Contacts.push(newContact);
    updateDatabase(Contacts);
    renderContacts(Contacts);
    closeContactDialog();
    closeContactDialogMobile();
    

    document.getElementById("name_input" + KindOfDlg_pc).value = "";
    document.getElementById("mail_input" + KindOfDlg_pc).value = "";
    document.getElementById("pohne_input" + KindOfDlg_pc).value = "";
    console.log("Neuer Kontakt hinzugefügt:", newContact);
}


/**
 * Finds the new index of a contact after sorting the contacts array by name.
 * @param {Object} contact - The contact object to search for.
 * @returns {number} - The new index of the contact in the sorted Contacts array, or -1 if not found.
 */
function findContactNewIndex(contact) {
    for (let i = 0; i < Contacts.length; i++) {
        if (
            Contacts[i].name === contact.name &&
            Contacts[i].mail === contact.mail &&
            Contacts[i].phone === contact.phone
        ) {
            return i;
        }
    }
    return -1;
}


function editContact(id) {

    let KindOfDlg_pc = "";
    let viewMode = getViewMode();
    if (viewMode === 1 || viewMode === 2) { KindOfDlg_pc = "_pc"; }

    let name = document.getElementById("name_input" + KindOfDlg_pc).value.trim();
    let mail = document.getElementById("mail_input" + KindOfDlg_pc).value.trim();
    let phone = document.getElementById("pohne_input" + KindOfDlg_pc).value.trim();


    if (!name || !mail  || !phone) {
        alert("EDIT: Bitte fülle die Felder Name, Mail und Pohne aus.")
        return;
    }
    if ( emailIsValid(mail) == false)  {
        alert("Pleas wiret a valid email address.");
        return;
    }
    
    name = capitalizeWords(name);

    let newContact = {
        mail: mail,
        name: name,
        phone: phone || "No phone number available" 
    };
    
    Contacts[id] = newContact;
    updateDatabase(Contacts);
    id = findContactNewIndex(newContact);

    if (viewMode === 1) {
        renderContacts(Contacts);
        renderViewCard(id);
        closeContactDialog();
    }else if (viewMode === 2) {
        renderContacts(Contacts);
        renderViewCard(id);
        closeContactDialog();
    }else if (viewMode === 3) {
        MobileVievCard(id);
        closeContactDialogMobile();
    }else if (viewMode === 4) {
        MobileVievCard(id);
        closeContactDialogMobile();
    }

    document.getElementById("name_input"+ KindOfDlg_pc).value = "";
    document.getElementById("mail_input"+ KindOfDlg_pc).value = "";
    document.getElementById("pohne_input"+ KindOfDlg_pc).value = "";

}


function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/*
TODO:
-Comment rausnehmen
*/
function deleteContact(id) {

    let viewMode = getViewMode();
    if( viewMode === 2 || viewMode === 3) editContactsMobileMenuOff();

    if (id < 0 || id >= Contacts.length) {
        console.error("Ungültige ID:", id);
        return;
    }

    let text = "Delete Contact?\nPress a button!\nEither OK or Cancel.";
    
    if (confirm(text) == true) {
        Contacts.splice(id, 1);
        updateDatabase(Contacts);

        let viewMode = getViewMode();
        if (viewMode === 1) {
            renderContacts(Contacts);
        }
/*
        if (Contacts.length > 0) {
            //renderViewCard(0); 
        } else {
            document.getElementById("contact_view_avatar_initials").innerText = "";
            document.getElementById("contact_view_name").innerText = "";
            document.getElementById("contact_view_mail").innerText = "";
            document.getElementById("contact_view_phone").innerText = "";
        }
        */
    //  alert("Contact deleted");
        clearViewCard();
    }
}


function clearViewCard()
{
    let viewMode = getViewMode();
    if( viewMode === 1) {
        document.getElementById("contactViewCard").innerHTML = "";
    }else if( viewMode === 2) {
         document.getElementById("contactViewCard").innerHTML = "";
    }else if(viewMode === 3){
        document.getElementById("contact_view_card").innerHTML = "";
    }else if(viewMode === 4){
        document.getElementById("contact_view_card").innerHTML = "";
    }
    
}


function configEditDlgBox(id){

    let kindOFEdit = "editContact";
    if(id < 0) kindOFEdit = "createContact";

    let btnText ="";
    //let kindOfDlg_Text = "";
    let functionName = "";
    let KindOfDlg_pc = "";
    let viewMode = getViewMode();
    if (viewMode === 1) { KindOfDlg_pc = "_pc"; }
    
    let AddNewcontactAvatar = document.getElementById("add_new_contact_avatar");
    let AddNewcontactAvatar_mobile = document.getElementById("add_new_contact_avatar_mobile");
    switch(kindOFEdit){
        case "editContact":
                document.getElementById("Kind_Of_Dlg" + KindOfDlg_pc).innerHTML = "Edit contact";
                btnText = "Save";
                functionName = "editContact(" + id + ")";

                let oldContactData = Contacts[id];

                document.getElementById("name_input" + KindOfDlg_pc).value = oldContactData.name; // Contacts[id].name;
                document.getElementById("mail_input" + KindOfDlg_pc).value = oldContactData.mail //Contacts[id].mail;
                document.getElementById("pohne_input" + KindOfDlg_pc).value = oldContactData.phone; //Contacts[id].phone;

                if(AddNewcontactAvatar){

                    let test = getInitials(oldContactData.name);
                    AddNewcontactAvatar.innerHTML = `
                        <p class="contact_view_avatar_initials" id="add_new_contact_avatar_1">${test[0].toUpperCase()}</p>
                        <p class="contact_view_avatar_initials" id="add_new_contact_avatar_2">${test[1].toUpperCase()}</p>
                    `;
                   
                    let avatarColor = getColor( oldContactData.name.charAt(0) );
                    AddNewcontactAvatar.style.backgroundColor = avatarColor;
                    AddNewcontactAvatar.style.color = "#FFFFFF";
                }

                if(AddNewcontactAvatar_mobile){

                    let test = getInitials(oldContactData.name);
                    AddNewcontactAvatar_mobile.innerHTML = `
                        <p class="contact_view_avatar_initials" id="add_new_contact_avatar_mob_1">${test[0].toUpperCase()}</p>
                        <p class="contact_view_avatar_initials" id="add_new_contact_avatar_mob_2">${test[1].toUpperCase()}</p>
                    `;
                   
                    let avatarColor = getColor( oldContactData.name.charAt(0) );
                    AddNewcontactAvatar_mobile.style.backgroundColor = avatarColor;
                    AddNewcontactAvatar_mobile.style.color = "#FFFFFF";
                }

            break;

        case "createContact":
                document.getElementById("Kind_Of_Dlg" + KindOfDlg_pc).innerHTML = "Add contact";
                btnText = "Create";
                functionName = "createContact()";

                if(AddNewcontactAvatar){
                    AddNewcontactAvatar.style.backgroundColor = "#eeecec";
                    AddNewcontactAvatar.innerHTML = `
                        <img class="ov_avatar" src="./assets/img/add_new_contact_ov_avatar.png" alt="add new contact avatar">
                    `;
                }

                if(AddNewcontactAvatar_mobile){
                    AddNewcontactAvatar_mobile.style.backgroundColor = "#eeecec";
                    AddNewcontactAvatar_mobile.innerHTML = `
                        <img class="ov_avatar" src="./assets/img/add_new_contact_ov_avatar.png" alt="add new contact avatar">
                    `;
                }

            break;

        default:
            break;
    }

    let btnHtml = `
        <button class="create_btn" id="id_Edit_Btn" onclick = "${functionName}">
            <span id="id_Edit_Btn_Text${KindOfDlg_pc}">${btnText}</span>
            <img class="create_btn_img" src="./assets/img/create_contact_btn.png" alt="create button">
        </button>`;

    document.getElementById("id_Edit_Btn").innerHTML = btnHtml;

}


function openContactDialog(id){
    //index > 0 entspricht Contacs editieren
    //index <0 entspricht neuen Kontakt erstellen
    document.getElementById("add_new_contact_ov_section").style.display = "flex";
    configEditDlgBox(id);
}


function closeContactDialog(){
    document.getElementById("add_new_contact_ov_section").style.display = "none";
    console.log("closeContactDialog aufgerufen");

    document.getElementById("name_input_pc").value = "";
    document.getElementById("mail_input_pc").value = "";
    document.getElementById("pohne_input_pc").value = "";
    // dialog beim schliesen lleeren
}


/*contact dialog mobile section*/
function openContactDialogMobile(id){
     
    let mobileDialogTemplate = getAddNewContactMobileTemplate();
    document.getElementById("add_new_contact_mobile_ov_container").innerHTML = mobileDialogTemplate;
    configEditDlgBox(id);

    console.log("openContactDialogMobile aufgerufen");
    
    editContactsMobileMenuOff();
    //document.getElementById("add_new_contact_mobile_ov").style.display = "flex";
}

function closeContactDialogMobile(){
    const addNewContactMobileOv = document.getElementById("add_new_contact_mobile_ov");
    
    if(addNewContactMobileOv) {
        addNewContactMobileOv.style.display = "none";
        const addNewContactMobileBtn = document.getElementById("add_new_contact_Mobile_btn");
        if (addNewContactMobileBtn) {
            addNewContactMobileBtn.style.display = "flex";  
        }
    }
}


function getInitials(name)
{
    let initials = name
        .trim()
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase()); 
    return initials;
}


function sortContacts(contacts){ //sort contacts by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    Contacts = contacts;
}


function getFirstLetter(name, oldLetter, change){ //get first letter of name

    let firstLetter = name.charAt(0);

    if (oldLetter !== firstLetter) {
        change = true;
    }
    else {
        change = false;
    }
    oldLetter = firstLetter;

    return firstLetter;
}

/**
 * Determines the current view mode based on the window's width.
 *
 * @returns {number} The view mode:
 *   1 - Desktop big (window width >= 1100)
 *   2 - Desktop small (window width < 1100)
 *   3 - Tablet (window width < 825)
 *   4 - Mobile (window width < 560)
 */
function getViewMode()
{
    let viewMode = 1;
    
    if (window.innerWidth < 1100) {
        viewMode = 2;
    }

    if (window.innerWidth < 825) {
        viewMode = 3;
    }
    if (window.innerWidth < 560) {
        viewMode = 4;
    }

    return viewMode;
}


let bigWindowIsRendered = false;
function proofVersion(index){

    setActualContactIndex(index);
    let version = getViewMode();

    switch (version) {
        case 1: //  1 = desktop big     | >= 1100
            renderViewCard(index);
            break;

        case 2: // 2 = desktop small   | < 1100
                // 3 = tablet          | < 825
        case 3:
            renderTabletVievCard(index);
            break;
        
        case 4: // 4 = mobile          | < 560
            MobileVievCard(index);
            break;

        default:
            break;
    }
}


function handleWindowResize(){

    let idx = getActualContactIndex();

    if (window.innerWidth > 825) {

            renderContacts(Contacts);

            if (idx < 0) {
                // Clear the view card
                clearViewCard();
            }else {
                renderViewCard(idx);
            }
/**/
            let addNewContact = "";
            addNewContact = getAddNewCotactTemplate();
            document.getElementById("add_new_contact_section").innerHTML = addNewContact;
/**/

            bigWindowIsRendered = true;
    }else {
        document.getElementById("contactViewCard").style.display = "flex";
        goBacktoContacts();
        //renderContacts(Contacts);
        bigWindowIsRendered = false;
    }

}


function getColor(firstLetter){

    let text = "";
    text = String(firstLetter).toUpperCase();

    let colorIndex = text.charCodeAt(0) - 65;

    return colorsArray[colorIndex];
}


function capitalizeWords(Sentence)
{
    return Sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}


function setActualContactIndex(index){
    actualContactIndex = index;
    return actualContactIndex;
}


function getActualContactIndex(){
    return actualContactIndex;
}   

function goBackBtn(){

}

function goBacktoContacts(){
    let tablet_additional_div = '';
    let addNewContact = "";
    let viewMode = getViewMode();
    if(viewMode === 2 || viewMode === 3)  tablet_additional_div = '<div id="tablate_view_card_container" class="tablate_view_card_container"></div>';

    let contactsContainer = document.getElementById("contactslist_container");
    if (contactsContainer) {
        contactsContainer.innerHTML = `

            ${tablet_additional_div}

            <div class="add_new_contact_section" id="add_new_contact_section">
            </div>
            <div class="contacts_list" id="contacts_list">
                <div class="contacts_section">
                    <div class="contact_card_section" id="contact_card_section"></div>
                </div>
            </div>
            <div class="add_new_contact_Mobile_section">
                <div class="add_new_contact_Mobile_btn" id = "add_new_contact_Mobile_btn" onclick="openContactDialogMobile(-1)">
                    <img class="add_new_contact_mobile_icon" src="./assets/icons/contact/addcontact.png" alt="icon">
                </div>
            </div>
        `;

        if (viewMode === 1) {
            addNewContact = getAddNewCotactTemplate();
        }else if (viewMode === 2){
            addNewContact = getAddNewCotactTemplate();
            addNewContactSectionState(true);
        }else if(viewMode === 3) {
            addNewContact = getAddNewContactMobileTemplate();
            addNewContactSectionState(true);
        }else if (viewMode === 4) {
            addNewContact = getAddNewContactMobileTemplate();
        }

        document.getElementById("add_new_contact_section").innerHTML = addNewContact;
    }
    renderContacts(Contacts);
}


function editContactsMobileMenuOn() {
    document.getElementById("mobile_view_card_menu").style.display = "flex";
    document.addEventListener('mousedown', handleOutsideClickForMobileMenu);
}


function editContactsMobileMenuOff() {
    let menu = document.getElementById("mobile_view_card_menu");
    
        menu.style.display = "none";
        document.removeEventListener('mousedown', handleOutsideClickForMobileMenu);
  
}


function addNewContactSectionState(state) {

    let stateStr = "none";
    if(state == true)   stateStr = "flex";

    let section = document.getElementById("add_new_contact_Mobile_section");
    if (section) {
        section.style.display = stateStr;
    }

    section = document.getElementById("add_new_contact_Mobile_btn");
    if (section) {
        section.style.display = stateStr;
    }
}

function handleOutsideClickForMobileMenu(event) {
    let menu = document.getElementById("mobile_view_card_menu");
    if (menu && !menu.contains(event.target)) {
        editContactsMobileMenuOff();
    }
}


// SETTING USER INITIALS 
function setUserInitials() {
  const firstInitial = document.getElementById('first_icon_initials');
  const lastInitial = document.getElementById('last_icon_initials');
  const initials = sessionStorage.getItem('userInitials');
  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');

  if (firstInitial && lastInitial && firstName && lastName) {
    firstInitial.textContent = firstName[0].toUpperCase();
    lastInitial.textContent = lastName[0].toUpperCase();
  } else if (initials && initials.length === 2) {
    firstInitial.textContent = initials[0];
    lastInitial.textContent = initials[1];
  }
}

window.addEventListener('DOMContentLoaded', setUserInitials);
