import { connectToDatabase } from "./Database";
import { MongoClient } from "mongodb";
import { Project } from "./Project";

let client: MongoClient;

async function initializeDB() {
    client = await connectToDatabase();
}
initializeDB();

export interface Timing {
    consultant: string;
    project: string;
    time: number;
    status: "started" | "stopped";
    startTimestamp?: Date;
    weekNumber: number;
    year: number;
}

export async function LogFirstTiming(consultant: string) {
    const projects = await Project.getConsultantProjects(consultant);
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();

    for (const project of projects) {
        const exists = await client.db("TimeSheet").collection("Timing").findOne({
            consultant,
            project: project.name, 
            weekNumber: currentWeek,
            year: currentYear
        });

        if (!exists) {
            await client.db("TimeSheet").collection("Timing").insertOne({
                consultant,
                project: project.name,
                time: 0,
                status: "stopped",
                weekNumber: currentWeek,
                year: currentYear
            });
        }
    }
}

export async function LogTiming(consultant: string, project: string) {
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();

    const timing = await client.db("TimeSheet").collection("Timing").findOne({
        consultant: consultant, 
        project: project, 
        weekNumber: currentWeek,
        year: currentYear
    });

    if (timing) {
        const newStatus = timing.status === "stopped" ? "started" : "stopped";
        
        if (newStatus === "started") {
            await client.db("TimeSheet").collection("Timing").updateOne(
                { 
                    consultant: consultant, 
                    project: project,
                    weekNumber: currentWeek,
                    year: currentYear
                },
                { 
                    $set: { 
                        status: newStatus,
                        startTimestamp: new Date()
                    }
                }
            );
        } else {
            const elapsedMinutes = timing.startTimestamp ? 
                Math.floor((new Date().getTime() - timing.startTimestamp.getTime()) / 60000) : 0;

            await client.db("TimeSheet").collection("Timing").updateOne(
                { 
                    consultant: consultant, 
                    project: project,
                    weekNumber: currentWeek,
                    year: currentYear
                },
                { 
                    $set: { 
                        status: newStatus,
                        startTimestamp: null
                    },
                    $inc: { time: elapsedMinutes }
                }
            );
        }
    }
}

export async function getTimePerProjectperWeek(consultant: string, weekNumber: number, year: number){ 
    const projectTimings = await client.db("TimeSheet").collection("Timing").find({
        consultant: consultant,
        weekNumber: weekNumber,
        team: {$in: [consultant]},
        year: year
    }).toArray();
    return projectTimings.map(timing => ({
        project: timing.project,
        time: timing.time
    }));
}

export async function createTiming(timing: Timing) {
    const exists = await client.db("TimeSheet").collection("Timing").findOne({
        consultant: timing.consultant,
        project: timing.project,
        weekNumber: timing.weekNumber,
        year: timing.year
    });

    if (exists) {
        throw new Error("Timing entry already exists for this project in the current week");
    }

    await client.db("TimeSheet").collection("Timing").insertOne(timing);
}

// Helper function to get the week number of a date
export function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
}