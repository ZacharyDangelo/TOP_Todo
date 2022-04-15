import Todo from "./todo";
import Project from "./project";


var todo1 = new Todo("Testing123","","",1,"",false);
var todo2 = new Todo("Testing456","","",1,"",false);
var testTodos = [todo1,todo2];

const displayController = ((document) =>{
    function displayTodos(todos){
        console.log(todos);
        const todoContainer = document.querySelector(".root");
        todos.forEach( (todo) => {
            const card = createTodoCard(todo);
            todoContainer.appendChild(card);
        });
    }

    function createTodoCard(todo){
        console.log(todo);
        const elem = document.createElement("p");
        elem.textContent = todo.title;
        return elem;
    }

    return {displayTodos};
})(document);

displayController.displayTodos(testTodos);