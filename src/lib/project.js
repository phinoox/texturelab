import fs from "fs";
export class Project {
    constructor() {
        this.name = null;
        this.path = null;
        this.data = null;
    }
}
export class ProjectManager {
    static load(path) {
        let project = new Project();
        project.path = path;
        project.name = path.replace(/^.*[\\\/]/, "");
        project.data = JSON.parse(fs.readFileSync(path).toString());
        return project;
    }
    static save(path, project) {
        // console.log(project.data);
        // console.log(JSON.stringify(project.data));
        fs.writeFileSync(path, JSON.stringify(project.data));
    }
}
//# sourceMappingURL=project.js.map