function getKanbanTemplate(task, assignedUsersHTML, index) {
    return `                <div class="task_container hover" draggable="true" ondragstart="startDragging('${task.id}')">
                    <div class="task">
                        <div class="task_category ${task.categoryClass}">${task.category}</div>

                        <div class="task_information">
                            <p class="task_title" id="task_title">${task.title}</p>
                            <p class="task_details" id="task_details">${task.details}</p>
                        </div>

                        <div id="subtask_container_${index}" class="subtask_container"></div>

                        <div class="user_priority_container">
                            <div class="user_initials">${assignedUsersHTML}</div>
                            <img src="./assets/icons/priority/priority_${task.priority}.png" class="priority_medium" id="priority">
                        </div>

                    </div>
                </div>

`
}

function getAddTaskOverlay() {
    return `
            <div class="overlay-content">

        <div class="add-task-container add-task-container-overlay">

        <div class="overlay_headline">    
            <h2>Add Task</h2>

            <button onclick="closeOverlay()" class="close_button hover">X</button>
        </div>

        <form id="taskForm" class="form-grid">
            
            <div class="form-left">
                <label for="title">Title <span class="required-marker">*</span></label>
                <input type="text" class="hover" id="title" name="title" placeholder="Enter a title" required>
    
                <label for="description">Description</label>
                <textarea id="description" class="hover" name="description" rows="4" placeholder="Enter a Description"></textarea>
    
                <label for="due-date">Due Date <span class="required-marker">*</span></label>
                <input type="date" id="due-date" class="hover" name="due-date" required>
            </div>
    
            <div class="form-divider"></div>
    
            <div class="form-right">
                <label>Priority</label>
                <div class="priority-options">
                    <input type="radio" id="priority-urgent" name="priority" value="urgent">
                    <label for="priority-urgent" class="priority-button urgent">
                        Urgent <img src="./assets/icons/priority/priority_urgent.png" alt="Urgent icon">
                    </label>

                    <input type="radio" id="priority-medium" name="priority" value="medium">
                    <label for="priority-medium" class="priority-button medium">
                        Medium <img src="./assets/icons/priority/priority_medium.png" alt="Medium icon">
                    </label>

                    <input type="radio" id="priority-low" name="priority" value="low">
                    <label for="priority-low" class="priority-button low">
                        Low <img src="./assets/icons/priority/priority_low.png" alt="Low icon">
                    </label>
                </div>
    
                <label for="assignees">Assigned to</label>
                <select class="hover" id="assignees" name="assignees">
                    <option value="" disabled selected>Select contacts to assign</option>
                </select>
                    
                </select>
    
                <label for="category">Category <span class="required-marker">*</span></label>
                <select id="category" class="hover" name="category" required>
                    <option value="">Select category</option>
                    <option value="technical-task">Technical Task</option>
                    <option value="user-story">User Story</option>
                </select>
    
                <label for="subtask">Subtasks</label>
                <div>
                    <input type="text" id="subtask" placeholder="Add new subtask">
                    <ul id="subtask-list"></ul>
                </div>
            </div>
        </form>
    
        <div class="form-footer">
            <div class="form-hint">
                <span class="required-marker">*</span>This field is required
            </div>
            <div class="task-buttons">
                <button type="reset" class="clear-btn">
                    Clear <span class="x-icon">X</span>
                </button>
                <button type="submit" class="create-btn">
                    Create Task
                    <img src="./assets/icons/check.png" alt="Create Icon">
                </button>
            </div>
        </div>

    `
}