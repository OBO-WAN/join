/*function getContactCardTamplate(){
return`
<div class="contact_card" id="contact_card">
<div class="contact_avatar_section">
    <div class="contact_avatar">
        <p class="contact_avatar_initials" id="contact_avatar_initials">A</p>
        <p class="contact_avatar_initials" id="contact_avatar_initials">C</p>
    </div>
</div>
<div class="contact_info_section">
    <div id="contact_name"class="contact_name"><span>Alice Cooper</span></div>
        <a href="mailto:cooper@gmail.com" class="contact_email" id="contact_email">cooper@gmail.com</a>
</div>
</div>`
}*/

function getContactCardTamplate(name, email, initials, index, color) {
    return `
<div class="contact_card" onclick="proofVersion(${index})">
    <div class="contact_avatar_section">
        <div class="contact_avatar" id="contact_avatar" style="background-color:${color};">
            <p class="contact_avatar_initials">${initials[0]}</p>
            <p class="contact_avatar_initials">${initials[1]}</p>
        </div>
    </div>
    <div class="contact_info_section">
        <div class="contact_name"><span>${name}</span></div>
        <a href="${email}" class="contact_email">${email}</a>
    </div>
</div>`;
}

function getViewCardTemplate(id, color) {
    return `
    <div id="mobile_view_card_header">
      <div class="contact_view_header">  
            <div class="contact_view_header_section">
            <div class="contacts_view_hl_section">
                <span class="contacts_view_hl">Contacts</span>
            </div>    
            <div class="contacts_view_seperator"></div>
            <div class="contacts_view_sloagen_section">
                <span class="contacts_view_sloagen">Better wiht a Team</span>
                
                 </div>
                 <div class="contacts_view_mobile_seperator_section">
                 <div class="mobile_view_card_seperator"></div>
            </div>    
        </div>
           <div class="go_back_btn_container">
                <div class="go_back_btn_section" id="go_back_btn_section">
                    <img oncilck="showContactList()" class="go_back_btn" src="./assets/icons/contact/next.png" alt="icon">
                </div>
            </div>
        </div>
    </div>
      

        <div class="contact_view_card" id="contact_view_card">
            <div class="contact_view_card_header" id="contact_view_card_header">
                <div class="contact_view_avatar_section" >
                    <div class="contact_view_avatar" id="contact_view_avatar"  style="background-color:${color};>
                        <p class="contact_view_avatar_initials" id="contact_view_avatar_initials"></p>
                        <p class="contact_view_avatar_initials" id="contact_view_avatar_initials"></p>
                    </div>
                </div>
                    <div class="contact_view_head_info_section">
                        <div class="contact_view_name_section">
                            <span class="contact_view_name" id="contact_view_name"></span>
                        </div>
                        <div class="contact_view_edit_section">
                            <div class="edtit_section">
                                <img  class="contactview_icon" src="./assets/img/edit.png" alt="edit">
                                <span class="edit_txt" onclick="openContactDialog(${id})">Edit</span>
                            </div>
                            <div class="delete_section">
                                <img  class="contactview_icon" src="./assets/img/delete.png" alt="delete">
                                <span class="delete_txt" onclick="deleteContact(${id})">Delete</span>
                            </div> 
                        </div>
                    </div>
                </div>

                    <div class="contact_view_card_info_section">
                        <div class="contact_view_card_info_header">
                            <span class="contact_view_card_info_hl">Contact Information</span>
                        </div>
                        <div class="contact_view_mail_section">
                            <p class="contact_view_mail_hl">Email</p>
                            <a href="mailto:cooper@gmail.com" id="contact_view_mail" class="contact_view_mail"></a>
                        </div>
                        <div class="contact_view_phone_section">
                            <p class="contact_view_phon_hl">Phone</p>
                            <div id="contact_view_phone" class="contact_view_phon_num"></div>
                        </div>
                    </div>

                    <div class="mobil_view_card_edit_section">
                        <div class="mobile_view_card_edit_btn">
                            <img class="mobile_view_card_edit_icon" src="./assets/icons/contact/mobile_edtit_menu_icon.png" alt="icon">
                        </div>
                        <div class="mobile_vivcard_edit_ov"></div>
                    </div>


                </div>
           </div>`;
}