import Todo from "./todo";
import Project from "./project";
import "./style.css";


var todo1 = new Todo("Testing123","","",1,"", false);
var todo2 = new Todo("Testing456","","",2,"", true);
var testTodos = [todo1,todo2];

const displayController = ((document) =>{
    function displayTodos(todos){
        console.log(todos);
        const todoContainer = document.querySelector(".todos");
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

        const dateInput = document.createElement("input");
        dateInput.classList.add("todo-date");
        card.appendChild(dateInput);

        const deleteButton = document.createElement("Button");
        deleteButton.classList.add("todo-delete");
        deleteButton.textContent = "X";
        card.appendChild(deleteButton);
        

        return card;
    }

    function getTodoPriorityClass(todo){
        if(todo.priority == 1) return "priority-one";
        if(todo.priority == 2) return "priority-two";
        if(todo.priority == 3) return "priority-three";
        if(todo.priority == 4) return "priority-four";
    }

    return {displayTodos};
})(document);

displayController.displayTodos(testTodos);