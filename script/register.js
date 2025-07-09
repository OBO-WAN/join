/**
 * 
 * @function getIdRefs
 * @description Retrieves references to various DOM elements by their IDs and returns them as an object.
 * @returns {object} An object containing references to various DOM elements. The keys of the object correspond to the reference names (e.g., `animationJoinLogoRef`), and the values are the corresponding DOM elements.
 * 
 */
function getIdRefs() {
  return {
    bodyLoginRegisterRef: document.getElementById('body_log_in'),
    animationsLogoOverlayRef: document.getElementById('animations_logo_overlay'),
    animationJoinLogoRef: document.getElementById('animation_join_logo'),
    animationFinishedRef: document.getElementById('animation_finished'),
    navLogInRef: document.getElementById('nav_log_in'),
    loginContainerRef: document.getElementById('login_container'),
    signUpContainerRef: document.getElementById('sign_up_container'),
    footerLogInRef: document.getElementById('footer_log_in'),
    imgPasswordLogInRef: document.getElementById('img_password_log_in'),
    loginFormRef: document.getElementById('login_form'),
    nameSignUpRef: document.getElementById('name_sign_up'),
    emailSignUpRef: document.getElementById('email_sign-up'),
    emailLogInRef: document.getElementById('email_log_in'),
    passwordLogInRef: document.getElementById('password_log_in'),
    passwordSignUpRef: document.getElementById('password_sign_up'),
    confirmPasswordSignUpRef: document.getElementById('confirm_sign_up'),
    checkboxRef: document.getElementById('checkbox'),
    signUpButtonRef: document.getElementById('sign_up_button'),
    customCheckmarkRef: document.getElementById('custom_checkmark'),
    errorMessageEmailNotValideSignUpRef: document.getElementById('error_message_email_not_valide_sign_up'),
    errorMessageEmailNotValideLoginRef: document.getElementById('error_message_email_not_valide_login'),
    errorMessageNameRef: document.getElementById('error_message_name'),
    errorMessageLogInRef: document.getElementById('error_message_log_in'),
    errorMessagePasswordSignInRef: document.getElementById('error_message_password_sign_up'),
    errorMessagePasswordLogInRef: document.getElementById('error_message_password_log_in'),
    errorMessageConfirmPasswordRef: document.getElementById('error_message_confirm_password'),
    errorMessageEmailRef: document.getElementById('error_message_email'),
    popupOverlaySignUpRef: document.getElementById('popup_overlay_sign_up'),
    logoWhiteRef: document.getElementById('logo_white'), 
    logoGrayRef: document.getElementById('logo_gray'), 
  };
}

/**
 *
 * @function togglePasswordVisibility
 * @description Toggles the visibility of a password input field and updates the corresponding visibility icon.
 * @param {string} inputId - The ID of the password input element.
 * @param {HTMLElement} iconElement - The HTML element representing the visibility toggle icon.
 */
function togglePasswordVisibility(inputId, iconElement) {
  const passwordInput = document.getElementById(inputId);
  const toggleIcon = iconElement;
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.src = 'assets/icons/visibility-eye.svg';
    toggleIcon.alt = 'Visibility Eye Icon';
  } else {
    passwordInput.type = 'password';
    toggleIcon.src = 'assets/icons/visibility-eye-off.svg';
    toggleIcon.alt = 'Visibility eye of Icon';
  }
}

/**
 * 
 * @function delayedRedirectAndReset
 * @description **This function is called by `handleSignUpSuccess` to perform post-sign-up actions.**
 * It uses `setTimeout` to delay the redirection to the 'log_in.html' page and calls the
 * `resetProberties` function after a specified delay (500 milliseconds).
 */
function delayedRedirectAndReset(){
 setTimeout(() => {
      goToUrl('login.html');
      toggleCheckbox(true);
    }, 500);
}

/**
 *
 * @function handlePasswordConfirmationResult
 * @description Handles the visual feedback based on whether the provided passwords match.
 * If they do not match, it displays the error message and adds the error class to both password input fields.
 * If they match, it clears the error message and removes the error class from the input fields.
 * @param {boolean} passwordsMatch - A boolean indicating whether the password and confirm password values are the same.
 * @param {HTMLElement} errorMessageConfirmPasswordRef - The HTML element for the confirm password error message.
 * @param {HTMLElement} passwordSignUpRef - The HTML input element for the password on the sign-up form.
 * @param {HTMLElement} confirmPasswordSignUpRef - The HTML input element for the confirm password on the sign-up form.
 * @returns {boolean} - Returns `false` if the passwords do not match, `true` otherwise.
 */
function handlePasswordConfirmationResult(passwordsMatch, errorMessageConfirmPasswordRef, passwordSignUpRef, confirmPasswordSignUpRef) {
  if (!passwordsMatch) {
    errorMessageConfirmPasswordRef.classList.add('d-flex');
    passwordSignUpRef.classList.add('not-valide-error');
    confirmPasswordSignUpRef.classList.add('not-valide-error');
    return false;
  } else {
    clearConfirmPasswordError();
    return true;
  }
}

/**
 *
 * @function checkPasswordConfirm
 * @description Checks if the password and confirm password input fields match.
 * It utilizes the `handlePasswordConfirmationResult` function to manage the visual feedback
 * based on the comparison. It also handles the case where the confirm password field is empty.
 * @returns {boolean} - Returns `true` if the passwords match or if the confirm password field is empty, `false` otherwise.
 */
function checkPasswordConfirm() {
  const { password, confirmPassword } = setIdRefValueTrimSignUp();
  const { errorMessageConfirmPasswordRef, passwordSignUpRef, confirmPasswordSignUpRef } = getIdRefs();

  if (confirmPassword === "") {
    clearConfirmPasswordError();
    return true;
  }

  const passwordsMatch = password === confirmPassword;
  return handlePasswordConfirmationResult(passwordsMatch, errorMessageConfirmPasswordRef, passwordSignUpRef, confirmPasswordSignUpRef);
}

/**
 * @function clearConfirmPasswordError
 * @description Clears the error styling and message related to the confirm password field.
 */
function clearConfirmPasswordError() {
  const { errorMessageConfirmPasswordRef, confirmPasswordSignUpRef, passwordSignUpRef } = getIdRefs();
  errorMessageConfirmPasswordRef.classList.remove('d-flex');
  confirmPasswordSignUpRef.classList.remove('not-valide-error');
  passwordSignUpRef.classList.remove('not-valide-error');
}

/**
 *
 * @function getEmailInputData
 * @description Extracts the email value from the provided input field, trims any leading or trailing whitespace,
 * and determines the appropriate email reference (for sign-up or login) based on the `isSignUp` flag.
 * @param {HTMLInputElement} emailInputField - The HTML input element for the email.
 * @param {boolean} isSignUp - A boolean indicating whether the context is the sign-up form (`true`) or the login form (`false`).
 * @returns {object} - An object containing the trimmed email value and the corresponding email reference element.
 * - `trimmedEmail`: The email value with leading and trailing whitespace removed.
 * - `currentEmailRef`: The HTML element reference for the email input field (either `emailSignUpRef` or `emailLogInRef`).
 */
function getEmailInputData(emailInputField, isSignUp) {
  const { emailSignUpRef, emailLogInRef } = getIdRefs();
  const email = emailInputField.value;
  const trimmedEmail = email.trim();
  const currentEmailRef = isSignUp ? emailSignUpRef : emailLogInRef;
  return { trimmedEmail, currentEmailRef };
}

// /**
//  *
//  * @function validateEmail
//  * @description Validates the email input field. It checks if the email is not empty,
//  * has no leading/trailing whitespace, and matches a basic email pattern using helper functions.
//  * It updates the visual feedback (error messages and input field styling) based on the validation result.
//  * @param {HTMLInputElement} emailInputField - The input element for the email.
//  * @param {boolean} boolean - A boolean indicating if the validation is for the sign-up form (`true`) or login form (`false`).
//  * @returns {boolean} - Returns true if the email is valid, false otherwise.
//  */
function validateEmail(inputField, isSignUp) {
  const value = inputField.value.trim();
  const errorMessage = document.getElementById('error_message_email_not_valide_login');
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!isValid) {
    inputField.classList.add('not-valide-error');
    if (errorMessage) errorMessage.style.display = 'block';
    return false;
  } else {
    inputField.classList.remove('not-valide-error');
    if (errorMessage) errorMessage.style.display = 'none';
    return true;
  }
}


/**
 * 
 * @function clearEmailValidationErrors
 * @description Removes the display style and error class from email validation error messages and the corresponding email input field.
 * It differentiates between sign-up and login forms to target the correct error message and input field.
 * @param {boolean} - A boolean flag indicating whether the validation context is for the sign-up form (`true`) or the login form (`false`).
 */
function clearEmailValidationErrors(boolean) {
  const { errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef, errorMessageEmailRef, emailSignUpRef, emailLogInRef } = getIdRefs();
  if (boolean) {
    emailSignUpRef.classList.remove('not-valide-error');
    errorMessageEmailNotValideSignUpRef.classList.remove('d-flex');
    errorMessageEmailRef.classList.remove('d-flex');
  } else {
    emailLogInRef.classList.remove('not-valide-error');
    errorMessageEmailNotValideLoginRef.classList.remove('d-flex');
  }
}

/**
 * 
 * @function ifValidateEmailTrimmed
 * @description Checks if the original email input value has leading or trailing whitespace.
 * If whitespace is present, it displays the appropriate error message and adds an error class to the email input field.
 * @param {string} email - The original email input value.
 * @param {string} trimmedEmail - The trimmed email input value.
 * @param {HTMLElement} errorMessageEmailNotValideSignUpRef - The error message element for invalid email format on sign-up.
 * @param {HTMLElement} errorMessageEmailNotValideLoginRef - The error message element for invalid email format on login.
 * @param {HTMLElement} errorMessageEmailRef - The general error message element for the email field.
 * @param {HTMLElement} emailRef - The HTML input element for the email.
 * @param {boolean} boolean - A boolean indicating if the validation is for the sign-up form (true) or login form (false).
 * @returns {boolean} - Returns true if there is no leading or trailing whitespace, false otherwise.
 */
function ifValidateEmailTrimmed(email, trimmedEmail, errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef, errorMessageEmailRef, emailRef, boolean) {
  if (email !== trimmedEmail) {
    if (boolean) {
      errorMessageEmailNotValideSignUpRef.classList.add('d-flex');
    } else {
      errorMessageEmailNotValideLoginRef.classList.add('d-flex');
    }
    errorMessageEmailRef.classList.remove('d-flex');
    if (emailRef) {
      emailRef.classList.add('not-valide-error');
    }
    return false;
  }
  return true;
}

/**
 * 
 * @function ifEmailPattern
 * @description Checks if the trimmed email input value matches a basic email pattern.
 * If the pattern does not match, it displays the appropriate error message and adds an error class to the email input field.
 * @param {string} trimmedEmail - The trimmed email input value.
 * @param {HTMLElement} errorMessageEmailNotValideSignUpRef - The error message element for invalid email format on sign-up.
 * @param {HTMLElement} errorMessageEmailNotValideLoginRef - The error message element for invalid email format on login.
 * @param {HTMLElement} errorMessageEmailRef - The general error message element for the email field.
 * @param {HTMLElement} emailRef - The HTML input element for the email.
 * @param {boolean} boolean - A boolean indicating if the validation is for the sign-up form (true) or login form (false).
 * @returns {boolean} - Returns true if the email matches the pattern, false otherwise.
 */
function ifEmailPattern(trimmedEmail, errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef, errorMessageEmailRef, emailRef, boolean) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    if (boolean) {
      errorMessageEmailNotValideSignUpRef.classList.add('d-flex');
    } else {
      errorMessageEmailNotValideLoginRef.classList.add('d-flex');
    }
    if (emailRef) {
      emailRef.classList.add('not-valide-error');
    }
    return false;
  }
  return true;
}

function validatePassword(inputField, isSignUp) {
  const password = inputField.value.trim();
  const errorMessage = document.getElementById('error_message_password_log_in');
  const isValid = password.length >= 8;

  if (!isValid) {
    inputField.classList.add('not-valide-error');
    if (errorMessage) errorMessage.style.display = 'block';
    return false;
  } else {
    inputField.classList.remove('not-valide-error');
    if (errorMessage) errorMessage.style.display = 'none';
    return true;
  }
}


/**
 *
 * @function getPasswordInputData
 * @description Extracts the password value from the provided input field and trims any leading or trailing whitespace.
 * @param {HTMLInputElement} passwordInputField - The HTML input element for the password.
 * @returns {object} - An object containing the original password value and the trimmed password value.
 * - `password`: The original value of the password input field.
 * - `trimmedPassword`: The password value with leading and trailing whitespace removed.
 */
function getPasswordInputData(passwordInputField) {
  const password = passwordInputField.value;
  const trimmedPassword = password.trim();
  return { password, trimmedPassword };
}

/**
 *
 * @function getPasswordRefs
 * @description Determines and returns the appropriate password input field reference and error message reference
 * based on whether the context is the sign-up form or the login form.
 * @param {boolean} isSignUp - A boolean indicating whether the context is the sign-up form (`true`) or the login form (`false`).
 * @returns {object} - An object containing the password input field reference and the error message reference.
 * - `currentPasswordRef`: The HTML element reference for the password input field (either `passwordSignUpRef` or `passwordLogInRef`).
 * - `currentErrorMessageRef`: The HTML element reference for the corresponding password error message (either `errorMessagePasswordSignInRef` or `errorMessagePasswordLogInRef`).
 */
function getPasswordRefs(isSignUp) {
  const { passwordSignUpRef, passwordLogInRef, errorMessagePasswordSignInRef, errorMessagePasswordLogInRef } = getIdRefs();
  let currentPasswordRef;
  let currentErrorMessageRef;

  if (isSignUp) {
    currentPasswordRef = passwordSignUpRef;
    currentErrorMessageRef = errorMessagePasswordSignInRef;
  } else {
    currentPasswordRef = passwordLogInRef;
    currentErrorMessageRef = errorMessagePasswordLogInRef;
  }

  return { currentPasswordRef, currentErrorMessageRef };
}

/**
 * 
 * Handles the case when the password input field is empty.
 * Removes the error message display and the error class from the input field if they exist.
 * @param {HTMLElement | null} currentPasswordRef - The reference element of the password input field.
 * @param {HTMLElement | null} currentErrorMessageRef - The reference element of the error message display for the password.
 * @returns {boolean} - Returns true, as an empty field is considered "valid" in terms of the *minimum requirement* (actual validation for existence might occur elsewhere).
 */
function handleEmptyPassword(currentPasswordRef, currentErrorMessageRef,errorMessageLogInRef) {
  if (currentErrorMessageRef) {
      currentErrorMessageRef.classList.remove('d-flex');
  }
  if (errorMessageLogInRef) {
      errorMessageLogInRef.classList.remove('d-flex');
  }    
  if (currentPasswordRef) {
    currentPasswordRef.classList.remove('not-valide-error');
  }
  return true;
}

/**
 *
 * @function handlePasswordLengthValidation
 * @description Validates the length of a provided password. If the trimmed length is less than 8 characters,
 * it calls `showPasswordLengthError` to display an error message and add a visual error indicator.
 * Otherwise, it calls `clearPasswordLengthError` to hide the error message and remove the error indicator.
 * @param {string} trimmedPassword - The password string after leading and trailing whitespace has been removed.
 * @param {HTMLElement | null} currentPasswordRef - A reference to the HTML input element for the password.
 * @param {HTMLElement | null} currentErrorMessageRef - A reference to the HTML element displaying the password length error message.
 * @returns {boolean} - Returns `true` if the trimmed password length is 8 characters or more, otherwise returns `false`.
 */
function handlePasswordLengthValidation(trimmedPassword, currentPasswordRef, currentErrorMessageRef) {
  if (trimmedPassword.length < 8) {
    return showPasswordLengthError(currentPasswordRef, currentErrorMessageRef);
  } else {
    return clearPasswordLengthError(currentPasswordRef, currentErrorMessageRef);
  }
}

/**
 *
 * @function showPasswordLengthError
 * @description Displays the password length error message and adds the error class to the password input field.
 * @param {HTMLElement | null} currentPasswordRef - A reference to the HTML input element for the password.
 * @param {HTMLElement | null} currentErrorMessageRef - A reference to the HTML element displaying the password length error message.
 * @returns {boolean} - Returns `false` to indicate that the password length is invalid.
 */
function showPasswordLengthError(currentPasswordRef, currentErrorMessageRef) {
  if (currentErrorMessageRef) {
    currentErrorMessageRef.classList.add('d-flex');
  }
  if (currentPasswordRef) {
    currentPasswordRef.classList.add('not-valide-error');
  }
  return false;
}

/**
 *
 * @function clearPasswordLengthError
 * @description Clears the password length error message and removes the error class from the password input field.
 * @param {HTMLElement | null} currentPasswordRef - A reference to the HTML input element for the password.
 * @param {HTMLElement | null} currentErrorMessageRef - A reference to the HTML element displaying the password length error message.
 * @returns {boolean} - Returns `true` to indicate that the password length is valid (meets the minimum requirement).
 */
function clearPasswordLengthError(currentPasswordRef, currentErrorMessageRef) {
  if (currentErrorMessageRef) {
    currentErrorMessageRef.classList.remove('d-flex');
  }
  if (currentPasswordRef) {
    currentPasswordRef.classList.remove('not-valide-error');
  }
  return true;
}

/**
 * 
 * @function checkUserIsPresent
 * @description Asynchronously checks if any user data exists.
 * It attempts to load user data from the '/user' endpoint.
 * If user data is found, it extracts the user IDs and calls `checkUserIsPresentForLoob` and `showLoginError`.
 * @param {boolean} [parameter=false] - An optional boolean parameter that is passed to the `checkUserIsPresentForLoob` function.
 * @returns {Promise<boolean>} - Returns a Promise that resolves to `false` if user data is present (indicating an error condition for login in this context),
 * or `false` if an error occurs during data loading. It does not resolve to `true` in the current implementation.
 */
async function checkUserIsPresent(parameter = false) {
  try {
    const users = await loadData('/user');
    if (users) {
      const userIds = Object.keys(users);
     return checkUserIsPresentForLoob(users,userIds, parameter);
    }
    return false;
  } catch (error) {
    console.error('Error verifying user', error);
    return false;
  }
}

/**
 *
 * @async
 * @function handleUserPresenceCheck
 * @description Checks user presence based on the provided parameter. 
 * If the parameter is true (sign-up), it checks for duplicate emails.
 * If false (login), it validates login credentials and stores user info in sessionStorage.
 * @param {*} parameter - A boolean flag determining which check to perform.
 * @param {object} user - The user object to check against.
 * @param {string} userId - The ID of the user (only relevant when parameter is false).
 * @returns {Promise<boolean>} - Returns the boolean result of either `ifParameterTrue` or `ifParameterFalse`.
 */
async function handleUserPresenceCheck(parameter, user, userId) {
  if (parameter) {
    return ifParameterTrue(parameter, user);
  } else {
    const { emailLogIn, passwordLogIn } = setIdRefValueTrimLogIn();
    const { loginFormRef } = getIdRefs();

    if (user.email === emailLogIn && user.password === passwordLogIn) {
      sessionStorage.setItem('loggedInUserId', userId);
      sessionStorage.setItem('userInitials', user.initials);
      sessionStorage.setItem('firstName', user.firstname);
      sessionStorage.setItem('lastName', user.lastname);
      await loadUserData();
      loginFormRef.reset();
      loginSuccessful();
      return true;
    } else {
      showLoginError();
      return false;
    }
  }
}

/**
 *
 * @async
 * @function checkUserIsPresentForLoob
 * @description Iterates through a list of user IDs and checks for user presence using the `handleUserPresenceCheck` function.
 * It returns true as soon as a user check returns true.
 * @param {object} users - An object containing user data, where keys are user IDs and values are user objects.
 * @param {string[]} userIds - An array of user IDs to iterate through.
 * @param {boolean} parameter - A boolean flag passed to `handleUserPresenceCheck` to determine the type of check.
 * @returns {Promise<boolean>} - Returns `true` if any user check returns true, `false` otherwise.
 */
async function checkUserIsPresentForLoob(users, userIds, parameter) {
  for (let index = 0; index < userIds.length; index++) {
    const userId = userIds[index];
    const user = users[userId];
    if (await handleUserPresenceCheck(parameter, user, userId)) {
      return true;
    }
  }
  return false;
}

/**
 * 
 * @function ifParameterTrue
 * @description Checks if a given parameter is true. If it is, it compares the provided user's email with the trimmed value from the signup email input field.
 * If the emails match, it displays an error message and visually indicates an error on the email input field.
 * @param {*} parameter - The parameter to check for truthiness.
 * @param {object} user - An object containing the user's email property.
 * @returns {boolean|void} - Returns `true` if the parameter is true and the emails match. Returns `void` otherwise.
 * 
 */
function ifParameterTrue(parameter, user) {
  const { email } = setIdRefValueTrimSignUp();
  const { emailSignUpRef, errorMessageEmailRef } = getIdRefs();
  if (parameter) {
    if (user.email === email) {
      errorMessageEmailRef.classList.add('d-flex');
      emailSignUpRef.classList.add('not-valide-error');
      return true; 
    }
  }
  return false; 
}

/**
 * 
 * @function ifParameterFalse
 * @description Checks if a given parameter is false. If it is, it compares the provided user's email and password with the values in the login input fields.
 * If they match, it clears the login input fields, stores the user ID in sessionStorage, loads user data, and indicates a successful login.
 * @param {*} parameter - The parameter to check for falsiness.
 * @param {object} user - An object containing the user's email and password properties.
 * @param {string} userId - The ID of the user to store in sessionStorage upon successful login.
 * @returns {Promise<boolean|void>} - Returns `true` if the parameter is false and the login is successful. Returns `void` otherwise.
 * 
 */
async function ifParameterFalse(parameter, user, userId) {
  const { emailLogIn, passwordLogIn } = setIdRefValueTrimLogIn();
  const { loginFormRef } = getIdRefs();
  if (!parameter) {
    if (user.email === emailLogIn && user.password === passwordLogIn) {
      sessionStorage.setItem('loggedInUserId', userId);
      await loadUserData();
      loginFormRef.reset();
      loginSuccessful();
      return true; 
    } else {
      showLoginError();
    }
  }
  return false; 
}


function showLoginError() {
  const {
    errorMessageLogInRef,
    emailLogInRef,
    passwordLogInRef
  } = getIdRefs();

  if (errorMessageLogInRef) {
    errorMessageLogInRef.classList.add('d-flex');
  }

  if (emailLogInRef) {
    emailLogInRef.classList.add('not-valide-error');
  }
  if (passwordLogInRef) {
    passwordLogInRef.classList.add('not-valide-error');
  }
}


  /**
 * 
 * @function removeLoginError
 * @description Retrieves references to the login error message, email input, and password input elements using `getIdRefs()`.
 * It then removes the 'd-flex' class from the error message to hide it and the 'not-valide-error' class from both the email and password input fields to remove the error indication.
 *
 */
function removeLoginError(){
    const { errorMessageLogInRef, passwordLogInRef, emailLogInRef } = getIdRefs();
    errorMessageLogInRef.classList.remove('d-flex');
    emailLogInRef.classList.remove('not-valide-error');
    passwordLogInRef.classList.remove('not-valide-error');
  }