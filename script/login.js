window.addEventListener('load', () => {
    runIntroAnimation();
});

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const nav = document.getElementById("nav_log_in");
    nav.classList.remove("hidden");
    nav.classList.add("fade-in");
  }, 3000); // delay (adjust if needed)
});


async function runIntroAnimation() {
    const overlay = document.getElementById('animationsLogoOverlay');
    const loginMain = document.getElementById('loginMain');
    const footerLogin = document.getElementById('footerLogin');
    const animationFinished = document.getElementById('animationFinished');

    await delay(1700); // Wait for animation duration

    // Hide the animated logo overlay
    if (overlay) overlay.style.display = 'none';

    // Reveal content with fade
    revealElement(loginMain);
    revealElement(footerLogin);
    revealElement(animationFinished);
}

// Utility: Delay using Promise
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility: Show and fade in an element
function revealElement(element) {
    if (element) {
        
        element.classList.remove('hidden');
        element.style.display = 'flex';
        element.style.opacity = '1';
        element.classList.add('fade-in');
    }
}

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation (replace with real API call)
    if (email === "user@example.com" && password === "password123") {
        alert("Login successful!");
        // Redirect to your app's main page
        window.location.href = "summary.html";
    } else {
        alert("Invalid email or password.");
    }
}

function guestLogin() {
    alert("Logged in as guest!");
    // Store user mode in local storage if needed
    localStorage.setItem("isGuest", "true");
    // Redirect to your app's main page
    window.location.href = "summary.html";
}


function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const icon = document.getElementById("togglePasswordIcon");

  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  icon.src = isPassword ? "assets/icons/visibility-eye-off.svg" : "assets/icons/visibility-eye.svg";
  icon.alt = isPassword ? "Hide Password" : "Show Password";
}
