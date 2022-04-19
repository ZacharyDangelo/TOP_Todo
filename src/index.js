import Todo from "./todo";
import Project from "./project";
import "./style.css";
import EditIcon from "./edit.svg";
import DeleteIcon from "./delete.svg";
import InfoIcon from "./info.svg";
import {format, formatDistance, formatRelative, subDays} from 'date-fns';

var projects = [];
if(localStorage.getItem('projects')){
    var localProjects = localStorage.getItem('projects');
    console.log(localProjects);
    var decodedProjects = JSON.parse(localProjects);
    console.log(decodedProjects);
    decodedProjects.forEach((projObj) =>{
        var project = new Project(projObj.name,[]);
        projObj.todos.forEach((todoObj) =>{
            var todo = new Todo(todoObj.title, todoObj.description, todoObj.dueDate, parseInt(todoObj.priority), todoObj.notes, todoObj.isComplete);
            project.todos.push(todo);
        });
        projects.push(project);
    });
}
else{
    var todo1 = new Todo("This is an example Todo","This is it's description!","9/30/2022",4,"", false);
    var todo2 = new Todo("Buy Groceries","","4/16/2022",2,"", true);
    var testTodos = [todo1,todo2];
    var mainProject = new Project("Main", testTodos);
    projects.push(mainProject);
}



const displayController = ((document) =>{
    var isEditing = false;
    var currentProject = projects[0];
    var expandedTodo = null;

    function displayTodos(){
        const newTodoForm = document.querySelector(".new-todo-form");
        if(currentProject.name == "High Priority" || currentProject.name == "Upcoming" || currentProject.name == "Overdue"){
            newTodoForm.classList.add("invisible");
        }
        else{
            newTodoForm.classList.remove("invisible");
        }

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
        card.classList.add(todo.getPriorityClass());
        if(todo.isComplete) card.classList.add("completed");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.classList.add("todo-checkbox");
        if(todo.isComplete) checkBox.checked = true;
        checkBox.addEventListener("change", () => {
            card.classList.toggle("completed");
            todo.isComplete = !todo.isComplete;
            localStorage.setItem('projects', JSON.stringify(projects));   
        })
        card.appendChild(checkBox);

        const title = document.createElement("h4");
        title.classList.add("todo-title");
        title.textContent = todo.title;
        card.appendChild(title);

        const dateText = document.createElement("p");
        dateText.classList.add("todo-date");
        dateText.textContent = formatDistance(new Date(todo.dueDate), new Date(), {addSuffix: true});
        card.appendChild(dateText);

        const infoButton = document.createElement("input");
        infoButton.type = "image";
        infoButton.src = InfoIcon;
        infoButton.classList.add("todo-info");
        infoButton.addEventListener("click", displayTodoInfo);
        infoButton.todo_param = todo;
        infoButton.card_param = card;
        card.appendChild(infoButton);

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

    function displayEditTodo(evt){
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
        localStorage.setItem('projects', JSON.stringify(projects));   
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

        localStorage.setItem('projects', JSON.stringify(projects));   
        displayController.displayTodos();
    }

    function setCurrentProject(project){
        currentProject = project;
        displaySidebar();
        displayTodos();
    }

    function displaySidebar(){
        displayInboxes();
        displayProjects();
    }

    function displayInboxes(){
        const container = document.querySelector(".inboxes-container");
        container.querySelectorAll(".sidebar-project").forEach((node)=>{
            if(node.textContent == currentProject.name) node.classList.add("current-project");
            else node.classList.remove("current-project");
        });
    }

    function displayProjects(){
        const container = document.querySelector(".projects-container");
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
        projects.forEach( (proj) =>{
            const elem = document.createElement("button");
            elem.classList.add("sidebar-project");
            elem.textContent = proj.name;
            if(proj.name == currentProject.name) elem.classList.add("current-project");
            if(proj.name != currentProject.name) elem.classList.remove("current-project");
            elem.addEventListener("click", () => setCurrentProject(proj));
            elem.proj_param = proj;
            container.appendChild(elem);
        });
    }

    function getCurrentProject(){
        return currentProject;
    }


    function displayTodoInfo(evt){
        const infoWindow = document.querySelector(".todo-info-window");
        infoWindow.classList.remove("invisible");
        var todo = evt.currentTarget.todo_param;
        expandedTodo = todo;
        infoWindow.querySelector("#info-window-todo-title").textContent = todo.title;
        infoWindow.querySelector("#todo-description").value = todo.description;
        infoWindow.querySelector("#todo-info-date").valueAsDate = new Date(todo.dueDate);
        infoWindow.querySelector("#todo-info-priority").value = todo.priority;
    }

    function saveTodoInfo(){
        const infoWindow = document.querySelector(".todo-info-window");
        if(expandedTodo == null){
            console.log("ERROR SAVING TODO INFO: NO TODO EXPANDED");
            return;
        }
        const descriptionInput = infoWindow.querySelector("#todo-description");
        const dueDateInput = infoWindow.querySelector("#todo-info-date");
        const priorityInput = infoWindow.querySelector("#todo-info-priority");
        var todo = expandedTodo;

        todo.description = descriptionInput.value;
        todo.dueDate = dueDateInput.value;
        todo.priority = priorityInput.value;
        infoWindow.classList.add("invisible");
        expandedTodo = null;
        displayTodos();     
        localStorage.setItem('projects', JSON.stringify(projects));   

    }


    function createHighPriorityInbox(){
        var highPriorityProject = new Project("High Priority",[]);
        highPriorityProject.createHighPriorityList(projects);
        console.log(highPriorityProject);
        currentProject = highPriorityProject;
        displayTodos();
        displaySidebar();
    }
    function createUpcomingInbox(){
        var upcomingProject = new Project("Upcoming",[]);
        upcomingProject.createUpcomingList(projects);
        console.log(upcomingProject);
        currentProject = upcomingProject;
        displayTodos();
        displaySidebar();
    }
    function createOverdueInbox(){
        var overdueProject = new Project("Overdue",[]);
        overdueProject.createOverdueList(projects);
        console.log(overdueProject);
        currentProject = overdueProject;
        displayTodos();
        displaySidebar();
    }


    (function registerClickEvents(){
        const infoCloseButton = document.querySelector("#close-info-window-icon");
        infoCloseButton.addEventListener("click", () => {
            document.querySelector(".todo-info-window").classList.add("invisible");
        })

        const saveInfoButton = document.querySelector("#save-todo-info-button");
        saveInfoButton.addEventListener("click", saveTodoInfo);

        const cancelInfoButton = document.querySelector("#cancel-todo-info-button");
        cancelInfoButton.addEventListener("click", () => {
            document.querySelector(".todo-info-window").classList.add("invisible");
        })

        const highPriorityButton = document.querySelector("#high-priority-button");
        const upcomingButton = document.querySelector("#upcoming-button");
        const overdueButton = document.querySelector("#overdue-button");

        highPriorityButton.addEventListener("click", createHighPriorityInbox);
        upcomingButton.addEventListener("click", createUpcomingInbox);
        overdueButton.addEventListener("click", createOverdueInbox);
        

    })();



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
    localStorage.setItem('projects', JSON.stringify(projects));
}

function addProject(evt){
    const nameInput = document.querySelector("#new-project-name");
    if(!nameInput.value){
        alert("Name cannot be blank!");
        return;
    }
    if(nameInput.value == "High Priority" || nameInput.value == "Overdue" || nameInput.value == "Upcoming"){
        alert("Name cannot be the same as the inboxes.");
        nameInput.value = "";
        return;
    }
    var newProject = new Project(nameInput.value, []);
    projects.push(newProject);
    nameInput.value = "";
    displayController.displaySidebar();
    localStorage.setItem('projects', JSON.stringify(projects));
}

const addTodoButton = document.querySelector("#new-todo-button");
addTodoButton.addEventListener("click", addTodo);
const addProjectButton = document.querySelector("#new-project-button");
addProjectButton.addEventListener("click", addProject);
displayController.setCurrentProject(projects[0]);
displayController.displaySidebar();
displayController.displayTodos();

localStorage.setItem('projects', JSON.stringify(projects));