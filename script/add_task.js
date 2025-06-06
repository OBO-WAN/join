const BASE_URL = "https://joinstorage-ef266-default-rtdb.europe-west1.firebasedatabase.app/"; 

loadContacts();

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

document.querySelector('.clear-btn').onclick = () => {
    document.getElementById('taskForm').reset();
    document.getElementById('subtask-list').innerHTML = '';
};

async function loadContacts() {
    try {
        const res = await fetch(`${BASE_URL}contacts.json`);
        const data = await res.json();

        console.log("Raw contacts response:", data);

        if (!Array.isArray(data)) {
            console.warn("Contacts is not an array.");
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
        console.error("Error loading contacts:", error);
    }
}

async function submitTask() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("due-date").value;
    const category = document.getElementById("category").value;
    const priority = document.querySelector("input[name='priority']:checked")?.value;
    const assignee = document.getElementById("assignees").value;

    const subtasks = Array.from(document.querySelectorAll("#subtask-list li")).map(li => li.textContent);

    const task = {
        title,
        description,
        dueDate,
        category,
        priority: priority || null,
        assignedTo: assignee || null,
        subtasks,
        status: "todo",
        createdAt: new Date().toISOString()
    };

    try {
        const res = await fetch(`${BASE_URL}task.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });

        if (res.ok) {
            alert("Task created successfully!");
            document.getElementById("taskForm").reset();
            document.getElementById("subtask-list").innerHTML = "";
        } else {
            alert("Failed to create task.");
        }
    } catch (error) {
        console.error("Error saving task:", error);
        alert("An error occurred while saving the task.");
    }
}