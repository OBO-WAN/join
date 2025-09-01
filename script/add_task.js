let Contacts = [];

loadContacts();

/**
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
 * Collects and formats all task data from the form inputs
 * @returns {Object} Task object with all necessary properties
 */
function collectTaskData() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDateRaw = document.getElementById("due-date").value;

  // Format due date: YYYY-MM-DD -> DD-MM-YYYY
  let dueDate = "";
  if (dueDateRaw) {
    const [year, month, day] = dueDateRaw.split("-");
    dueDate = `${day}-${month}-${year}`;
  }

  const categoryValue = document.getElementById("category").value;
  const priorityRaw = document.querySelector("input[name='priority']:checked")?.value;

  // Match existing label mapping used in your app
  const categoryMap = {
    "technical-task": "Technical Task",
    "user-story": "User Story",
  };
  const category = categoryMap[categoryValue] || categoryValue;

  // Capitalize priority the same way as before ("urgent" -> "Urgent")
  const priority = priorityRaw
    ? priorityRaw.charAt(0).toUpperCase() + priorityRaw.slice(1).toLowerCase()
    : null;

  // Build assignees from checked boxes, then de-dup to prevent duplicates on the board
  const checkboxElements = document.querySelectorAll('#assignee-dropdown input[type="checkbox"]:checked');
  const assignees = Array.from(checkboxElements).map((cb) => cb.value);
  const uniqueAssignees = [...new Set(assignees)];

  // Collect subtasks, strip any leading bullets
  const subtaskItems = document.querySelectorAll("#subtask-list li");
  const subTasks = Array.from(subtaskItems).map((item) => {
    const raw = item.textContent.trim();
    return { task: raw.replace(/^•+\s*/, "") };
  });

  // Return the exact shape consumed by the board
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
 * Displays a temporary toast notification
 * @param {string} message - Message to display
 * @param {string} iconPath - Path to icon image (optional)
 */
function showToast(message, iconPath = "./assets/img/board.png") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  // Create toast element
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
        <span>${message}</span>
        <img src="${iconPath}" alt="Icon">
    `;

  container.appendChild(toast);

  // Auto-remove toast after 4 seconds
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/**
 * Saves the task to Firebase and handles post-save actions
 * @param {Object} task - Task object to save
 * @param {number} id - Task ID
 */
async function saveTaskToFirebase(task, id) {
  try {
    // Ensure assignedTo is an array
    if (!Array.isArray(task.assignedTo)) {
      task.assignedTo = Object.values(task.assignedTo || {});
    }

    // Save task to Firebase
    const res = await fetch(`${BASE_URL}tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      // Success actions
      showToast("Task added to Board", "./assets/img/board.png");
      resetForm();

      // Close overlay if exists
      if (document.getElementById("overlay")) {
        closeOverlay();
      }

      // Reload tasks if function is available
      if (typeof loadTasksFromFirebase === "function") {
        await loadTasksFromFirebase();
      }

      // Redirect to board page after delay
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
 */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.classList.add("d-none");
  }
}

/**
 * Resets the entire task form to its initial state
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
 * Initializes event handlers for the add task form
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
 * Validates all required form fields before task submission.
 * Calls individual field validation functions for each relevant input.
 * 
 * @returns {boolean} Returns true if all required fields are valid, otherwise false.
 */

function validateForm() {
  let valid = true;

  if (!validateField("title", "error-title")) valid = false;
  if (!validateField("due-date", "error-due-date")) valid = false;
  if (!validateCategory()) valid = false;

  return valid;
}

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
 * Loads contacts from Firebase and renders the assignee dropdown
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
 * Updates the assignee selection display with selected contacts
 */
function updateAssigneePlaceholder() {
  const selectedAvatars = document.getElementById("selected-assignee-avatars");
  const placeholder = document.getElementById("selected-assignees-placeholder");
  const checkboxes = document.querySelectorAll(
    '#assignee-dropdown input[type="checkbox"]'
  );

  if (!selectedAvatars || !placeholder) return;

  let selected = [];
  checkboxes.forEach((cb) => {
    const label = cb.closest(".checkbox-label");
    if (cb.checked) {
      selected.push(cb.value);
      label.classList.add("selected");
    } else {
      label.classList.remove("selected");
    }
  });

  // Reset Anzeige
  selectedAvatars.innerHTML = "";
  placeholder.textContent = "Select contacts";

  // Avatare anzeigen
  const maxVisible = 4;
  const visible = selected.slice(0, maxVisible);
  const extraCount = selected.length - maxVisible;

  visible.forEach((name) => {
    const initials = getInitials(name);
    const color = getColor(initials[0]);
    selectedAvatars.innerHTML += `
            <div class="avatar" style="background-color: ${color};">
                ${initials}
            </div>
        `;
  });

  if (extraCount > 0) {
    selectedAvatars.innerHTML += `
            <div class="avatar" style="background-color: #2a3647;">
                +${extraCount}
            </div>
        `;
  }
}

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


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  if (form) {
    initAddTaskFormEvents();
    addFieldValidationListeners();
    loadContacts();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setMinDateToday();
});
