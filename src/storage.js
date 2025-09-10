

export const getProjects = () => {
    let projectNames = localStorage.getItem("Project");
    if(!projectNames) return [];
      
    return JSON.parse(projectNames);
}

export const saveAllProjects = (allProjects) => {
    localStorage.setItem("Project",JSON.stringify(allProjects));

}