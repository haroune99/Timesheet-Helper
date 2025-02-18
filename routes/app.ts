import express from "express";
import { connectToDatabase } from "../src/Database";
import { Project } from "../src/Project";
import { LogFirstTiming, LogTiming, getTimePerProjectperWeek } from "../src/Timing";

const app = express();
const port = 3000;

// Middleware must come first!
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello to the TimeSheet API");
});

app.get("/projects", async (req, res) => {
    try {
        const projects = await Project.getConsultantProjects(req.body.consultant);
        res.json(projects);
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});