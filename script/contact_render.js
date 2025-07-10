window.addEventListener("resize", () => {
    handleWindowResize();
});

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


/**
 * Renders the contact view card for desktop view.
 * @param {number} index - The contact index.
 */
function renderViewCard(index) {
    setActualContactIndex(index);

    if (index >= 0) {
        let contact = Contacts[index];

        //let initials = getInitials(contact.name);

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