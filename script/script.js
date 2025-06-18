function toggleMenu(){
    let mobileViewCard = document.getElementById("mobile_view_card_header");
    const menu = document.getElementById("dropdown_menu");

    if (menu.style.display === "flex") {
        menu.style.display = "none";
        if (mobileViewCard){
           document.getElementById("go_back_btn_section").style.display = "flex";
        }           
    } else {
        menu.style.display = "flex";
        if (mobileViewCard ){
        document.getElementById("go_back_btn_section").style.display = "none";
        }      
    }
}


// Toggle active for Responsive Menu
function toHrefFocus(targetHref, anchor) {
  const allLinks = document.querySelectorAll('.nav-links .link-button');
  allLinks.forEach(link => link.classList.remove('active'));

  const parentLi = anchor.closest('.link-button');
  if (parentLi) parentLi.classList.add('active');

  window.location.href = targetHref;
}

//Render Initials

function setUserInitials() {
  const firstInitial = document.getElementById('first_icon_initials');
  const lastInitial = document.getElementById('last_icon_initials');
  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');

  if (firstInitial && lastInitial && firstName && lastName) {
    firstInitial.textContent = firstName[0].toUpperCase();
    lastInitial.textContent = lastName[0].toUpperCase();
  }
}

// function logOut() {
//   sessionStorage.clear(); 
//   window.location.href = 'login.html'; 
// }



window.addEventListener('DOMContentLoaded', setUserInitials);