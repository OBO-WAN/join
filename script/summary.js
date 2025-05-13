async function initializeSummaryPage() {
  try {
    await initializeSummaryData();
    setupSummaryUI();
    setupHoverIcons();
  } catch (error) {
    console.error('Error initializing the summary page', error);
  }
}



 

  
   