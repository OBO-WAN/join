const BASE_URL = "https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/";

let Contacts = [];

loadContacts();

/**
 * 
 * Submits a new task by collecting form data, generating an ID, and saving to Firebase
 */
async function submitTask() {
  const task = collectTaskData();
  const tasks = await fetchAllTasks();
  const newId = getNextTaskId(tasks);
  task.id = newId.toString();

  saveTaskToFirebase(task, newId);
}

/**
 * Collects and formats all task-related input data from the task form.
 *
 * @returns {Object} The compiled task data object, ready to be saved or submitted.
 * @returns {string} return.title - The task title.
 * @returns {string} return.description - The task description.
 * @returns {string} return.dueDate - The formatted due date (DD-MM-YYYY).
 * @returns {string} return.category - The mapped category label.
 * @returns {string|null} return.priority - The capitalized priority level, or null if none selected.
 * @returns {string[]} return.assignedTo - A unique array of selected contact names.
 * @returns {{task: string}[]} return.subTasks - A list of subtasks, each as an object with a task string.
 * @returns {string} return.status - Default task status (e.g., "toDo").
 */
function collectTaskData() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDateRaw = document.getElementById("due-date").value;

  let dueDate = "";
  if (dueDateRaw) {
    const [year, month, day] = dueDateRaw.split("-");
    dueDate = `${day}-${month}-${year}`;
  }

  const categoryValue = document.getElementById("category").value;
  const priorityRaw = document.querySelector("input[name='priority']:checked")?.value;

  const categoryMap = {
    "technical-task": "Technical Task",
    "user-story": "User Story",
  };
  const category = categoryMap[categoryValue] || categoryValue;

  const priority = priorityRaw
    ? priorityRaw.charAt(0).toUpperCase() + priorityRaw.slice(1).toLowerCase()
    : null;

  const checkboxElements = document.querySelectorAll('#assignee-dropdown input[type="checkbox"]:checked');
  const assignees = Array.from(checkboxElements).map((cb) => cb.value);
  const uniqueAssignees = [...new Set(assignees)];

  const subtaskItems = document.querySelectorAll("#subtask-list li");
  const subTasks = Array.from(subtaskItems).map((item) => {
    const raw = item.textContent.trim();
    return { task: raw.replace(/^•+\s*/, "") };
  });

  return {
    title,
    description,
    dueDate,
    category,
    priority,
    assignedTo: uniqueAssignees,
    subTasks,
    status: "toDo",
  };
}

/**
 * 
 * Fetches all existing tasks from Firebase
 * @returns {Promise<Object>} Object containing all tasks or empty object on error
 */
async function fetchAllTasks() {
  try {
    const res = await fetch(`${BASE_URL}tasks.json`);
    return (await res.json()) || {};
  } catch (err) {
    console.warn("⚠️ Fehler beim Laden der Aufgaben:", err);
    return {};
  }
}

/**
 * 
 * Determines the next available task ID by finding the maximum existing ID
 * @param {Object} tasks - Object containing all existing tasks
 * @returns {number} Next available task ID
 */
function getNextTaskId(tasks) {
  let maxId = 0;
  for (const key in tasks) {
    const task = tasks[key];
    if (!task || typeof task !== "object") continue;

    const idNum = parseInt(task.id);
    if (!isNaN(idNum) && idNum > maxId) {
      maxId = idNum;
    }
  }
  return maxId + 1;
}

/**
 * Saves a task object to Firebase under the given task ID.
 *
 * @async
 * @function
 * @param {Object} task - The task object to be saved.
 * @param {string} id - The unique ID under which the task will be stored in Firebase.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @throws {Error} Logs a warning if the request fails or another error occurs during execution.
 */
async function saveTaskToFirebase(task, id) {
  try {
    if (!Array.isArray(task.assignedTo)) {
      task.assignedTo = Object.values(task.assignedTo || {});
    }

    const res = await fetch(`${BASE_URL}tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      showToast("Task added to Board", "./assets/img/board.png");
      resetForm();

      if (document.getElementById("overlay")) {
        closeOverlay();
      }

      if (typeof loadTasksFromFirebase === "function") {
        await loadTasksFromFirebase();
      }

      setTimeout(() => {
        window.location.href = "board.html";
      }, 1000);
    }
  } catch (error) {
    console.warn("⚠️ Fehler beim Speichern der Aufgabe:", error);
  }
}



/**
 * Special validation function for the custom category select component.
 * Checks if a category has been selected and handles error styling.
 * 
 * @returns {boolean} True if a category is selected, false otherwise.
 */

function validateCategory() {
  const category = document.getElementById("category");
  const error = document.getElementById("error-category");
  const header = document.querySelector(".category-select-header");

  if (!category.value.trim()) {
    header.classList.add("input-error");
    error.classList.add("active");
    return false;
  } else {
    header.classList.remove("input-error");
    error.classList.remove("active");
    return true;
  }
}


/**
 * Loads the contact list from Firebase and updates the global `Contacts` array.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when contacts are successfully loaded and rendered.
 *
 * @throws {Error} Logs a warning if the fetch operation fails or if the returned data is not an array.
 */
async function loadContacts() {
  try {
    const res = await fetch(`${BASE_URL}contacts.json`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.warn("⚠️ Contacts ist kein Array.");
      return;
    }

    Contacts = data;
    renderAssigneeDropdown();
  } catch (error) {
    console.warn("⚠️ Fehler beim Laden der Kontakte:", error);
  }
}

/**
 * Extracts initials from a contact name
 * @param {string} name - The contact's full name
 * @returns {string} Uppercase initials
 */
function getInitials(name) {
  return name
    .trim()
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Returns a color from a predefined palette based on the first letter
 * @param {string} letter - The first letter of initials
 * @returns {string} Hex color code
 */
function getColor(letter) {
  const colorsArray = [
    "#FF6B6B",
    "#FF8C42",
    "#FFA500",
    "#FFD700",
    "#FFE600",
    "#B4FF00",
    "#4CAF50",
    "#00C853",
    "#00E5FF",
    "#00B8D4",
    "#1DE9B6",
    "#00CFAE",
    "#00BCD4",
    "#40C4FF",
    "#2196F3",
    "#3D5AFE",
    "#536DFE",
    "#7C4DFF",
    "#AB47BC",
    "#E040FB",
    "#FF4081",
    "#F50057",
    "#EC407A",
    "#FF1744",
    "#FF5252",
    "#D500F9",
    "#9C27B0",
  ];
  const index = (letter.toUpperCase().charCodeAt(0) - 65) % colorsArray.length;
  return colorsArray[index];
}

/**
 * Adds a new subtask to the list from the input field
 */
function addSubtask() {
  const input = document.getElementById("subtask");
  const value = input.value.trim();
  if (!value) return;

  const li = createSubtaskElement(value);
  document.getElementById("subtask-list").appendChild(li);
  input.value = "";
}

/**
 * Creates a subtask list element with edit and delete functionality
 * @param {string} value - The subtask text
 * @returns {HTMLElement} List item element for the subtask
 */
function createSubtaskElement(value) {
  const li = document.createElement("li");
  li.classList.add("subtask-item");

  li.innerHTML = `
        <span class="subtask-circle"></span>
        <span class="subtask-text">• ${value}</span>
        <input class="subtask-edit-input d-none" type="text" value="${value}">
        <div class="subtask-actions">
            <img src="./assets/icons/edit.svg" class="edit-subtask" title="Edit">
            <img src="./assets/icons/delete_icon.svg" class="delete-subtask" title="Delete">
        </div>
    `;

  addSubtaskEditHandler(li);
  addSubtaskDeleteHandler(li);
  li.addEventListener("dblclick", () => enterEditMode(li));
  return li;
}

/**
 * Adds edit functionality to a subtask item
 * @param {HTMLElement} li - The subtask list item element
 */
function addSubtaskEditHandler(li) {
  const editButton = li.querySelector(".edit-subtask");
  editButton.addEventListener("click", () => enterEditMode(li));
}