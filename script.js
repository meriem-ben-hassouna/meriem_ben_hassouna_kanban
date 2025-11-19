const nameInput = document.getElementById("nom");
const prenomInput = document.getElementById("prenom");
const emailInput = document.getElementById("email");
const numInput = document.getElementById("num");

function validatePersonalInfo() {
  if (nameInput.value.trim() === "") return false;
  if (prenomInput.value.trim() === "") return false;
  if (!emailInput.value.includes("@")) return false;
  if (numInput.value.trim().length < 8) return false;

  return true;
}

const categoryInput = document.getElementById("newcategname");
const categoryColor = document.getElementById("categ-colour");
const addCategoryBtn = document.getElementById("addcategbtn");
const categoryList = document.getElementById("category-list");

let categories = [];

addCategoryBtn.addEventListener("click", () => {
  const name = categoryInput.value.trim();
  const color = categoryColor.value;

  if (name === "") return alert("Enter a category name!");
  if (categories.length >= 5) return alert("Max 5 categories!");

  const cat = { name, color };
  categories.push(cat);

  const item = document.createElement("div");
  item.innerText = name;
  item.style.background = color;
  item.className = "categoryTag";
  categoryList.appendChild(item);

  categoryInput.value = "";
});

const todoColumn = document.getElementById("todo");
const inprogressColumn = document.getElementById("inprogress");
const doneColumn = document.getElementById("done");

const taskInput = document.getElementById("tasktitle");
const addTaskBtn = document.getElementById("addtaskbtn");

addTaskBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  if (title === "") return alert("Task cannot be empty!");

  const card = createCard(title);
  todoColumn.appendChild(card);
  taskInput.value = "";
});

function createCard(title) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.draggable = true;
  card.innerText = title;

  card.addEventListener("dragstart", (e) => {
    draggedCard = card;
  });
  return card;
}

let draggedCard = null;

[todoColumn, inprogressColumn, doneColumn].forEach((col) => {
  col.addEventListener("dragover", (e) => e.preventDefault());
  col.addEventListener("drop", () => {
    if (draggedCard) col.appendChild(draggedCard);
    draggedCard = null;
    saveToLocalStorage();
  });
});

const saveInfoBtn = document.getElementById("savebtn");

saveInfoBtn.addEventListener("click", () => {
  if (!validatePersonalInfo()) {
    alert("Please complete all fields correctly.");
    return;
  }

  const info = {
    nom: nameInput.value,
    prenom: prenomInput.value,
    email: emailInput.value,
    num: numInput.value,
  };

  localStorage.setItem("userInfo", JSON.stringify(info));
  saveToLocalStorage();
  alert("Information saved!");
});

function saveToLocalStorage() {
  const data = {
    categories,
    tasks: {
      todo: getColumnTasks(todoColumn),
      inprogress: getColumnTasks(inprogressColumn),
      done: getColumnTasks(doneColumn),
    },
  };

  localStorage.setItem("kanbanData", JSON.stringify(data));
}

function getColumnTasks(column) {
  const arr = [];
  column.querySelectorAll(".tasktitle").forEach((card) => {
    arr.push(card.innerText);
  });
  return arr;
}

window.addEventListener("load", () => {
  const savedInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (savedInfo) {
    nameInput.value = savedInfo.nom;
    prenomInput.value = savedInfo.prenom;
    emailInput.value = savedInfo.email;
    numInput.value = savedInfo.num;
  }

  const savedData = JSON.parse(localStorage.getItem("kanbanData"));
  if (!savedData) return;

  categories = savedData.categories || [];
  categories.forEach((cat) => {
    const item = document.createElement("div");
    item.innerText = cat.name;
    item.style.background = cat.color;
    item.className = "categoryTag";
    categoryList.appendChild(item);
  });

  savedData.tasks.todo.forEach((t) => todoColumn.appendChild(createCard(t)));
  savedData.tasks.doing.forEach((t) =>
    inprogressColumn.appendChild(createCard(t))
  );
  savedData.tasks.done.forEach((t) => doneColumn.appendChild(createCard(t)));
});
