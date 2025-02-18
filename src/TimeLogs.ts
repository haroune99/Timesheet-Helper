import { connectToDatabase } from "./Database";
import { ObjectId } from "mongodb";
const client = await connectToDatabase();
import { Project } from "./Project";

interface Timing{
    consultant: string;
    project: string;
    time: number;
    status: "started" | "stopped";
    startTimestamp?: Date;
    weekNumber: number;
    year: number;
}

export async function LogFirstTiming(consultant: string){
    const projects = await Project.getConsultantProjects(consultant);
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();

    for (const project of projects){
        if (!(await client.db("TimeSheet").collection("Timing").findOne({
            consultant: consultant, 
            project: project.name, 
            team: {$in: [consultant]},
            weekNumber: currentWeek,
            year: currentYear
        }))){
            const timing: Timing = {
                consultant: consultant,
                project: project.name,
                time: 0,
                status: "stopped",
                weekNumber: currentWeek,
                year: currentYear
            }
            await client.db("TimeSheet").collection("Timing").insertOne(timing);
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
        team: {$in: [consultant]},
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


// Helper function to get the week number of a date
function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
}


