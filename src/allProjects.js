export default class AllProjects {
    constructor() {
        this.projects = [];
        this.nowShowing = 0; //project id on display
        this.nowShowingIndex = 0; //index of project on display
    }

    addProject(project) {
        this.projects.push(project);
    }

    removeProject(id){
        this.projects = this.projects.filter(project => project.id !== id)
    } 

    setNowShowing(id) {
        this.nowShowing = id;
        this.nowShowingIndex = this.projects.findIndex(element => element.id == id);
    }

    getNowShowing() {
        return this.nowShowing;
    }

    getNowShowingIndex() {
        return this.nowShowingIndex;
    }
}