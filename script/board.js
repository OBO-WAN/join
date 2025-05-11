const BASE_URL = "https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = BASE_URL;

let users = [];

async function loadTasksFromFirebase() {
    const response = await fetch(`${BASE_URL}tasks.json`);
    const data = await response.json();

    if (data) {
        tasks = Object.values(data); // aus Objekt ein Array machen
    } else {
        tasks = []; // Fallback, falls nichts da ist
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

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskData = prepareTaskForTemplate(task);

          const assignedUsersHTML = taskData.assignedTo.map(user => `
            <div class="user_initials_circle" style="background-color: ${user.color}; color: white;"}>${user.initials}</div>
        `).join('');

        const container = statusContainers[task.status];
        if (container) {

            container.innerHTML += getKanbanTemplate(taskData, assignedUsersHTML);
        }
    }
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


function prepareTaskForTemplate(task) {

    const assignedTo = (task.assignedTo || []).map(name => {

        const user = users.find(u => u.name === name);
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        const color = user?.color || '#2A3647'; // Fallback-Farbe
        return { initials, color };
    });

    return {
        category: task.category || 'General',
        categoryClass: (task.category || 'general').toLowerCase().replace(/\s/g, '_'),
        title: task.task || 'Untitled',
        details: task.description || '',
        assignedTo,
        priority: (task.priority || 'low').toLowerCase()
    };
}


function showCurrentBoard() {
    renderCurrentTasks();
}

async function loadTasksFromFirebase() {
    const response = await fetch(`${BASE_URL}tasks.json`);
    const data = await response.json();
    tasks = Object.values(data); // falls tasks als Objekt gespeichert sind

    console.log(tasks);
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