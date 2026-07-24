import express from "express";
import {notFound,errorHandler} from "../src/middleware/errorHandler.js";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { clerkMiddleware } from '@clerk/express'
import {MonitorRoute} from "../src/routes/MonitorRoute.js";
import {UploadRoute} from "../src/routes/UploadRoute.js";
export const app=express();

app.use(helmet({crossOriginResourcePolicy:{policy:"cross-origin"}}))
app.use(cors({origin(origin,callback){
    if(!origin || !corsOrigin.includes(origin)) return callback(null,true)
},credentials:true}))

app.use(clerkMiddleware())
app.use(compression())
app.use(express.json({limit:'200kb'}))

app.use(express.urlencoded({extended:true,limit:'50kb'}))

app.use('/api/monitor',MonitorRoute)
app.use('/api/upload',UploadRoute)
app.get('/health', (req, res) => res.send('OK'));

app.use(notFound)
app.use(errorHandler)
