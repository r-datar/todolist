
import { displayAllProjects, displayProjectTitle, displayProjectTodos, displayAddNewTodo, getProjectIDFromTargetID, clearProjectDetailsDisplay } from "./displayProjects";
import Project from "./project";
import Todo from "./todo";

import AllProjects from "./allProjects";
import { saveAllProjects } from "./storage";

export function initEvents(allProjects) {
    const add_project = document.querySelector("div.add-project");
    const projects_div = document.querySelector("div.all-projects");
    const project_container = document.querySelector("div.project-container")
    const add_todo_input = document.querySelector(".add-todo-title");
    
        //event handler for 'add project'
    add_project.addEventListener("click",() => {
    //call function to add the project name    
        let newProject = new Project('Today\'s Tasks');
        newProject.id = Date.now();
        allProjects.addProject(newProject);
        saveAllProjects(allProjects);
        displayAllProjects(allProjects);
    });

    //event handler for project details
    projects_div.addEventListener("click",(event) => {

        clearProjectDetailsDisplay();
        //display project name and allow edit
        displayProjectTitle(event.target.id, event.target.innerText);
        displayProjectTodos(event.target.id, allProjects);
        displayAddNewTodo(event.target.id);

        allProjects.setNowShowing(getProjectIDFromTargetID(event.target.id));
        //console.log(allProjects.getNowShowing());
    });

    project_container.addEventListener("change", (event) => {
        //event.target.id = project-1757069052157

        let projectID = getProjectIDFromTargetID(event.target.id);
        let i = allProjects.projects.findIndex(element => element.id == projectID);
        if( i >= 0 ) {
            //update title
            allProjects.projects[i].title = event.target.value;
            saveAllProjects(allProjects);
            displayAllProjects(allProjects);
        }
    });

    add_todo_input.addEventListener("change", (event) => {
        //capture changed data and save it
        //updateTodo(event,"title");
        let newTodo = new Todo(Date.now(), event.target.value,'','','');
        let projectID = getProjectIDFromTargetID(event.target.id);
        let i = allProjects.projects.findIndex(element => element.id == projectID);
        if( i >= 0 ) {
            allProjects.projects[i].addTodo(newTodo);
            //console.log(allProjects.projects[i], newTodo)
        }    
        saveAllProjects(allProjects);

        //Clear display and show existing todos plus add todo 
        clearProjectDetailsDisplay();
        displayProjectTitle(projectID, allProjects.projects[i].title);
        displayProjectTodos(projectID, allProjects);
        //requires project-123456, so send event id
        displayAddNewTodo(event.target.id);
    });

    

}
