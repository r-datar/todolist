

export const saveTodo = (e) => {
    //what element is being edited
    let temp = e.target.id;

    let todo_details = temp.split("-");
    //length 2 means we got the id
        if(todo_details.length == 4) {
            let todoId = todo_details[1];
            let projectId = todo_details[3];
            console.log('In saveTodo',todoId,"todoID",projectId,"Project ID")
            let allTodos;
            allTodos = getAllTodos();
            if(allTodos == null ) allTodos = new Array();
            //console.log(allTodos, typeof(allTodos))
            let storeTodo = {};
            storeTodo["todo"] = todoId;
            storeTodo["project"] = projectId;
            storeTodo["title"] = e.target.value;
            storeTodo["date"] = e.target.value;
            allTodos.push(storeTodo);
              
            saveTodoData(allTodos);
        }

}

export const updateTodo = (e,field) => {
    //what element is being edited
    let temp = e.target.id;

    let todo_details = temp.split("-");
    //length 2 means we got the id
        if(todo_details.length == 4) {
            let todoId = todo_details[1];
            let projectId = todo_details[3];
            //console.log('In updateTodo',todoId,"todoID",projectId,"Project ID")
            let allTodos;
            allTodos = getAllTodos();
            if(allTodos == null ) {
                allTodos = new Array();
            }
            else {
                //some todos found for this project
                allTodos.forEach(element => {
                    if(element.todo == todoId && element.project == projectId) {
                        console.log("field")
                        switch(field) {
                            case "title" : element.title = e.target.value;
                                           break;
                            case "date"  : element.date = e.target.value;
                                           break;     
                            case "desc"  : element.desc = e.target.value;
                                           break;
                            case "priority" : element.priority = e.target.value;
                                            break;                                           
                        }
                        
                    }
                });
            }
            saveTodoData(allTodos);
        }

}

export const deleteTodo = (btnId) => {
    
    let temp = btnId;
    let todo_details = temp.split("-");
    if(todo_details.length == 5) {
            let todoId = todo_details[2];
            let projectId = todo_details[4];
            let allTodos;
            allTodos = getAllTodos();
            if(allTodos == null ) {
                allTodos = new Array();
            }
            else {
                //some todos found for this project
                let index = 0;
                allTodos.forEach(element => {
                    if(element.todo == todoId && element.project == projectId) {
                        //matched, so delete it
                        allTodos.splice(index,1);

                    }
                    index++;
                });
            }
            saveTodoData(allTodos);

    }        
}

export function getTodosForProject(projectId) {
    let todosForProject = new Array();
    let allTodos = getAllTodos();
    //console.log(allTodos,"alltodos")
    if(allTodos) {
        allTodos.forEach(element => {
        if(element.project == projectId) {
            todosForProject.push(element)
        }    
    });
    }
    return todosForProject;
}

function getAllTodos() {
    return JSON.parse(localStorage.getItem("Todo"));
}

function saveTodoData(objTodo) {
    localStorage.setItem("Todo",JSON.stringify(objTodo));
}