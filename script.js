document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

function loadTasks() {
    let pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    
    displayTasks(pendingTasks, 'pending-tasks');
    displayTasks(completedTasks, 'completed-tasks');
}

function saveTasks(pendingTasks, completedTasks) {
    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function displayTasks(tasks, elementId) {
    let list = document.getElementById(elementId);
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        li.innerHTML = `<span>${task.text} (Added: ${task.added})</span>
                        <div class="actions">
                            <button class="edit" onclick="editTask('${elementId}', ${index})">Edit</button>
                            <button class="complete" onclick="toggleComplete('${elementId}', ${index})">${elementId === 'pending-tasks' ? 'Complete' : 'Pending'}</button>
                            <button onclick="deleteTask('${elementId}', ${index})">Delete</button>
                        </div>`;
        list.appendChild(li);
    });
}

function addTask() {
    let newTaskInput = document.getElementById('new-task');
    let taskText = newTaskInput.value.trim();
    if (taskText === '') return;
    
    let task = {
        text: taskText,
        added: new Date().toLocaleString(),
        completed: null
    };

    let pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
    pendingTasks.push(task);
    saveTasks(pendingTasks, JSON.parse(localStorage.getItem('completedTasks')) || []);
    
    newTaskInput.value = '';
    displayTasks(pendingTasks, 'pending-tasks');
}

function editTask(listId, index) {
    let tasks = JSON.parse(localStorage.getItem(listId === 'pending-tasks' ? 'pendingTasks' : 'completedTasks')) || [];
    let newTaskText = prompt('Edit task:', tasks[index].text);
    if (newTaskText === null || newTaskText.trim() === '') return;
    
    tasks[index].text = newTaskText;
    saveTasks(listId === 'pending-tasks' ? tasks : JSON.parse(localStorage.getItem('pendingTasks')) || [], 
              listId === 'completed-tasks' ? tasks : JSON.parse(localStorage.getItem('completedTasks')) || []);
    
    displayTasks(tasks, listId);
}

function toggleComplete(listId, index) {
    let pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    
    if (listId === 'pending-tasks') {
        let task = pendingTasks.splice(index, 1)[0];
        task.completed = new Date().toLocaleString();
        completedTasks.push(task);
    } else {
        let task = completedTasks.splice(index, 1)[0];
        task.completed = null;
        pendingTasks.push(task);
    }
    
    saveTasks(pendingTasks, completedTasks);
    displayTasks(pendingTasks, 'pending-tasks');
    displayTasks(completedTasks, 'completed-tasks');
}

function deleteTask(listId, index) {
    let tasks = JSON.parse(localStorage.getItem(listId === 'pending-tasks' ? 'pendingTasks' : 'completedTasks')) || [];
    tasks.splice(index, 1);
    saveTasks(listId === 'pending-tasks' ? tasks : JSON.parse(localStorage.getItem('pendingTasks')) || [], 
              listId === 'completed-tasks' ? tasks : JSON.parse(localStorage.getItem('completedTasks')) || []);
    displayTasks(tasks, listId);
}
