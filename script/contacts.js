let Contacts = [];
let actualContactIndex = 0;


window.addEventListener("resize", () => {
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
];


/**
 * Fetches contacts from the remote database and renders them.
 * @param {any} data - Unused parameter.
 * @returns {any} The input data.
 */
function getContacts(data) {
    fetch(
        "https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
    )
        .then((response) => response.json())
        .then((data) => {
            Contacts = data;
            renderContacts(data);
        });

    if (getViewMode() === 1) clearViewCard();
    setActualContactIndex(-1);
    /*versionHandling();*/
    return data;
}

/**
 * Updates the remote database with the provided contacts data.
 * @param {Array} data - The contacts array to store.
 */
function updateDatabase(data) {
    fetch(
        "https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/contacts.json",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    )
        .then((response) => response.json())
        .then((data) => {
        })
        .catch((error) => {
        });
}

/**
 * Generates HTML for all contact cards, grouped by first letter.
 * @param {Array} contacts - The contacts array.
 * @returns {string} The HTML string for contact cards.
 */
function generateContactsCards(contacts) {
    let oldLetter = ""; // Speichert den vorherigen Buchstaben
    let contactCards = "";
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        let initials = getInitials(contact.name);

        let firstLetter = contact.name.charAt(0).toUpperCase(); // Erster Buchstabe des Namens
        // Wenn der Buchstabe wechselt, füge eine neue Überschrift hinzu
        if (oldLetter !== firstLetter) {
            contactCards += `
                <div class="contacts_section_header">
                    <p class="contacts_section_letter">${firstLetter}</p>
                </div>`;
            oldLetter = firstLetter;
        }
        let color = getColor(index);
        contactCards += getContactCardTamplate(
            contact.name,
            contact.mail,
            initials,
            index,
            color
        );
    }
    return contactCards;
}

/* Kontaktliste */
function renderContacts(contacts) {
    let contactList = document.getElementById("contacts_list");
    if (contactList) {
       contactList.style.overflowy = "scroll";
    }

    sortContacts(contacts); // Kontakte sortieren

    let contactsListElem = document.getElementById("contacts_list");
    if (contactsListElem) {
        contactsListElem.style.display = "flex";
    }

    let contactCards = generateContactsCards(contacts);
    let contactCardSection = document.getElementById("contact_card_section");

    if (contactCardSection) {
        contactCardSection.innerHTML = contactCards;
         activateContactCardClick();
    }

}

/* Mobile Version */
function MobileVievCard(index) {
    if (index >= 0) {
        //let contact = Contacts[index];
        //let initials = getInitials(contact.name);
        let color = getColor(index);
        let contactsListElem = document.getElementById("contacts_list");
        if (contactsListElem) {
            contactsListElem.style.display = "none";
        }
        let addNewContactSectionElem = document.getElementById(
            "add_new_contact_section"
        );
        if (addNewContactSectionElem) {
            addNewContactSectionElem.style.display = "none";
        }
        let viewCardTemp = getMobileViewCardTemplate(index, color);
        let contactsContainer = document.getElementById("contactslist_container");
        contactsContainer.innerHTML = viewCardTemp;
        renderViewCard(index);
    }
}

/**
 * Renders the header for the tablet view card.
 */
function getTabletViewCardHeader() {
    let tabletViewCardHeader = getTeblateViewCardHeaderTemplate();
    let tabletViewCardHeaderId = document.getElementById(
        "Tablet_view_card_header"
    );
    tabletViewCardHeaderId.innerHTML = tabletViewCardHeader;
}



/**
 * Renders the contact view card for tablet view.
 * @param {number} index - The contact index.
 */
function renderTabletVievCard(index) {
    addNewContactSectionState(true);
    //document.getElementById("contactslist_container").style.overflow = "hidden";

    if (index >= 0) {
        const contact = Contacts[index];
        const color = getColor(index);

        addNewContactSectionState(false);

        renderTabletCardContainer(index, color);
        fillTabletCardFields(contact);
    }

    hideContactsList();
}

/**
 * Renders the container for the tablet view card.
 * @param {number} index - The contact index.
 * @param {string} color - The avatar color.
 */
function renderTabletCardContainer(index, color) {
    const TabletViewContainer = document.getElementById("tablate_view_card_container");
    TabletViewContainer.style.display = "flex";
    TabletViewContainer.innerHTML = getTabletViewCardTemplate(index, color);

    // Header einfügen
    const tabletViewCardHeaderId = document.getElementById("Tablet_view_card_header");
    tabletViewCardHeaderId.innerHTML = getTabletViewCardHeaderTemplate();
}

/**
 * Fills the tablet card fields with contact data.
 * @param {Object} contact - The contact object.
 */
function fillTabletCardFields(contact) {
    document.getElementById("contact_view_avatar_initials").innerText =
        contact.name
            .split(" ")
            .map((word) => word[0].toUpperCase())
            .join("");
    document.getElementById("contact_view_name").innerText = contact.name;
    document.getElementById("contact_view_mail").innerText = contact.mail;
    document.getElementById("contact_view_phone").innerText =
        contact.phone || "No phone number available";
}

/**
 * Hides the contacts list in the UI.
 */
function hideContactsList() {
    const contactsListElem = document.getElementById("contacts_list");
    if (contactsListElem) contactsListElem.style.display = "none";
}

/**
 * Clears the tablet view card container.
 */
function clearTabletViewCard() {
    let tabletViewCardContainer = document.getElementById(
        "tablate_view_card_container"
    );
    if (tabletViewCardContainer) {
        tabletViewCardContainer.innerHTML = "";
        tabletViewCardContainer.style.display = "none";
    }
}

/**
 * Renders the contact view card for desktop view.
 * @param {number} index - The contact index.
 */
function renderViewCard(index) {
    setActualContactIndex(index);

    if (index >= 0) {
        let contact = Contacts[index];

        let initials = getInitials(contact.name);
        //let color = getColor(initials[0]);
        let color = getColor(index);
        let tempViewCard = getViewCardTemplate(index, color);
        //tempViewCard.innerHTML = "";
        document.getElementById("contactViewCard").innerHTML = tempViewCard;

        document.getElementById("contact_view_avatar_initials").innerText =
            contact.name
                .split(" ")
                .map((word) => word[0].toUpperCase())
                .join("");
        document.getElementById("contact_view_name").innerText = contact.name;
        document.getElementById("contact_view_mail").innerText = contact.mail;
        document.getElementById("contact_view_phone").innerText =
            contact.phone || "No phone number available";
    }
}

/**
 * Creates a new contact from the form and updates the UI.
 */
function createContact() {
    const newContact = buildContactFromForm();
    if (!newContact) return; // Falls Validierung fehlschlägt

    addContactAndUpdateUI(newContact);
}

/**
 * Builds a contact object from the form inputs.
 * @returns {Object|null} The contact object or null if validation fails.
 */
function buildContactFromForm() {
    let KindOfDlg_pc = "";
    if (getViewMode() === 1) KindOfDlg_pc = "_pc";

    let name = document.getElementById("name_input" + KindOfDlg_pc).value.trim();
    let mail = document.getElementById("mail_input" + KindOfDlg_pc).value.trim();
    let phone = document.getElementById("phone_input" + KindOfDlg_pc).value.trim();

    if (!name || !mail || !phone) return null;
    if (!emailIsValid(mail)) return null;

    name = capitalizeWords(name);

    return {
        mail: mail,
        name: name,
        phone: phone || "No phone number available",
    };
}

/**
 * Adds a contact to the list, updates the database, and refreshes the UI.
 * @param {Object} contact - The contact object.
 */
function addContactAndUpdateUI(contact) {
    Contacts.push(contact);
    updateDatabase(Contacts);
    renderContacts(Contacts);
    closeContactDialog();
    closeContactDialogMobile();
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

/**
 * Edits an existing contact with new data from the form.
 * @param {number} id - The contact index.
 */
function editContact(id) {
    let KindOfDlg_pc = "";
    let viewMode = getViewMode();
    if (viewMode === 1) {
        KindOfDlg_pc = "_pc";
    }

    let name = document.getElementById("name_input" + KindOfDlg_pc).value.trim();
    let mail = document.getElementById("mail_input" + KindOfDlg_pc).value.trim();
    let phone = document
        .getElementById("phone_input" + KindOfDlg_pc)
        .value.trim();

    if (!name || !mail || !phone) {
        //alert("EDIT: Bitte fülle die Felder Name, Mail und Pohne aus.");
        return;
    }
    if (emailIsValid(mail) == false) {
        //alert("Pleas wiret a valid email address.");
        return;
    }

   saveEditedContact(id, KindOfDlg_pc, name, mail, phone, viewMode)
}

/**
 * Saves the edited contact and updates the UI based on view mode.
 * @param {number} id - The contact index.
 * @param {string} KindOfDlg_pc - Dialog suffix.
 * @param {string} name - The contact name.
 * @param {string} mail - The contact email.
 * @param {string} phone - The contact phone.
 * @param {number} viewMode - The current view mode.
 */
function saveEditedContact(id, KindOfDlg_pc, name, mail, phone, viewMode){
     name = document.getElementById("name_input" + KindOfDlg_pc).value.trim();
    name = capitalizeWords(name);

    let newContact = {
        mail: mail,
        name: name,
        phone: phone || "No phone number available",
    };

    Contacts[id] = newContact;
    updateDatabase(Contacts);
    id = findContactNewIndex(newContact);

    if (viewMode === 1) {
        renderContacts(Contacts);
        renderViewCard(id);
        closeContactDialog();
    } else if (viewMode === 2) {
        /*      renderContacts(Contacts);
                renderViewCard(id);
                closeContactDialog();
        */
        renderViewCard(id);
        closeContactDialogMobile();
    } else if (viewMode === 3) {
        closeContactDialogMobile();
        renderTabletVievCard(id);
    } else if (viewMode === 4) {
        MobileVievCard(id);
        closeContactDialogMobile();
    }
}

/**
 * Validates an email address.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Deletes a contact by index after confirmation.
 * @param {number} id - The contact index.
 */
function deleteContact(id) {
    if (id < 0 || id >= Contacts.length) {
        return;
    }




        Contacts.splice(id, 1);
        updateDatabase(Contacts);

        let viewMode = getViewMode();
        if (viewMode === 1) {
            renderContacts(Contacts);
        }
        goBacktoContacts();
 
}

/**
 * Clears the contact view card based on view mode.
 */
function clearViewCard() {
    let contactViewCard = document.getElementById("contactViewCard");
    let contact_view_card = document.getElementById("contact_view_card");

    let viewMode = getViewMode();
    if (viewMode === 1 && contactViewCard) {
        contactViewCard.innerHTML = "";
    } else if (viewMode === 2 && contact_view_card) {
        contact_view_card.innerHTML = "";
    } else if (viewMode === 3 && contact_view_card) {
        contact_view_card.innerHTML = "";
    } else if (viewMode === 4 && contact_view_card) {
        contact_view_card.innerHTML = "";
    }

    setActualContactIndex(-1);
}

/** * Configures the dialog box for editing or creating a contact.
 * @param {number} id - The index of the contact to edit, or -1 for creating a new contact.
 * This function sets the dialog box's title, button text, and function name based on the
 * provided index. It also populates the input fields with the existing contact data if editing.
 * If creating a new contact, it clears the input fields and sets default values.
 *  * It also configures the avatar display based on the contact's initials and color.
 * The dialog box is displayed in either desktop or mobile view mode based on the current window width*/
function configEditDlgBox(id) {
    

    let kindOFEdit = "editContact";
    if (id < 0) kindOFEdit = "createContact";
    let btnText = "";
    let KindOfDlg_pc = "";
    let viewMode = getViewMode();
    if (viewMode === 1) { KindOfDlg_pc = "_pc"; }

    switch (kindOFEdit) {
        case "editContact":
            document.getElementById("Kind_Of_Dlg" + KindOfDlg_pc).innerHTML =
                "Edit contact";
            btnText = "Save";
            document.getElementById("id_Edit_Btn" + KindOfDlg_pc).onclick =
                function () {
                    editContact(id);
                };

            let oldContactData = Contacts[id];

            document.getElementById("name_input" + KindOfDlg_pc).value = oldContactData.name; // Contacts[id].name;
            document.getElementById("mail_input" + KindOfDlg_pc).value = oldContactData.mail; //Contacts[id].mail;
            document.getElementById("phone_input" + KindOfDlg_pc).value = oldContactData.phone; //Contacts[id].phone;

            let avatarColor = getColor(id);

            configAvatar_pc(oldContactData, avatarColor);
            configAvatar_mobile(oldContactData, avatarColor);

            break;

        case "createContact":

            createContactDialog(KindOfDlg_pc);
            btnText = "Create";
            break;

        default:
            break;
    }
    document.getElementById("id_Edit_Btn_Text" + KindOfDlg_pc).innerText = btnText;
}

/**
 * Configures the avatar for the desktop dialog.
 * @param {Object} contact - The contact object.
 * @param {string} avatarColor - The avatar color.
 */
function configAvatar_pc(contact, avatarColor) {

    let AddNewcontactAvatar = document.getElementById("add_new_contact_avatar");
    if (AddNewcontactAvatar) {
        let test = getInitials(contact.name);
        AddNewcontactAvatar.innerHTML = `
                <p class="contact_view_avatar_initials" id="add_new_contact_avatar_1">${test[0].toUpperCase()}</p>
                <p class="contact_view_avatar_initials" id="add_new_contact_avatar_2">${test[1].toUpperCase()}</p>
            `;

        AddNewcontactAvatar.style.backgroundColor = avatarColor;
        AddNewcontactAvatar.style.color = "#FFFFFF";
    }
}

/**
 * Configures the avatar for the mobile dialog.
 * @param {Object} contact - The contact object.
 * @param {string} avatarColor - The avatar color.
 */
function configAvatar_mobile(contact, avatarColor) {
    let AddNewcontactAvatar_mobile = document.getElementById(
        "add_new_contact_avatar_mobile"
    );

    if (AddNewcontactAvatar_mobile) {
        let test = getInitials(contact.name);
        AddNewcontactAvatar_mobile.innerHTML = `
                <p class="contact_view_avatar_initials" id="add_new_contact_avatar_mob_1">${test[0].toUpperCase()}</p>
                <p class="contact_view_avatar_initials" id="add_new_contact_avatar_mob_2">${test[1].toUpperCase()}</p>
            `;

        AddNewcontactAvatar_mobile.style.backgroundColor = avatarColor;
        AddNewcontactAvatar_mobile.style.color = "#FFFFFF";
    }
}

/**
 * Prepares the dialog for creating a new contact.
 * @param {string} KindOfDlg_pc - Dialog suffix.
 */
function createContactDialog(KindOfDlg_pc) {

    let AddNewcontactAvatar = document.getElementById("add_new_contact_avatar");
    let AddNewcontactAvatar_mobile = document.getElementById("add_new_contact_avatar_mobile");
    document.getElementById("Kind_Of_Dlg" + KindOfDlg_pc).innerHTML = "Add contact";

    document.getElementById("id_Edit_Btn" + KindOfDlg_pc).onclick =
        function () {
            createContact();
        };

    if (AddNewcontactAvatar) {
        AddNewcontactAvatar.style.backgroundColor = "#eeecec";
        AddNewcontactAvatar.innerHTML = `
                <img class="ov_avatar" src="./assets/img/add_new_contact_ov_avatar.png" alt="add new contact avatar">
            `;
    }

    if (AddNewcontactAvatar_mobile) {
        AddNewcontactAvatar_mobile.style.backgroundColor = "#eeecec";
        AddNewcontactAvatar_mobile.innerHTML = `
                <img class="ov_avatar" src="./assets/img/add_new_contact_ov_avatar.png" alt="add new contact avatar">
            `;
    }
}

/**
 * Opens the contact dialog for editing or creating a contact.
 * @param {number} id - The contact index or -1 for new contact.
 */
function openContactDialog(id) {
    //index > 0 entspricht Contacs editieren
    //index <0 entspricht neuen Kontakt erstellen
    let addNewContactButton = document.getElementById("add_new_contact_button");

    if (addNewContactButton) {
        addNewContactButton.style.display = "none";
    }

    let addNewContactOvSection = document.getElementById(
        "add_new_contact_ov_section"
    );
    if (addNewContactOvSection) {
        addNewContactOvSection.style.display = "flex";
        addNewContactOvSection.innerHTML = getAddNewContactTemplate();

        document.getElementById("add_new_contact_ov_container").style.display =
            "flex";
    }

    addNewContactSectionState_pc(true);
    configEditDlgBox(id);
}

/**
 * Closes the contact dialog and clears input fields.
 */
function closeContactDialog() {
    let name = document.getElementById("name_input_pc");
    let mail = document.getElementById("mail_input_pc");
    let phone = document.getElementById("phone_input_pc");

    if (name || mail || phone) {
        name.value = "";
        mail.value = "";
        phone.value = "";
    }

    let addNewSection = document.getElementById("add_new_contact_ov_section");
    let addNewContainer = document.getElementById("add_new_contact_ov_container");

    if (name || mail || phone) {
        addNewSection.style.display = "none";
        addNewSection.innerHTML = "";
        addNewContainer.style.display = "none";
    }
    // dialog beim schliesen lleeren
}

/*contact dialog mobile section*/
/**
 * Opens the contact dialog for mobile view.
 * @param {number} id - The contact index or -1 for new contact.
 */
function openContactDialogMobile(id) {
    let mobileDialogTemplate = getAddNewContactMobileTemplate();
    document.getElementById("add_new_contact_mobile_ov_container").innerHTML =
    mobileDialogTemplate;
    configEditDlgBox(id);
    editContactsMobileMenuOff();
}

/**
 * Closes the contact dialog for mobile view.
 */
function closeContactDialogMobile() {
    const addNewContactMobileOv = document.getElementById(
        "add_new_contact_mobile_ov"
    );

    if (addNewContactMobileOv) {
        addNewContactMobileOv.style.display = "none";
        const addNewContactMobileBtn = document.getElementById(
            "add_new_contact_Mobile_btn"
        );
        if (addNewContactMobileBtn) {
            addNewContactMobileBtn.style.display = "flex";
        }
    }
}

/**
 * Gets the initials from a name string.
 * @param {string} name - The full name.
 * @returns {Array} Array of initials.
 */
function getInitials(name) {
    let initials = name
        .trim()
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word[0].toUpperCase());
    return initials;
}

/**
 * Sorts the contacts array by name.
 * @param {Array} contacts - The contacts array.
 */
function sortContacts(contacts) {
    //sort contacts by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    Contacts = contacts;
}

/**
 * Gets the first letter of a name and checks if it changed.
 * @param {string} name - The name.
 * @param {string} oldLetter - The previous letter.
 * @param {boolean} change - Change flag.
 * @returns {string} The first letter.
 */
function getFirstLetter(name, oldLetter, change) {
    //get first letter of name

    let firstLetter = name.charAt(0);

    if (oldLetter !== firstLetter) {
        change = true;
    } else {
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
function getViewMode() {
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

/**
 * Renders the appropriate contact view based on the current version.
 * @param {number} index - The contact index.
 */
function proofVersion(index) {
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

/**
 * Handles window resize events and updates the UI accordingly.
 */
function handleWindowResize() {
    let idx = getActualContactIndex();
    getViewMode();

    switch (getViewMode()) {
        case 1: // 1 = desktop big     | >= 1100
            clearTabletViewCard();
            addNewContact = getAddNewContactTemplate();
            document.getElementById("add_new_contact_section").innerHTML =
                addNewContact;
            renderContacts(Contacts);
            renderViewCard(idx);
            addNewContactSectionState_pc(true);
            break;

        case 2: // 2 = desktop small   | < 1100
            goBacktoContacts();
            addNewContactSectionState_pc(false);
            break;

        case 3: // 3 = tablet          | < 825
            goBacktoContacts();
            MobileVievCard(idx);
            addNewContactSectionState_pc(false);
            break;
        case 4: // 4 = mobile          | < 560
            goBacktoContacts();
            MobileVievCard(idx);
            break;
        default:
            break;
    }
}

/**
 * Gets a color from the colors array based on index.
 * @param {number} index - The index.
 * @returns {string} The color.
 */
function getColor(index) {
    let idx = index;
    if (idx < 0) {
        idx = 0; // Fallback to the first color if index is out of bounds
    }

    return colorsArray[idx % colorsArray.length];
}

/**
 * Gets a color from the colors array based on the first letter.
 * @param {string} firstLetter - The first letter.
 * @returns {string} The color.
 */
function getColorFromFirstLetter(firstLetter) {
    let text = "";
    text = String(firstLetter).toUpperCase();

    let colorIndex = text.charCodeAt(0) - 65;

    return colorsArray[colorIndex];
}

/**
 * Capitalizes the first letter of each word in a sentence.
 * @param {string} Sentence - The sentence.
 * @returns {string} The capitalized sentence.
 */
function capitalizeWords(Sentence) {
    return Sentence.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
    );
}

/**
 * Sets the actual contact index.
 * @param {number} index - The index.
 * @returns {number} The set index.
 */
function setActualContactIndex(index) {
    actualContactIndex = index;
    return actualContactIndex;
}

/**
 * Gets the actual contact index.
 * @returns {number} The actual contact index.
 */
function getActualContactIndex() {
    return actualContactIndex;
}

/**
 * Returns to the contacts list view and resets UI.
 */
function goBacktoContacts() {
    let tablet_additional_div = "";
    let addNewContact = "";
    let viewMode = getViewMode();
    if (viewMode === 2 || viewMode === 3) {
        tablet_additional_div = `
            <div id="tablate_view_card_container" class="tablate_view_card_container"></div>
            `;
        let contactsListElem = document.getElementById("contacts_list");
        if (contactsListElem) contactsListElem.style.display = "flex";
    }

    let contactsContainer = document.getElementById("contactslist_container");
    if (contactsContainer) {
        contactsContainer.innerHTML = getGoBackTemplate(tablet_additional_div);
        contorlAddNewContactSection(viewMode);
    }

    renderContacts(Contacts);
    setActualContactIndex(-1);
    clearViewCard();
}

/**
 * Controls the display state of the add new contact section based on view mode.
 * @param {number} viewMode - The view mode.
 */
function contorlAddNewContactSection(viewMode) {
        if (viewMode === 1) {
            addNewContactSectionState_pc(true);
        } else if (viewMode === 2) {
            addNewContactSectionState(true);
            addNewContactSectionState_pc(false);
        } else if (viewMode === 3) {
            addNewContactSectionState(true);
            addNewContactSectionState_pc(false);
        } else if (viewMode === 4) {
            addNewContactSectionState_pc(false);
        }
}

/**
 * Shows the mobile menu for editing contacts.
 */
function editContactsMobileMenuOn() {
    document.getElementById("mobile_view_card_menu").style.display = "flex";
    document.addEventListener("mousedown", handleOutsideClickForMobileMenu);
}

/**
 * Hides the mobile menu for editing contacts.
 */
function editContactsMobileMenuOff() {
    let menu = document.getElementById("mobile_view_card_menu");
    if (menu) {
        menu.style.display = "none";
        document.removeEventListener("mousedown", handleOutsideClickForMobileMenu);
    }
}

/**
 * Sets the display state of the add new contact section for desktop.
 * @param {boolean} state - True to show, false to hide.
 */
function addNewContactSectionState_pc(state) {
    let stateStr = "none";
    if (state == true) stateStr = "flex";
    let section = document.getElementById("add_new_contact_button");
    if (section) {
        section.style.display = stateStr;
    } else {
        let addNewContactSection = document.getElementById(
            "add_new_contact_section"
        );
        if (addNewContactSection) {
            let addNewContact = `
                <button class="add_new_contact_button" id="add_new_contact_button" onclick="openContactDialog(-1)">
                <span class="add_contact_text">Add New Contact</span>
                <img src="./assets/icons/contact/addcontact.png" class="add_contact_icon">
                </button>`;
            addNewContactSection.innerHTML += addNewContact;
            section = document.getElementById("add_new_contact_button");
            section.style.display = stateStr;
        }
    }

    section = document.getElementById("add_new_contact_section");
    if (section) {
        section.style.display = stateStr;
    }
}

/**
 * Sets the display state of the add new contact section for mobile/tablet.
 * @param {boolean} state - True to show, false to hide.
 */
function addNewContactSectionState(state) {
    let stateStr = "none";
    if (state == true) stateStr = "flex";

    let section = document.getElementById("add_new_contact_Mobile_section");
    if (section) {
        section.style.display = stateStr;
    }

    section = document.getElementById("add_new_contact_Mobile_btn");
    if (section) {
        section.style.display = stateStr;
    }
}

/**
 * Handles clicks outside the mobile menu to close it.
 * @param {Event} event - The mouse event.
 */
function handleOutsideClickForMobileMenu(event) {
    let menu = document.getElementById("mobile_view_card_menu");
    if (menu && !menu.contains(event.target)) {
        editContactsMobileMenuOff();
    }
}

function activateContactCardClick() {
    document.querySelectorAll('.contact_card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.contact_card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Nach dem Rendern der Kontakte aufrufen:
renderContacts(Contacts);
activateContactCardClick();
