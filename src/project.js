import {format, formatDistance, formatRelative, subDays, addDays, differenceInDays} from 'date-fns';

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

    createHighPriorityList(projects){
        projects.forEach( proj =>{
            proj.todos.forEach( todo =>{
                if(todo.priority == 1) this.todos.push(todo);
            });
        });
    }

    createOverdueList(projects){
        console.log(projects);
        projects.forEach( proj =>{
            proj.todos.forEach( todo =>{
                console.log(todo);
                if(new Date(todo.dueDate) < new Date() && !todo.isComplete){
                    this.todos.push(todo);
                }
            });
        });
    }

    createUpcomingList(projects){
        projects.forEach( proj =>{
            proj.todos.forEach( todo =>{
                console.log(`${todo.title} : ${todo.dueDate} : ${differenceInDays(new Date(todo.dueDate), new Date())}`);
                if(differenceInDays(new Date(todo.dueDate), new Date()) > 0 && differenceInDays(new Date(todo.dueDate), new Date()) <= 7 && !todo.isComplete){
                    this.todos.push(todo);
                }
            });
        });
        this.todos.sort( (a,b) => a.dueDate > b.dueDate);
    }


    
}