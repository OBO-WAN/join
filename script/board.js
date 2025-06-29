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
    console.log('Rendering', tasks.length, 'tasks');

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

    loadContacts()
    initAddTaskFormEvents();
}

function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('d-none');

}

function openTask(task, assignedUsersHTML, index) {
    document.body.classList.add('overlay-active'); // hides <header> as well
    console.log('openTask wurde aufgerufen');
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = "";

    overlay.innerHTML = getTaskSheetOverlay(task, assignedUsersHTML, index);

    overlay.classList.remove('d-none');
}

function startDragging(taskId) {
    currentDraggedElement = parseInt(taskId, 10);
    console.log('startDragging - taskId:', taskId, 'Type:', typeof taskId);
    console.log('currentDraggedElement:', currentDraggedElement, 'Type:', typeof currentDraggedElement);
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(newStatus) {

    if (!currentDraggedElement && currentDraggedElement !== 0) {
        console.log('No currentDraggedElement set, exiting.');
        return;
    }

    const task = tasks.find(t => Number(t.id) === currentDraggedElement);

    if (!task) {
        console.log('Task not found, exiting.');
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

//Overlay

async function toggleSubtaskCheckbox(element, taskId, subtaskIndex) {
    const task = tasks.find(t => t.id == taskId);
    if (!task || !task.subTasks || !task.subTasks[subtaskIndex]) return;

    // Toggle "checked" Zustand
    task.subTasks[subtaskIndex].done = !task.subTasks[subtaskIndex].done;

    // Update image
    const img = element.querySelector('img');
    img.src = `assets/icons/${task.subTasks[subtaskIndex].done ? 'checkbox-checked' : 'checkbox-empty'}.svg`;

    // Save updated task to Firebase
    await fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify(task)
    });

    // Optional: update progress bar without reloading the entire board
    const progressContainer = document.getElementById(`subtask_container_${tasks.indexOf(task)}`);
    if (progressContainer) {
        proofSubtasks(task, tasks.indexOf(task));
    }
}

// Edit Overlay (in Progress)

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
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
        tasks = tasks.filter(t => t.id != taskId);

        await reindexTasksInFirebase();

        closeOverlay();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("There was an error deleting the task.");
    }
}

