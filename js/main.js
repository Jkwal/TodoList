//Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const themeController = document.querySelector('#btnTheme');
const search = document.querySelector("#searchInput")

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

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

//Редактирование задачи
tasksList.addEventListener('click',editTask );


//Функции
function changeTheme() {
    const themeName = document.body.getAttribute("data-theme");
    if(themeName === "light"){
        document.body.setAttribute("data-theme", "dark")
        localStorage.setItem('theme', "dark");
    }else{
        document.body.setAttribute("data-theme", "light")
        localStorage.setItem('theme', "light");
    }


}

function renderTask(task) {
    // Формируей Css класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Формируем разметку для новой задачи
    const taskHTML = `
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

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
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
    renderTask(newTask);

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
    //Проверяем, что клик был НЕ по кнопке "задача выполнена"
    if (event.target.dataset.action !== "done") return;

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
    //Проверяем, что клик был НЕ по кнопке "задача выполнена"
    if (event.target.dataset.action !== 'edit') return;

    //Проверяем, что клик был по кнопке "задача выполнена"
    const parentNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);

    taskInput.value = task.text;
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

////////////////////////////////////////////////
search.oninput = function (){
    let val = this.value.trim();
    let elasticItems = document.querySelectorAll('#tasksList li')
    console.log(val)
    console.log(elasticItems)
    if(val != ''){
        elasticItems.forEach(function (elem){
            if(elem.innerText.search(val) == -1){
                elem.classList.add('hide')
            } else {
                elem.classList.remove('hide')
            }
        })
    }
}
////////////////////////////////////////////////


