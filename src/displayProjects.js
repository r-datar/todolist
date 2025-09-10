import { saveAllProjects } from "./storage";
import Todo from "./todo";

// Show default project 
const projects_div = document.querySelector("div.all-projects");
const add_todo_input = document.querySelector(".add-todo-title");
const todoPriority = {"Low": "Low","Medium" : "Medium","High":"High"}; 


export const displayAllProjects = (allProjects) => {
        //console.log('in displayAllProjects, ',allProjects)
        
        //reset 
        projects_div.innerHTML = "";
        if(allProjects.projects.length > 0) {
            allProjects.projects.forEach((element) => {
                //show each project
                displaySingleProject(element.id, element.title);
                
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

export function displayProjectTitle(targetId, targetText) {
    
    //function called from event or directly
    const projectID = targetId.includes("-") ? getProjectIDFromTargetID(targetId) : targetId;

    let currProjID = projectID;
    
    var project_title = document.createElement("input");
    project_title.className = "project-title";
    project_title.type = "text";
    project_title.name = "project_name";
    project_title.id = targetId;
    project_title.value = targetText;
    
    let projectContainer = document.getElementById("project-container");
    projectContainer.appendChild(project_title);
}

export function displayProjectTodos(targetId, allProjects) {
    const projectID = targetId.includes("-") ? getProjectIDFromTargetID(targetId) : targetId;
    //console.log(projectID);
    if(projectID) {
        let i = allProjects.projects.findIndex(element => element.id == projectID);
        if( i >= 0 ) {
            let todoListDiv = document.querySelector(".todo-list");
            allProjects.projects[i].todos.forEach(element => {
                //console.log(element);
                
                createTodoWrapper(todoListDiv,element.id,projectID);
                let elementID = `container-todo-${element.id}`;
                //console.log(elementID);
                let wrapperDiv = document.getElementById(elementID);
                createTodoTitle(wrapperDiv, element.id, element.title, projectID);
                createTodoDetailsDiv(wrapperDiv, element, allProjects)
            
            })
        }    
    }
}

export function displayAddNewTodo(projID) {
    clearAddNewTodo()   
    //projID => project-1757069143210
    if(projID) {
        add_todo_input.id = projID;
        add_todo_input.style = "display : block";
    }
    
}

function clearAddNewTodo() {
    add_todo_input.id = "";
    add_todo_input.value="";
}


export function clearProjectDetailsDisplay() {
    //reset previous display
    const content_div = document.querySelector("div.project-container");

    content_div.innerHTML = "";
    // if (content_div.hasChildNodes()) {
    //     content_div.removeChild("input.project_name") ;
    // }

    const  todo_div = document.querySelector(".todo-list");
    todo_div.innerHTML = "";
    
}

export function getProjectIDFromTargetID(targetId) {
    // Get the projectID
    let temp = targetId.split("-");    
    let projectID = temp[1]; //project-xxxxxxxx
    return projectID;
}

function createTodoWrapper(wrapperDiv, todoID) {
    let elementId = `container-` + `todo-` + todoID; 
    createDivElement(wrapperDiv,"todo-wrapper", elementId);
    //let titleContainDiv = document.getElementById(elementId);

}

function createTodoTitle(wrapperDiv, todoID, todoTitle) {
    //container for title input element
    let elementId = `title-todo-${todoID}`;
    createDivElement(wrapperDiv,"todo-title", elementId);
    let titleContainDiv = document.getElementById(elementId);

    //title input element
    elementId = `todotitle-${todoID}`;
    createInputElement(titleContainDiv,"input-todo-title", elementId, "text", todoTitle, "todo_title");
}

function createTodoDetailsDiv(wrapperDiv,element,allProjects) {
    let todoID = element.id;
    //container for todo details
    let elementId = `container-todo-details-${todoID}`; 
    createDivElement(wrapperDiv,"contain-todo-details", elementId,"display:none");
    let detailsContainDiv =  document.getElementById(elementId);
    detailsContainDiv.innerHTML = displayTodoDetails(element);
    assignDetailsEventHandlers(todoID,allProjects);
}

function displayTodoDetails(element) {
    var detailsElements = '';

    detailsElements += displayTodoDescription(element.id,element.description);
    detailsElements += displayTodoDate(element.id, element.duedate);
    detailsElements += displayTodoPriority(element.id, element.priority);
    detailsElements += displayTodoDeleteButton(element.id);
    return detailsElements;
}

function displayTodoDescription(todoID, descValue) {
    var inputID = "tododesc-" + todoID;
    
    if(descValue == undefined) descValue = "";
    
    return `<label for=${inputID}>Description</label>
            <input type="text" placeholder="Add description" id=${inputID} class="tododesc-input" value="${descValue}">`;
}

function displayTodoDate(todoID, dateValue) {
    var inputID = "tododate-" + todoID; 
    if(dateValue === undefined) dateValue = '';
    return `<label for=${inputID}>Date</label><input type="date" id=${inputID} class="todo-date-input" value="${dateValue}">`; 
}

function displayTodoPriority(todoID, priorityValue) {
    var inputID = "todopriority-" + todoID;
    
    var selectString = `<label for=${inputID}>Priority</label>
    <select id=${inputID} class="todopriority-select">`;
    var optionString = '', selectedValue;

        for (const [key, value] of Object.entries(todoPriority)) {
            // console.log(`${key} ${value}`);
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
function displayTodoDeleteButton(todoID) {
    var btnID = "tododel-" + todoID;
    return `<button type="button" id=${btnID} class="todo-delete-button">Delete</button> `; 
}

function assignDetailsEventHandlers(todoID,allProjects) {
    
    let inputElement = `#todotitle-${todoID}`;

    //Handler for show-hide details
    var curr_todo_input = document.querySelector(inputElement);
    curr_todo_input.addEventListener("click", (event) => {
        let element = event.target.id;

        let elementID = `container-todo-details-${todoID}`;
        let detailsContainDiv = document.getElementById(elementID);
        var currStyle = detailsContainDiv.style.display;

        if (currStyle === "none") {
            detailsContainDiv.style.display = "flex";    
        }
        else {
            detailsContainDiv.style.display = "none";
        }
    });

    //handler for todo title 
    curr_todo_input.addEventListener("change",(event) => {
        updateTodo(todoID,allProjects, event.target.value, "title");
    });

    //handler for todo description
    let addDescInputElement = document.getElementById(`tododesc-${todoID}`);
    addDescInputElement.addEventListener("change",(event) => {
        updateTodo(todoID,allProjects, event.target.value, "desc");
    });


    let addDateInputElement = document.getElementById(`tododate-${todoID}`);
    addDateInputElement.addEventListener("change",(event) => {
        updateTodo(todoID,allProjects, event.target.value, "date");
    });


    let addPriorityElement = document.getElementById(`todopriority-${todoID}`);
    addPriorityElement.addEventListener("change",(event) => {
        updateTodo(todoID,allProjects, event.target.value, "priority");
    });

    let btnDelete = document.getElementById(`tododel-${todoID}`);
        btnDelete.addEventListener("click",(event) => {
        deleteTodo(todoID, allProjects);
        clearProjectDetailsDisplay();
        let projectID = allProjects.getNowShowing();
        let projectIndex = allProjects.projects.findIndex(element => element.id == projectID);
        if(projectIndex < 0) return;
        displayProjectTitle(projectID, allProjects.projects[projectIndex].title);
        displayProjectTodos(projectID, allProjects);
        //requires project-123456
        let addTodoId = `project-${projectID}`;
        displayAddNewTodo(addTodoId);
    });
}


function deleteTodo(todoID, allProjects) {
    let projectID = allProjects.getNowShowing();
    let projectIndex = allProjects.projects.findIndex(element => element.id == projectID);
    if(projectIndex < 0) return;
    allProjects.projects[projectIndex].removeTodo(todoID);    
    saveAllProjects(allProjects);

}

function updateTodo(todoID, allProjects, changedValue, field) {
    let projectID = allProjects.getNowShowing();
    let projectIndex = allProjects.projects.findIndex(element => element.id == projectID);
    if(projectIndex < 0) return;
    let todoIndex = allProjects.projects[projectIndex].todos.findIndex(todo => todo.id == todoID);
    if (todoIndex < 0) return;

    let title = allProjects.projects[projectIndex].todos[todoIndex].title;
    let desc = allProjects.projects[projectIndex].todos[todoIndex].description;
    let duedate = allProjects.projects[projectIndex].todos[todoIndex].duedate;
    let priority = allProjects.projects[projectIndex].todos[todoIndex].priority;

    switch(field) {
                            case "title" : title = changedValue;
                                           break;
                            case "date"  : duedate = changedValue;
                                           break;     
                            case "desc"  : desc = changedValue;
                                           break;
                            case "priority" : priority = changedValue   ;
                                            break;                                           
                        }


        allProjects.projects[projectIndex].todos[todoIndex].editTodo(title, desc, duedate, priority);
        //console.log(allProjects)
        saveAllProjects(allProjects);

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