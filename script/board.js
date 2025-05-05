let tasks = [];

function init() {
    showCurrentBoard();
}

function showCurrentBoard() {
    renderCurrentTasks();
}

function renderCurrentTasks() {
    let contentRef = document.getElementById('');

    contentRef.innerHTML = "";

    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        contentRef.innerHTML += getKanbanTemplate(taskIndex);
    }
}