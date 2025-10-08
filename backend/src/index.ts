import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";

import cors from "cors";
import {Env} from "./config/env.config.js";
import { HTTPSTATUS } from "./config/http.config.js";
import { log } from "console";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { asyncHandler } from "./middlewares/asyncHandler.middlerware.js";
import connectDatabase from "./config/database.config.js";
import authRoutes from "./routes/auth.routes.js"; 


const app=express();
const BASE_PATH=Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use(
//     cors({
//         origin : Env.FRONTEND_ORIGIN,
//         Credential : true,
//     })
// );

app.get("/",asyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
    throw new Error("This is a test error");
    res.status(HTTPSTATUS.OK).json({
        message:"Hello World!"
    });
}));


app.use(`${BASE_PATH}/auth`,authRoutes);


app.use(errorHandler);

app.listen(Env.PORT,async()=>{
    await connectDatabase();
    console.log(`Server is running on ${Env.PORT} in ${Env.NODE_ENV} mode`)
})