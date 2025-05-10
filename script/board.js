const BASE_URL = "https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = BASE_URL;

function init() {
    showCurrentBoard();
}

function showCurrentBoard() {
    renderCurrentTasks();
}

function renderCurrentTasks() {
    let contentRef = document.getElementById('inProgressContainer');

    contentRef.innerHTML = "";

    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        contentRef.innerHTML += getKanbanTemplate(taskIndex);
    }
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