import {addProject, getCurrentProject, getProjects, saveEditedProject} from "./project"
import { saveTodo, updateTodo, deleteTodo, getTodosForProject } from "./todo";

// Show default project 
const projects_div = document.querySelector("div.all-projects");
const add_project = document.querySelector("div.add-project");
const content_div = document.querySelector("div.content");
var addedTodo = false;
var currProjName = '', currProjID = 0; 
var addTodoText = "add new task";
const todoPriority = {"Low": "Low","Medium" : "Medium","High":"High"}; 

//const  add_todo_title_input = document.querySelector("input.input-add-todo-title");

export const displayProjects = () => {


    // if local storage has projects , show them
    if(localStorage.length) {
        //reset 
        projects_div.innerHTML = "";

        let listProjects = getProjects();
        listProjects.forEach((element) => {
        
            for (const [projID, projName] of Object.entries(element)) {
            
                //show each project
                displaySingleProject(projID, projName);
                
            }  
        });
  
    }

}

function displaySingleProject(key, value) {
    var projects_div_list = document.createElement("div");
    projects_div_list.className = `project`;
    projects_div_list.id = `project-` + key;
    projects_div_list.innerText = value;
    //Add to parent div
    projects_div.appendChild(projects_div_list);
}



function displayProjectDetails(targetId, targetText) {
    
    //Clear screen
    clearProjectDetailsDisplay();

    currProjName = targetText; 
    
    //function called from event or directly
    const projectID = targetId.includes("-") ? getProjectIDFromTargetID(targetId) : targetId;

    currProjID = projectID;

    var projectNameDiv = document.createElement("div");
    projectNameDiv.className = "project-container";
    projectNameDiv.id = targetId;
    content_div.appendChild(projectNameDiv); 

    var project_name = document.createElement("input");
    project_name.className = "project-name";
    project_name.type = "text";
    project_name.name = "project_name";
    project_name.id = targetId;
    project_name.value = targetText;
    

    project_name.addEventListener("change", (event) => {
        //capture changed data and save it
        saveEditedProject(event);
        displayProjects();
    });

    projectNameDiv.appendChild(project_name);

    let time_now = Date.now();

    var todoListDiv = document.createElement("div");
    todoListDiv.className = "todo_list";
    todoListDiv.id = "todo-list";
    content_div.appendChild(todoListDiv);

    //In todolistdiv show all existing todos for this proj followed by add todo

    
    var todo_name, todoDiv, todoNameDiv;
    //Display existing todos
    let todosForProject = getTodosForProject(projectID);
    //console.log('In displayProjectDetails all todos for project=>',todosForProject)
    if(todosForProject) {
        todosForProject.forEach(element => {

            //wrapper for a todo
            let elementId = `wrap-todo-` + element.todo + `-project-` + element.project; 
            createDivElement(todoListDiv,"wrap-existing-todo", elementId);
            let wrapperDiv = document.getElementById(elementId);

            //container for title input element
            elementId = `container-` + `todo-` + element.todo + `-project-` + element.project; 
            createDivElement(wrapperDiv,"contain-todo-title", elementId);
            let titleContainDiv = document.getElementById(elementId);

            //title input element
            elementId = `todo-` + element.todo + `-project-` + element.project;
            createInputElement(titleContainDiv,"input-todo-title", elementId, "text", element.title, "todo_title");
            let addTodoInputElement =  document.getElementById(elementId);

            //container for todo details
            elementId = `container-` + `details-` + element.todo + `-project-` + element.project; 
            createDivElement(wrapperDiv,"contain-todo-details", elementId,"display:none");
            var detailsContainDiv =  document.getElementById(elementId);
            detailsContainDiv.innerHTML = displayTodoDetails(element);

            //show hide details
            addTodoInputElement.addEventListener("click", (event) => {
                var currStyle = detailsContainDiv.style.display;

                if (currStyle === "none") {
                    detailsContainDiv.style.display = "flex";    
                }
                else {
                    detailsContainDiv.style.display = "none";
                }
            });

            //edit change todo title
            addTodoInputElement.addEventListener("change", (event) => {
                //capture changed data and save it
                updateTodo(event,"title");
            });

            let addDescInputElement = document.getElementById(`tododesc-${element.todo}-project-${element.project}`);
            addDescInputElement.addEventListener("change",(event) => {
                updateTodo(event,"desc");
            });

            let addDateInputElement = document.getElementById(`tododate-${element.todo}-project-${element.project}`);
            addDateInputElement.addEventListener("change",(event) => {
                updateTodo(event,"date");
            }); 
        
            let addPrioritySelectElement = document.getElementById(`todopriority-${element.todo}-project-${element.project}`);
                addPrioritySelectElement.addEventListener("change",(event) => {
                updateTodo(event,"priority");
            });
        
            let btnDelete = document.getElementById(`del-todo-${element.todo}-project-${element.project}`);
            btnDelete.addEventListener("click",(event) => {
                deleteTodo(event.target.id);
                displayProjectDetails(currProjID, currProjName);
                displayAddNewTodo(null,currProjID);  
            });


        });
        
    }
}

function displayAddNewTodo(parentDiv, targetId) {
    
    //associate the add todo div to main content div as default
    if(parentDiv == null) {
        parentDiv =  document.querySelector("div.content");
    }

    //get only the project ID
    //const projectID = getProjectIDFromTargetID(targetId);    
    const projectID = targetId.includes("-") ? getProjectIDFromTargetID(targetId) : targetId;
    console.log('In displayAddNewTodo projectID', projectID)
    //assign current time
    var time_now = Date.now();

    //wrapper div
    let elementId = `wrap-todo-` + time_now + `-project-` + projectID;
            
    //create wrapper div for add todo 
    createDivElement(parentDiv,"wrap-add-new-todo", elementId);
    //get reference to div generated above
    let wrapperDiv = document.getElementById(elementId);


    //create container div for add todo
    elementId = `container-` + `todo-` + time_now + `-project-` + projectID;
    createDivElement(wrapperDiv,"contain-todo-title",elementId)
    //get reference to div generated above
    let titleContainDiv = document.getElementById(elementId);

    //create input element for add todo
    elementId =`todo-` + time_now + `-project-` + projectID ;
    createInputElement(titleContainDiv,"input-add-todo-title", elementId, "text", "", "todo_title",addTodoText);
    
    //get reference to input element generated above
    let addTodoInputElement =  document.getElementById(elementId);
    addTodoInputElement.addEventListener("keydown",(event) => {
        //other classes should also change after save??
        
        if(event.key == "Enter") {
            //save only if default text has changed
            if( event.target.value !== addTodoText && event.target.value.trim().length !== 0 ) {
                saveTodo(event);
                //console.log('In event listener for focus -- enter : Proj ID ',currProjID,' and name:', currProjName)
                displayProjectDetails(currProjID, currProjName);
                displayAddNewTodo(null,currProjID);  
            } 
            

        }
        
         //display project name and allow edit
        // displayProjectDetails(event.target.id, event.target.innerText);

         
    });
    
       
    //when clicked, show details ----
    //addTaskInputElement.addEventListener("click",(event) => {saveTodo(event);});
}

function createDivElement(parentElement,className, elementId,style) {
    var newDiv;
    newDiv =  document.createElement("div");
    newDiv.className = className;
    newDiv.id = elementId;
    style != undefined
        newDiv.style = style;
    // text != undefined 
    //     newDiv.innerText = text    
    parentElement.appendChild(newDiv);
}

function createInputElement(parentElement,className,elementId,type,elementValue, elementName,placeHolder) {
    var newInput;
    newInput = document.createElement("input");
    newInput.className = className;
    newInput.type = type;
    newInput.name = elementName;
    newInput.id = elementId;
    elementValue !== "" 
        newInput.value = elementValue;
    placeHolder != undefined 
        newInput.placeholder = placeHolder;
    parentElement.appendChild(newInput);
}

function getProjectIDFromTargetID(targetId) {
    // Get the projectID
    let temp = targetId.split("-");    
    let projectID = temp[1]; //project-xxxxxxxx
    return projectID;
}

function getProjectIDFromTodoTargetID(targetId) {
    // Get the projectID
    let temp = targetId.split("-");    
    let projectID = temp[3]; //todo-xxxxxx-project-xxxxxxxx
    return projectID;
}



function clearProjectDetailsDisplay() {
    //reset previous display
    content_div.innerHTML = "";
    if (content_div.hasChildNodes()) {
        content_div.removeChild("input.project_name") ;
    }
}

function displayTodoDetails(element) {
    var detailsElements = '';

    detailsElements += displayTodoDescription(element.todo,element.project, element.desc);
    detailsElements += displayTodoDate(element.todo,element.project, element.date);
    detailsElements += displayTodoPriority(element.todo,element.project, element.priority);
    detailsElements += displayTodoDeleteButton(element.todo, element.project);
    return detailsElements;
}

function displayTodoPriority(todoID, projectID, priorityValue) {
    var inputID = "todopriority-" + todoID + "-project-" + projectID;
    
    var selectString = `<label for=${inputID}>Priority</label>
    <select id=${inputID} class="todopriority-select">`;
    var optionString = '', selectedValue;

        for (const [key, value] of Object.entries(todoPriority)) {
            console.log(`${key} ${value}`);
            if(`${key}` == priorityValue) {
                selectedValue = "selected";
            }
            else {
                selectedValue = "";
            }
            optionString +=  `<option value=${key} ${selectedValue}>${value}</option>`;
        }
            
        selectString += optionString;
        
        selectString += `</select>`;

        return selectString;
}

function displayTodoDescription(todoID, projectID,descValue) {
    var inputID = "tododesc-" + todoID + "-project-" + projectID;
    
    if(descValue == undefined) {
        descValue = "";
    }
    return `<label for=${inputID}>Description</label>
            <input type="text" placeholder="Add description" id=${inputID} class="tododesc-input" value="${descValue}">`;
}

function displayTodoDeleteButton(todoID, projectID) {
    var btnID = "del-todo-" + todoID + "-project-" + projectID;
    return `<button type="button" id=${btnID} class="todo-delete-button">Delete</button> `; 
}


function displayTodoDate(todoID, projectID, dateValue) {
    var inputID = "tododate-" + todoID + "-project-" + projectID; 
    return `<label for=${inputID}>Date</label><input type="date" id=${inputID} class="todo-date-input" value="${dateValue}">`; 
}

//Event listeners
add_project.addEventListener("click",() => {
    //call function to add the project name    
    addProject('Today\'s Tasks');
    displayProjects();
});


//When project name is clicked, display details
projects_div.addEventListener("click",(event) => {

    //display project name and allow edit
    displayProjectDetails(event.target.id, event.target.innerText);

    displayAddNewTodo(null,event.target.id);
});


