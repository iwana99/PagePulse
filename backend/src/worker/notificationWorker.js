import dotenv from "dotenv";
import { Worker } from "bullmq";
import Monitor from "../models/Monitor.js";
import Snapshot from "../models/Snapshot.js";
import { connectDB } from "../conf/db.js";
import { sendNotification } from "../services/notificationService.js";
import { getTransporter } from "../services/notificationService.js";
dotenv.config();

await connectDB(process.env.MONGODB_URI);

await getTransporter().verify();
console.log("SMTP konekcija radi.");

const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    const { monitorId, snapshotId } = job.data;

    const monitor = await Monitor.findById(monitorId);
    const snapshot = await Snapshot.findById(snapshotId);

    if (!monitor || !snapshot) {
      throw new Error("Monitor or snapshot not found.");
    }

    await sendNotification({
      monitor,
      snapshot,
    });

    return {
      monitorId,
      snapshotId,
      sent: true,
    };
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);

console.log("Notification worker sluša queue...");