/**
 * Toggles the visibility of the dropdown menu and go back button section
 * for mobile view.
 */
function toggleMenu(){
    let goBackBtn = document.getElementById("go_back_btn_container");
    let arrowLeft = document.getElementById("arrow-left");
    let headlineImageContainer = document.getElementById("headline-img-container");
    let contactViewCardMobile = document.getElementById("mobile_view_card_header");
    let contactViewCardTablate = document.getElementById("Tablet_view_card_header");
    const menu = document.getElementById("dropdown_menu");

    if (menu.style.display == "flex") {
        menu.style.display = "none";
        document.getElementById("dropdown_container").style.zIndex = "1";
        if( goBackBtn ) {
            goBackBtn.style.display = "flex";
        }
        if (arrowLeft) {
            arrowLeft.style.display = "flex";
        }

        if ( contactViewCardMobile || contactViewCardTablate  ) {
           goBackBtn.style.display = "flex"; 
        }  
        if (headlineImageContainer && menu.style.display == "none") {
            arrowLeft.style.display = "flex";      
        }
          
    } else {
        menu.style.display = "flex";
        if( goBackBtn ){
          goBackBtn.style.display = "none";
        } 
        if (arrowLeft) {
          arrowLeft.style.display = "none";
        }


        if (contactViewCardMobile|| contactViewCardTablate){
          goBackBtn.style.display = "none";
        }
         if (headlineImageContainer){
          arrowLeft.style.display = "none";
        }
          
    }
}



function switchoffMenu(){
    let goBackBtn = document.getElementById("go_back_btn_container");
    const menu = document.getElementById("dropdown_menu");

    if (menu.style.display == "flex") {
        menu.style.display = "none";
        if (goBackBtn) {
            goBackBtn.style.display = "flex";
        }
    }
} 

/**
 * Sets the active class on the clicked navigation link and navigates to the target href.
 * @param {string} targetHref - The URL to navigate to.
 * @param {HTMLElement} anchor - The anchor element that was clicked.
 */
function toHrefFocus(targetHref, anchor) {
  const allLinks = document.querySelectorAll('.nav-links .link-button');
  allLinks.forEach(link => link.classList.remove('active'));

  const parentLi = anchor.closest('.link-button');
  if (parentLi) parentLi.classList.add('active');

  window.location.href = targetHref;
}


/**
 * Renders the user's initials in the avatar icon if logged in,
 * otherwise sets a default initial.
 */
function setUserInitials() {
  const firstInitial = document.getElementById('first_icon_initials');
  const lastInitial = document.getElementById('last_icon_initials');
  let firstName = sessionStorage.getItem('firstName');
  let lastName = sessionStorage.getItem('lastName');
  let prooofLokedIn = sessionStorage.getItem("loggedIn");

  if (prooofLokedIn == "true" && firstName && lastName) {
    firstInitial.textContent = firstName[0].toUpperCase();
    lastInitial.textContent = lastName[0].toUpperCase();
    lastInitial.style.display = "flex";
  }
  else{
      let AvatarInitialFirst = document.getElementById("first_icon_initials");
      let AvatarInitialLast = document.getElementById("last_icon_initials");
      AvatarInitialFirst.innerHTML ="G";
      AvatarInitialLast.innerHTML = "";
  }
}


/**
 * Logs out the user by clearing session storage and redirecting to login page.
 */
function logOut() {
  sessionStorage.clear(); 
  window.location.href = 'login.html';
}


// Set user initials when the DOM content is loaded
window.addEventListener('DOMContentLoaded', setUserInitials);