let currentDraggedElement = null;
let touchedTask = null;
let touchStartX = 0;
let touchStartY = 0;

/**
 *  Cleans up drag effects by removing classes and hiding drop placeholders after a drag ends. */
document.addEventListener("dragend", () => {
    document.querySelectorAll(".dragging-swing").forEach(el =>
      el.classList.remove("dragging-swing", "invisible-during-drag")
    );
  
    document.querySelectorAll(".kanban_section").forEach(section =>
      section.classList.remove("drag-over")
    );
  
    document.querySelectorAll(".drop-placeholder").forEach(p =>
      p.style.display = "none"
    );
});

/**
* Sets the currently dragged task element and applies styles for animation
* @param {string} taskId - ID of the dragged task
* @param {DragEvent} event - The drag event object
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
  
    document.querySelectorAll(".drop-placeholder").forEach(p => {
      p.style.display = "block";
    });
}
  
/**
* Prevents default behavior to allow drop operations
* @param {Event} ev - The drag event
*/
function allowDrop(ev) {
    ev.preventDefault();
  
    const section = ev.currentTarget;
    section.classList.add("drag-over");
  
    const placeholder = section.querySelector(".drop-placeholder");
    if (placeholder) {
      placeholder.style.display = "block";
    } else {
      console.warn("[DragDrop] Kein Platzhalter gefunden!");
    }
}
  
/**
*  Hides the drop placeholder and removes the visual highlight when a dragged item leaves a section. */
function hideDropPlaceholder(ev) {
    const section = ev.currentTarget;
    section.classList.remove("drag-over");
  
    const placeholder = section.querySelector(".drop-placeholder");
    if (placeholder) {
      placeholder.style.display = "none";
    }
}
  
/**
* Moves a task to a new status column via drag and drop
* @param {string} newStatus - The new status to assign to the task
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
  
    currentDraggedElement = null;

    document.querySelectorAll(".drop-placeholder").forEach(p => {
      p.style.display = "none";
    });
  
    await loadTasksFromFirebase();
}

function handleTouchStart(event) {
    const touch = event.touches[0];
    touchedTask = event.currentTarget;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
}
  
function handleTouchMove(event) {
    event.preventDefault(); // ✅ wichtig!
    if (!touchedTask) return;
  
    const touch = event.touches[0];
    touchedTask.style.position = 'absolute';
    touchedTask.style.left = `${touch.clientX - touchedTask.offsetWidth / 2}px`;
    touchedTask.style.top = `${touch.clientY - touchedTask.offsetHeight / 2}px`;
    touchedTask.style.zIndex = 1000;
}
  
function bindTouchEventsToTasks() {
    document.querySelectorAll('.task_container').forEach(task => {
      task.addEventListener('touchstart', handleTouchStart, { passive: false });
    });
}

function handleTouchEnd(event) {
    if (!touchedTask) return;
  
    const touch = event.changedTouches[0];
    const dropTargets = document.querySelectorAll('.kanban_section');
  
    dropTargets.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        const newStatus = section.getAttribute('ondrop')?.match(/moveTo\('(.+)'\)/)?.[1];
        if (newStatus) {
          const taskId = touchedTask.dataset.taskId;
          startDragging(taskId); 
          moveTo(newStatus);
        }
      }
    });

    touchedTask.style.position = '';
    touchedTask.style.left = '';
    touchedTask.style.top = '';
    touchedTask.style.zIndex = '';
    touchedTask = null;
  
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
}