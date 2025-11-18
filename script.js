const categoryInput = document.getElementById("newcategname");
const categoryColor = document.getElementById("categ-colour");
const addCategoryBtn = document.getElementById("addcategbtn");
const categoryList = document.getElementById("category-list");

let categories = [];

addCategoryBtn.addEventListener("click", () => {
  const name = categoryInput.ariaValueMax.trim();
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
const doingColumn = document.getElementById("inprogress");
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
