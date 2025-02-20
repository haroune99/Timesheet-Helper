import express from "express";
import { Project } from "../src/Project";
import { LogTiming, createTiming, getWeekNumber, Timing } from "../src/TimeLogs";
import cors from "cors";

const app = express();
const port = 4000;

// Middleware must come first!
app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
    res.send("Hello to the TimeSheet API");
});

app.get("/projects", async (req, res) => {
    try {
        const consultant = req.query.consultant as string;
        const projects = await Project.getConsultantProjects(consultant);
        res.json(Array.isArray(projects) ? projects : []);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/projects", async (req, res) => {
    try {
        const project = new Project(
            req.body.consultant,
            req.body.name,
            req.body.hours,
            new Date(req.body.startDate),
            new Date(req.body.endDate),
            req.body.description,
            req.body.status,
            req.body.progress,
            req.body.team,
            req.body.PM
        );
        await Project.save(project);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: "Invalid request" });
    }
});

app.put("/projects/:id", async (req, res) => {
    try {
        await Project.updateProject(req.params.id, req.body);
        res.json({ message: "Project updated successfully" });
    } catch (error) {
        res.status(404).json({ error: "Project not found" });
    }
});

app.delete("/projects/:id", async (req, res) => {
    try {
        await Project.deleteProject(req.params.id);
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(404).json({ error: "Project not found" });
    }
});

// Add Timing-related routes
app.post("/timing/start", async (req, res) => {
    try {
        await LogTiming(req.body.consultant, req.body.project);
        res.json({ message: "Timing updated" });
    } catch (error) {
        res.status(500).json({ error: "Timing operation failed" });
    }
});

// Add new route for creating timing entries
app.post("/timing", async (req, res) => {
    try {
        const timing: Timing = {
            consultant: req.body.consultant,
            project: req.body.project,
            time: 0,
            status: "stopped" as "stopped",
            weekNumber: getWeekNumber(new Date()),
            year: new Date().getFullYear()
        };
        
        await createTiming(timing);
        res.status(201).json({ message: "Timing entry created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Invalid request" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});