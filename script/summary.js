async function initializeSummaryPage() {
  try {
    await initializeSummaryData();
    setupSummaryUI();
    setupHoverIcons();
  } catch (error) {
    console.error('Error initializing the summary page', error);
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

 

  
   