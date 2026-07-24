import Monitor from "../models/Monitor.js";
import { checkQueue } from "../queues/checkQueue.js";

export async function runSchedulerOnce() {
  const now = new Date();

    console.log("Scheduler se pokrenuo:", new Date().toISOString()); 

  const monitor = await Monitor.findOne({
    active: true,
    nextRunAt: { $lte: now },
    status: { $nin: ["queued", "checking"] },
  }).sort({ nextRunAt: 1 });

   console.log("Scheduler pronašao:", monitor?._id?.toString() || null);
  if (!monitor) {
    console.log("Scheduler: nema monitora za proveru.");
    return;
  }

  monitor.status = "queued";

  monitor.nextRunAt = new Date(
    Date.now() + monitor.intervalMinutes * 60 * 1000
  );

  await monitor.save();

  await checkQueue.add("check-monitor", {
    monitorId: monitor.id,
  });

  console.log(
    `Scheduler: dodat job za monitor ${monitor.id}`
  );
}