import Router from 'express'
import { CreateMonitor,UpdateMonitor,DeleteMonitor,GetAllMonitors,GetOneMonitor } from '../controllers/MonitorController.js';

export const MonitorRoute=Router()

MonitorRoute.post('/createMonitor',CreateMonitor)
MonitorRoute.put("/update/:id",UpdateMonitor)
MonitorRoute.delete("/delete/:id",DeleteMonitor)
MonitorRoute.get("/getAll",GetAllMonitors)
MonitorRoute.get('/getMonitor/:id',GetOneMonitor)