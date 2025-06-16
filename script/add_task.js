const BASE_URL = "https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/";

loadContacts();

document.querySelector('.clear-btn').onclick = resetForm;

const form = document.getElementById("taskForm");
const submitBtn = document.querySelector(".create-btn");

submitBtn.onclick = function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    submitTask();
};

async function submitTask() {
    const task = collectTaskData();
    const tasks = await fetchAllTasks();
    const newId = getNextTaskId(tasks);
    task.id = newId.toString();

    saveTaskToFirebase(task, newId);
}

function collectTaskData() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("due-date").value;
    const category = document.getElementById("category").value;
    const priority = document.querySelector("input[name='priority']:checked")?.value;
    const assignee = document.getElementById("assignees").value;
    const subtasks = Array.from(document.querySelectorAll("#subtask-list li"))
                          .map(li => li.textContent);

    return {
        title,
        description,
        dueDate,
        category,
        priority: priority || null,
        assignedTo: assignee || null,
        subTasks: subtasks,
        status: "toDo",
        createdAt: new Date().toISOString()
    };
}

async function fetchAllTasks() {
    try {
        const res = await fetch(`${BASE_URL}tasks.json`);
        return await res.json() || {};
    } catch (err) {
        console.error("Fehler beim Laden der Aufgaben:", err);
        alert("Fehler beim Laden der Aufgaben.");
        return {};
    }
}

function getNextTaskId(tasks) {
    let maxId = 0;
    for (const key in tasks) {
        const task = tasks[key];
        const idNum = parseInt(task.id);
        if (!isNaN(idNum) && idNum > maxId) {
            maxId = idNum;
        }
    }
    return maxId + 1;
}

async function saveTaskToFirebase(task, id) {
    try {
        const res = await fetch(`${BASE_URL}tasks/${id}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });

        if (res.ok) {
            alert("Task erfolgreich erstellt!");
            resetForm();
        } else {
            alert("Fehler beim Speichern der Aufgabe.");
        }
    } catch (error) {
        console.error("Fehler beim Speichern der Aufgabe:", error);
        alert("Ein Fehler ist aufgetreten.");
    }
}

function resetForm() {
    document.getElementById("taskForm").reset();
    document.getElementById("subtask-list").innerHTML = "";
}

async function loadContacts() {
    try {
        const res = await fetch(`${BASE_URL}contacts.json`);
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.warn("Contacts ist kein Array.");
            return;
        }

        const select = document.getElementById("assignees");
        data.forEach((contact) => {
            if (contact && contact.name) {
                const option = document.createElement("option");
                option.value = contact.name;
                option.textContent = contact.name;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
    }
}