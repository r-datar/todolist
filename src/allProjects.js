export default class AllProjects {
    constructor() {
        this.projects = [];
        this.nowShowing = 0;
    }

    addProject(project) {
        this.projects.push(project);
    }

    removeProject(id){
        this.projects = this.projects.filter(project => project.id !== id)
    } 

    setNowShowing(id) {
        this.nowShowing = id;
    }

    getNowShowing() {
        return this.nowShowing;
    }
}