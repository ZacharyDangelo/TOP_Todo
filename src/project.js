export default class Project{
    constructor(name, todos){
        this.name = name;
        this.todos = todos;
    }

    addTodo(todo){
        this.todos.push(todo);
    }

    removeTodo(todo){
        this.todos = this.todos.filter((item) => item != todo);
    }

    
}