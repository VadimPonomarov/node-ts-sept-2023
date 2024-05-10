import { CronJob } from "cron";

import { Logger } from "../common/configs";

const handler = async () => {
  Logger.debug("Test cron");
};

export const testCron = new CronJob("1-3 */1 * * *", handler);
