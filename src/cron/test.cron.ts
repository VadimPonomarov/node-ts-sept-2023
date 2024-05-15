import "dayjs/locale/uk.js";

import { CronJob } from "cron";
import dayjs from "dayjs";

import { Logger } from "../common/configs";

const handler = async () => {
  dayjs.locale("");
  const ttt = [
    dayjs().second(3).add(1, "day").format("DD-MM-YYYY hh:mm:ss:SSS"),
    dayjs().second(30).add(2, "day").format("DD-MM-YYYY hh:mm:ss:SSS"),
  ];
  Logger.debug(dayjs(ttt[1]).get("day"));
};

export const testCron = new CronJob("* * * * * *", handler);
