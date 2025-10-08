
import mongoose from "mongoose";
import {Env} from "./env.config.js"
import { log } from "console";
const connectDatabase=async()=>{
    try {
        await mongoose.connect(Env.MONGO_URI,{
            serverSelectionTimeoutMS:8000,
            socketTimeoutMS:45000,
            connectTimeoutMS:10000,
        });
        console.log("Connected to MongoDb database");
    } catch (error) {
        console.error("Error connecting to MongoDb database",error);
        process.exit(1);
        
    }
}

export default connectDatabase;