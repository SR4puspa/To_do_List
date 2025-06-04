// === Date & Time ===
const dateEl = document.getElementById('date');
const timeEl = document.getElementById('time');

function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString(undefined, options);
  timeEl.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateDateTime, 1000);
updateDateTime();

// === Dark/Light Mode toggle ===
const modeToggleBtn = document.getElementById('mode-toggle');
modeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const icon = modeToggleBtn.querySelector('i');
  if (document.body.classList.contains('dark')) {
    icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
  }
});

// === Elements ===
const userLoginSection = document.getElementById('user-login-section');
const userForm = document.getElementById('user-form');
const usernameInput = document.getElementById('username-input');

const todoAppSection = document.getElementById('todo-app-section');
const displayUsername = document.getElementById('display-username');

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let currentUser = null;
let todos = [];

// localStorage key for user
const USER_KEY = 'todo_app_user';

// Clear user on refresh (so login form always shows)
localStorage.removeItem(USER_KEY);
currentUser = null;

// Load todos for current user
function loadTodos() {
  if (!currentUser) return;
  const savedTodos = localStorage.getItem(`todos_${currentUser}`);
  todos = savedTodos ? JSON.parse(savedTodos) : [];
}

// Save todos for current user
function saveTodos() {
  if (!currentUser) return;
  localStorage.setItem(`todos_${currentUser}`, JSON.stringify(todos));
}

// Animated letter-by-letter text function
function createAnimatedText(text) {
  const container = document.createElement('span');
  container.style.display = 'inline-block';
  container.style.perspective = '400px';

  for (let i = 0; i < text.length; i++) {
    const letter = document.createElement('span');
    letter.textContent = text[i];
    letter.style.display = 'inline-block';
    letter.style.opacity = '0';
    letter.style.animation = `fadeInLetter 0.4s forwards`;
    letter.style.animationDelay = `${i * 0.05}s`;
    container.appendChild(letter);
  }
  return container;
}

// Add a todo item with unique ID
function addTodoItem(text, done = false, save = true, id = null) {
  if (!id) id = Date.now();

  const li = document.createElement('li');
  li.className = 'todo-item';
  if (done) li.classList.add('done');
  li.dataset.id = id;

  const animatedText = createAnimatedText(text);
  animatedText.className = 'todo-text';

  const btns = document.createElement('div');
  btns.className = 'todo-buttons';

  const doneBtn = document.createElement('button');
  doneBtn.title = 'Mark as done';
  doneBtn.innerHTML = '<i class="fas fa-check"></i>';
  doneBtn.addEventListener('click', () => {
    li.classList.toggle('done');
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos[index].done = li.classList.contains('done');
      saveTodos();
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.title = 'Delete task';
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.addEventListener('click', () => {
  li.style.animation = 'slideOutTop 0.3s forwards';
  setTimeout(() => {
    li.remove();  // Remove from UI
    todos = todos.filter(t => t.id !== id);  // Remove from array
    saveTodos();  // Update localStorage
  }, 300);
});



  btns.appendChild(doneBtn);
  btns.appendChild(deleteBtn);

  li.appendChild(animatedText);
  li.appendChild(btns);

  todoList.prepend(li);

  setTimeout(() => {
    li.style.opacity = '1';
  }, 10);

  if (save) {
    todos.push({ id, text, done });
    saveTodos();
  }
}

// Render all todos
function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    addTodoItem(todo.text, todo.done, false, todo.id);
  });
}

// Handle user login form submit
userForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (!username) return;

  currentUser = username;
  localStorage.setItem(USER_KEY, currentUser);
  showTodoApp();
});

// Show the todo app section and hide login form
function showTodoApp() {
  userLoginSection.classList.add('hidden');
  todoAppSection.classList.remove('hidden');
  displayUsername.textContent = currentUser;

  loadTodos();
  renderTodos();
}

// Handle adding new todo item
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const todoText = todoInput.value.trim();
  if (!todoText) return;

  addTodoItem(todoText);
  todoInput.value = '';
});

// --- Insert keyframes for animations dynamically ---
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`@keyframes fadeInLetter {
  to { opacity: 1; transform: rotateX(0) rotateY(0) rotateZ(0); }
}`, styleSheet.cssRules.length);
styleSheet.insertRule(`@keyframes slideOutTop {
  0% { opacity: 1; transform: translateY(0) translateZ(0); }
  100% { opacity: 0; transform: translateY(-30px) translateZ(30px); }
}`, styleSheet.cssRules.length);
