document.addEventListener("DOMContentLoaded", function () {
    const todoForm = document.querySelector("form");
    const todoInput = document.getElementById("todo-input")
    const todoListUl = document.getElementById("todo-list")

    let allTodos = getTodos();
    updateTodoList();

    todoForm.addEventListener("submit", function(e){
        e.preventDefault();
        addTodo();
    })

    function addTodo() {
        const todoText = todoInput.value.trim();

        if (todoText === "") {
            alert("Please enter the task you want to save.");
            return;
        }

        const todoObject = {
            text: todoText,
            completed: false,
            locked: false
        }

        allTodos.push(todoObject);
        updateTodoList();
        saveToDos();
        todoInput.value = "";
    }

    function updateTodoList() {
        todoListUl.innerHTML = "";
        allTodos.forEach((todo, todoIndex) => {
            todoItem = createTodoItem(todo, todoIndex);
            todoListUl.append(todoItem)
        })
    }

    function createTodoItem(todo, todoIndex) {
        const todoId = "todo" + todoIndex;
        const todoLI = document.createElement("li");
        const todoText = todo.text;

        todoLI.className = "todo";
        todoLI.innerHTML = `
            <input type="checkbox" id="${todoId}">
            <label for="${todoId}" class="custom-checkbox">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                </svg>
            </label>
            <label for="${todoId}" class="todo-text">${todoText}</label>

            <button class="lock-button">
                ${todo.locked ? getLockIcon() : getUnlockIcon()}
            </button>

            <button class="delete-button">
                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28.5" height="28.5" viewBox="0 0 16 16">
                    <path d="M6.5 1C5.68 1 5 1.68 5 2.5V3H2v1h1v8.5c0 .83.67 1.5 1.5 1.5h6c.83 0 1.5-.67 1.5-1.5V4h1V3h-3V2.5c0-.82-.68-1.5-1.5-1.5H6.5zM6 2.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5V3H6V2.5zM5 5h1v6H5V5zm2 0h1v6H7V5zm2 0h1v6h-1V5z"/>
                </svg>
            </button>
        `;

        const deleteButton = todoLI.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
            if (allTodos[todoIndex].locked) {
                alert("You must unlock this task for delete.");
                return;
            }
            if (confirm("Are you sure of delete this task?")) {
                deleteTodoItem(todoIndex);
            }
        });

        const checkbox = todoLI.querySelector("input");
        checkbox.addEventListener("change", () => {
            allTodos[todoIndex].completed = checkbox.checked;
            saveToDos();
        });
        checkbox.checked = todo.completed;

        const lockButton = todoLI.querySelector(".lock-button");
        lockButton.addEventListener("click", () => {
            allTodos[todoIndex].locked = !allTodos[todoIndex].locked;
            saveToDos();
            updateTodoList();
        });

        return todoLI;
    }

    function getLockIcon() {
        return `
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
            </svg>
        `;
    }

    function getUnlockIcon() {
        return `
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-unlock-fill" viewBox="0 0 16 16">
                <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2"/>
            </svg>
        `;
    }

    function deleteTodoItem(todoIndex) {
        allTodos = allTodos.filter((_, i) => i !== todoIndex);
        saveToDos();
        updateTodoList();
    }

    function saveToDos() {
        const todosJson = JSON.stringify(allTodos);
        localStorage.setItem("todos", todosJson);
    }

    function getTodos() {
        const todos = localStorage.getItem("todos") || "[]";
        return JSON.parse(todos);
    }
});