// --- DOM Elements ---
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');

// --- State Management ---
// 1. Load tasks from LocalStorage OR initialize an empty array if none exist
let tasks = JSON.parse(localStorage.getItem('tasks')) ||[];
let currentFilter = 'All'; // Default filter

// 2. Save current state to LocalStorage
function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// --- UI Rendering ---
function renderTasks() {
    // Clear current list items before re-rendering
    taskList.innerHTML = '';

    // Filter tasks based on the active filter button
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'Active') return !task.completed;
        if (currentFilter === 'Completed') return task.completed;
        return true; // 'All'
    });

    // Show or hide empty state message
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // Build DOM elements safely for each task
    filteredTasks.forEach(task => {
        // Create <li> container
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        // Create container for checkbox and text
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('task-content');

        // Create Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

        // Create Text Span
        const span = document.createElement('span');
        span.classList.add('task-text');
        span.textContent = task.text;
        // Allow users to click the text itself to toggle completion
        span.addEventListener('click', () => toggleTaskStatus(task.id));

        // Create Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Assemble the elements
        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);
       
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        // Append the completed <li> to the <ul>
        taskList.appendChild(li);
    });
}

// --- Core Actions ---
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return; // Prevent empty tasks

    const newTask = {
        id: Date.now(), // Unique ID based on timestamp
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasksToStorage(); // Save to LocalStorage
    renderTasks();        // Update UI
   
    taskInput.value = ''; // Clear input field
}

function toggleTaskStatus(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
   
    saveTasksToStorage();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToStorage();
    renderTasks();
}

// --- Event Listeners ---

// Add task via button click
addBtn.addEventListener('click', addTask);

// Add task via 'Enter' key
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Filter Buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove 'active' class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
       
        // Add 'active' class to clicked button
        e.target.classList.add('active');
       
        // Update state and re-render
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});

// --- Initialization ---
// Render tasks immediately on page load
renderTasks(); 
