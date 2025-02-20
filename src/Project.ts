import { connectToDatabase } from "./Database";
import { ObjectId, Collection, MongoClient } from "mongodb";

let client: MongoClient;

async function initializeDB() {
    client = await connectToDatabase();
}
initializeDB();

export interface Project {
    consultant: string;
    name: string;
    hours: number;
    startDate: Date;
    endDate: Date;
    description: string;
    status: string;
    progress: string;
    team: string[];
    PM: string;
    _id?: string;
}

export class Project implements Project {
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
    ) {}

    public static async save(project: Project) {
        const { _id, ...projectData } = project;
        await client.db("TimeSheet").collection("Projects").insertOne(projectData);
    }

    public static async getConsultantProjects(consultant: string): Promise<Project[]> {
        const collection = client.db("TimeSheet").collection("Projects") as Collection<Project>;
        const projects = await collection
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
            .toArray() as unknown as (Project & { _id: ObjectId })[];
    
        return projects.map(p => ({
            ...p,
            _id: p._id.toString() 
        }));
    }

    public static async updateProject(id: string, updateData: Partial<Project>) {
        await client.db("TimeSheet").collection("Projects").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
    }

    public static async deleteProject(id: string) {
        await client.db("TimeSheet").collection("Projects").deleteOne(
            { _id: new ObjectId(id) }
        );
    }
}