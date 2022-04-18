import Todo from "./todo";
import Project from "./project";
import "./style.css";
import EditIcon from "./edit.svg";
import DeleteIcon from "./delete.svg";
import {format, formatDistance, formatRelative, subDays} from 'date-fns';


var todo1 = new Todo("Testing123","","1/2/2022",1,"", false);
var todo2 = new Todo("Testing456","","3/16/1996",2,"", true);
var testTodos = [todo1,todo2];

var project = new Project("Main", testTodos);
var project2 = new Project("Guitar", []);
var project3 = new Project("Game Development", [new Todo("Finish State Machine", "", "4/21/2022",2,"", false)]);
var project4 = new Project("Web Dev", [todo2]);

var projects = [project, project2, project3, project4];

const displayController = ((document) =>{
    var isEditing = false;
    var currentProject = projects[0];

    function displayTodos(){
        var todos = currentProject.todos;
        const inboxHeader = document.querySelector("#inbox-header");
        inboxHeader.textContent = `${currentProject.name} Inbox`;

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
        dateText.textContent = formatDistance(new Date(), new Date(todo.dueDate), {addSuffix: true});
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
        const card_param = evt.currentTarget.card_param;
        const todo_param = evt.currentTarget.todo_param;

        while(card_param.firstChild){
            card_param.removeChild(card_param.firstChild);
        }
        card_param.classList.remove("completed");
        card_param.classList.add("new-todo-form");
        
        
        const saveTodoButton = document.createElement("button");
        card_param.appendChild(saveTodoButton);


        saveTodoButton.id = "edit-todo-button";
        saveTodoButton.textContent = "Save Todo";


        const titleInput = document.createElement("input");
        titleInput.classList.add("new-todo-title");
        titleInput.value = todo_param.title;
        card_param.appendChild(titleInput);

        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.classList.add("new-todo-date");
        dateInput.placeholder = todo_param.dueDate;
        card_param.appendChild(dateInput);

        const priorityLabel = document.createElement("label");
        priorityLabel.textContent = "priority";
        card_param.appendChild(priorityLabel);
        const priorityInput = document.createElement("select");
        priorityInput.classList.add("new-todo-priority");
        for(var i = 1; i<=4; i++){
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = i;
            priorityInput.appendChild(opt);
        }
        card_param.appendChild(priorityInput);

        
        saveTodoButton.addEventListener("click", saveTodoEdit);
        saveTodoButton.card_param = card_param;
        saveTodoButton.todo_param = todo_param;

    }

    function deleteTodo(evt){
        currentProject.removeTodo(evt.currentTarget.todo_param);
        displayTodos();
    }

    function saveTodoEdit(evt){
        const card_param = evt.currentTarget.card_param;
        const todo_param = evt.currentTarget.todo_param;
        
        const titleInput = card_param.querySelector(".new-todo-title").value || todo_param.title;
        const dateInput = card_param.querySelector(".new-todo-date").value || todo_param.dueDate;
        const priorityInput = card_param.querySelector(".new-todo-priority") || todo_param.priority;

        todo_param.title = titleInput;
        todo_param.dueDate = dateInput;
        todo_param.priority = priorityInput;

        displayController.displayTodos();
    }

    function setCurrentProject(project){
        currentProject = project;
        displayTodos();
    }

    function displaySidebar(){
        const container = document.querySelector(".projects-container");
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
        projects.forEach( (proj) =>{
            const elem = document.createElement("button");
            elem.classList.add("sidebar-project");
            elem.textContent = proj.name;
            if(proj.name == currentProject.name) elem.classList.add("current-project");
            elem.addEventListener("click", () => setCurrentProject(proj));
            elem.proj_param = proj;
            container.appendChild(elem);
        });
    }

    function getCurrentProject(){
        return currentProject;
    }

    return {displayTodos, displaySidebar, setCurrentProject, getCurrentProject};
})(document);


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
    displayController.getCurrentProject().addTodo(newTodo);
    displayController.displayTodos(testTodos);


    titleInput.value = "";
    dateInput.value = "";
    priorityInput.value = 4;
}

function addProject(evt){
    const nameInput = document.querySelector("#new-project-name");
    if(!nameInput.value){
        alert("Name cannot be blank!");
        return;
    }
    var newProject = new Project(nameInput.value, []);
    projects.push(newProject);
    nameInput.value = "";
    displayController.displaySidebar();
}

const addTodoButton = document.querySelector("#new-todo-button");
addTodoButton.addEventListener("click", addTodo);
const addProjectButton = document.querySelector("#new-project-button");
addProjectButton.addEventListener("click", addProject);
displayController.setCurrentProject(projects[0]);
displayController.displaySidebar();
displayController.displayTodos();