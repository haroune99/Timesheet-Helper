"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogFirstTiming = LogFirstTiming;
exports.LogTiming = LogTiming;
exports.getTimePerProjectperWeek = getTimePerProjectperWeek;
const Database_1 = require("./Database");
const client = await (0, Database_1.connectToDatabase)();
const Project_1 = require("./Project");
async function LogFirstTiming(consultant) {
    const projects = await Project_1.Project.getConsultantProjects(consultant);
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
async function LogTiming(consultant, project) {
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();
    const timing = await client.db("TimeSheet").collection("Timing").findOne({
        consultant: consultant,
        project: project,
        team: { $in: [consultant] },
        weekNumber: currentWeek,
        year: currentYear
    });
    if (timing) {
        const newStatus = timing.status === "stopped" ? "started" : "stopped";
        if (newStatus === "started") {
            await client.db("TimeSheet").collection("Timing").updateOne({
                consultant: consultant,
                project: project,
                weekNumber: currentWeek,
                year: currentYear
            }, {
                $set: {
                    status: newStatus,
                    startTimestamp: new Date()
                }
            });
        }
        else {
            const elapsedMinutes = timing.startTimestamp ?
                Math.floor((new Date().getTime() - timing.startTimestamp.getTime()) / 60000) : 0;
            await client.db("TimeSheet").collection("Timing").updateOne({
                consultant: consultant,
                project: project,
                weekNumber: currentWeek,
                year: currentYear
            }, {
                $set: {
                    status: newStatus,
                    startTimestamp: null
                },
                $inc: { time: elapsedMinutes }
            });
        }
    }
}
async function getTimePerProjectperWeek(consultant, weekNumber, year) {
    const projectTimings = await client.db("TimeSheet").collection("Timing").find({
        consultant: consultant,
        weekNumber: weekNumber,
        team: { $in: [consultant] },
        year: year
    }).toArray();
    return projectTimings.map(timing => ({
        project: timing.project,
        time: timing.time
    }));
}
// Helper function to get the week number of a date
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
//# sourceMappingURL=TimeLogs.js.map