import { saveAllProjects } from "./storage";
import Todo from "./todo";

// Show default project 
const projects_div = document.querySelector("div.all-projects");
const add_todo_input = document.querySelector("#add-todo");
const projectContainer = document.getElementById("project-container");

const todoPriority = {"Low": "Low","Medium" : "Medium","High":"High"}; 


//Function to display all projects in left sidebar
export const displayAllProjects = (allProjects) => {
        //reset display 
        projects_div.innerHTML = "";
        if(allProjects.projects.length > 0) {
            allProjects.projects.forEach((element) => {
                //show each project
                displaySingleProject(element.id, element.title);
                
            });    
        }    
}

//Function to display a single project in left sidebar
function displaySingleProject(key, value) {
    var projects_div_list = document.createElement("div");
    projects_div_list.className = `project`;
    projects_div_list.id = `project-` + key;
    projects_div_list.innerText = value;
    //Add to parent div
    projects_div.appendChild(projects_div_list);
}

//Function to display project title in main section
export function displayProjectTitle(targetId, targetText) {
    
    var project_title = document.createElement("input");
    project_title.className = "project-title";
    project_title.type = "text";
    project_title.name = "project_title";
    project_title.id = targetId;
    project_title.value = targetText;
    
    projectContainer.appendChild(project_title);
}

//Function to display all todos for this project
export function displayProjectTodos(allProjects) {
    const projectID = allProjects.getNowShowing();
    let i = allProjects.getNowShowingIndex();

    let todoListDiv = document.querySelector(".todo-list");

    allProjects.projects[i].todos.forEach(element => {
        let wrapperDiv = createTodoWrapper(todoListDiv,element.id);
        
        createTodoTitle(wrapperDiv, element.id, element.title);
        createTodoDetailsDiv(wrapperDiv, element, allProjects)
            
    })
}

//Function to show the add todo div
export function displayAddNewTodo() {
    clearAddNewTodo();
    add_todo_input.style = "display : block";
}

//Function to clear out the add todo div display
function clearAddNewTodo() {
    add_todo_input.value="";
}

//Function to clear out the main display
export function clearProjectDetailsDisplay() {
    //reset previous display
    const content_div = document.querySelector("div.project-container");

    content_div.innerHTML = "";
    const  todo_div = document.querySelector(".todo-list");
    todo_div.innerHTML = "";
    
}

//Function to get project ID
export function getProjectIDFromTargetID(targetId) {
    // Get the projectID
    let temp = targetId.split("-");    
    let projectID = temp[1]; //project-xxxxxxxx
    return projectID;
}

//Function to create a wrapper div for each todo
function createTodoWrapper(wrapperDiv, todoID) {
    let elementId = `container-` + `todo-` + todoID; 
    return createDivElement(wrapperDiv,"todo-wrapper", elementId);
}

//Function to display title of todo
function createTodoTitle(wrapperDiv, todoID, todoTitle) {
    //container for title input element
    let elementId = `title-todo-${todoID}`;
    
    let titleContainDiv = createDivElement(wrapperDiv,"todo-title", elementId);

    //title input element
    elementId = `todotitle-${todoID}`;
    createInputElement(titleContainDiv,"input-todo-title", elementId, "text", todoTitle, "todo_title");
}

//Function to create hidden details div for each todo
function createTodoDetailsDiv(wrapperDiv,element,allProjects) {
    let todoID = element.id;
    //container for todo details
    let elementId = `container-todo-details-${todoID}`; 
    
    let detailsContainDiv =  createDivElement(wrapperDiv,"contain-todo-details", elementId,"display:none");
    detailsContainDiv.innerHTML = displayTodoDetails(element);
    assignDetailsEventHandlers(todoID,allProjects);
}

//Function to create details form elements for each todo
function displayTodoDetails(element) {
    var detailsElements = '';

    detailsElements += displayTodoDescription(element.id,element.description);
    detailsElements += displayTodoDate(element.id, element.duedate);
    detailsElements += displayTodoPriority(element.id, element.priority);
    detailsElements += displayTodoDeleteButton(element.id);
    return detailsElements;
}

//Function to create form element for todo description
function displayTodoDescription(todoID, descValue) {
    var inputID = "tododesc-" + todoID;
    
    if(descValue == undefined) descValue = "";
    
    return `<label for=${inputID}>Description</label>
            <input type="text" placeholder="Add description" id=${inputID} class="tododesc-input" value="${descValue}">`;
}

//Function to create form element for todo date 
function displayTodoDate(todoID, dateValue) {
    var inputID = "tododate-" + todoID; 
    if(dateValue === undefined) dateValue = '';
    return `<label for=${inputID}>Date</label><input type="date" id=${inputID} class="todo-date-input" value="${dateValue}">`; 
}

//Function to create form element for todo priority
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

//Function to display todo delete button
function displayTodoDeleteButton(todoID) {
    var btnID = "tododel-" + todoID;
    return `<button type="button" id=${btnID} class="todo-delete-button">Delete</button> `; 
}

//Function to assign event handlers for todo details form elements
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

    //handler for todo date change
    let addDateInputElement = document.getElementById(`tododate-${todoID}`);
    addDateInputElement.addEventListener("change",(event) => {
        updateTodo(todoID,allProjects, event.target.value, "date");
    });


    //handler for todo priority change
    let addPriorityElement = document.getElementById(`todopriority-${todoID}`);
    addPriorityElement.addEventListener("change",(event) => {
        updateTodo(todoID,allProjects, event.target.value, "priority");
    });

    //handler for todo delete button
    let btnDelete = document.getElementById(`tododel-${todoID}`);
        btnDelete.addEventListener("click",(event) => {
        deleteTodo(todoID, allProjects);
        clearProjectDetailsDisplay();
        let projectID = allProjects.getNowShowing();
        let projectIndex = allProjects.getNowShowingIndex();
        displayProjectTitle(projectID, allProjects.projects[projectIndex].title);
        displayProjectTodos(allProjects);
        displayAddNewTodo();
    });
}


//Function to delete todo
function deleteTodo(todoID, allProjects) {
    let projectID = allProjects.getNowShowing();
    let projectIndex = allProjects.getNowShowingIndex();
    allProjects.projects[projectIndex].removeTodo(todoID);    
    saveAllProjects(allProjects);

}

//Function to update todo -- all fields handled
function updateTodo(todoID, allProjects, changedValue, field) {
    let projectID = allProjects.getNowShowing();
    let projectIndex = allProjects.getNowShowingIndex();

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
    saveAllProjects(allProjects);

}

//Function to create a div element in DOM with attributes
function createDivElement(parentElement,className, elementId,style) {
    var newDiv;
    newDiv =  document.createElement("div");
    newDiv.className = className;
    newDiv.id = elementId;
    if(style) newDiv.style = style;
    parentElement.appendChild(newDiv);
    return newDiv;
}

//Function to create a input element in DOM with attributes
function createInputElement(parentElement,className,elementId,type,elementValue, elementName,placeHolder) {
    var newInput;
    newInput = document.createElement("input");
    newInput.className = className;
    newInput.type = type;
    newInput.name = elementName;
    newInput.id = elementId;
    if(elementValue) newInput.value = elementValue;
    parentElement.appendChild(newInput);
}