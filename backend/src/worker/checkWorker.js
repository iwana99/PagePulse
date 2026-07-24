import dotenv from "dotenv";
import { Worker } from "bullmq";
import Monitor from "../models/Monitor.js";
import { connectDB } from "../conf/db.js";
import { captureTarget } from "../services/captureService.js";

dotenv.config();

await connectDB(process.env.MONGODB_URI);

const checkWorker = new Worker(
  "checks",

  async (job) => {
    const { monitorId } = job.data;

    console.log("Worker je dobio job:", job.id);
    console.log("Monitor ID:", monitorId);

    const monitor = await Monitor.findById(monitorId);

    if (!monitor) {
      throw new Error("Monitor not found.");
    }

    monitor.status = "checking";
    await monitor.save();

    console.log(
      `Worker proverava: ${monitor.title} - ${monitor.url}`
    );

   /* // Za sada samo glumimo posao od 2 sekunde.
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });*/

    //sada ovo da radi umesto laznog promisa 
    const capture = await captureTarget(monitor.url);

console.log("Finalni URL:", capture.finalUrl);
console.log(
  "Tekst stranice:",
  capture.textContent.slice(0, 200)
);

    monitor.status = "ok";
    await monitor.save();

    console.log(
      `Worker je završio monitor ${monitor.id}`
    );

    return {
      monitorId: monitor.id,
      status: "ok",
    };
  },

  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);

checkWorker.on("completed", (job) => {
  console.log(`Job ${job.id} je uspešno završen.`);
});

checkWorker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} nije uspeo:`,
    error.message
  );
});

console.log("Check worker sluša queue...");