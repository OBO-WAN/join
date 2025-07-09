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
