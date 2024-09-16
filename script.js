document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const categorySelect = document.getElementById('category-select');
    const dueDateInput = document.getElementById('due-date');
    const prioritySelect = document.getElementById('priority-select');
    const filterButtons = document.querySelectorAll('#filters button');

    // Load tasks and theme from localStorage
    loadTasks();
    loadTheme();

    // Add task
    addTaskBtn.addEventListener('click', addTask);

    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterTasks(button.getAttribute('data-filter'));
        });
    });

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;

        if (taskText) {
            const taskItem = createTaskElement(taskText, category, dueDate, priority);
            taskList.appendChild(taskItem);
            saveTasks();
            taskInput.value = '';
        }
    }

    // Function to create a task element
    function createTaskElement(taskText, category, dueDate, priority) {
        const li = document.createElement('li');
        li.classList.add(category, priority);
        
        const taskContent = document.createElement('span');
        taskContent.textContent = `${taskText} (${category})`;
        li.appendChild(taskContent);

        const dueDateElement = document.createElement('small');
        dueDateElement.textContent = `Due: ${dueDate || 'No date'}`;
        li.appendChild(dueDateElement);

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTask(li);
        li.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(li);
        li.appendChild(deleteBtn);

        return li;
    }

    // Function to edit a task
    function editTask(taskItem) {
        const taskContent = taskItem.querySelector('span');
        const newTaskText = prompt('Edit your task:', taskContent.textContent.split(' (')[0]); // Get text before category
        if (newTaskText !== null && newTaskText.trim() !== '') {
            const category = taskItem.classList[0];
            taskContent.textContent = `${newTaskText.trim()} (${category})`;
            saveTasks();
        }
    }

    // Function to delete a task
    function deleteTask(taskItem) {
        taskItem.remove();
        saveTasks();
    }

    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const taskData = {
                text: li.querySelector('span').textContent,
                category: li.classList[0],
                dueDate: li.querySelector('small').textContent.replace('Due: ', ''),
                priority: li.classList[1]
            };
            tasks.push(taskData);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskData => {
            const taskItem = createTaskElement(taskData.text, taskData.category, taskData.dueDate, taskData.priority);
            taskList.appendChild(taskItem);
        });
    }

    // Function to filter tasks
    function filterTasks(category) {
        taskList.querySelectorAll('li').forEach(li => {
            if (category === 'all' || li.classList.contains(category)) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        });
    }

    // Function to toggle theme
    function toggleTheme() {
        document.body.classList.toggle('dark');
        taskList.querySelectorAll('li').forEach(li => {
            li.classList.toggle('dark');
        });
        saveTheme();
    }

    // Function to save theme to localStorage
    function saveTheme() {
        const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    }

    // Function to load theme from localStorage
    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark');
            taskList.querySelectorAll('li').forEach(li => {
                li.classList.add('dark');
            });
        }
    }
});
