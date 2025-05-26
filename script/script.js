function toggleMenu() {
    const menu = document.getElementById("dropdown_menu");
    if (menu.style.display === "flex") {
        menu.style.display = "none";
        document.getElementById("go_back_btn_section").style.display = "flex";
    } else {
        menu.style.display = "flex";
        document.getElementById("go_back_btn_section").style.display = "none";
    }
}

// Toggle active for Responsive Menu

function toHrefFocus(targetHref, anchor) {
  // Remove active class from all link-buttons
  const allLinks = document.querySelectorAll('.nav-links .link-button');
  allLinks.forEach(link => link.classList.remove('active'));

  // Add active to the clicked link's parent <li>
  const parentLi = anchor.closest('.link-button');
  if (parentLi) parentLi.classList.add('active');

  // Navigate to the new page
  window.location.href = targetHref;
}
