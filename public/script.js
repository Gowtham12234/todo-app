const username = localStorage.getItem("username");
let loadedTasks = []; // to keep all tasks globally

//checking for user loggedin or not

if (!username && !location.pathname.includes("/index.html")) {
  window.location.href = "login.html";
}
if (!username && !location.pathname.includes("/signup.html")) {
  window.location.href = "signup.html";
}

//login

document.querySelector(".login-btn")?.addEventListener("click", async () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("username", user);
    location.href = "index.html";
  } else {
    alert("login failed" + data.message);
  }
});

//signup

document.getElementById("signup-btn")?.addEventListener("click", async () => {
  const user = document.getElementById("signup-username").value;
  const pass = document.getElementById("signup-password").value;
  if (!user || !pass) {
    alert("please fill up the details..");
    return;
  }
  const res = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass }),
  });
  const data = await res.json();
  if (data.success) {
    alert("DONE WITH THE SIGNUP MOVE TOWARS LOGIN ");
    window.location.href = "login.html";
  } else {
    alert("signup failed" + data.message);
  }
});

//load tasks

async function loadtasks() {
  const res = await fetch("/gettasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  const data = await res.json();
  loadedTasks = data.tasks; // store tasks globally
  renderTasks(loadedTasks);
}

function renderTasks(tasks) {
  const container = document.querySelector(".task-display-container");

  let allTasksHtml = "";
  tasks.forEach((t) => {
    allTasksHtml += `
      <div class="task-container">
        <p class="task">${t.task}</p>
        <div class="task-time">
          <p class="task-date">${t.date}</p>
          <p class="task-time">${t.time}</p>
        </div>
        <div class="task-status">
          ${
            t.completed
              ? "<span>Completed</span>"
              : `<button class="task-completed" data-id="${t._id}">Mark as Completed</button>`
          }
        </div>
        <div class="task-delete-container">
          <button class="task-delete" data-id="${t._id}">Delete</button>
        </div>
      </div>
    `;
  });

  // Set the innerHTML once
  container.innerHTML = allTasksHtml;

  // Add event listeners AFTER elements are in DOM
  container.querySelectorAll(".task-completed").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!id) return alert("Task id missing!");
      await markcomplete(id);
    });
  });

  container.querySelectorAll(".task-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!id) return alert("Task id missing!");
      await deleteTask(id);
    });
  });
}
document.getElementById("filter")?.addEventListener("change", () => {
  const filterValue = document.getElementById("filter").value.toLowerCase();

  let filteredTasks = loadedTasks;

  if (filterValue === "completed") {
    filteredTasks = loadedTasks.filter((task) => task.completed);
  } else if (filterValue === "not completed") {
    filteredTasks = loadedTasks.filter((task) => !task.completed);
  } else {
    filteredTasks = loadedTasks; // for "all" or unknown option
  }

  console.log("Filtered tasks:", filteredTasks); //
  if (tasks.length === 0) {
    container.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  renderTasks(filteredTasks);
});

//mark as completed

async function markcomplete(id) {
  await fetch("/complete-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId: id }),
  });
  loadtasks();
}

//delete tasks

async function deleteTask(id) {
  await fetch("/delete-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId: id }),
  });
  loadtasks();
}
if (location.pathname.includes("index")) loadtasks();

// add task

document.querySelector(".add-task-btn")?.addEventListener("click", async () => {
  const taskInput = document.getElementById("task-input").value;
  const dateInput = document.getElementById("date-input").value;
  const timeInput = document.getElementById("time-input").value;

  if (!taskInput || !dateInput || !timeInput) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch("/addtask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      task: taskInput,
      date: dateInput,
      time: timeInput,
    }),
  });

  const data = await res.json();
  if (data.success) {
    // clear inputs and reload tasks
    document.getElementById("task-input").value = "";
    document.getElementById("date-input").value = "";
    document.getElementById("time-input").value = "";
    loadtasks();
  } else {
    alert("Failed to add task");
  }
});
