

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

const taskInput = document.querySelector("#task-input");
const taskDueInput = document.querySelector("#task-due");
const addTaskButton = document.querySelector("#add-task");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");
const clearCompletedButton = document.querySelector("#clear-completed");

let tasks = JSON.parse(localStorage.getItem("edialeTasks")) || [];

function updateTaskCount() {
  const taskElements = taskList.querySelectorAll(".task");
  const count = taskElements.length;

  taskCount.textContent =
    count + (count === 1 ? " task" : " tasks");

  if (count === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

function saveTasks() {
  localStorage.setItem("edialeTasks", JSON.stringify(tasks));
}

function addTask() {
  const taskText = taskInput.value.trim();
  const taskDue = taskDueInput.value;

  if (taskText === "") {
    return;
  }

  const task = {
    text: taskText,
    completed: false,
    due: taskDue
  };

  tasks.push(task);
  saveTasks();

  createTaskElement(task);

  taskInput.value = "";
  taskDueInput.value = "";

  updateTaskCount();
}

function createTaskElement(task) {
  const taskItem = document.createElement("li");

  taskItem.classList.add("task");

  if (task.completed) {
    taskItem.classList.add("completed");
  }

  taskItem.innerHTML = `
    <input
      type="checkbox"
      class="task-checkbox"
      ${task.completed ? "checked" : ""}
    >

    <div class="task-content">
      <span class="task-text">${task.text}</span>

      ${
        task.due
          ? `<small class="task-due">Due: ${new Date(task.due).toLocaleString()}</small>`
          : ""
      }
    </div>

    <button class="delete-task" aria-label="Delete task">×</button>
  `;

  taskList.appendChild(taskItem);

  const checkbox =
    taskItem.querySelector(".task-checkbox");

  checkbox.addEventListener("change", function() {
    task.completed = checkbox.checked;

    taskItem.classList.toggle(
      "completed",
      task.completed
    );

    saveTasks();
  });

  const deleteButton =
    taskItem.querySelector(".delete-task");

  deleteButton.addEventListener("click", function() {
    const index = tasks.indexOf(task);

    if (index !== -1) {
      tasks.splice(index, 1);
    }

    taskItem.remove();

    saveTasks();
    updateTaskCount();
  });
}

function loadTasks() {
  tasks.forEach(function(task) {
    createTaskElement(task);
  });
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

clearCompletedButton.addEventListener("click", function() {
  const completedTasks =
    taskList.querySelectorAll(".task.completed");

  completedTasks.forEach(function(taskElement) {
    const checkbox =
      taskElement.querySelector(".task-checkbox");

    const taskIndex = Array.from(
      taskList.querySelectorAll(".task")
    ).indexOf(taskElement);

    const task = tasks.find(function(item) {
      return item.text ===
        taskElement.querySelector(".task-text").textContent;
    });

    if (task) {
      const index = tasks.indexOf(task);

      if (index !== -1) {
        tasks.splice(index, 1);
      }
    }

    taskElement.remove();
  });

  saveTasks();
  updateTaskCount();
});

loadTasks();
updateTaskCount();


function checkDueTasks() {
  const now = new Date();

  tasks.forEach(function(task) {

    if (
      task.due &&
      !task.completed &&
      !task.notified
    ) {

      const dueTime = new Date(task.due);

      if (now >= dueTime) {

        const notification = document.querySelector("#notification");
const notificationMessage =
  document.querySelector("#notification-message");

notificationMessage.textContent =
  task.text + " is due now!";

notification.classList.add("show");

setTimeout(function() {
  notification.classList.remove("show");
}, 5000);

        task.notified = true;

        saveTasks();
      }
    }
  });
}

setInterval(checkDueTasks, 1000);



const closeNotification =
  document.querySelector("#close-notification");

closeNotification.addEventListener("click", function() {
  document
    .querySelector("#notification")
    .classList.remove("show");
})

alert("JavaScript is connected!");
