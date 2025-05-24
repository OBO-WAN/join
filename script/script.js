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