export default class Project {

    constructor(title,id) {
        if(id) this.id = id
        this.title = title;
        this.todos = [];
    }

    edit(title) {
        this.title = title;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(id) {
        this.todos = this.todos.filter(todo =>todo.id !== id);

    }
        
}


// export const addProject = (name) => {
//     var newProject = new Project(name);
//     saveNewProject(newProject);
//     //currently made project is available here
// }


