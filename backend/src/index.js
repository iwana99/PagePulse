import {app} from "./app.js";
import {connectDB} from '../src/conf/db.js'

import dotenv from "dotenv"
import { connectRedis } from "../src/conf/redis.js";
import {getRedisClient} from "../src/conf/redis.js";
import {cloudinaryConnect} from '../src/conf/cloudinary.js'
import { runSchedulerOnce } from "./scheduler/scheduler.js";
dotenv.config()

async function startServer(){
    
    
    await connectDB(process.env.MONGODB_URI)
 await connectRedis(process.env.REDIS_URL)
cloudinaryConnect()

    
    app.listen(process.env.PORT,()=>console.log(`Server is running on port ${process.env.PORT}`))


}
setInterval(async()=>{  try {  //ugradjena u node.js i kaze da se pokrene ordedjena funkcija na svakih 5 sekundi
      await runSchedulerOnce();
    } catch (error) {
      console.error("Scheduler error:", error);
    }},5000)
startServer().catch((error)=>{
    console.log(error)
    process.exit(1)
})

