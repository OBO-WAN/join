let masegeName = []
let masegeMail = []
let masegePhone = []
const contactFormPc = document.getElementById("contact_form_pc");

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact_form_pc");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Verhindert das Neuladen der Seite!
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact_form_mobile");
    if (form) {
        form.addEventListener("submit", function(event) {    
            event.preventDefault();
        });
    }
});

function validateName(){
    const name = document.getElementById("name_input_pc");
    const nameError = document.getElementById("form_name_erro_pc");
    let msgName = "Please enter your first and last name";

    if (validateName_LowLevel(name.value)) {
        nameError.innerHTML = "";
        name.style.borderColor = "#DBDBDB";
    }
    else
    {
        nameError.innerHTML = msgName;
        name.style.borderColor = "red";
    }
}

function validateNameMobile(){
    const name = document.getElementById("name_input");
    const nameError = document.getElementById("form_name_erro_mobile");
    let msgName = "Please enter your first and last name";

    if (validateName_LowLevel(name.value)) {
        nameError.innerHTML = "";
        name.style.borderColor = "#DBDBDB";
    } 
    else
    {
        nameError.innerHTML = msgName;
        name.style.borderColor = "red";
    }   
}

function validateName_LowLevel(name){

    let test  = name.split(" ");
    let result = false;

    let length_1 = test[0].length;
    let length_2 = 0;
    if (test.length > 1) {
        length_2 = test[1].length;
    }

    if (name.length >= 5 && test.length >= 2 && length_1 >= 2 && length_2 >= 2) {
        result = true;
    }
    else
    {
        result = false;
    }
    return result;
}

/*Validate mail*/ 
function validateMail(){
    const mail = document.getElementById("mail_input_pc");
    const mailError = document.getElementById("form_mail_erro_pc");
    let msgMail = "A valid email address is required";


    if (validateMail_LowLevel(mail.value)) {
        mailError.innerHTML = "";
        mail.style.borderColor = "#DBDBDB";
    }
    else 
    {
        mailError.innerHTML = msgMail;
        mail.style.borderColor = "red";
    }
}

function validateMailMobile(){
    const mail = document.getElementById("mail_input");
    const mailError = document.getElementById("form_mail_erro_mobile");
    let msgMail = "A valid email address is required";

    if (validateMail_LowLevel(mail.value)) {
        mailError.innerHTML = "";
        mail.style.borderColor = "#DBDBDB";
    }
    else 
    {
        mailError.innerHTML = msgMail;
        mail.style.borderColor = "red";
    }
}

function validateMail_LowLevel(mail){
    let result = false;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        result = true;
    }
    else
    {
        result = false;
    }
    return result;
}

/*Validate phone*/
function validatePhone(){
    const phone = document.getElementById("phone_input_pc");
    const phoneError = document.getElementById("form_phone_erro_pc");
    let msgPhone = "A Valid phone number is required";

    if (validatePhone_LowLevel(phone.value)) {
        phoneError.innerHTML = "";
        phone.style.borderColor = "#DBDBDB";
    }
    else 
    {
        phoneError.innerHTML = msgPhone;
        phone.style.borderColor = "red";
    }

}


function validatePhoneMobile(){
    const phone = document.getElementById("phone_input");
    const phoneError = document.getElementById("form_phone_erro_mobile");
    let msgPhone = "A Valid phone number is required";

    if (validatePhone_LowLevel(phone.value)) {
        phoneError.innerHTML = "";
        phone.style.borderColor = "#DBDBDB";
    }
    else 
    {
        phoneError.innerHTML = msgPhone;
        phone.style.borderColor = "red";
    }
}

function validatePhone_LowLevel(phone){
    let result = false;
    if (/^(\+)?[0-9]{7,}$/.test(phone)) {
        result = true;
    }
    else
    {
        result = false;
    }
    return result;
}