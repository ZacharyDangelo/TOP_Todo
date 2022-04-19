

export default class Todo{
    constructor(title, description, dueDate, priority, notes, isComplete){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.isComplete = isComplete;
    }

    changePriority(newPriority){
        this.priority = newPriority;
    }

    setComplete(newStatus){
        this.isComplete = newStatus;
    }

    getPriorityClass(){
        if(this.priority == 1) return "priority-one";
        if(this.priority == 2) return "priority-two";
        if(this.priority == 3) return "priority-three";
        if(this.priority == 4) return "priority-four";
    }


}