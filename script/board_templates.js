/**
 * Generates the HTML string for a single task card displayed on the Kanban board.
 * 
 * The card includes task category, title, description, assigned user avatars,
 * priority icon, and an empty container for subtask progress (populated later by JS).
 * It also includes drag-and-drop attributes and a click event hook to open the overlay.
 * 
 * Used in rendering logic such as `renderCurrentTasks()` in board.js.
 * 
 * @function getKanbanTemplate
 * @param {Object} task - The task object to render.
 * @param {string} task.id - Unique identifier for the task.
 * @param {string} task.category - Task category (e.g., "Technical Task").
 * @param {string} task.categoryClass - CSS class applied to the category label.
 * @param {string} task.title - Task title.
 * @param {string} task.details - Task description/details.
 * @param {string} task.priority - Task priority (e.g., "low", "medium", "urgent").
 * @param {Array<Object>} assignedUsersHTML - Pre-rendered user initials HTML string.
 * @param {number} index - Index of the task in the current list (used for DOM targeting).
 * 
 * @returns {string} - HTML string representing a Kanban board task card.
 * 
 * @example
 * const cardHTML = getKanbanTemplate(task, assignedHTML, 3);
 * document.getElementById('toDoContainer').innerHTML += cardHTML;
 */

function getKanbanTemplate(task, assignedUsersHTML, index) {
  return `    <div class="task_container hover" data-task-id="${task.id}" data-task-index="${index}" draggable="true" ondragstart="startDragging('${task.id}')">
                    
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

`;
}

/**
 * Generates the HTML structure for the "Add Task" overlay form.
 * Includes inputs for title, description, due date, priority selection,
 * category dropdown, contact assignee selector, and dynamic subtask entry.
 * 
 * This form is typically displayed in a modal (overlay) when the user clicks
 * "Add Task" on the board or from the sidebar menu.
 * 
 * The returned HTML is meant to be injected into an element with the ID "overlay",
 * and works in conjunction with form handlers in `add_task.js`.
 * 
 * @function getAddTaskOverlay
 * 
 * @returns {string} - A complete HTML string for rendering the task creation form overlay.
 * 
 * @example
 * const overlay = document.getElementById('overlay');
 * overlay.innerHTML = getAddTaskOverlay();
 * overlay.classList.remove('d-none');
 */


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

    `;
}


/**
 * Generates the HTML content for the task detail overlay (popup) including task information,
 * assigned users, priority, and dynamically rendered subtasks with interactive checkboxes.
 * 
 * @function getTaskSheetOverlay
 * @param {Object} task - The task object containing details about the task.
 * @param {string} task.id - The unique ID of the task.
 * @param {string} task.title - The task title.
 * @param {string} task.details - The task description/details.
 * @param {string} task.dueDate - The due date of the task.
 * @param {string} task.priority - The task's priority level ('low', 'medium', 'urgent').
 * @param {string} task.category - The task category (e.g., 'Technical Task').
 * @param {string} task.categoryClass - CSS class used to style the category badge.
 * @param {Array<Object>} task.subTasks - Array of subtasks, each with a title and done status.
 * @param {string} task.subTasks[].title - Title of the subtask.
 * @param {boolean} task.subTasks[].done - Whether the subtask is completed.
 * @param {string} assignedUsersHTML - Pre-rendered HTML string of assigned user badges.
 * @param {number} index - The index of the task (used to scope DOM elements uniquely).
 * 
 * @returns {string} HTML string to be injected into the DOM for the overlay popup.
 * 
 * @example
 * const overlayHTML = getTaskSheetOverlay(taskObj, assignedUsersHTML, 2);
 * document.getElementById('overlay').innerHTML = overlayHTML;
 */

function getTaskSheetOverlay(task, assignedUsersHTML, index) {
  return `
    <div class="task_container_overlay hover">
      <div class="task">

        <div class="overlay_headline"> 
          <div class="task_category_overlay ${task.categoryClass}">${task.category}</div>
          <button onclick="closeOverlay()" class="close_button hover">X</button>
        </div>

        <div class="task_information_overlay">
          <p class="task_title_overlay" id="task_title">${task.title}</p>
          <p class="task_details_overlay" id="task_details">${task.details}</p>

          <table>
            <tr>
              <td>Due date:</td>
              <td class="td_right">${task.dueDate || "1.1.2011"}</td>
            </tr>
            <tr>
              <td>Priority:</td>
              <td class="td_priority">
                <p class="margin_right_10">${task.priority}</p>
                <img src="./assets/icons/priority/priority_${task.priority.toLowerCase()}.png">
              </td>
            </tr>
          </table>

          <div class="assigned_container">
            <p>Assigned to:</p>
            <div class="assigned_user">
              <div class="user_initials_overlay">${assignedUsersHTML}<p>User Name</p></div>
            </div>
          </div>
        </div>

        <div id="subtask_container_${index}" class="subtask_container"></div>

        <div class="popup-subtasks">
          <span class="subtasks-label">Subtasks:</span>
          <div class="subtasks-list" id="subtasks-list-${index}">
            ${
              (task.subTasks || []).map((subtask, subIndex) => `
                <div class="subtasks-elements-container" onclick="toggleSubtaskCheckbox(this, '${task.id}', ${subIndex})">
                  <img class="subtask-checkbox-img" src="assets/icons/${subtask.done ? 'checkbox-checked' : 'checkbox-empty'}.svg" alt="Checkbox">
                  <span>${subtask.task}</span>
                </div>
              `).join("")
            }
          </div>
        </div>

        <div class="popup-actions">
          <div class="action-box delete" onclick="deleteTaskFromBoardPopup('${task.id}')">
            <div class="delete-icon">
              <img src="assets/icons/delete_icon.svg" alt="Delete" id="delete_icon">
            </div>
            <span class="delete-btn">Delete</span>
          </div>

          <div>
            <img src="assets/icons/vertical_line.svg" alt="horizontal dividing line">
          </div>

          <div class="action-box edit" onclick="editPopupTask('${task.id}')">
            <div class="edit-icon">
              <img src="assets/icons/edit.svg" alt="Edit" id="edit_icon">
            </div>
            <span class="edit-btn">Edit</span>
          </div>
        </div>

      </div>  
    </div>
  `;
}
