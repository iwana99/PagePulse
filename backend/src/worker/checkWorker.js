import dotenv from "dotenv";
import { Worker } from "bullmq";
import Monitor from "../models/Monitor.js";
import { connectDB } from "../conf/db.js";
import { captureTarget } from "../services/captureService.js";
import {textCompare} from '../services/compareService.js'
import Snapshot from "../models/Snapshot.js";
import { notificationQueue } from "../queues/checkQueue.js";

dotenv.config();

await connectDB(process.env.MONGODB_URI);

const checkWorker = new Worker(

  
  "checks",

  async (job) => {
   
    const { monitorId } = job.data;

    console.log("Worker je dobio job:", job.id);
    console.log("Monitor ID:", monitorId);

     try {

    const monitor = await Monitor.findById(monitorId);

    if (!monitor) {
      throw new Error("Monitor not found.");
    }

    monitor.status = "checking";
    await monitor.save();

    console.log(
      `Worker proverava: ${monitor.title} - ${monitor.url}`
    );


    const capture = await captureTarget(monitor.url);

   const previousSnapshot= await Snapshot.findOne({ monitorId: monitor.id }).sort({ checkedAt: -1 });

   console.log("Previous snapshot ID:", previousSnapshot?.id);




   const compareText = previousSnapshot
  ? textCompare(
      previousSnapshot.textContent,
      capture.textContent
    )
  : {
      percent: 0,
      addedWords: 0,
      removedWords: 0,
      stableWords: 0,
    };

   const snapshot= await Snapshot.create({
      monitorId: monitor.id,
      checkedAt: new Date(),
      finalUrl: capture.finalUrl,
      textContent: capture.textContent,
      addedWords:compareText.addedWords,
      removedWords:compareText.removedWords,
      stableWords:compareText.stableWords,

      percentChange:compareText.percent
     
    });

monitor.lastRunAt = snapshot.checkedAt;

if(!previousSnapshot){monitor.status="ok"}
else{
  monitor.status =
  compareText.percent >= monitor.thresholdPercent  //ako je promena dovoljno velika, status se menja, ako nije ne 
    ? "changed"
    : "ok";
}

console.log("Previous snapshot postoji:", Boolean(previousSnapshot));
console.log("Percent:", compareText.percent);
console.log("Threshold:", monitor.thresholdPercent);
console.log("Status nakon poređenja:", monitor.status);

if (monitor.status === "changed") {
  monitor.lastChangeAt = snapshot.checkedAt;
   console.log("Dodajem notification job...");
}

if (monitor.status === "changed") {
  const notificationJob = await notificationQueue.add("send-notification", {
    monitorId: monitor.id,
    snapshotId: snapshot.id,
  }, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
   console.log("Notification job dodat:", notificationJob.id);
}

await monitor.save();



    console.log(
      `Worker je završio monitor ${monitor.id}`
    );

    return {   //ovaj objekat se salje na redis ,to je job result, na osnovu koga bullMWQ stavlja status tog joba na complete
  monitorId: monitor.id,  //ovaj return je koristan za logoe, testove, lakse otkrivanje sta je job uradio
  snapshotId: snapshot.id,
  status: monitor.status,
  percentChange: compareText.percent,
};

  } catch (error) {
    console.error("Greska prilikom provere:", error.message);
    throw error;
  }
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

