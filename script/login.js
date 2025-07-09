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
    console.log("Login function triggered");
    checkUserIsPresent(false);
}

function guestLogin() {
    // Store user mode in local storage if needed
    localStorage.setItem("isGuest", "true");
    // Redirect to your app's main page
    window.location.href = "summary.html";
}

function togglePasswordVisibility(inputId, iconElement) {
  const passwordInput = document.getElementById(inputId);
  const icon = iconElement;

  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  icon.src = isPassword ? "assets/icons/visibility-eye-off.svg" : "assets/icons/visibility-eye.svg";
  icon.alt = isPassword ? "Hide Password" : "Show Password";
}

/**
 * 
 * @function checkAndShowAnimation
 * @description Checks if the initial login animation has already been shown in the current session.
 * If the animation has been shown (indicated by the 'animationShown' item in sessionStorage),
 * it directly shows the finished animation state and removes the overlay.
 * Otherwise, it calls the `startLoginAnimationsWithDelay` function to initiate the delayed fade-in animations
 * for the login container, navigation, and footer, and then hides the overlay.
 * Finally, it sets the 'animationShown' item in sessionStorage to 'true' to prevent the animation from
 * showing again in the current session and retrieves the 'linksSidebarBoolienKey' from sessionStorage.
 */
function checkAndShowAnimation() {
    const {animationsLogoOverlayRef, animationFinishedRef, navLogInRef, loginContainerRef, footerLogInRef } = getIdRefs();
    animationsLogoOverlayRef.classList.remove('d-none');
    if (sessionStorage.getItem('animationShown')) {
      animationFinishedRef.classList.add('d-flex');
      animationsLogoOverlayRef.classList.add('d-none');
      removeAnimation();
      return;
    }
    startLoginAnimationsWithDelay(loginContainerRef,navLogInRef,footerLogInRef,animationsLogoOverlayRef,animationFinishedRef);
    sessionStorage.setItem('animationShown', 'true');
    sessionStorage.getItem('linksSidebarBoolienKey');
  }

  /**
   * 
   * @function removeAnimation
   * @description Removes any applied CSS animation and resets the opacity property for the login container,
   * login navigation, and login/register footer elements. This is likely used to clear fade-in animations.
   */
  function removeAnimation() {
    const { navLogInRef, loginContainerRef, footerLogInRef } = getIdRefs();
    loginContainerRef.style.removeProperty('animation');
    loginContainerRef.style.opacity = 'unset';
    navLogInRef.style.removeProperty('animation');
    navLogInRef.style.opacity = 'unset';
    footerLogInRef.style.removeProperty('animation');
    footerLogInRef.style.opacity = 'unset';
  }
  
  /**
   * 
   * @function removeOpacity
   * @description Resets the opacity property to its default value ('unset') for the login container,
   * login navigation, and login/register footer elements. This effectively makes the elements fully visible
   * if their opacity was previously modified (e.g., during an animation).
   */
  function removeOpacity() {
    const { navLogInRef, loginContainerRef, footerLogInRef } = getIdRefs();
    loginContainerRef.style.opacity = 'unset';
    navLogInRef.style.opacity = 'unset';
    footerLogInRef.style.opacity = 'unset';
  }

/**
 * 
 * @function setIdRefValueTrimLogIn
 * @description Retrieves the values from the email and password input fields in the login form,
 * trims any leading or trailing whitespace, and returns them as an object.
 * @returns {object} - An object containing the trimmed values of the login form fields:
 * - `emailLogIn`: The trimmed value of the email input field.
 * - `passwordLogIn`: The trimmed value of the password input field.
 */
function setIdRefValueTrimLogIn() {
    return {
      emailLogIn: document.getElementById('email_log_in').value.trim(),
      passwordLogIn: document.getElementById('password_log_in').value.trim(),
    };
  }


function showLoginError() {
  const { errorMessageLogInRef } = getIdRefs();
  if (errorMessageLogInRef) {
    errorMessageLogInRef.classList.add('d-flex'); // Show the error according to css
  }
}
  
  /**
   *
   * @function handleGenericLoginErrorDisplay
   * @description Controls the visibility of the generic login error message based on the visibility states
   * of the specific email and password error messages. It displays the generic error message only if neither
   * the email nor the password error messages are currently visible.
   * @param {HTMLElement | null} errorMessageLogInRef - The HTML element representing the generic login error message.
   * @param {boolean} isEmailErrorVisible - A boolean indicating if the email error message is currently visible (has the 'd-flex' class).
   * @param {boolean} isPasswordErrorVisible - A boolean indicating if the password error message is currently visible (has the 'd-flex' class).
   */
  function handleGenericLoginErrorDisplay(errorMessageLogInRef, isEmailErrorVisible, isPasswordErrorVisible) {
    if (errorMessageLogInRef) {
      if (!isEmailErrorVisible && !isPasswordErrorVisible) {
        errorMessageLogInRef.classList.add('d-flex');
      } else {
        errorMessageLogInRef.classList.remove('d-flex');
      }
    }
  }

