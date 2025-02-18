import { connectToDatabase } from "./Database";
import { ObjectId } from "mongodb";
const client = await connectToDatabase();

export const projects : Project[] = [];

export class Project {
    constructor(
        public consultant: string,
        public name: string,
        public hours: number,
        public startDate: Date,
        public endDate: Date,
        public description: string,
        public status: string,
        public progress: string,
        public team: string[],
        public PM: string,
        public _id?: string
    ) {
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

    public static async save(project: Project) {
        const { _id, ...projectData } = project;
        await client.db("TimeSheet").collection("Timesheet").insertOne(projectData);
    }

    public static async getConsultantProjects(consultant: string) {
        return await client.db("TimeSheet").collection("Timesheet")
            .find({consultant: consultant, team: {$in: [consultant]}})
            .toArray();
    }

    public static async UpdateProject(project: Project) {
        const { _id, ...projectWithoutId } = project;  
        await client.db("TimeSheet").collection("Timesheet").updateOne(
            { _id: new ObjectId(project._id) },
            { $set: projectWithoutId }
        );
    }

    public static async DeleteProject(project: Project) {
        await client.db("TimeSheet").collection("Timesheet").deleteOne({_id: new ObjectId(project._id)});
    }
}   




