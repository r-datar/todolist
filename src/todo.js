export default class Todo {
    constructor(id,title, description, duedate, priority){
        if (id) this.id = id; 
        this.title = title;
        if(description)  this.description = description;
        if(duedate) this.duedate = duedate;
        if(priority) this.priority = priority;
    }

    editTodo(titleVal, descVal, duedateVal, priorityVal) {
        this.title = titleVal;
        this.description = descVal;
        this.duedate = duedateVal;
        this.priority = priorityVal;
        //console.log(this)
    }
}

