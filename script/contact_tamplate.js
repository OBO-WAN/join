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

function getContactCardTamplate(name, email, initials) {
    return `
<div class="contact_card">
    <div class="contact_avatar_section">
        <div class="contact_avatar">
            <p class="contact_avatar_initials">${initials[0]}</p>
            <p class="contact_avatar_initials">${initials[1]}</p>
        </div>
    </div>
    <div class="contact_info_section">
        <div class="contact_name"><span>${name}</span></div>
        <a href="mailto:${email}" class="contact_email">${email}</a>
    </div>
</div>`;
}