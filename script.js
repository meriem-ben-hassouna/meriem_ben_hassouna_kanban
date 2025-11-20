/*inputs*/
const nameInput = document.getElementById("nom");
const prenomInput = document.getElementById("prenom");
const emailInput = document.getElementById("email");
const numInput = document.getElementById("num");
const notesInput = document.getElementById("notes");

const categoryInput = document.getElementById("newcategname");
const categoryColor = document.getElementById("categ-colour");
const addCategoryBtn = document.getElementById("addcategbtn");
const categoryList = document.getElementById("category-list");

const taskCategorySelect = document.getElementById("taskcategory");
const taskInput = document.getElementById("tasktitle");
const addTaskBtn = document.getElementById("addtaskbtn");

const todoColumn = document.getElementById("todo");
const inprogressColumn = document.getElementById("inprogress");
const doneColumn = document.getElementById("done");

const saveInfoBtn = document.getElementById("savebtn");

/*form*/
function validatePersonalInfo() {
  if (nameInput.value.trim() === "") return false;
  if (prenomInput.value.trim() === "") return false;
  if (!emailInput.value.includes("@")) return false;
  if (numInput.value.trim().length < 8) return false;

  return true;
}

/*categories*/
let categories = [];

addCategoryBtn.addEventListener("click", () => {
  const name = categoryInput.value.trim();
  const color = categoryColor.value;

  if (name === "") return alert("Enter a category name!");
  if (categories.length >= 5) return alert("Max 5 categories!");

  const cat = { name, color };
  categories.push(cat);

  const tag = document.createElement("span");
  tag.className = "category-tag";
  tag.style.setProperty("--tag-color", color);
  tag.textContent = name;
  categoryList.appendChild(tag);

  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  taskCategorySelect.appendChild(option);

  categoryInput.value = "";
});

/*task*/
let draggedCard = null;

function createCard(title, color = "", categoryName = "") {
  const card = document.createElement("div");
  card.className = "task-card";
  card.draggable = true;

  card.innerHTML = `
    <span class="card-title">${title}</span>
    <span class="card-category" style="background:${color}">${categoryName}</span>
  `;

  card.addEventListener("dragstart", () => (draggedCard = card));
  return card;
}

addTaskBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  const categoryName = taskCategorySelect.value;

  if (title === "") return alert("Task cannot be empty!");
  if (categoryName === "") return alert("Select a category!");

  const category = categories.find((c) => c.name === categoryName);
  const card = createCard(title, category.color, category.name);

  todoColumn.appendChild(card);
  taskInput.value = "";
  taskCategorySelect.value = "";
  saveToLocalStorage();
});

/*table*/
[todoColumn, inprogressColumn, doneColumn].forEach((col) => {
  col.addEventListener("dragover", (e) => e.preventDefault());
  col.addEventListener("drop", () => {
    if (draggedCard) col.appendChild(draggedCard);
    draggedCard = null;
    saveToLocalStorage();
  });
});

/*saving*/
function getColumnTasks(column) {
  const arr = [];
  column.querySelectorAll(".task-card").forEach((card) => {
    arr.push({
      title: card.querySelector(".card-title").innerText,
      categoryName: card.querySelector(".card-category").innerText,
      color: card.querySelector(".card-category").style.background,
    });
  });
  return arr;
}

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

/*restore*/
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
    const tag = document.createElement("span");
    tag.className = "category-tag";
    tag.style.setProperty("--tag-color", cat.color);
    tag.textContent = cat.name;
    categoryList.appendChild(tag);

    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    taskCategorySelect.appendChild(option);
  });

  savedData.tasks.todo.forEach((t) =>
    todoColumn.appendChild(createCard(t.title, t.color, t.categoryName))
  );
  savedData.tasks.inprogress.forEach((t) =>
    inprogressColumn.appendChild(createCard(t.title, t.color, t.categoryName))
  );
  savedData.tasks.done.forEach((t) =>
    doneColumn.appendChild(createCard(t.title, t.color, t.categoryName))
  );
});
