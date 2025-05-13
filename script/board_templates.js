function getKanbanTemplate(task, assignedUsersHTML) {
    return `                <div class="task_container">
                    <div class="task">
                        <div class="task_category ${task.categoryClass}">${task.category}</div>

                        <div class="task_information">
                            <p class="task_title" id="task_title">${task.title}</p>
                            <p class="task_details" id="task_details">${task.details}</p>
                        </div>

                        <div class="user_priority_container">
                            <div class="user_initials">${assignedUsersHTML}</div>
                            <img src="./assets/icons/priority/priority_${task.priority}.png" class="priority_medium" id="priority">
                        </div>

                    </div>
                </div>

`
}