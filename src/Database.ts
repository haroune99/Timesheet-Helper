import * as dotenv from 'dotenv';
//import { Project } from "./project";
import { MongoClient } from "mongodb";

dotenv.config();
const PASSWORD = process.env.PASSWORD;

const uri = `mongodb+srv://hrna2011:${PASSWORD}@harounecluster.rrbfu.mongodb.net/?retryWrites=true&w=majority&appName=HarouneCluster`;
const client = new MongoClient(uri);

export { client };

export async function connectToDatabase() {
    try {
        if (!client.connect) {
            await client.connect();
            console.log("Connected to MongoDB");
        }
        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}





