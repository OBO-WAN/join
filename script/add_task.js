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
 * 
 * Displays a temporary toast notification
 * @param {string} message - Message to display
 * @param {string} iconPath - Path to icon image (optional)
 * Create toast element
 * Auto-remove toast after 4 seconds
 */
function showToast(message, iconPath = "./assets/img/board.png") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
        <span>${message}</span>
        <img src="${iconPath}" alt="Icon">
    `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
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
 * Closes the task creation overlay by hiding it
 * 
 */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.classList.add("d-none");
  }
}

/**
 * Resets the task form to its initial default state.
 *
 * Typically used after submitting or cancelling the task form.
 */
function resetForm() {
  document.getElementById("taskForm").reset();
  document.getElementById("subtask-list").innerHTML = "";

  const checkboxes = document.querySelectorAll('#assignee-dropdown input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  updateAssigneePlaceholder();

  const inputs = document.querySelectorAll("#taskForm input, #taskForm textarea");
  inputs.forEach(input => {
      input.classList.remove("input-error");
      input.setCustomValidity?.("");
  });

  const errorMessages = document.querySelectorAll(".field-error-message");
  errorMessages.forEach(error => error.classList.remove("active"));

  const categoryInput = document.getElementById("category");
  const categoryPlaceholder = document.getElementById("selected-category-placeholder");
  const categoryHeader = document.querySelector(".category-select-header");
  const categoryError = document.getElementById("error-category");

  if (categoryInput && categoryPlaceholder && categoryHeader && categoryError) {
      categoryInput.value = "";
      categoryPlaceholder.textContent = "Select category";
      categoryHeader.classList.remove("input-error");
      categoryError.classList.remove("active");
  }
}

/**
 * Initializes event listeners for the "Add Task" form.
 *
 * Typically called on page load to activate form interactivity.
 */
function initAddTaskFormEvents() {
  const clearBtn = document.querySelector(".clear-btn");
  if (clearBtn) {
    clearBtn.onclick = resetForm;
  }

  const form = document.getElementById("taskForm");
  const submitBtn = document.querySelector(".create-btn");

  if (submitBtn && form) {
    submitBtn.onclick = function (event) {
      event.preventDefault();

      if (!validateForm()) {
        return;
      }

      submitTask();
    };
  }
}

/**
 * Validates the required fields of the task form.
 *
 * Each validation step is delegated to helper functions (e.g., `validateField`, `validateCategory`).
 * 
 * @returns {boolean} `true` if all validations pass, otherwise `false`.
 */
function validateForm() {
  let valid = true;

  if (!validateField("title", "error-title")) valid = false;
  if (!validateField("due-date", "error-due-date")) valid = false;
  if (!validateCategory()) valid = false;

  return valid;
}

/**
 * Validates a single input field by checking if it has a non-empty value.
 *
 * If the field is empty: (`input-error`) 
 *
 * If the field is valid: Any error styles and messages are removed.
 *
 * @param {string} inputId - The ID of the input or textarea element to validate.
 * @param {string} errorId - The ID of the associated error message element.
 * @returns {boolean} `true` if the field has a valid (non-empty) value, otherwise `false`.
 */
function validateField(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (!input.value.trim()) {
    input.classList.add("input-error");
    error.classList.add("active");
    return false;
  } else {
    input.classList.remove("input-error");
    error.classList.remove("active");
    return true;
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
 * Attaches real-time validation listeners to form fields.
 *
 * This function adds `input` event listeners to specific fields (e.g., title and due date)
 * to remove validation error styles and messages as soon as the user corrects the input.
 * 
 * Typically called on form initialization to enhance user feedback during input.
 */
function addFieldValidationListeners() {
  const title = document.getElementById("title");
  const titleError = document.getElementById("error-title");

  const dueDate = document.getElementById("due-date");
  const dueDateError = document.getElementById("error-due-date");

  title.addEventListener("input", () => {
    if (title.value.trim()) {
      title.classList.remove("input-error");
      titleError.classList.remove("active");
    }
  });

  dueDate.addEventListener("input", () => {
    if (dueDate.value.trim()) {
      dueDate.classList.remove("input-error");
      dueDateError.classList.remove("active");
    }
  });
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

/**
 * Adds delete functionality to a subtask item
 * @param {HTMLElement} li - The subtask list item element
 */
function addSubtaskDeleteHandler(li) {
  const deleteButton = li.querySelector(".delete-subtask");
  deleteButton.addEventListener("click", () => li.remove());
}

/**
 * Enables inline editing mode for a subtask
 * @param {HTMLElement} li - The subtask list item element
 */
function enterEditMode(li) {
  const textSpan = li.querySelector(".subtask-text");
  const inputField = li.querySelector(".subtask-edit-input");

  inputField.value = textSpan.textContent.replace(/^•\s*/, "");
  textSpan.style.display = "none";
  inputField.classList.remove("d-none");
  inputField.focus();

  const save = () => {
    const newValue = inputField.value.trim();
    if (newValue) {
      textSpan.textContent = `• ${newValue}`;
      inputField.classList.add("d-none");
      textSpan.style.display = "inline";
    }
    removeEditListeners();
  };

  const onEnter = (e) => e.key === "Enter" && save();
  const onBlur = () => save();

  function removeEditListeners() {
    inputField.removeEventListener("keydown", onEnter);
    inputField.removeEventListener("blur", onBlur);
  }

  inputField.addEventListener("keydown", onEnter);
  inputField.addEventListener("blur", onBlur);
}

/**
 * Renders the assignee dropdown with contact checkboxes
 */
function renderAssigneeDropdown() {
  const container = document.getElementById("assignee-dropdown");
  if (!container) return;

  container.innerHTML = "";

  Contacts.forEach((contact, index) => {
    const initials = getInitials(contact.name);
    const color = getColor(initials[0]);
    const checkboxId = `assignee_${index}`;

    const html = `
            <label class="checkbox-label" for="${checkboxId}">
                <div class="assignee-info">
                    <div class="user-initials" style="background-color: ${color};">${initials}</div>
                    <span>${contact.name}</span>
                </div>
                <input type="checkbox" id="${checkboxId}" value="${contact.name}" onchange="updateAssigneePlaceholder()">
            </label>
        `;
    container.insertAdjacentHTML("beforeend", html);
  });
}

/**
 * Updates the visual placeholder for selected assignees in the task form.
 *
 *
 * Typically called when checkboxes in the "Assigned to" dropdown are toggled.
 */
function updateAssigneePlaceholder() {
  const avatars = document.getElementById("selected-assignee-avatars");
  const placeholder = document.getElementById("selected-assignees-placeholder");
  const checkboxes = document.querySelectorAll('#assignee-dropdown input[type="checkbox"]');
  if (!avatars || !placeholder) return;

  const selected = Array.from(checkboxes).filter(cb => {
    const label = cb.closest(".checkbox-label");
    label?.classList.toggle("selected", cb.checked);
    return cb.checked;
  }).map(cb => cb.value);

  avatars.innerHTML = "";
  placeholder.textContent = "Select contacts";

  selected.slice(0, 4).forEach(name => {
    const initials = getInitials(name);
    const color = getColor(initials[0]);
    avatars.innerHTML += `
      <div class="avatar" style="background-color: ${color};">${initials}</div>
    `;
  });

  if (selected.length > 4) {
    avatars.innerHTML += `
      <div class="avatar" style="background-color: #2a3647;">+${selected.length - 4}</div>
    `;
  }
}

/**
 * Closes custom dropdowns when clicking outside of them.
 *
 * Applies to: assignee multiselect dropdown & category selection dropdown
 *
 * This helps ensure that dropdowns do not remain open unintentionally when interacting elsewhere on the page.
 */
document.addEventListener("click", function (event) {
  const dropdowns = [
    {
      dropdown: document.getElementById("assignee-dropdown"),
      header: document.querySelector(".multiselect-header"),
    },
    {
      dropdown: document.getElementById("category-dropdown"),
      header: document.querySelector(".category-select-header"),
    },
  ];

  dropdowns.forEach(({ dropdown, header }) => {
    if (!dropdown || !header) return;
    if (!dropdown.contains(event.target) && !header.contains(event.target)) {
      dropdown.classList.add("d-none");
    }
  });
});

/**
 * Toggles the visibility of the assignee dropdown
 */
function toggleAssigneeDropdown() {
  document.getElementById("category-dropdown").classList.add("d-none");
  const assigneeDropdown = document.getElementById("assignee-dropdown");
  assigneeDropdown.classList.toggle("d-none");
}

/**
 * Toggles the visibility of the category dropdown
 */
function toggleCategoryDropdown() {
  document.getElementById("assignee-dropdown").classList.add("d-none");
  const categoryDropdown = document.getElementById("category-dropdown");
  categoryDropdown.classList.toggle("d-none");
}

/**
 * Selects a category and updates the display
 * @param {string} value - The category value to select
 */
function selectCategory(value) {
  const label = {
    "technical-task": "Technical Task",
    "user-story": "User Story",
  };

  document.getElementById("category").value = value;
  document.getElementById("selected-category-placeholder").textContent =
    label[value] || "Select category";
  document.getElementById("category-dropdown").classList.add("d-none");
}

/**
 * Handles Enter key press in subtask input to add subtask
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleSubtaskKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtask();
  }
}

/**
 * Sets the minimum date for the due date input to today's date
 */
function setMinDateToday() {
  const dateInput = document.getElementById("due-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    dateInput.min = today;
  }
}

/**
 * Initializes the Add Task form once the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");

  if (form) {
    initAddTaskFormEvents();
    addFieldValidationListeners();
    loadContacts();
    setMinDateToday();
  }
});