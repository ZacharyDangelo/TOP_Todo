import Todo from "./todo";
import Project from "./project";
import "./style.css";
import EditIcon from "./edit.svg";
import DeleteIcon from "./delete.svg";


var todo1 = new Todo("Testing123","","1/2/2022",1,"", false);
var todo2 = new Todo("Testing456","","3/16/1996",2,"", true);
var testTodos = [todo1,todo2];

const displayController = ((document) =>{
    function displayTodos(todos){
        console.log(todos);
        const todoContainer = document.querySelector(".todos");
        while(todoContainer.firstChild){
            todoContainer.removeChild(todoContainer.firstChild);
        }

        todos.forEach( (todo) => {
            const card = createTodoCard(todo);
            todoContainer.appendChild(card);
        });
    }

    function createTodoCard(todo){
        const card = document.createElement("div");
        card.classList.add("todo-card");
        card.classList.add(getTodoPriorityClass(todo));
        if(todo.isComplete) card.classList.add("completed");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.classList.add("todo-checkbox");
        card.appendChild(checkBox);

        const title = document.createElement("h4");
        title.classList.add("todo-title");
        title.textContent = todo.title;
        card.appendChild(title);

        const dateText = document.createElement("p");
        dateText.classList.add("todo-date");
        dateText.textContent = todo.dueDate;
        card.appendChild(dateText);

        const editButton = document.createElement("input");
        editButton.type = "image";
        editButton.src = EditIcon;
        editButton.classList.add("todo-edit");
        editButton.addEventListener("click", displayEditTodo);
        editButton.todo_param = todo;
        editButton.card_param = card;
        card.appendChild(editButton);



        const deleteButton = document.createElement("input");
        deleteButton.type = "image";
        deleteButton.src = DeleteIcon;
        deleteButton.classList.add("todo-delete");
        deleteButton.addEventListener("click", deleteTodo);
        deleteButton.todo_param = todo;
        deleteButton.card_param = card;

        card.appendChild(deleteButton);
        

        return card;
    }

    function getTodoPriorityClass(todo){
        if(todo.priority == 1) return "priority-one";
        if(todo.priority == 2) return "priority-two";
        if(todo.priority == 3) return "priority-three";
        if(todo.priority == 4) return "priority-four";
    }


    function displayEditTodo(evt){
        console.log(evt.currentTarget.todo_param);
        console.log(evt.currentTarget.card_param);
    }

    function deleteTodo(evt){
        console.log(evt.currentTarget.todo_param);
        console.log(evt.currentTarget.card_param);
    }

    return {displayTodos};
})(document);

displayController.displayTodos(testTodos);
const addTodoButton = document.querySelector("#new-todo-button");
addTodoButton.addEventListener("click", addTodo);


function addTodo(evt){
    const titleInput = document.querySelector("#new-todo-title");
    const dateInput = document.querySelector("#new-todo-date");
    const priorityInput = document.querySelector("#new-todo-priority");

    if(!titleInput.value){
        alert("Title cannot be blank!");
        return;       
    }
    if(!dateInput.value){
        alert("Date cannot be blank!");
        return;
    }
    
    var newTodo = new Todo(titleInput.value, "description", dateInput.value, priorityInput.value, "notes", false);
    testTodos.push(newTodo);
    displayController.displayTodos(testTodos);


    titleInput.value = "";
    dateInput.value = "";
    priorityInput.value = 4;
}