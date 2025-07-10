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