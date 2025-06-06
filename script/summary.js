function updateGreeting() {
  const greetingElements = document.querySelectorAll('.good');
  if (!greetingElements) return;
  const hours = new Date().getHours();
  const greetingText = hours < 12 ? 'Good Morning,' : hours < 18 ? 'Good Afternoon,' : 'Good Evening,';
  greetingElements.forEach(el => el.textContent = greetingText);
}

function greetingName(user) {
  const nameElements = document.querySelectorAll('.name');
  if (nameElements && user) {
    const nameText = user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : 'guest';
    nameElements.forEach(el => el.innerHTML = nameText);
  }
}

function updateDate() {
  const dateElement = document.querySelector('.date');
  if (dateElement) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString(undefined, options);
  }
}

async function fetchTaskData() {
  const response = await fetch(`${BASE_URL}/tasks.json`);
  if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
  return (await response.json()) || {};
}

function initializeStats() {
  return { todo: 0, done: 0, urgent: 0, tasksInBoard: 0, tasksInProgress: 0, awaitingFeedback: 0 };
}

function updateStatsFromTask(task, stats) {
  stats.tasksInBoard++;
  switch (task.status) {
    case 'toDo': stats.todo++; break;
    case 'done': stats.done++; break;
    case 'inProgress': stats.tasksInProgress++; break;
    case 'awaitFeedback': stats.awaitingFeedback++; break;
  }
  if (task.priority?.toLowerCase() === 'urgent') stats.urgent++;
}

function computeTaskStats(tasks) {
  const stats = initializeStats();
  Object.values(tasks).forEach(task => {
    if (task && typeof task === 'object') {
      updateStatsFromTask(task, stats);
    }
  });
  return stats;
}

function updateTaskSummaryDisplay(stats) {
  document.querySelector('.summarynmb.todo').textContent = stats.todo;
  document.querySelector('.summarynmb.done').textContent = stats.done;
  document.querySelector('.urgentnmb').textContent = stats.urgent;
  const taskNumbers = document.querySelectorAll('.tasknmb');
  if (taskNumbers[0]) taskNumbers[0].textContent = stats.tasksInBoard;
  if (taskNumbers[1]) taskNumbers[1].textContent = stats.tasksInProgress;
  if (taskNumbers[2]) taskNumbers[2].textContent = stats.awaitingFeedback;
}

async function updateTaskData() {
  try {
    const tasks = await fetchTaskData();
    const stats = computeTaskStats(tasks);
    updateTaskSummaryDisplay(stats);
  } catch (error) {
    console.error('Error loading task data:', error);
  }
}

function addClickEvents() {
  const redirectToBoard = () => window.location.href = 'board.html';
  const tasksElement = document.querySelector('.tasks');
  if (tasksElement) tasksElement.onclick = redirectToBoard;
  const urgentElement = document.querySelector('.urgent');
  if (urgentElement) urgentElement.onclick = redirectToBoard;
  document.querySelectorAll('.pencil').forEach(el => el.onclick = redirectToBoard);
}

function addHoverEffect(container, imgElement, defaultSrc, hoverSrc) {
  if (!container || !imgElement) return;
  container.onmouseover = () => imgElement.src = hoverSrc;
  container.onmouseout = () => imgElement.src = defaultSrc;
}

async function initializeSummaryData() {
  const user = await loadUserData();
  greetingName(user);
  updateTaskData();
}

function setupSummaryUI() {
  updateGreeting();
  updateDate();
  checkAndShowAnimationSummary();
  setInterval(updateTaskData, 5000);
  addClickEvents();
}

function setupHoverIcons() {
  const pencilContainer = document.querySelector('.pencil:first-child');
  const pencilImg = pencilContainer?.querySelector('img');
  const doneContainer = document.querySelector('.pencil:nth-child(2)');
  const doneImg = doneContainer?.querySelector('img');
  addHoverEffect(pencilContainer, pencilImg, 'assets/icons/Pencil.svg', 'assets/icons/pencilhover.svg');
  addHoverEffect(doneContainer, doneImg, 'assets/icons/done.svg', 'assets/icons/donehover.svg');
}

async function initializeSummaryPage() {
  try {
    await initializeSummaryData();
    setupSummaryUI();
    setupHoverIcons();
  } catch (error) {
    console.error('Error initializing the summary page', error);
  }
}

function checkAndShowAnimationSummary() {
  const overlay = document.getElementById('mobile_view_greetin_overlay');
  const animationShown = sessionStorage.getItem('animationShownSummary');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (animationShown || !isMobile) return overlay.style.display = 'none';
  overlay.style.display = 'flex';
  sessionStorage.setItem('animationShownSummary', 'true');
  setTimeout(() => overlay.style.display = 'none', 2500);
}
