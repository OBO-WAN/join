let tasks = [];

let users = [];

let currentDraggedElement = null;

window.onclick =  (event) =>{
if (event.target.id === "overlay") {
        closeOverlay();
    }
}

/**
 * Loads all tasks from Firebase and updates the global tasks array
 */
async function loadTasksFromFirebase() {
  const response = await fetch(`${BASE_URL}tasks.json`);
  const data = await response.json();

  tasks = [];
  for (const [id, task] of Object.entries(data || {})) {
    if (!task || typeof task !== "object") continue;
    task.id = id;
    tasks.push(task);
  }

  renderCurrentTasks();
}

/**
 * Initializes the application by loading users and tasks from Firebase
 */
async function init() {
  await loadUsersFromFirebase();
  await loadTasksFromFirebase();
  
let index = 0; // Beispiel: erster User
let userColor = users[index]?.color;
  showCurrentBoard();
}

/**
 * Renders all tasks in their respective status columns on the Kanban board
 * - De-dups assignees
 * - Caps visible avatars at 4 and shows a +N counter
 */
function renderCurrentTasks() {
  const statusContainers = proofStatus();
  const statusCounts = proofStatusCounts();

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskData = prepareTaskForTemplate(task);

    const assignedUsersHTML = buildAssignedUsersHTML(task.assignedTo);

    const container = statusContainers[task.status];
    if (container) {
      container.innerHTML += getKanbanTemplate(taskData, assignedUsersHTML, i);
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    }

    setTimeout(() => {
      proofSubtasks(task, i);
    }, 0);
  }

  showStatusPlaceholder(statusCounts, statusContainers);

  // Attach events after DOM paint (once)
  setTimeout(() => {
    attachTaskEventHandlers();
  }, 0);
}

/**
 * Gets status container elements and clears their content
 * @returns {Object} Object containing status container elements
 */
function proofStatus() {
  const statusContainers = {
    toDo: document.getElementById("toDoContainer"),
    inProgress: document.getElementById("inProgressContainer"),
    awaitFeedback: document.getElementById("awaitFeedbackContainer"),
    done: document.getElementById("doneContainer"),
  };

  Object.values(statusContainers).forEach(
    (container) => (container.innerHTML = "")
  );
  return statusContainers;
}

/**
 * Initializes status count counters for each task status
 * @returns {Object} Object with count properties for each status
 */
function proofStatusCounts() {
  const statusCounts = {
    toDo: 0,
    inProgress: 0,
    awaitFeedback: 0,
    done: 0,
  };

  return statusCounts;
}

/**
 * Displays subtask progress for a task if it has subtasks
 * @param {Object} task - The task object containing subtasks
 * @param {number} index - The index of the task for DOM targeting
 */
function proofSubtasks(task, index) {
  if (!task.subTasks || task.subTasks.length === 0) return;

  const subtaskContainer = document.getElementById(
    `subtask_container_${index}`
  );

  if (subtaskContainer) {
    // Fortschritt berechnen (hier: 0 erledigt, kann angepasst werden)
    const total = task.subTasks.length;
    const done = task.subTasks.filter((t) => t.done === true).length;
    const percent = Math.round((done / total) * 100) || 0;

    subtaskContainer.innerHTML = `
            <div class="progress_container">
                <div class="progress_bar_bg">
                    <div class="progress-bar" style="width: ${percent}%;"></div>
                </div>
                <p class="subtasks_progress">${done}/${total} Subtasks</p>
            </div>
        `;
  }
}

/**
 * Shows placeholder text for empty status columns
 * @param {Object} statusCounts - Object containing task counts for each status
 * @param {Object} statusContainers - Object containing DOM container elements
 */
function showStatusPlaceholder(statusCounts, statusContainers) {
  for (const [status, count] of Object.entries(statusCounts)) {
    if (count === 0) {
      const container = statusContainers[status];
      container.innerHTML = `<div class="no_task_placeholder">No tasks</div>`;
    }
  }
}

/**
 * Shows subtask progress container (legacy function)
 */
function showSubtasks() {
  container.innerHTML = `
                        <div class="progress_container">
                            <div class="progress-bar" style="width: 50%;"></div>
                            <p class="subtasks_progress">1/2 Subtasks</p>
                        </div>
`;
}

/**
 * Attaches click and drag event handlers to all task containers
 * - Uses the same avatar builder as the board card so the overlay matches
 */
function attachTaskEventHandlers() {
  const containers = document.querySelectorAll(".task_container");

  containers.forEach((container) => {
    const id = container.dataset.taskId;
    const index = parseInt(container.dataset.taskIndex, 10);
    const task = tasks.find((t) => t.id == id);
    if (!task) return;

    const taskData = prepareTaskForTemplate(task);
    // Build avatars with de-dup + +N overflow (use raw names)
    const assignedUsersHTML = buildAssignedUsersHTML(task.assignedTo);

    // Open details overlay on click
    container.addEventListener("click", () => {
      openTask(taskData, assignedUsersHTML, index);
    });

    // Support drag start (template also has ondragstart; keeping for robustness)
    container.addEventListener("dragstart", () => {
      startDragging(task.id);
    });
  });
}

/**
 * Prepares task data for template rendering with formatted properties
 * @param {Object} task - Raw task object from Firebase
 * @returns {Object} Formatted task object ready for template rendering
 */
function prepareTaskForTemplate(task) {
  const uniqueAssigned = [...new Set(task.assignedTo || [])];

  const assignedTo = uniqueAssigned.map((name) => {
    const user = Object.values(Contacts).find((u) => u.name === name);
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    let color = "#2A3647";
    if (user) {
      color = getColor(initials); // uses add_task.js palette
    }
    return { initials, color };
  });

  return {
    id: task.id,
    category: task.category || "General",
    categoryClass: (task.category || "general").toLowerCase().replace(/\s/g, "_"),
    dueDate: task.dueDate,
    title: task.title || task.task || "Untitled",
    description: task.description || "",
    assignedTo,
    priority: (task.priority || "low").toLowerCase(),
    subTasks: task.subTasks || [],
  };
}

/**
 * Displays the current board by rendering all tasks
 */
function showCurrentBoard() {
  renderCurrentTasks();
}

/**
 * Loads user data from Firebase
 */
async function loadUsersFromFirebase() {
  const response = await fetch(`${BASE_URL}user.json`);
  const data = await response.json();
  users = data || [];
}

window.addEventListener("DOMContentLoaded", function () {
  var searchInput = document.getElementsByClassName("search_input")[0];
  var taskElements = document.getElementsByClassName("task");

  searchInput.addEventListener("input", function () {
    var searchTerm = searchInput.value.toLowerCase();
    for (var i = 0; i < taskElements.length; i++) {
      var task = taskElements[i];
      var titleElements = task.getElementsByClassName("task_title");
      var detailElements = task.getElementsByClassName("task_details");

      var title = titleElements.length
        ? titleElements[0].textContent.toLowerCase()
        : "";
      var details = detailElements.length
        ? detailElements[0].textContent.toLowerCase()
        : "";

      var match = title.includes(searchTerm) || details.includes(searchTerm);
      task.style.display = match ? "block" : "none";
    }
  });
});

/**
 * Opens the Add Task overlay with form and functionality
 */
function addNewTask() {
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "";
  overlay.innerHTML = getAddTaskOverlay();
  overlay.classList.remove("d-none");

  setMinDateToday();
  loadContacts();
  initAddTaskFormEvents();
}

/**
 * Closes the currently open overlay
 */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.classList.add("d-none");
}

/**
 * Opens the task detail overlay with full task information
 * @param {Object} task - Task object to display
 * @param {string} assignedUsersHTML - HTML string for assigned user avatars
 * @param {number} index - Task index for DOM targeting
 */
function openTask(task, assignedUsersHTML, index) {
  const formattedDate = formatDateForOverlay(task.dueDate) || "—";
  document.body.classList.add("overlay-active");

  const priority = (task.priority || "low").toLowerCase();
  const subtasksHTML = generateSubtasksHTML(task.subTasks, task.id);

  const overlay = document.getElementById("overlay");
  overlay.innerHTML = getTaskSheetOverlay(
    task,
    assignedUsersHTML,
    index,
    formattedDate,
    priority,
    subtasksHTML
  );
  overlay.classList.remove("d-none");
}

/**
 * Formats a date string for display in the task overlay
 * @param {string} dueDate - Date string in DD-MM-YYYY format
 * @returns {string} Formatted date string for display
 */
function formatDateForOverlay(dueDate) {
  if (!dueDate || !dueDate.includes("-")) return "";

  const parts = dueDate.split("-");
  if (parts.length !== 3) return "";

  const [day, month, year] = parts;

  // Pad values to ensure correct format
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");

  const iso = `${year}-${paddedMonth}-${paddedDay}`;
  const dateObj = new Date(iso);

  if (isNaN(dateObj.getTime())) {
    console.warn("⚠️ Invalid date passed to formatter:", dueDate);
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Sets the currently dragged task element for drag and drop
 * @param {string} taskId - ID of the task being dragged
 */
function startDragging(taskId) {
  currentDraggedElement = parseInt(taskId, 10);
}

/**
 * Prevents default behavior to allow drop operations
 * @param {Event} ev - The drag event
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a task to a new status column via drag and drop
 * @param {string} newStatus - The new status to assign to the task
 */
async function moveTo(newStatus) {
  if (!currentDraggedElement && currentDraggedElement !== 0) {
    return;
  }
  const task = tasks.find((t) => Number(t.id) === currentDraggedElement);
  if (!task) {
    return;
  }
  task.status = newStatus;
  await fetch(`${BASE_URL}tasks/${currentDraggedElement}.json`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
  await loadTasksFromFirebase();
  currentDraggedElement = null;
}

/**
 * Toggles the completion status of a subtask and updates Firebase
 * @param {Element} element - The checkbox element that was clicked
 * @param {string} taskId - ID of the parent task
 * @param {number} subtaskIndex - Index of the subtask within the task
 */
async function toggleSubtaskCheckbox(element, taskId, subtaskIndex) {
  const task = tasks.find((t) => t.id == taskId);
  if (!task || !task.subTasks || !task.subTasks[subtaskIndex]) return;
  task.subTasks[subtaskIndex].done = !task.subTasks[subtaskIndex].done;
  const img = element.querySelector("img");
  img.src = `assets/icons/${
    task.subTasks[subtaskIndex].done ? "checkbox-checked" : "checkbox-empty"
  }.svg`;
  await fetch(`${BASE_URL}tasks/${taskId}.json`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
  const progressContainer = document.getElementById(
    `subtask_container_${tasks.indexOf(task)}`
  );
  if (progressContainer) {
    proofSubtasks(task, tasks.indexOf(task));
  }
}

/**
 * Formats a date from DD-MM-YYYY to YYYY-MM-DD for HTML date inputs
 * @param {string} dueDate - Date string in DD-MM-YYYY format
 * @returns {string} Date string in YYYY-MM-DD format
 */
function formatDateForInput(dueDate) {
  if (!dueDate) return "";

  const [day, month, year] = dueDate.split("-");
  return `${year}-${month}-${day}`;
}

/**
 * Saves task edits to Firebase (legacy function)
 * @param {string} taskId - ID of the task to save
 */
async function saveTaskEdits(taskId) {
  const task = tasks.find((t) => t.id == taskId);
  if (!task) return;

  const newTitle = document.getElementById("edit-title").value.trim();
  const newDetails = document.getElementById("edit-details").value.trim();
  const newDueDate = document.getElementById("edit-dueDate").value;
  const newPriority = document.getElementById("edit-priority").value;

  const [year, month, day] = newDueDate.split("-");
  const formattedDate = `${day}-${month}-${year}`;

  task.task = newTitle;
  task.description = newDetails;
  task.dueDate = formattedDate;
  task.priority = newPriority;

  await fetch(`${BASE_URL}tasks/${taskId}.json`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

  closeOverlay();
  await loadTasksFromFirebase(); // Re-render
}

/**
 * Saves an edited task to Firebase and reopens the task overlay
 * @param {string} taskId - ID of the task to save
 */
async function saveEditedTask(taskId) {
  const task = tasks.find((t) => t.id == taskId);
  const updatedTask = collectTaskData();
  updatedTask.id = taskId;
  updatedTask.status = task.status; // Preserve current status

  await fetch(`${BASE_URL}tasks/${taskId}.json`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask)
  });

  showToast("Task updated", "./assets/img/board.png");

  // Reload and re-open the updated task
  await loadTasksFromFirebase();
  const updated = tasks.find(t => t.id == taskId);
  if (updated) {
    const taskData = prepareTaskForTemplate(updated);
    const index = tasks.findIndex(t => t.id == taskId);

    const assignedUsersHTML = buildAssignedUsersHTML(updated.assignedTo);

    openTask(taskData, assignedUsersHTML, index);
  }
}


/**
 * Reindexes all tasks in Firebase with sequential IDs
 */
async function reindexTasksInFirebase() {
  const newTasks = {};

  for (let i = 0; i < tasks.length; i++) {
    const task = { ...tasks[i] };
    task.id = i;
    newTasks[i] = task;
  }

  await fetch(`${BASE_URL}tasks.json`, {
    method: "PUT",
    body: JSON.stringify(newTasks),
  });

  await loadTasksFromFirebase();
}

/**
 * Deletes a task from the board after user confirmation
 * @param {string} taskId - ID of the task to delete
 */
async function deleteTaskFromBoardPopup(taskId) {
  const confirmDelete = await showConfirmation(
    "Are you sure you want to delete this task?"
  );
  if (!confirmDelete) return;

  try {
    tasks = tasks.filter((t) => t.id != taskId);
    await reindexTasksInFirebase();
    closeOverlay();
  } catch (error) {
    showToast("Error deleting task", "./assets/icons/error.png");
    console.error("Delete error:", error);
  }
}

/**
 * Opens the edit overlay for a task
 * @param {string} taskId - ID of the task to edit
 */
function editPopupTask(taskId) {
  const task = tasks.find(t => t.id == taskId);
  if (!task) return;

  showEditOverlay(task);

  const clearBtn = document.getElementById("clear-btn");
  if (clearBtn) clearBtn.remove();

  setMinDateToday();
  
  setTimeout(() => {
  prefillEditForm(task);
}, 200);

  loadContacts().then(() => {
    preselectAssignees(task.assignedTo);
  });

  setupEditFormSubmit(taskId);
}

/**
 * Shows the edit overlay with the add task form modified for editing
 * @param {Object} task - Task object to edit
 */
function showEditOverlay(task) {
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "";
  overlay.classList.remove("d-none");
  overlay.innerHTML = getAddTaskOverlay();

  document.querySelector(".add-task-title h2").textContent = "Edit Task";
  document.querySelector(
    ".create-btn"
  ).innerHTML = `Save <img src="./assets/icons/check.png" alt="Save Icon">`;
}

/**
 * Prefills the edit form with existing task data
 * @param {Object} task - Task object containing data to prefill
 */
function prefillEditForm(task) {
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const dueInput = document.getElementById("due-date");
  const categoryInput = document.getElementById("category");
  const categoryPlaceholder = document.getElementById("selected-category-placeholder");

  // Title
  if (titleInput) {
    titleInput.value = task.task || task.title || "";
  }
  // Description
  if (descInput) {
    descInput.value = task.description || "";
  }
  // Due Date
  if (dueInput) {
    const formattedDueDate = formatDateForInput(task.dueDate);
    dueInput.value = formattedDueDate;
  } else {
    console.warn("⚠️ 'due-date' input not found in the DOM.");
  }
  // Category
  if (categoryInput && categoryPlaceholder) {
    categoryInput.value = task.category;
    categoryPlaceholder.textContent = task.category;
  }
  // Priority
  if (task.priority) {
    const priorityValue = task.priority.toLowerCase();
    const priorityInput = document.querySelector(
      `input[name="priority"][value="${priorityValue}"]`
    );
    if (priorityInput) {
      priorityInput.checked = true;
    } else {
      console.warn("⚠️ Priority input not found for value:", priorityValue);
    }
  }

  // Subtasks
  if (task.subTasks && Array.isArray(task.subTasks)) {
    const subtaskList = document.getElementById("subtask-list");
    if (subtaskList) {
      subtaskList.innerHTML = "";
      for (const sub of task.subTasks) {
        const subText = sub.task || sub;
        const li = createSubtaskElement(subText);
        subtaskList.appendChild(li);
      }
    } else {
      console.warn("⚠️ Subtask list container not found.");
    }
  }
}

/**
 * Preselects assignees in the dropdown based on task data
 * @param {Array} assignedToArray - Array of assigned contact names
 */
function preselectAssignees(assignedToArray) {
  if (!Array.isArray(assignedToArray)) return;

  assignedToArray.forEach((name) => {
    const checkbox = [
      ...document.querySelectorAll('#assignee-dropdown input[type="checkbox"]'),
    ].find((cb) => cb.value === name);
    if (checkbox) checkbox.checked = true;
  });

  updateAssigneePlaceholder();
}

/**
 * Sets up the form submit handler for editing tasks
 * @param {string} taskId - ID of the task being edited
 */
function setupEditFormSubmit(taskId) {
  const form = document.getElementById("taskForm");
  const saveBtn = document.querySelector(".create-btn");

  saveBtn.onclick = async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    await saveEditedTask(taskId);
  };
}

/**
 * Generates HTML markup for the list of subtasks displayed in the task overlay.
 * 
 * Each subtask is rendered with a clickable checkbox icon and its text,
 * allowing users to toggle completion status directly from the overlay.
 * Supports both string-based and object-based subtasks.
 *
 * @function generateSubtasksHTML
 * @param {Array<Object|string>} subtasks - An array of subtasks, each either a string or an object with `task` and `done` fields.
 * @param {string|number} taskId - The ID of the parent task, used for identifying which task to update on click.
 * @returns {string} - HTML string of the rendered subtasks list, including icons and toggle handlers.
 *
 * @example
 * const html = generateSubtasksHTML(task.subTasks, task.id);
 * document.getElementById("subtasks-list-3").innerHTML = html;
 */
function generateSubtasksHTML(subtasks = [], taskId) {
  return `
    <ul>
      ${subtasks
        .map((subtask, index) => {
          const raw = subtask.task ?? subtask ?? "";
          const text = typeof raw === "string" ? raw : "";
          const cleanText = text.replace(/^•+\s*/, "").trim();
          const done = subtask.done === true;
          const checkbox = done ? "checkbox-checked" : "checkbox-empty";

          return `
            <li class="overlay-subtask-item" onclick="toggleSubtaskCheckbox(this, '${taskId}', ${index})">
              <img src="assets/icons/${checkbox}.svg" alt="Checkbox" class="overlay-checkbox">
              <span class="${done ? 'overlay-subtask-done' : ''}">${cleanText}</span>
            </li>
          `;
        })
        .join("")}
    </ul>
  `;
}

/**
 * Shows a confirmation dialog and returns user's choice
 * @param {string} message - Message to display in the confirmation dialog
 * @returns {Promise<boolean>} Promise that resolves to true if confirmed, false if cancelled
 */
function showConfirmation(message = "Are you sure?") {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    const msg = document.getElementById("confirm-message");
    const yesBtn = document.getElementById("confirm-yes");
    const noBtn = document.getElementById("confirm-no");

    msg.textContent = message;
    modal.classList.remove("d-none");

    const cleanUp = () => {
      modal.classList.add("d-none");
      yesBtn.removeEventListener("click", onYes);
      noBtn.removeEventListener("click", onNo);
    };

    const onYes = () => {
      cleanUp();
      resolve(true);
    };
    const onNo = () => {
      cleanUp();
      resolve(false);
    };

    yesBtn.addEventListener("click", onYes);
    noBtn.addEventListener("click", onNo);
  });
}

/**
 * Closes any open overlay when the Escape key is pressed
 */
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeOverlay();
  }
});



function buildAssignedUsersHTML(assignedTo, maxVisible = 4) {
  const uniq = [...new Set(assignedTo || [])];
  const visible = uniq.slice(0, maxVisible);
  const extra = Math.max(0, uniq.length - maxVisible);

  const avatars = visible.map(name => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
    const color = getColor(initials[0]); // from add_task.js
    return `<div class="user_initials_circle" style="background-color:${color};color:white;">${initials}</div>`;
  }).join("");

  const counter = extra > 0
    ? `<div class="user_initials_circle" style="background-color:#2A3647;color:white;">+${extra}</div>`
    : "";

  return avatars + counter;
}
