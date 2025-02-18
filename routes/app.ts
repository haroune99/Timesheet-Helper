import express from "express";
import { connectToDatabase } from "../src/Database";
import { Project } from "../src/Project";
// import { TimeLogs } from "../src/TimeLogs";


const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello to the TimeSheet API");
});

app.get("/projects", async (req, res) => {
    const projects = await Project.getConsultantProjects(req.body.consultant);
    res.json(projects);
});

app.post("/projects", async (req, res) => {
    const project = new Project(req.body.consultant, req.body.name, req.body.hours, req.body.startDate, req.body.endDate, req.body.description, req.body.status, req.body.progress, req.body.team, req.body.PM);
    await Project.save(project);
    res.json(project);
});

app.put("/projects/:id", async (req, res) => {
    try {
        const project = new Project(req.body.consultant, req.body.name, req.body.hours, req.body.startDate, req.body.endDate, req.body.description, req.body.status, req.body.progress, req.body.team, req.body.PM);
        project.id = req.params.id;
        const updatedProject = await Project.UpdateProject(project);
        res.json(updatedProject);
    } catch (error) {
        res.status(404).json({ error: "Project not found" });
    }
});

app.delete("/projects/:id", async (req, res) => {
    try {
        const projectId = req.params.id;
        await Project.DeleteProject(projectId);
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(404).json({ error: "Project not found" });
    }
});



app.use(express.json());



