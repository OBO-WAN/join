function toggleMenu() {
    const menu = document.getElementById("dropdown_menu");
    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }
}