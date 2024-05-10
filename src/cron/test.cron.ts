import { CronJob } from "cron";

const handler = async () => {
  console.log("Test cron");
};

export const testCron = new CronJob("1-3 */1 * * *", handler);
