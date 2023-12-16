const dayNumberElement = document.getElementById("day-number");
const monthNameElement = document.getElementById("month-name");
const yearNumberElement = document.getElementById("year-number");
const weekdayNameElement = document.getElementById("weekday-name");

const taskInputElement = document.querySelector(".task-input-field");
const addButton = document.getElementById("add-button");
const taskListElement = document.querySelector(".task-display ul");
const pendingTasksCount = document.getElementById("pending-tasks-count");
const deleteAllTasksButton = document.getElementById("delete-all-tasks-button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let count = 0;

function displayCurrentDate() {
  let currentDate = new Date();
  dayNumberElement.textContent = currentDate.toLocaleString("es", {
    day: "numeric",
  });
  weekdayNameElement.textContent = currentDate.toLocaleString("es", {
    weekday: "long",
  });
  monthNameElement.textContent = currentDate.toLocaleString("es", {
    month: "short",
  });
  yearNumberElement.textContent = currentDate.toLocaleString("es", {
    year: "numeric",
  });
}

function showError() {
  document.body.classList.add("error");
  taskInputElement.disabled = true;
  setTimeout(() => {
    document.body.classList.remove("error");
    taskInputElement.disabled = false;
  }, 3000);
}

function displayTask(task, id, isDone) {
  const taskContainerDiv = document.createElement("div");
  const taskListItem = document.createElement("li");
  const deleteButton = document.createElement("button");
  const trashIcon = document.createElement("i");

  trashIcon.classList.add("fa-solid", "fa-trash-can");
  taskListItem.textContent = task;
  taskListItem.id = id;

  if (isDone === 1) {
    taskListItem.classList.add("done");
  } else {
    count++;
    pendingTasksCount.textContent = count;
  }

  deleteButton.appendChild(trashIcon);
  taskContainerDiv.appendChild(taskListItem);
  taskContainerDiv.appendChild(deleteButton);

  taskListElement.appendChild(taskContainerDiv);

  taskContainerDiv.addEventListener("click", (e) => {
    if (e.target === taskListItem) {
      e.target.classList.toggle("done");
      let index = tasks.findIndex((t) => t.id === id);

      if (e.target.classList.contains("done")) {
        tasks[index].isDone = 1;
        count--;
      } else {
        tasks[index].isDone = 0;
        count++;
      }

      localStorage.setItem("tasks", JSON.stringify(tasks));
      pendingTasksCount.textContent = count;
    }
    if (e.target === deleteButton || e.target === trashIcon) {
      let index = tasks.findIndex((t) => t.id === id);
      if (index > -1) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
      if (!taskListItem.classList.contains("done")) {
        count--;
      }
      taskContainerDiv.remove();
      pendingTasksCount.textContent = count;
    }
  });
}

function addTask() {
  if (taskInputElement.value.length === 0) {
    showError();
    return;
  }
  let uuid = self.crypto.randomUUID();
  tasks.push({ task: taskInputElement.value, id: uuid, isDone: 0 });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTask(taskInputElement.value, uuid, 0);
  taskInputElement.value = "";
}

function deleteAllTasks() {
  tasks = [];
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskListElement.textContent = "";
  count = 0;
  pendingTasksCount.textContent = count;
}

displayCurrentDate();
tasks.forEach((task) => displayTask(task.task, task.id, task.isDone));
addButton.addEventListener("click", addTask);
deleteAllTasksButton.addEventListener("click", deleteAllTasks);
