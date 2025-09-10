import  "./styles.css";

import ProjectManager from "./allProjects";
import Project from "./project";
import Todo from "./todo";
import { getProjects, saveAllProjects } from "./storage";
import { displayAllProjects } from "./displayProjects";
import { initEvents } from "./events";
import AllProjects from "./allProjects";

const allProjects = new AllProjects();
// Get projects stored in memory
let listProjects = getProjects();
if(listProjects.projects) {
    //Populate allProjects
    listProjects.projects.forEach((element) => {
        
        const tempProject = new Project(element.title, element.id);
        element.todos.forEach(todo => {
            const tempTodo = new Todo(todo.id,todo.title, todo.description, todo.duedate, todo.priority);
            tempProject.addTodo(tempTodo);    
        });
    
        allProjects.addProject(tempProject);  
    });
    
}
else {
    //first time application is run, so create default project
    const tempProject = new Project('Default', Date.now());
    allProjects.addProject(tempProject);  
    saveAllProjects(allProjects);
}


//display projects  
displayAllProjects(allProjects);

//prepare for events
initEvents(allProjects);
