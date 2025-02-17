import * as dotenv from 'dotenv';
//import { Project } from "./project";
import { MongoClient } from "mongodb";

dotenv.config();
const PASSWORD = process.env.PASSWORD;

MongoClient.connect(`mongodb+srv://hrna2011:${PASSWORD}@harounecluster.rrbfu.mongodb.net/?retryWrites=true&w=majority&appName=HarouneCluster`)
    .then((client: any) => {
        const db = client.db("TimeSheet");
        const collection = db.collection("TimeSheet");
        console.log("Connected to MongoDB");
    })
    .catch((err: Error) => {
        console.error("Error connecting to MongoDB:", err);
    });






