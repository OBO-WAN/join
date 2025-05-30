/**
 * Ensures a header container exists. Creates one if not found.
 * @returns {HTMLElement} The header container element.
 */
function ensureHeaderContainer() {
  let container = document.getElementById('header_container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'header_container';
    document.body.insertBefore(container, document.body.firstChild);
  }
  return container;
}

/**
 * Fetches and returns the content of the header HTML file.
 * @returns {Promise<string>} The fetched HTML content.
 * @throws Will throw an error if the fetch fails.
 */
async function fetchHeaderHtml() {
  const response = await fetch('header_sidebar.html');
  if (!response.ok) {
    throw new Error(`Error retrieving header ${response.status}`);
  }
  return await response.text();
}

/**
 * Runs initialization routines after header is loaded.
 */
function initializeHeaderContent() {
  const buttonLinksSidebar = sessionStorage.getItem('linksSidebarBoolienKey');
  ifButtonLinkSidebar(buttonLinksSidebar);
  loadInitialsUserIcon();
  ifActivePage();
}

/**
 * Asynchronously loads the header and initializes its behavior.
 * Creates the container if necessary and inserts HTML content.
 *
 * @async
 * @returns {Promise<void>}
 */
async function loadHeaderAndInitialize() {
  const container = ensureHeaderContainer();

  try {
    const html = await fetchHeaderHtml();
    container.innerHTML = html;
    initializeHeaderContent();
  } catch (error) {
    console.error('Error loading header', error);
  }
}


/**
 * Shows or hides the login links in the sidebar based on the provided parameter.
 *
 * @param {string} buttonLinksSidebar - A string indicating whether the links should be displayed ('true') or not.
 */
function ifButtonLinkSidebar(buttonLinksSidebar) {
  if (buttonLinksSidebar === 'true') {
    showLoggedInLinks();
  } else {
    hideLoggedInLinks();
  }
}

/**
 * Checks the current URL and marks the corresponding link in the sidebar as active.
 * Also, stores the active page path in session storage.
 */
function ifActivePage() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  document.querySelectorAll('.link-button a').forEach((a) => {
    const linkHref = a.getAttribute('href');
    if (linkHref === currentPage) {
      a.closest('li').classList.add('active');
      sessionStorage.setItem('activePage', linkHref);
    } else {
      a.closest('li').classList.remove('active');
    }
  });
}

/**
 * Toggles the submenu.
 * In mobile view (max-width 768px), a slide-in animation is toggled;
 * otherwise, standard classes are adjusted.
 */
function toggleSubmenu() {
  let submenu = document.getElementById('user-submenu');

  if (window.matchMedia('(max-width: 768px)').matches) {
    submenu.style.transition = 'transform 0.3s ease-in-out';
    submenu.classList.toggle('submenu-slide-in');
  } else {
    submenu.classList.remove('submenu-slide-in');
    submenu.classList.toggle('hidden');
  }
}

/**
 * Global click handler: If a click occurs outside the user profile and submenu,
 * the submenu is hidden.
 */
document.onclick = function (event) {
  let profile = document.querySelector('.user-profile');
  let submenu = document.getElementById('user-submenu');

  // If the click target is neither within the profile nor the submenu, hide the submenu.
  if (!profile.contains(event.target) && !submenu.contains(event.target)) {
    submenu.classList.add('hidden');
  }
};

/**
 * Asynchronously loads the user icon by retrieving the initials and optionally the color from the user data.
 * If no data is available, a default value ('G') is used.
 *
 * @async
 * @function loadInitialsUserIcon
 * @returns {Promise<void>}
 */
async function loadInitialsUserIcon() {
  let userProfileCircleRef = document.getElementById('user_profile_circle');

  try {
    const user = await loadUserData();
    if (user && user.initials && user.randomColor) {
      userProfileCircleRef.innerHTML = user.initials;
    } else {
      userProfileCircleRef.innerHTML = 'G';
    }
  } catch (error) {
    console.error('Error loading user data', error);
  }
}

/**
 * Sets focus on a specified link and navigates to the given URL.
 * At the same time, the active link in the sidebar is visually marked
 * and the active page is stored in session storage.
 *
 * @param {string} url - The target URL to navigate to.
 * @param {HTMLElement} element - The DOM element that contains the link.
 */
function toHrefFocus(url, element) {
  document.querySelectorAll('.link-button').forEach((li) => {
    li.classList.remove('active');
  });

  if (element) {
    element.closest('li').classList.add('active');
  }

  sessionStorage.setItem('activePage', url);
  window.location.href = url;
}
