let currentDraggedElement = null;

/**
 * Cleans up all drag-related styles, classes, and placeholders.
 * This function is used for both desktop (dragend) and mobile (touchend) events.
 */
function cleanupDrag() {
  document.querySelectorAll(".dragging-swing").forEach(el =>
    el.classList.remove("dragging-swing", "invisible-during-drag")
  );

  document.querySelectorAll(".kanban_section").forEach(section =>
    section.classList.remove("drag-over")
  );

  document.querySelectorAll(".drop-placeholder").forEach(p =>
    p.style.display = "none"
  );

  currentDraggedElement = null;
}

/** 
 * Desktop & Mobile cleanup handler */
document.addEventListener("dragend", cleanupDrag);
document.addEventListener("touchend", cleanupDrag);

/**
 * Starts the dragging process for a task element.
 * Adds visual feedback and sets the current dragged element.
 *
 * @param {string} taskId - The ID of the dragged task
 * @param {DragEvent|TouchEvent} event - The drag or touch event object
 */
function startDragging(taskId, event) {
  currentDraggedElement = parseInt(taskId, 10);

  if (event?.dataTransfer) {
    event.dataTransfer.setData("text/plain", taskId);
    event.dataTransfer.effectAllowed = "move";
  }

  const element = document.querySelector(`[data-task-id="${taskId}"]`);
  if (element) {
    setTimeout(() => {
      element.classList.add("dragging-swing", "invisible-during-drag");
    }, 0);
  }
}

/**
 * Allows dropping an element into a kanban section.
 * Adds visual highlight and shows the drop placeholder.
 *
 * @param {DragEvent} ev - The dragover event object
 */
function allowDrop(ev) {
  ev.preventDefault();
  const section = ev.currentTarget;
  section.classList.add("drag-over");

  const placeholder = section.querySelector(".drop-placeholder");
  if (placeholder) {
    placeholder.style.display = "block";
  }
}

/**
 * Hides the drop placeholder and removes section highlight
 * when the dragged element leaves the section.
 *
 * @param {DragEvent} ev - The dragleave event object
 */
function hideDropPlaceholder(ev) {
  const section = ev.currentTarget;
  section.classList.remove("drag-over");

  const placeholder = section.querySelector(".drop-placeholder");
  if (placeholder) {
    placeholder.style.display = "none";
  }
}

/**
 * Moves a dragged task into a new kanban section
 * and updates its status in Firebase.
 *
 * @param {string} newStatus - The new status for the task (e.g. "inProgress", "done")
 */
async function moveTo(newStatus) {
  if (currentDraggedElement == null) return;

  const task = tasks.find((t) => Number(t.id) === currentDraggedElement);
  if (!task) return;

  task.status = newStatus;

  await fetch(`${BASE_URL}tasks/${currentDraggedElement}.json`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

  cleanupDrag();
  await loadTasksFromFirebase();
}

/**
 * Handles task movement during touch interactions on mobile devices.
 * Moves the dragged element with the user's finger.
 */
document.addEventListener("touchmove", (ev) => {
  const touch = ev.touches[0];
  const element = document.querySelector(`[data-task-id="${currentDraggedElement}"]`);

  if (element) {
    element.style.position = "fixed";
    element.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
    element.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
    element.style.zIndex = 1000;
  }
}, { passive: false });

document.addEventListener("touchend", () => {
  const element = document.querySelector(`[data-task-id="${currentDraggedElement}"]`);
  if (element) {
    element.style.position = "";
    element.style.left = "";
    element.style.top = "";
    element.style.zIndex = "";
  }
});