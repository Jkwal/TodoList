//Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const themeController = document.querySelector('#btnTheme');
// const search = document.querySelector("#searchInput")

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

const theme = localStorage.getItem('theme');
document.body.dataset.theme = theme;

// Cмена темы
themeController.addEventListener("click", changeTheme);

// Если в списке нет задач, то выводить "Список дел пуст"
checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask);

//Редактирование задачи
tasksList.addEventListener('click', (event) => {
    event.preventDefault()

    const action = event.target.dataset.action

    if (action === 'edit') {
        editTask(event)
    }
    if (action === 'done') {
        doneTask(event)
    }
    if (action === 'delete') {
        deleteTask(event)
    }
})


//Функции
function findTodoById(todoId) {
    return tasks.find((elem) => elem.id === todoId)
}

function changeTheme() {
    const themeName = document.body.getAttribute("data-theme");
    if (themeName === "light") {
        document.body.setAttribute("data-theme", "dark")
        localStorage.setItem('theme', "dark");
    } else {
        document.body.setAttribute("data-theme", "light")
        localStorage.setItem('theme', "light");
    }


}

function renderTask() {

    tasksList.innerHTML = null

    tasks.forEach(task => {
        const cssClass = task.done ? "task-title task-title--done" : "task-title";
        tasksList.innerHTML += `
            <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <button type="button" data-action="edit" class="btn-action">
						<img src="./img/pencil.svg" alt="Edit" width="18" height="18">
					</button>
				<span class="${cssClass}">${task.text}</span>
				<div class="task-item__buttons">
					<button type="button" data-action="done" class="btn-action">
						<img src="./img/tick.svg" alt="Done" width="18" height="18">
					</button>
					<button type="button" data-action="delete" class="btn-action">
						<img src="./img/cross.svg" alt="Done" width="18" height="18">
					</button>
				</div>
			</li>`;
    })

}

function addTask(event) {

    // Отменяем отправку формы
    event.preventDefault();

    // Достаем текст задачи из поля ввода
    const taskText = taskInput.value;

    // Описываем задачу в виде обьекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    //Добавляем задачу  в массив с задачами
    tasks.push(newTask);

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    //Рендерим задачу на странице
    renderTask();

    // Очищаем поле ввода и вовзращаем на него фокус
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {
    //Проверяем, если клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;

    // Проверяем, что клик был по кнопке "удалить задачу"
    const parentNode = event.target.closest('.list-group-item');

    //Определяем ID задачи
    const id = Number(parentNode.id);

    // Удаляем задачу через фильтрацию массива
    tasks = tasks.filter((task) => task.id !== id);

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage()

    // Удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
}

function doneTask(event) {

    //Проверяем, что клик был по кнопке "задача выполнена"
    const parentNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage()

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function editTask(event) {

    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);
    const task = findTodoById(id);

    taskInput.value = task.text;
    taskInput.focus();

    const edit = document.getElementById('edit');
    const create = document.getElementById('create')

    create.hidden = true;
    edit.hidden = false


    edit.onclick = (e) => {
        e.preventDefault()
        task.text = taskInput.value

        renderTask()
        create.hidden = false;
        edit.hidden = true
        taskInput.value = ''
    }
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
               <div class="empty-list__title">Список дел пуст</div>
            </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyList = document.querySelector('#emptyList');
        emptyList ? emptyList.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}








