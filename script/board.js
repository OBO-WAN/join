const BASE_URL = "https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = BASE_URL;

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
    loadTasksFromFirebase();
    showCurrentBoard();
}

function renderCurrentTasks() {
    const container = document.getElementById('inProgressContainer');
    container.innerHTML = ''; // Leeren vor dem Rendern

 for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskHTML = prepareTaskForTemplate(task);
        let assignedUsersHTML = taskHTML.assignedTo.map(user => `<div class="user_initials_circle">${user.initials}</div>`).join('');
        container.innerHTML += getKanbanTemplate(taskHTML, assignedUsersHTML);
    }
}

function prepareTaskForTemplate(task) {
    return {
        category: task.category || 'General',
        categoryClass: (task.category || 'general').toLowerCase().replace(/\s/g, '_'),
        title: task.task || 'Untitled',
        details: task.description || '',
        assignedTo: task.assignedTo || [],
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