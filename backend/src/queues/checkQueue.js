import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

export const checkQueue = new Queue("checks", {  //napravila sam red poslova koji se zove checks
  connection: {
    url: process.env.REDIS_URL,
  },
});

export const notificationQueue = new Queue("notifications", {
  connection: {
    url: process.env.REDIS_URL,
  },
});