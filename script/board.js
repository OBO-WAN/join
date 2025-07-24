let tasks = [];

let users = [];

let currentDraggedElement = null;

async function loadTasksFromFirebase() {
    const response = await fetch(`${BASE_URL}tasks.json`);
    const data = await response.json();

    tasks = [];
    for (const [id, task] of Object.entries(data || {})) {
        if(!task || typeof task!== 'object') continue;
        task.id = id;
        tasks.push(task);
    }

    renderCurrentTasks();
}

async function init() {
    await loadUsersFromFirebase();
    await loadTasksFromFirebase();

    showCurrentBoard();
}

function renderCurrentTasks() {

    const statusContainers = proofStatus();

    const statusCounts = proofStatusCounts();

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskData = prepareTaskForTemplate(task);

          const assignedUsersHTML = taskData.assignedTo.map(user => `
            <div class="user_initials_circle" style="background-color: ${user.color}; color: white;">${user.initials}</div>
        `).join('');

        const container = statusContainers[task.status];
        if (container) {

            container.innerHTML += getKanbanTemplate(taskData, assignedUsersHTML, i);
            statusCounts[task.status]++;
        }

        setTimeout(() => {
            proofSubtasks(task, i);
        }, 0);

    }
    
    showStatusPlaceholder(statusCounts, statusContainers);
     setTimeout(() => {
        attachTaskEventHandlers();
     }, 0);

     attachTaskEventHandlers();

}

function proofStatus() {
    const statusContainers = {
        toDo: document.getElementById('toDoContainer'),
        inProgress: document.getElementById('inProgressContainer'),
        awaitFeedback: document.getElementById('awaitFeedbackContainer'),
        done: document.getElementById('doneContainer')
    };

    Object.values(statusContainers).forEach(container => container.innerHTML = '');
    return statusContainers;
}

function proofStatusCounts() {
        const statusCounts = {
        toDo: 0,
        inProgress: 0,
        awaitFeedback: 0,
        done: 0
    };

    return statusCounts;
}

function proofSubtasks(task, index) {
    if (!task.subTasks || task.subTasks.length === 0) return;

    const subtaskContainer = document.getElementById(`subtask_container_${index}`);

    if (subtaskContainer) {
        // Fortschritt berechnen (hier: 0 erledigt, kann angepasst werden)
        const total = task.subTasks.length;
        const done = task.subTasks.filter(t => t.done === true).length;
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

function showStatusPlaceholder(statusCounts, statusContainers) {
    for (const [status, count] of Object.entries(statusCounts)) {
        if (count === 0) {
            const container = statusContainers[status];
            container.innerHTML = `<div class="no_task_placeholder">No tasks</div>`;
        }
    }
}

function showSubtasks() {
    container.innerHTML = `
                        <div class="progress_container">
                            <div class="progress-bar" style="width: 50%;"></div>
                            <p class="subtasks_progress">1/2 Subtasks</p>
                        </div>
`
}

function attachTaskEventHandlers() {
 const containers = document.querySelectorAll('.task_container');

    containers.forEach(container => {
        const id = container.dataset.taskId;
        const index = parseInt(container.dataset.taskIndex, 10);
        const task = tasks.find(t => t.id == id);

        if (!task) return;

        const taskData = prepareTaskForTemplate(task);
        const assignedUsersHTML = taskData.assignedTo.map(user => `
            <div class="user_initials_circle" style="background-color: ${user.color}; color: white;">
                ${user.initials}
            </div>
        `).join('');

        // das Overlay wird per JS geöffnet
        container.addEventListener('click', () => {
            openTask(taskData, assignedUsersHTML, index);
        });

        container.addEventListener('dragstart', () => {
            startDragging(task.id);
        });
    });}

function prepareTaskForTemplate(task) {

    const assignedTo = (task.assignedTo || []).map(name => {

        const user = Object.values(users).find(u => u.name === name);
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        const color = user?.color || '#2A3647'; // Fallback-Farbe
        return { initials, color };
    });

    return {
        id: task.id,
        category: task.category || 'General',
        categoryClass: (task.category || 'general').toLowerCase().replace(/\s/g, '_'),
        title: task.title || task.task || 'Untitled',
        details: task.description || '',
        assignedTo,
        priority: (task.priority || 'low').toLowerCase(),
        subTasks: task.subTasks || []
    };
}

function showCurrentBoard() {
    renderCurrentTasks();
}

async function loadUsersFromFirebase() {
    const response = await fetch(`${BASE_URL}user.json`);
    const data = await response.json();
    users = data || [];
}

window.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementsByClassName('search_input')[0];
    var taskElements = document.getElementsByClassName('task');

    searchInput.addEventListener('input', function () {
        var searchTerm = searchInput.value.toLowerCase();

        for (var i = 0; i < taskElements.length; i++) {
            var task = taskElements[i];
            var titleElements = task.getElementsByClassName('task_title');
            var detailElements = task.getElementsByClassName('task_details');

            var title = titleElements.length ? titleElements[0].textContent.toLowerCase() : '';
            var details = detailElements.length ? detailElements[0].textContent.toLowerCase() : '';

            var match = title.includes(searchTerm) || details.includes(searchTerm);
            task.style.display = match ? 'block' : 'none';
        }
    });
});

function addNewTask() {
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = "";
    overlay.innerHTML = getAddTaskOverlay();
    overlay.classList.remove('d-none');

    setMinDateToday();
    loadContacts()
    initAddTaskFormEvents();
}

function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('d-none');
}

function openTask(task, assignedUsersHTML, index) {
  document.body.classList.add('overlay-active');

  const formattedDate = task.dueDate || "1.1.2011";
  const priority = (task.priority || 'low').toLowerCase();
  const subtasksHTML = generateSubtasksHTML(task.subTasks, task.id);

  const overlay = document.getElementById('overlay');
  overlay.innerHTML = getTaskSheetOverlay(task, assignedUsersHTML, index, formattedDate, priority, subtasksHTML);
  overlay.classList.remove('d-none');
}

function startDragging(taskId) {
    currentDraggedElement = parseInt(taskId, 10);
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(newStatus) {
    if (!currentDraggedElement && currentDraggedElement !== 0) {
        return;
    }
    const task = tasks.find(t => Number(t.id) === currentDraggedElement);
    if (!task) {
        return;
    }
    task.status = newStatus;
    await fetch(`${BASE_URL}tasks/${currentDraggedElement}.json`, {
        method: 'PUT',
        body: JSON.stringify(task)
    });
    await loadTasksFromFirebase();
    currentDraggedElement = null;
}

async function toggleSubtaskCheckbox(element, taskId, subtaskIndex) {
    const task = tasks.find(t => t.id == taskId);
    if (!task || !task.subTasks || !task.subTasks[subtaskIndex]) return;
    task.subTasks[subtaskIndex].done = !task.subTasks[subtaskIndex].done;
    const img = element.querySelector('img');
    img.src = `assets/icons/${task.subTasks[subtaskIndex].done ? 'checkbox-checked' : 'checkbox-empty'}.svg`;
    await fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify(task)
    });
    const progressContainer = document.getElementById(`subtask_container_${tasks.indexOf(task)}`);
    if (progressContainer) {
        proofSubtasks(task, tasks.indexOf(task));
    }
}

function formatDateForInput(dueDate) {
    if (!dueDate) return '';

    const [day, month, year] = dueDate.split('-');
    return `${year}-${month}-${day}`;
}

async function saveTaskEdits(taskId) {
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;

    const newTitle = document.getElementById('edit-title').value.trim();
    const newDetails = document.getElementById('edit-details').value.trim();
    const newDueDate = document.getElementById('edit-dueDate').value;
    const newPriority = document.getElementById('edit-priority').value;

    const [year, month, day] = newDueDate.split('-');
    const formattedDate = `${day}-${month}-${year}`;

    task.task = newTitle;
    task.description = newDetails;
    task.dueDate = formattedDate;
    task.priority = newPriority;

    await fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify(task)
    });

    closeOverlay();
    await loadTasksFromFirebase(); // Re-render
}

async function saveEditedTask(taskId) {
  const updatedTask = collectTaskData();
  updatedTask.id = taskId;

  await fetch(`${BASE_URL}tasks/${taskId}.json`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask)
  });

  showToast("Task updated", "./assets/img/board.png");
  closeOverlay();
  await loadTasksFromFirebase();
}

async function reindexTasksInFirebase() {
    const newTasks = {};

    for (let i = 0; i < tasks.length; i++) {
        const task = { ...tasks[i] };
        task.id = i;
        newTasks[i] = task;
    }

    await fetch(`${BASE_URL}tasks.json`, {
        method: 'PUT',
        body: JSON.stringify(newTasks)
    });

    await loadTasksFromFirebase();
}

async function deleteTaskFromBoardPopup(taskId) {
  const confirmDelete = await showConfirmation("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    tasks = tasks.filter(t => t.id != taskId);
    await reindexTasksInFirebase();
    closeOverlay();
  } catch (error) {
    showToast("Error deleting task", "./assets/icons/error.png");
    console.error("Delete error:", error);
  }
}

function editPopupTask(taskId) {
  const task = tasks.find(t => t.id == taskId);
  if (!task) return;

  showEditOverlay(task);

  const clearBtn = document.getElementById("clear-btn");
  if (clearBtn) clearBtn.remove();

  prefillEditForm(task);
  setMinDateToday();
  loadContacts().then(() => preselectAssignees(task.assignedTo));
  setupEditFormSubmit(taskId);
}

function showEditOverlay(task) {
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  overlay.classList.remove('d-none');
  overlay.innerHTML = getAddTaskOverlay();

  document.querySelector('.add-task-title h2').textContent = "Edit Task";
  document.querySelector(".create-btn").innerHTML = `Save <img src="./assets/icons/check.png" alt="Save Icon">`;
}

function prefillEditForm(task) {
  document.getElementById("title").value = task.task || task.title || "";
  document.getElementById("description").value = task.description || "";
  document.getElementById("due-date").value = formatDateForInput(task.dueDate);
  document.getElementById("category").value = task.category;
  document.getElementById("selected-category-placeholder").textContent = task.category;

  if (task.priority) {
    const priorityInput = document.querySelector(`input[name="priority"][value="${task.priority.toLowerCase()}"]`);
    if (priorityInput) priorityInput.checked = true;
  }

  if (task.subTasks && Array.isArray(task.subTasks)) {
    const subtaskList = document.getElementById("subtask-list");
    subtaskList.innerHTML = "";
    for (const sub of task.subTasks) {
      const li = createSubtaskElement(sub.task || sub);
      subtaskList.appendChild(li);
    }
  }
}

function preselectAssignees(assignedToArray) {
  if (!Array.isArray(assignedToArray)) return;

  assignedToArray.forEach(name => {
    const checkbox = [...document.querySelectorAll('#assignee-dropdown input[type="checkbox"]')]
      .find(cb => cb.value === name);
    if (checkbox) checkbox.checked = true;
  });

  updateAssigneePlaceholder();
}

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

function generateSubtasksHTML(subTasks = [], taskId) {
  return subTasks.map((subtask, i) => `
    <div class="subtasks-elements-container" onclick="toggleSubtaskCheckbox(this, '${taskId}', ${i})">
      <img class="subtask-checkbox-img" src="assets/icons/${subtask.done ? 'checkbox-checked' : 'checkbox-empty'}.svg" alt="Checkbox">
      <span>${subtask.task}</span>
    </div>
  `).join("");
}

function showConfirmation(message = "Are you sure?") {
  return new Promise(resolve => {
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

    const onYes = () => { cleanUp(); resolve(true); };
    const onNo = () => { cleanUp(); resolve(false); };

    yesBtn.addEventListener("click", onYes);
    noBtn.addEventListener("click", onNo);
  });
}
