"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const Database_1 = require("./Database");
const mongodb_1 = require("mongodb");
const client = await (0, Database_1.connectToDatabase)();
class Project {
    consultant;
    name;
    hours;
    startDate;
    endDate;
    description;
    status;
    progress;
    team;
    PM;
    _id;
    constructor(consultant, name, hours, startDate, endDate, description, status, progress, team, PM, _id) {
        this.consultant = consultant;
        this.name = name;
        this.hours = hours;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.status = status;
        this.progress = progress;
        this.team = team;
        this.PM = PM;
        this._id = _id;
    }
    static async save(project) {
        const { _id, ...projectData } = project;
        await client.db("TimeSheet").collection("Projects").insertOne(projectData);
    }
    static async getConsultantProjects(consultant) {
        const projects = await client.db("TimeSheet").collection("Projects")
            .find({
            consultant: consultant,
            team: { $in: [consultant] }
        })
            .project({
            _id: 1,
            name: 1,
            consultant: 1,
            hours: 1,
            startDate: 1,
            endDate: 1,
            description: 1,
            status: 1,
            progress: 1,
            team: 1,
            PM: 1
        })
            .toArray();
        return projects.map(p => ({
            ...p,
            _id: p._id.toString()
        }));
    }
    static async updateProject(id, updateData) {
        await client.db("TimeSheet").collection("Projects").updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData });
    }
    static async deleteProject(id) {
        await client.db("TimeSheet").collection("Projects").deleteOne({ _id: new mongodb_1.ObjectId(id) });
    }
}
exports.Project = Project;
//# sourceMappingURL=Project.js.map