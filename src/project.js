function Project(name) {
         if (!new.target) {
             throw Error("You must use the 'new' operator to call the constructor");
        }
        this.name = name;
        return this;
    }


export const addProject = (name) => {
    var newProject = new Project(name);
    saveNewProject(newProject);
    //currently made project is available here
}

function saveNewProject(Project) {
   
    let existing = localStorage.getItem("Project");
    let projectNames = new Array;

    if(existing) {
        existing = JSON.parse(existing);
        projectNames = [...existing]
    }

    let keyis = Date.now();
    let obj = {};
    obj[keyis] = Project.name;
    projectNames.push(obj);
    //console.log(JSON.stringify(projectNames));
    localStorage.setItem("Project",JSON.stringify(projectNames));
    Project.id = keyis;
}

export const saveEditedProject = (e) => {
    //console.log(e.target.value);
    let temp = e.target.id;
    let proj_details = temp.split("-");
    //length 2 means we got the id
    if(proj_details.length == 2) {
        let projectId = proj_details[1];
        //Get local storage and update it
        let allProjects = getProjects();
        allProjects.forEach((element) => {
            for (let [key, value] of Object.entries(element)) {
                if(key == projectId) {
                    element[key] = e.target.value;
                }
            }       
        })    
        localStorage.setItem("Project",JSON.stringify(allProjects));
    }
    //else do nothing
}

export const getProjects = () => {
    let projectNames = localStorage.getItem("Project");
    return JSON.parse(projectNames);
}

