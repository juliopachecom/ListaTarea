const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
        <div class="d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center">
                <div class="task-text mr-auto ${task.isDone ? 'taskDone' : ''}">${task.text}&nbsp;</div>
                <div>
                    <button class="btn-done btn-sm btn-link" data-index="${index}">
                        <i class="fas fa-check" style="pointer-events: none;"></i>
                    </button>
                    <button class="btn-edit btn-sm btn-link" data-index="${index}">
                        <i class="far fa-edit" style="pointer-events: none;"></i>
                    </button>
                    <button class="btn-delete btn-sm btn-link" data-index="${index}">
                        <i class="far fa-trash-alt" style="pointer-events: none;"></i>
                    </button>
                </div>
            </div>
            <div class="task-details">
                <div><strong>Fecha de inicio:</strong> ${task.startDate}</div>
                <div><strong>Fecha de fin:</strong> ${task.endDate}</div>
                <div><strong>Propietario:</strong> ${task.owner}</div>
            </div>
        </div>
    `;

    taskList.appendChild(li);

    li.querySelector('.btn-done').addEventListener('click', () => {
      taskIsDone(index);
      li.querySelector('.task-text').classList.toggle('taskDone');
      task.isDone = !task.isDone; 
      saveTasks();
    });
  });
}




function addTask(e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const owner = document.getElementById('owner').value;

  if (taskText) {
    if (tasks.find(task => task.text === taskText)) {
      Swal.fire({
        title: 'Oops...',
        text: 'Esta tarea ya existe.',
      });
      return;
    }

    const newTask = {
      text: taskText,
      isDone: false,
      startDate: startDate,
      endDate: endDate,
      owner: owner,
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    displayTasks();
  }
}

function deleteTasksDone() {
  const uncompletedTasks = tasks.filter(task => !task.isDone);

  Swal.fire({
    title: '¿Eliminar todas las tareas completadas?',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      tasks = uncompletedTasks;
      saveTasks();
      displayTasks();
    }
  });
}


function editTask(index, newText) {
  tasks[index].text = newText;
  saveTasks();
  displayTasks();
}

function showEditPopup(index) {
  Swal.fire({
    title: 'Editar',
    input: 'text',
    inputValue: tasks[index].text,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar'
  }).then((result) => {
    if (result.isConfirmed) {
      const newText = result.value.trim();
      if (newText) {
        editTask(index, newText);
      }
    }
  })
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
}

taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-edit')) {
    const index = e.target.dataset.index;
    showEditPopup(index);
  } else if (e.target.classList.contains('btn-delete')) {
    const index = e.target.dataset.index;
    deleteTask(index);
  } else if (e.target.classList.contains('btn-done')) {
    const index = e.target.dataset.index;
    taskIsDone(index);
    e.target.classList.toggle('btnIsDone');
    tasks[index].isDone = !tasks[index].isDone;
    saveTasks();
  }
});

taskForm.addEventListener('submit', addTask);

displayTasks();

function taskIsDone(index) {
  const taskItem = document.querySelectorAll('.list-group-item')[index];
  taskItem.querySelector('.task-text').classList.toggle('taskDone');
  saveTasks();
}

function deleteTasksDone() {
  const uncompletedTasks = [];

  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].isDone) {
      uncompletedTasks.push(tasks[i]);
    }
  }

  Swal.fire({
    title: '¿Eliminar todas las tareas completadas?',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      tasks = uncompletedTasks;
      saveTasks();
      displayTasks();
    }
  });
};

window.addEventListener('load', loadTasks);
