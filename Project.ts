import { connectToDatabase } from "./Database";

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
        public PM: string
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
    }

    public static save(project: Project) {
        client.db("TimeSheet").collection("Timesheet").insertOne(project);
    }

    public static getProjects(consultant: string) {
        return client.db("TimeSheet").collection("Timesheet").find({consultant: consultant, team: {$in: [consultant]}}).toArray();
    }
}   




